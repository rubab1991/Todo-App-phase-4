# Todo AI Chatbot Deployment

This directory contains all necessary files and scripts for deploying the Todo AI Chatbot application.

## Files Overview

- `docker-compose.yml` - Docker Compose configuration for all services
- `Dockerfile.backend` - Dockerfile for the backend service
- `Dockerfile.frontend` - Dockerfile for the frontend service
- `deploy.sh` - Production deployment script
- `README.md` - This file

## Prerequisites

- Docker and Docker Compose installed
- Access to a PostgreSQL database
- Valid Cohere API key
- Valid Better Auth secret

## Environment Variables

Before deployment, ensure the following environment variables are set:

```bash
DATABASE_URL=postgresql://user:password@host:port/database
BETTER_AUTH_SECRET=your_better_auth_secret
COHERE_API_KEY=your_cohere_api_key
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

## Deployment Steps

1. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

2. **Run the deployment script**:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

## Services

The deployment includes:

- **Backend API**: FastAPI application serving the AI chatbot functionality
- **Frontend UI**: Next.js application with the chat interface
- **Database**: PostgreSQL for storing tasks, conversations, and user data
- **Redis**: For caching and session management

## Health Checks

After deployment, verify the services are running:

- Backend API: `http://localhost:8000/health`
- Frontend UI: `http://localhost:3000`

## Management Commands

- View logs: `docker-compose -f docker-compose.yml logs -f`
- Stop services: `docker-compose -f docker-compose.yml down`
- Restart services: `docker-compose -f docker-compose.yml restart`

## Scaling

To scale the backend service:
```bash
docker-compose -f docker-compose.yml up -d --scale backend=3
```

## Troubleshooting

- If services fail to start, check logs with `docker-compose logs`
- Ensure all required environment variables are set
- Verify database connectivity
- Check that the Cohere API key is valid and has sufficient quota