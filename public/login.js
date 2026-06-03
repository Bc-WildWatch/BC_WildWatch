

const STORAGE_KEYS = {
  users: "auth_users",
  session: "auth_session",
  lockout: "auth_lockout",
};

const MIN_PASSWORD_LENGTH = 8;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;
const SESSION_HOURS = 24;

const authSection = document.getElementById("auth-section");
const dashboardSection = document.getElementById("dashboard-section");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const tabLogin = document.getElementById("tab-login");
const tabSignup = document.getElementById("tab-signup");
const formTitle = document.getElementById("form-title");
const formSubtitle = document.getElementById("form-subtitle");
const messageEl = document.getElementById("message");
const welcomeText = document.getElementById("welcome-text");
const userAvatar = document.getElementById("user-avatar");
const logoutBtn = document.getElementById("logout-btn");


function generateSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(salt + password);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer), (b) =>
    b.toString(16).padStart(2, "0")
  ).join("");
}

function getUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.users);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function sanitizeName(name) {
  return name.trim().replace(/\s+/g, " ");
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}



function getLockout() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.lockout);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveLockout(lockout) {
  localStorage.setItem(STORAGE_KEYS.lockout, JSON.stringify(lockout));
}

function isLockedOut(email) {
  const lockout = getLockout();
  const entry = lockout[email];
  if (!entry || !entry.until) return false;

  if (Date.now() < entry.until) {
    const mins = Math.ceil((entry.until - Date.now()) / 60000);
    return { locked: true, minutes: mins };
  }

  delete lockout[email];
  saveLockout(lockout);
  return { locked: false };
}

function recordFailedAttempt(email) {
  const lockout = getLockout();
  if (!lockout[email]) {
    lockout[email] = { attempts: 0 };
  }
  lockout[email].attempts += 1;

  if (lockout[email].attempts >= MAX_LOGIN_ATTEMPTS) {
    lockout[email].until = Date.now() + LOCKOUT_MINUTES * 60 * 1000;
    lockout[email].attempts = 0;
  }

  saveLockout(lockout);
}

function clearLockout(email) {
  const lockout = getLockout();
  if (lockout[email]) {
    delete lockout[email];
    saveLockout(lockout);
  }
}



function createSession(user) {
  const token = generateSalt() + generateSalt();
  const session = {
    email: user.email,
    name: user.name,
    token,
    expiresAt: Date.now() + SESSION_HOURS * 60 * 60 * 1000,
  };
  sessionStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
  return session;
}

function getSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEYS.session);
    if (!raw) return null;

    const session = JSON.parse(raw);
    if (!session.expiresAt || Date.now() > session.expiresAt) {
      sessionStorage.removeItem(STORAGE_KEYS.session);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function clearSession() {
  sessionStorage.removeItem(STORAGE_KEYS.session);
}



function showMessage(text, type = "error") {
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
  messageEl.hidden = false;
}

function hideMessage() {
  messageEl.hidden = true;
  messageEl.textContent = "";
}

function setMode(mode) {
  const isLogin = mode === "login";

  tabLogin.classList.toggle("active", isLogin);
  tabSignup.classList.toggle("active", !isLogin);
  tabLogin.setAttribute("aria-selected", isLogin);
  tabSignup.setAttribute("aria-selected", !isLogin);

  loginForm.classList.toggle("active", isLogin);
  loginForm.hidden = !isLogin;
  signupForm.classList.toggle("active", !isLogin);
  signupForm.hidden = isLogin;

  formTitle.textContent = isLogin ? "Welcome back" : "Create account";
  formSubtitle.textContent = isLogin
    ? "Sign in to your account"
    : "Register with a secure password";

  hideMessage();
}

function showDashboard(session) {
    sessionStorage.setItem("currentUser", JSON.stringify(session));
    
    window.location.href = "/index.html";
}

function showAuth() {
  authSection.hidden = false;
  
  if (dashboardSection)
  {
    dashboardSection.hidden = true;
  }
}

function validatePassword(password) {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return null;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) {
    return "Please enter a valid email address.";
  }
  return null;
}



async function handleSignup(event) {
  event.preventDefault();
  hideMessage();

  const name = sanitizeName(document.getElementById("signup-name").value);
  const email = normalizeEmail(document.getElementById("signup-email").value);
  const password = document.getElementById("signup-password").value;
  const confirm = document.getElementById("signup-confirm").value;

  if (name.length < 2) {
    showMessage("Name must be at least 2 characters.");
    return;
  }

  const emailError = validateEmail(email);
  if (emailError) {
    showMessage(emailError);
    return;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    showMessage(passwordError);
    return;
  }

  if (password !== confirm) {
    showMessage("Passwords do not match.");
    return;
  }

  const users = getUsers();
  if (users[email]) {
    showMessage("An account with this email already exists. Try logging in.");
    return;
  }

  const salt = generateSalt();
  const passwordHash = await hashPassword(password, salt);

  users[email] = {
    email,
    name,
    salt,
    passwordHash,
    createdAt: Date.now(),
  };

  saveUsers(users);
  signupForm.reset();

  showMessage("Account created! You can sign in now.", "success");
  setMode("login");
  document.getElementById("login-email").value = email;
  document.getElementById("login-password").focus();
}

async function handleLogin(event) {
  event.preventDefault();
  hideMessage();

  const email = normalizeEmail(document.getElementById("login-email").value);
  const password = document.getElementById("login-password").value;

  const emailError = validateEmail(email);
  if (emailError) {
    showMessage(emailError);
    return;
  }

  const lockStatus = isLockedOut(email);
  if (lockStatus.locked) {
    showMessage(
      `Too many failed attempts. Try again in ${lockStatus.minutes} minute(s).`
    );
    return;
  }

  if (!password) {
    showMessage("Please enter your password.");
    return;
  }

  const users = getUsers();
  const user = users[email];

  if (!user) {
    recordFailedAttempt(email);
    showMessage("Invalid email or password.");
    return;
  }

  const passwordHash = await hashPassword(password, user.salt);

  if (passwordHash !== user.passwordHash) {
    recordFailedAttempt(email);
    const lockout = getLockout();
    const attempts = lockout[email]?.attempts ?? 0;
    const remaining = MAX_LOGIN_ATTEMPTS - attempts;

    if (remaining > 0 && remaining < MAX_LOGIN_ATTEMPTS) {
      showMessage(
        `Invalid email or password. ${remaining} attempt(s) remaining before lockout.`
      );
    } else {
      showMessage("Invalid email or password.");
    }
    return;
  }

  clearLockout(email);
  const session = createSession(user);
  loginForm.reset();
  showDashboard(session);
}

function handleLogout() {
  clearSession();
  showAuth();
  setMode("login");
  hideMessage();
}



document.querySelectorAll(".toggle-password").forEach((btn) => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.target);
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    btn.textContent = isHidden ? "Hide" : "Show";
    btn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
  });
});



tabLogin.addEventListener("click", () => setMode("login"));
tabSignup.addEventListener("click", () => setMode("signup"));
loginForm.addEventListener("submit", handleLogin);
signupForm.addEventListener("submit", handleSignup);
if(logoutBtn)
{
    logoutBtn.addEventListener("click", handleLogout);
}

const existingSession = getSession();
if (existingSession) {
  showDashboard(existingSession);
} else {
  showAuth();
  setMode("login");
}
