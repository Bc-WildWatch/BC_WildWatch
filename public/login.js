// ── Session helpers ───────────────────────────────────────────────────────────
function saveSession(token, user) {
  sessionStorage.setItem("jwt", token);
  sessionStorage.setItem("currentUser", JSON.stringify(user));
}
function getSession() {
  const token = sessionStorage.getItem("jwt");
  const user  = sessionStorage.getItem("currentUser");
  if (!token || !user) return null;
  return { token, user: JSON.parse(user) };
}
if (getSession()) window.location.href = "/index.html";

// ── DOM refs ──────────────────────────────────────────────────────────────────
const msBtn     = document.getElementById("btn-microsoft");
const messageEl = document.getElementById("message");
const loginForm  = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const tabLogin   = document.getElementById("tab-login");
const tabSignup  = document.getElementById("tab-signup");

// ── Message banner ────────────────────────────────────────────────────────────
function showMessage(text, type = "error") {
  messageEl.textContent = text;
  messageEl.className   = `message ${type}`;
  messageEl.hidden      = false;
}
function hideMessage() {
  messageEl.hidden      = true;
  messageEl.textContent = "";
}

// ── Tab switching ─────────────────────────────────────────────────────────────
function setMode(mode) {
  const isLogin = mode === "login";
  tabLogin.classList.toggle("active", isLogin);
  tabSignup.classList.toggle("active", !isLogin);
  loginForm.style.display  = isLogin ? "block" : "none";
  signupForm.style.display = isLogin ? "none"  : "block";
  hideMessage();
  clearAllFieldErrors();
}

// ── Loading state ─────────────────────────────────────────────────────────────
function setLoading(btn, loading, label = "Please wait…") {
  btn.disabled     = loading;
  btn.dataset.orig  = btn.dataset.orig || btn.textContent;
  btn.textContent   = loading ? label : btn.dataset.orig;
}

// ── Per-field error display ───────────────────────────────────────────────────
function setFieldError(inputId, msg) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.classList.toggle("invalid", !!msg);
  let hint = input.closest(".field")?.querySelector(".field-error");
  if (!hint) {
    hint = document.createElement("p");
    hint.className = "field-error";
    input.closest(".pw-wrap, .field")?.appendChild(hint) ||
    input.parentElement?.appendChild(hint);
  }
  hint.textContent = msg || "";
  hint.hidden      = !msg;
}
function clearFieldError(inputId) { setFieldError(inputId, ""); }
function clearAllFieldErrors() {
  document.querySelectorAll(".field-error").forEach(el => { el.textContent = ""; el.hidden = true; });
  document.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
}

// ── Validators ────────────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(value) {
  if (!value)                   return "Email is required.";
  if (!EMAIL_RE.test(value))    return "Enter a valid email address.";
  return null;
}

function validatePassword(value) {
  if (!value)                   return "Password is required.";
  if (value.length < 8)         return "Password must be at least 8 characters.";
  return null;
}

function validateNewPassword(value) {
  if (!value)                          return "Password is required.";
  if (value.length < 8)                return "Must be at least 8 characters.";
  if (!/[A-Z]/.test(value))            return "Must contain at least one uppercase letter.";
  if (!/[0-9]/.test(value))            return "Must contain at least one number.";
  return null;
}

// ── Real-time password strength meter ────────────────────────────────────────
function updateStrength(value) {
  const meter = document.getElementById("strength-meter");
  const label = document.getElementById("strength-label");
  if (!meter) return;

  let score = 0;
  if (value.length >= 8)         score++;
  if (/[A-Z]/.test(value))       score++;
  if (/[0-9]/.test(value))       score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;

  const levels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#e53e3e", "#d97706", "#2563eb", "#16a34a"];

  meter.style.width      = `${score * 25}%`;
  meter.style.background = colors[score] || "transparent";
  if (label) {
    label.textContent  = value ? levels[score] : "";
    label.style.color  = colors[score];
  }
}

// Attach real-time listeners
document.getElementById("signup-password")?.addEventListener("input", (e) => {
  updateStrength(e.target.value);
  if (e.target.value) clearFieldError("signup-password");
});
document.getElementById("signup-confirm")?.addEventListener("input", (e) => {
  if (e.target.value) clearFieldError("signup-confirm");
});
document.getElementById("login-email")?.addEventListener("input", () => clearFieldError("login-email"));
document.getElementById("login-password")?.addEventListener("input", () => clearFieldError("login-password"));
document.getElementById("signup-email")?.addEventListener("input", () => clearFieldError("signup-email"));
document.getElementById("signup-name")?.addEventListener("input",  () => clearFieldError("signup-name"));

// ── Login form submit ─────────────────────────────────────────────────────────
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideMessage();
  clearAllFieldErrors();

  const email    = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;
  const btn      = document.getElementById("login-btn");

  // Client-side validation
  let hasError = false;
  const emailErr = validateEmail(email);
  if (emailErr) { setFieldError("login-email", emailErr); hasError = true; }
  const passErr  = validatePassword(password);
  if (passErr)  { setFieldError("login-password", passErr); hasError = true; }
  if (hasError) return;

  setLoading(btn, true, "Signing in…");
  try {
    const res  = await fetch("/api/auth/login", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!res.ok) return showMessage(data.message || "Login failed.");

    saveSession(data.token, data.user);
    window.location.href = "/index.html";
  } catch {
    showMessage("Network error. Please check your connection and try again.");
  } finally {
    setLoading(btn, false);
  }
});

// ── Register form submit ──────────────────────────────────────────────────────
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideMessage();
  clearAllFieldErrors();

  const name     = document.getElementById("signup-name").value.trim();
  const email    = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;
  const confirm  = document.getElementById("signup-confirm").value;
  const btn      = document.getElementById("signup-btn");

  // Client-side validation
  let hasError = false;
  if (name.length < 2) { setFieldError("signup-name", "Name must be at least 2 characters."); hasError = true; }
  const emailErr = validateEmail(email);
  if (emailErr)        { setFieldError("signup-email", emailErr); hasError = true; }
  const passErr  = validateNewPassword(password);
  if (passErr)         { setFieldError("signup-password", passErr); hasError = true; }
  if (!hasError && password !== confirm) { setFieldError("signup-confirm", "Passwords do not match."); hasError = true; }
  if (hasError) return;

  setLoading(btn, true, "Creating account…");
  try {
    const res  = await fetch("/api/auth/register", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ name, email, password })
    });
    const data = await res.json();

    if (!res.ok) return showMessage(data.message || "Registration failed.");

    showMessage("Account created! You can now sign in.", "success");
    setMode("login");
    document.getElementById("login-email").value = email;
  } catch {
    showMessage("Network error. Please check your connection and try again.");
  } finally {
    setLoading(btn, false);
  }
});

// ── Microsoft SSO ─────────────────────────────────────────────────────────────
let msalInstance = null;

async function initMsal() {
  try {
    const cfg = await fetch("/api/config").then(r => r.json());
    if (!cfg.azureClientId) {
      msBtn.disabled = true;
      msBtn.title    = "Microsoft login not configured (AZURE_CLIENT_ID missing in .env).";
      return;
    }
    msalInstance = new msal.PublicClientApplication({
      auth: {
        clientId:    cfg.azureClientId,
        authority:   `https://login.microsoftonline.com/${cfg.azureTenantId || "common"}`,
        redirectUri: window.location.origin + "/login"
      },
      cache: { cacheLocation: "sessionStorage" }
    });
    await msalInstance.initialize();
  } catch (err) {
    console.warn("MSAL init failed:", err);
    msBtn.disabled = true;
  }
}

msBtn.addEventListener("click", async () => {
  if (!msalInstance) {
    showMessage("Microsoft login is not configured. Please use email and password.");
    return;
  }
  hideMessage();
  setLoading(msBtn, true, "Opening Microsoft…");
  try {
    const result = await msalInstance.loginPopup({ scopes: ["openid", "profile", "email", "User.Read"] });
    const res    = await fetch("/api/auth/microsoft", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ accessToken: result.accessToken })
    });
    const data = await res.json();
    if (!res.ok) return showMessage(data.message || "Microsoft login failed.");
    saveSession(data.token, data.user);
    window.location.href = "/index.html";
  } catch (err) {
    if (err.errorCode !== "user_cancelled") showMessage("Microsoft sign-in failed. Please try again.");
  } finally {
    setLoading(msBtn, false);
  }
});

// ── Password reveal toggles ───────────────────────────────────────────────────
document.querySelectorAll(".pw-toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    const input     = document.getElementById(btn.dataset.target);
    const isHidden  = input.type === "password";
    input.type      = isHidden ? "text" : "password";
    btn.textContent = isHidden ? "Hide" : "Show";
  });
});

initMsal();
