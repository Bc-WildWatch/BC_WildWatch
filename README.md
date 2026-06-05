# BC-WildWatch Backend API

Production-ready Node.js/Express backend for the BC-WildWatch incident reporting system.

## Quick Start

### Development
```bash
npm install
npm run dev
```

### Production
```bash
npm install --production
npm start
```

### Docker
```bash
docker-compose up
```

## Features

- ✅ Express.js REST API
- ✅ MongoDB integration
- ✅ CORS support
- ✅ Environment configuration
- ✅ Docker & Docker Compose
- ✅ CI/CD with GitHub Actions
- ✅ Security scanning
- ✅ Production-ready

## Project Structure

```
src/
├── config/      # Database connection
├── models/      # Data models
├── controllers/ # Request handlers
├── routes/      # API routes
└── middleware/  # Custom middleware
```

## API Endpoints

### Health Check
```
GET /
```

### Reports
```
GET    /api/reports          # List all reports
POST   /api/reports          # Create new report
GET    /api/reports/:id      # Get specific report
PUT    /api/reports/:id      # Update report
DELETE /api/reports/:id      # Delete report
```

## Environment Variables

See [.env.example](.env.example) for all required variables.

## Deployment

See [deployment-guide.md](deployment-guide.md) for detailed deployment instructions.

### Quick Deploy

**Heroku:**
```bash
heroku create your-app-name
git push heroku main
```

**Railway:**
Connect via GitHub and deploy automatically.

**Docker:**
```bash
docker build -t wildwatch-api .
docker run -p 3000:3000 -e MONGO_URI="..." wildwatch-api
```

## CI/CD Pipeline

Automated workflows run on every push:

- **CI Pipeline**: Tests, linting, security checks
- **Docker Build**: Build and push container images
- **Security Scan**: Vulnerability scanning

## Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

### Run Production Server
```bash
npm start
```

### Build Docker Image
```bash
npm run docker:build
```

### Stop Docker Containers
```bash
npm run docker:stop
```

## Testing

Add your test files and run:
```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature/name`
5. Submit a pull request

## License

ISC

## Support

For issues or questions, please create an issue in the GitHub repository.
