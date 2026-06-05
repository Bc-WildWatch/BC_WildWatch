# 🚀 BC WildWatch - Deployment Guide

This guide explains how to deploy BC WildWatch with **separated frontend and backend repositories**.

---

## 📁 Repository Structure

We're splitting the monorepo into two specialized repositories:

```
Original Repo (BC_WildWatch)
├── frontend/                 → BC-WildWatch/Frontend
│   └── public/              (all HTML, CSS, JS)
└── backend/                 → BC-WildWatch/Backend
    ├── src/
    ├── server.js
    ├── package.json
    └── .env
```

---

## ✅ Step 1: Create Frontend Repository

Create a new repo named: **`Frontend`** in the Bc-WildWatch organization

### Files to include:
- `public/index.html`
- `public/login.html`
- `public/login.js`
- `public/login.css`
- `.gitignore`
- `package.json` (for Netlify build if needed)
- `netlify.toml` (redirect API calls to backend)
- `README.md`

### `.gitignore`:
```
node_modules/
.env
.env.local
dist/
.DS_Store
```

### `package.json`:
```json
{
  "name": "bc-wildwatch-frontend",
  "version": "1.0.0",
  "description": "BC WildWatch Frontend - Campus Wildlife Safety System",
  "type": "module",
  "scripts": {
    "dev": "npx http-server public -p 3001",
    "build": "echo 'Frontend is static HTML - no build needed'"
  },
  "dependencies": {},
  "devDependencies": {
    "http-server": "^14.1.1"
  }
}
```

### `netlify.toml`:
```toml
[build]
  command = "echo 'Static site - no build'"
  publish = "public"

[[redirects]]
  from = "/api/*"
  to = "https://YOUR-RENDER-BACKEND-URL.onrender.com/api/:splat"
  status = 200
  force = true
```

**Replace `YOUR-RENDER-BACKEND-URL`** with your actual Render URL (e.g., `https://bc-wildwatch-backend.onrender.com`)

---

## ✅ Step 2: Create Backend Repository

Create a new repo named: **`Backend`** in the Bc-WildWatch organization

### Files to include:
- `src/` (all backend source code)
- `server.js`
- `package.json`
- `.env.example`
- `.gitignore`
- `README.md`

### `.gitignore`:
```
node_modules/
.env
.env.local
.DS_Store
*.log
dist/
```

### `.env.example`:
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wildwatch

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this

# Azure AD (Microsoft)
AZURE_CLIENT_ID=your-azure-client-id
AZURE_TENANT_ID=your-azure-tenant-id

# Server
PORT=3000
NODE_ENV=production

# CORS
FRONTEND_URL=https://bcwildwatch.netlify.app
```

### `package.json` (keep existing):
```json
{
  "name": "back-end",
  "version": "1.0.0",
  "description": "BC WildWatch Backend API",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "axios": "^1.17.0",
    "bcryptjs": "^3.0.3",
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "express-rate-limit": "^8.5.2",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^9.6.2"
  },
  "devDependencies": {
    "nodemon": "^3.1.14"
  }
}
```

---

## ✅ Step 3: Deploy Frontend to Netlify

### Connect to Netlify:
1. Go to [netlify.com](https://netlify.com)
2. Click **"New site from Git"**
3. Connect your GitHub account
4. Select the **`Frontend`** repository
5. Set build settings:
   - **Build command:** `npm run build` (or leave empty)
   - **Publish directory:** `public`
6. Click **Deploy**

### After deployment:
- Your frontend will be live at: `https://bcwildwatch.netlify.app` ✅
- The `netlify.toml` will automatically redirect API calls to your backend

---

## ✅ Step 4: Deploy Backend to Render

### Create Web Service:
1. Go to [render.com](https://render.com)
2. Click **"New"** → **"Web Service"**
3. Connect your GitHub account
4. Select the **`Backend`** repository
5. Configure:
   - **Name:** `bc-wildwatch-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or paid for guaranteed uptime)

### Set Environment Variables:
Go to **Environment** and add:
```
MONGODB_URI = mongodb+srv://...
JWT_SECRET = your-secret-key
AZURE_CLIENT_ID = your-client-id
AZURE_TENANT_ID = your-tenant-id
FRONTEND_URL = https://bcwildwatch.netlify.app
NODE_ENV = production
```

6. Click **"Create Web Service"**

### After deployment:
- Your backend will be live at: `https://bc-wildwatch-backend.onrender.com` ✅
- Copy this URL to update `netlify.toml` in the frontend

---

## ✅ Step 5: Update Frontend with Backend URL

Once your Render backend is live:

1. Go to your **Frontend** repository
2. Edit `netlify.toml`
3. Replace the placeholder with your actual Render URL:
   ```toml
   [[redirects]]
     from = "/api/*"
     to = "https://bc-wildwatch-backend.onrender.com/api/:splat"
     status = 200
     force = true
   ```
4. Commit and push
5. Netlify will automatically redeploy ✅

---

## 🔧 CORS Configuration

Update your **backend** `server.js` to accept Netlify frontend:

```javascript
import cors from "cors";

const corsOptions = {
  origin: [
    "https://bcwildwatch.netlify.app",  // Production
    "http://localhost:3001"              // Local development
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

---

## 📊 Final Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  bcwildwatch.netlify.app                │
│                    (Frontend - Netlify)                 │
│  ┌──────────────────────────────────────────────────┐   │
│  │  - HTML/CSS/JS (index.html, login.html, etc)     │   │
│  │  - Automatic API redirects via netlify.toml      │   │
│  │  - Auto HTTPS                                    │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↓↑ (API calls via /api/*)
┌─────────────────────────────────────────────────────────┐
│         bc-wildwatch-backend.onrender.com               │
│          (Backend API - Render)                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  - Express.js REST API                           │   │
│  │  - MongoDB connection                            │   │
│  │  - JWT authentication                            │   │
│  │  - Azure AD integration                          │   │
│  │  - Auto HTTPS                                    │   │
│  └──────────────────────────────────────────────────┘   │
│                          ↓↑
│                     MongoDB Atlas
└─────────────────────────────────────────────────────────┘
```

---

## 🧪 Testing

### Test Frontend Locally:
```bash
cd Frontend
npm install
npm run dev
# Visit http://localhost:3001
```

### Test Backend Locally:
```bash
cd Backend
npm install
npm run dev
# Backend runs on http://localhost:3000
```

### Test API Connectivity:
```bash
curl http://localhost:3000/api/animals
# Should return animal types
```

---

## 🚨 Troubleshooting

### API calls failing with CORS error:
- ✅ Check `netlify.toml` has correct backend URL
- ✅ Verify `server.js` CORS is configured correctly
- ✅ Check backend is running on Render

### "Not found" errors on Render:
- ✅ Verify environment variables are set
- ✅ Check MongoDB URI is valid
- ✅ Review Render logs: `More` → `Logs`

### Netlify build failing:
- ✅ Ensure `public` folder exists with all HTML files
- ✅ Check `package.json` build script
- ✅ Review Netlify deploy logs

### Database connection errors:
- ✅ Verify MongoDB connection string
- ✅ Check IP whitelist in MongoDB Atlas
- ✅ Ensure credentials are correct

---

## 📝 Summary

| Component | Host | URL |
|-----------|------|-----|
| Frontend | Netlify | https://bcwildwatch.netlify.app |
| Backend API | Render | https://bc-wildwatch-backend.onrender.com |
| Database | MongoDB Atlas | Cloud-hosted |

---

## 🔐 Security Checklist

- [ ] MongoDB IP whitelist includes Render IP
- [ ] JWT_SECRET is strong and unique
- [ ] Environment variables are NOT in version control
- [ ] CORS origins are properly restricted
- [ ] HTTPS is enforced on both frontend and backend
- [ ] API rate limiting is enabled (via `express-rate-limit`)
- [ ] Database backups are enabled

---

## 🆘 Support

For issues:
1. Check Render logs: Dashboard → Backend → `Logs`
2. Check Netlify logs: Site overview → `Deploys`
3. Check browser console (F12) for frontend errors
4. Verify environment variables are set correctly

---

**Your BC WildWatch app is now production-ready! 🎉**
