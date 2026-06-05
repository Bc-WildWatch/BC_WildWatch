# Deployment Guide

This document provides instructions for deploying the BC-WildWatch Backend API.

## Prerequisites

- Node.js 18+ or 20+
- MongoDB Atlas account (or local MongoDB)
- GitHub repository with Actions enabled
- Hosting provider account (Heroku, Railway, Render, DigitalOcean, etc.)

## Environment Variables

Create a `.env` file in the root directory with:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
PORT=3000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

Reference `.env.example` for all required variables.

## Local Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run in production mode
npm start
```

## Docker Deployment

### Build Docker Image

```bash
docker build -t wildwatch-api:latest .
```

### Run with Docker Compose

```bash
docker-compose up -d
```

### Run Single Container

```bash
docker run -p 3000:3000 \
  -e MONGO_URI="mongodb+srv://..." \
  -e NODE_ENV=production \
  wildwatch-api:latest
```

## Deployment Options

### Option 1: Heroku

1. Install Heroku CLI
2. Run `heroku create your-app-name`
3. Add secrets: `heroku config:set MONGO_URI="..."`
4. Push: `git push heroku main`

### Option 2: Railway.app

1. Connect GitHub repository
2. Add environment variables in Railway dashboard
3. Deploy automatically on push to main

### Option 3: Render

1. Create new Web Service
2. Connect GitHub repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

### Option 4: DigitalOcean App Platform

1. Create App
2. Connect GitHub repository
3. Configure environment
4. Deploy

## GitHub Actions CI/CD

The repository includes automated workflows:

- **CI Pipeline** (`.github/workflows/ci.yml`):
  - Runs on push to main/develop
  - Tests on Node 18 and 20
  - Checks dependencies
  - Builds application

- **Docker Build** (`.github/workflows/docker-build.yml`):
  - Builds and pushes Docker image to GitHub Container Registry
  - Runs on push to main and pull requests

### Setting Up Secrets

Add these secrets to GitHub repository settings:

```
HEROKU_API_KEY          - Your Heroku API key
HEROKU_APP_NAME         - Your Heroku app name
RAILWAY_TOKEN           - Railway API token
RENDER_DEPLOY_HOOK      - Render deploy hook URL
```

## Health Checks

The application includes a health check endpoint:

```bash
curl http://localhost:3000/
```

Response: "BC-WildWatch API running."

## Production Best Practices

1. **Security**
   - Use environment variables for all secrets
   - Enable HTTPS only
   - Set CORS_ORIGIN to specific domain
   - Use strong MongoDB credentials

2. **Performance**
   - Use load balancer if available
   - Enable MongoDB indexing
   - Use caching headers
   - Monitor response times

3. **Monitoring**
   - Set up error tracking (Sentry, etc.)
   - Monitor database performance
   - Track API response times
   - Alert on failures

4. **Database**
   - Use MongoDB Atlas for managed hosting
   - Enable automatic backups
   - Monitor connection pool
   - Regular maintenance

## Scaling

For increased traffic:

1. Use container orchestration (Kubernetes)
2. Implement load balancing
3. Add database replication
4. Cache frequently accessed data
5. Use CDN for static assets

## Troubleshooting

### Port Already in Use
```bash
lsof -i :3000
kill -9 <PID>
```

### MongoDB Connection Failed
- Check MONGO_URI format
- Verify MongoDB is running
- Check network access in MongoDB Atlas
- Verify credentials

### Container Won't Start
```bash
docker logs <container_id>
```

## Support

For issues, create an issue in the GitHub repository or contact the development team.
