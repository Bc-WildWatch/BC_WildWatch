# CI/CD & Deployment Setup Checklist

This checklist helps you complete the GitHub Actions and deployment setup.

## ✅ GitHub Repository Setup

- [ ] Ensure repository is on GitHub
- [ ] Enable GitHub Actions (Settings → Actions)
- [ ] Enable Branch protection for `main` branch
  - [ ] Require pull request reviews
  - [ ] Require status checks to pass
- [ ] Set default branch to `main`

## ✅ Environment Variables & Secrets

### Local Development
- [ ] Copy `.env.example` to `.env`
- [ ] Fill in `MONGO_URI` with your MongoDB connection string
- [ ] Set `NODE_ENV=development`

### GitHub Secrets
Add these in GitHub repository Settings → Secrets and Variables → Actions:

- [ ] `MONGO_URI` - MongoDB connection string
- [ ] Deployment service secrets (choose your provider):
  - [ ] `HEROKU_API_KEY` + `HEROKU_APP_NAME` (for Heroku)
  - [ ] `RAILWAY_TOKEN` (for Railway)
  - [ ] `RENDER_DEPLOY_HOOK` (for Render)
  - [ ] `DIGITALOCEAN_TOKEN` (for DigitalOcean)
- [ ] `SNYK_TOKEN` (optional, for security scanning)
- [ ] `SONAR_TOKEN` (optional, for code quality)

## ✅ CI/CD Workflows

Workflows are automatically enabled in `.github/workflows/`:

- [ ] **ci.yml** - Runs tests, security checks on every push/PR
- [ ] **docker-build.yml** - Builds Docker images
- [ ] **security.yml** - Security scanning

No additional setup needed - they run automatically!

## ✅ Docker Setup

### Local Testing
```bash
# Build image
npm run docker:build

# Start containers
npm run docker:start

# Verify running
curl http://localhost:3000

# Stop containers
npm run docker:stop
```

- [ ] Test Docker build locally
- [ ] Test Docker Compose setup
- [ ] Verify health check works

## ✅ Choose a Hosting Provider

### Option 1: Heroku (Recommended for Beginners)

1. [ ] Create Heroku account: https://heroku.com
2. [ ] Create new app
3. [ ] Set buildpack to Node.js
4. [ ] Add MongoDB add-on (mLab) OR use MongoDB Atlas
5. [ ] Set config variables in Heroku dashboard:
   - [ ] `MONGO_URI`
   - [ ] `NODE_ENV=production`
6. [ ] Connect GitHub repository to Heroku
7. [ ] Enable automatic deploys from `main` branch
8. [ ] Test deployment

### Option 2: Railway.app (Modern Alternative)

1. [ ] Sign up at https://railway.app
2. [ ] Create new project
3. [ ] Add MongoDB service
4. [ ] Connect GitHub repository
5. [ ] Set environment variables:
   - [ ] `MONGO_URI`
   - [ ] `NODE_ENV=production`
6. [ ] Deploy
7. [ ] Test deployment

### Option 3: Render

1. [ ] Sign up at https://render.com
2. [ ] Create new Web Service
3. [ ] Connect GitHub repository
4. [ ] Set build command: `npm install`
5. [ ] Set start command: `npm start`
6. [ ] Add environment variables
7. [ ] Deploy
8. [ ] Test deployment

### Option 4: DigitalOcean App Platform

1. [ ] Create DigitalOcean account
2. [ ] Go to App Platform
3. [ ] Create new app from GitHub repo
4. [ ] Configure service
5. [ ] Set environment variables
6. [ ] Deploy
7. [ ] Test deployment

## ✅ Deployment Configuration

### Update `.github/workflows/ci.yml`

After choosing a provider, uncomment the deployment step:

```yaml
- name: Deploy to [SERVICE_NAME]
  run: |
    # Add your deployment command here
```

- [ ] Uncomment deployment step
- [ ] Add deployment secrets
- [ ] Test deployment workflow

## ✅ Monitoring & Logs

### Health Check
```bash
curl https://your-deployed-app.com/
```

- [ ] Endpoint returns "BC-WildWatch API running."
- [ ] Response is within 200ms

### View Logs
- [ ] **Heroku**: `heroku logs --tail`
- [ ] **Railway**: View in dashboard
- [ ] **Render**: View in dashboard
- [ ] **DigitalOcean**: View in dashboard

## ✅ Test Full CI/CD Pipeline

1. [ ] Create a test branch: `git checkout -b test/ci-cd`
2. [ ] Make a small change to `server.js`
3. [ ] Push to GitHub: `git push origin test/ci-cd`
4. [ ] Create pull request
5. [ ] Watch GitHub Actions run:
   - [ ] CI workflow completes ✅
   - [ ] Docker build completes ✅
   - [ ] Security scan completes ✅
6. [ ] Merge pull request
7. [ ] Watch deployment workflow (if configured)
8. [ ] Verify deployed app works

## ✅ Production Best Practices

- [ ] Enable HTTPS on custom domain
- [ ] Set CORS_ORIGIN to your frontend domain only
- [ ] Enable database backups
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Set up monitoring/alerting
- [ ] Document deployment process
- [ ] Set up team access to deployment services
- [ ] Review security scan results

## ✅ Documentation

- [ ] README.md updated ✅
- [ ] deployment-guide.md reviewed ✅
- [ ] Environment variables documented ✅
- [ ] API endpoints documented
- [ ] Troubleshooting guide created (optional)

## ✅ Testing & Verification

### API Testing
```bash
# Test health endpoint
curl http://localhost:3000/

# Test reports endpoint (if implemented)
curl http://localhost:3000/api/reports
```

- [ ] Health check passes
- [ ] API responds to requests
- [ ] Database connections work
- [ ] CORS is configured correctly

## 🎉 Deployment Complete!

Once all items are checked:

1. Your app is CI/CD ready
2. Tests run automatically on every push
3. Docker images are built automatically
4. Code is scanned for security issues
5. Deployment is automated to production

## 🔗 Useful Links

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Heroku Deployment Guide](https://devcenter.heroku.com/articles/nodejs-support)
- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs/)
- [DigitalOcean Docs](https://docs.digitalocean.com/products/app-platform/)

## 📞 Support

For help:
1. Check deployment-guide.md
2. Review GitHub Actions logs
3. Check provider's documentation
4. Create an issue in the repository
