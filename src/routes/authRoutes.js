import express from "express";
import rateLimit from "express-rate-limit";
import { register, login, microsoftLogin } from "../controllers/authController.js";

// Max 10 auth attempts per IP per 15 minutes
const authLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             10,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { message: "Too many requests from this IP. Please try again in 15 minutes." }
});

// Stricter limiter for login specifically — 5 attempts per 15 minutes per IP
const loginLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             5,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         { message: "Too many login attempts from this IP. Please try again in 15 minutes." }
});

const router = express.Router();

router.post("/register",  authLimiter,  register);
router.post("/login",     loginLimiter, login);
router.post("/microsoft", authLimiter,  microsoftLogin);

export default router;
