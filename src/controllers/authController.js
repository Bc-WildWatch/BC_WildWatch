import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const MAX_ATTEMPTS    = 5;
const LOCKOUT_MINUTES = 15;

// ── Role is derived automatically from email domain ───────────────────────────
// @student.belgiumcampus.ac.za  → "user"
// @belgiumcampus.ac.za          → "admin"
function getRoleFromEmail(email) {
  if (email.endsWith("@student.belgiumcampus.ac.za")) return "user";
  if (email.endsWith("@belgiumcampus.ac.za"))          return "admin";
  return null; // not a recognised campus domain
}

const signToken = (user) =>
  jwt.sign(
    { id: user._id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ── Required fields ───────────────────────────────────────────────────────
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }

    // ── Name length ───────────────────────────────────────────────────────────
    const cleanName = name.trim();
    if (cleanName.length < 2 || cleanName.length > 80) {
      return res.status(400).json({ message: "Name must be between 2 and 80 characters." });
    }

    // ── Email format ──────────────────────────────────────────────────────────
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail  = email.toLowerCase().trim();
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    // ── Campus domain check ───────────────────────────────────────────────────
    const role = getRoleFromEmail(cleanEmail);
    if (!role) {
      return res.status(403).json({
        message: "Registration is restricted to Belgium Campus email addresses (@belgiumcampus.ac.za or @student.belgiumcampus.ac.za)."
      });
    }

    // ── Password strength ─────────────────────────────────────────────────────
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }
    if (!/[A-Z]/.test(password)) {
      return res.status(400).json({ message: "Password must contain at least one uppercase letter." });
    }
    if (!/[0-9]/.test(password)) {
      return res.status(400).json({ message: "Password must contain at least one number." });
    }

    // ── Duplicate check ───────────────────────────────────────────────────────
    const exists = await User.findOne({ email: cleanEmail });
    if (exists) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const hash    = await bcrypt.hash(password, 12);
    const newUser = await User.create({ name: cleanName, email: cleanEmail, password: hash, role });

    const token = signToken(newUser);
    res.status(201).json({
      message: "Account created successfully.",
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed.", error: err.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail  = email.toLowerCase().trim();
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    const user = await User.findOne({ email: cleanEmail });

    // ── Lockout check ─────────────────────────────────────────────────────────
    if (user?.lockedUntil && user.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil((user.lockedUntil - Date.now()) / 60000);
      return res.status(423).json({
        message: `Account is locked. Try again in ${minutesLeft} minute${minutesLeft === 1 ? "" : "s"}.`
      });
    }

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      user.failedAttempts = (user.failedAttempts || 0) + 1;

      if (user.failedAttempts >= MAX_ATTEMPTS) {
        user.lockedUntil    = new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000);
        user.failedAttempts = 0;
        await user.save();
        return res.status(423).json({
          message: `Too many failed attempts. Account locked for ${LOCKOUT_MINUTES} minutes.`
        });
      }

      const remaining = MAX_ATTEMPTS - user.failedAttempts;
      await user.save();
      return res.status(401).json({
        message: `Invalid email or password. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining before lockout.`
      });
    }

    // ── Success ───────────────────────────────────────────────────────────────
    user.failedAttempts = 0;
    user.lockedUntil    = null;
    await user.save();

    const token = signToken(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed.", error: err.message });
  }
};

// POST /api/auth/microsoft
export const microsoftLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: "Microsoft access token is required." });
    }

    const graphRes = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!graphRes.ok) {
      return res.status(401).json({ message: "Microsoft token verification failed." });
    }

    const profile     = await graphRes.json();
    const microsoftId = profile.id;
    const email       = (profile.mail || profile.userPrincipalName || "").toLowerCase().trim();
    const name        = profile.displayName || email;

    if (!email) {
      return res.status(400).json({ message: "Could not retrieve email from Microsoft account." });
    }

    // ── Campus domain check ───────────────────────────────────────────────────
    const role = getRoleFromEmail(email);
    if (!role) {
      return res.status(403).json({
        message: "Access is restricted to Belgium Campus accounts (@belgiumcampus.ac.za)."
      });
    }

    let user = await User.findOne({ $or: [{ microsoftId }, { email }] });

    if (!user) {
      user = await User.create({ name, email, microsoftId, role });
    } else {
      // Keep role in sync with email domain in case domain policy changes
      if (!user.microsoftId) user.microsoftId = microsoftId;
      if (user.role !== role) user.role = role;
      await user.save();
    }

    const token = signToken(user);
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: "Microsoft login failed.", error: err.message });
  }
};
