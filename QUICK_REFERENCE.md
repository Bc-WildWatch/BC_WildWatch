# Quick Command Reference

## Development

```bash
# Install dependencies
npm install

# Run development server with hot reload
npm run dev

# Run production server
npm start
```

## Docker

```bash
# Build Docker image
npm run docker:build

# Start with Docker Compose (includes MongoDB)
npm run docker:run

# Stop all containers
npm run docker:stop

# View logs
docker-compose logs -f app
```

## Deployment

```bash
# Deploy to Heroku (requires Heroku CLI)
heroku login
git push heroku main

# Deploy to Railway (requires Railway CLI)
railway up

# Deploy Docker to registry
docker push ghcr.io/your-username/back-end:latest
```

## Testing & Monitoring

```bash
# Health check
curl http://localhost:3000/

# View application logs (production)
heroku logs --tail           # Heroku
railway logs                 # Railway
```

## Environment Setup

```bash
# Create .env from template
cp .env.example .env

# Edit .env with your values
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
# PORT=3000
# NODE_ENV=production
```

## GitHub Actions

Workflows run automatically - no manual steps needed!

### Workflows
- **ci.yml** - Runs on every push/PR (tests, linting, security)
- **docker-build.yml** - Builds Docker images on push to main
- **security.yml** - Weekly security scans

### Check Status
1. Go to repository on GitHub
2. Click "Actions" tab
3. View workflow run status

## API Testing

```bash
# Health check
GET http://localhost:3000/

# Reports endpoint
GET http://localhost:3000/api/reports
POST http://localhost:3000/api/reports
```

See `requests.http` for more examples.
