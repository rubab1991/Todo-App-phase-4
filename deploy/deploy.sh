#!/bin/bash

# Todo AI Chatbot Production Deployment Script

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Todo AI Chatbot Production Deployment Script${NC}"
echo "=================================================="

# Check if running as root (optional - depending on your setup)
if [[ $EUID -eq 0 ]]; then
   echo -e "${YELLOW}Warning: This script is running as root${NC}"
fi

# Check if docker and docker-compose are installed
if ! [ -x "$(command -v docker)" ]; then
  echo -e "${RED}Error: Docker is not installed.${NC}" >&2
  exit 1
fi

if ! [ -x "$(command -v docker-compose)" ]; then
  echo -e "${RED}Error: Docker Compose is not installed.${NC}" >&2
  exit 1
fi

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | xargs)
    echo -e "${GREEN}Loaded environment variables from .env${NC}"
else
    echo -e "${YELLOW}.env file not found. Make sure environment variables are set.${NC}"
fi

# Check required environment variables
required_vars=("DATABASE_URL" "BETTER_AUTH_SECRET" "COHERE_API_KEY")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${RED}Error: $var is not set${NC}"
        exit 1
    fi
done

echo -e "${GREEN}Environment variables check passed${NC}"

# Build the services
echo -e "${YELLOW}Building services...${NC}"
docker-compose -f deploy/docker-compose.yml build

# Run database migrations
echo -e "${YELLOW}Running database migrations...${NC}"
docker-compose -f deploy/docker-compose.yml run --rm backend alembic upgrade head

# Start the services
echo -e "${YELLOW}Starting services...${NC}"
docker-compose -f deploy/docker-compose.yml up -d

# Wait for services to be healthy
echo -e "${YELLOW}Waiting for services to be ready...${NC}"
sleep 10

# Check if backend is running
if docker-compose -f deploy/docker-compose.yml ps | grep -q "backend.*Up"; then
    echo -e "${GREEN}Backend service is running${NC}"
else
    echo -e "${RED}Error: Backend service failed to start${NC}"
    docker-compose -f deploy/docker-compose.yml logs backend
    exit 1
fi

# Check if frontend is running
if docker-compose -f deploy/docker-compose.yml ps | grep -q "frontend.*Up"; then
    echo -e "${GREEN}Frontend service is running${NC}"
else
    echo -e "${RED}Error: Frontend service failed to start${NC}"
    docker-compose -f deploy/docker-compose.yml logs frontend
    exit 1
fi

# Run health checks
echo -e "${YELLOW}Running health checks...${NC}"
sleep 5

BACKEND_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health || echo "000")
if [ "$BACKEND_HEALTH" -eq 200 ]; then
    echo -e "${GREEN}Backend health check passed${NC}"
else
    echo -e "${RED}Error: Backend health check failed (HTTP $BACKEND_HEALTH)${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo ""
echo "Services:"
echo "- Backend API: http://localhost:8000"
echo "- Frontend UI: http://localhost:3000"
echo "- Database: localhost:5432"
echo ""
echo "To view logs: docker-compose -f deploy/docker-compose.yml logs -f"
echo "To stop services: docker-compose -f deploy/docker-compose.yml down"
echo ""

# Optional: Run basic integration tests
read -p "Run basic integration tests? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Running basic integration tests...${NC}"

    # Test API endpoint
    API_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/health || echo "000")
    if [ "$API_TEST" -eq 200 ]; then
        echo -e "${GREEN}✓ API health check: PASSED${NC}"
    else
        echo -e "${RED}✗ API health check: FAILED${NC}"
    fi

    # Test static assets (frontend)
    FRONTEND_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "000")
    if [ "$FRONTEND_TEST" -eq 200 ]; then
        echo -e "${GREEN}✓ Frontend availability: PASSED${NC}"
    else
        echo -e "${RED}✗ Frontend availability: FAILED${NC}"
    fi

    echo -e "${GREEN}Integration tests completed${NC}"
fi

echo -e "${GREEN}Deployment script finished successfully!${NC}"