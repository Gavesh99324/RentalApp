#!/bin/bash

# RentalApp Deployment Script
# Usage: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-development}
echo "🚀 Deploying RentalApp in $ENVIRONMENT mode..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ Error: .env file not found!${NC}"
    echo "Please copy .env.example to .env and configure it:"
    echo "  cp .env.example .env"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker is not running!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Environment file found${NC}"
echo -e "${GREEN}✅ Docker is running${NC}"

# Stop existing containers
echo -e "${YELLOW}📦 Stopping existing containers...${NC}"
docker-compose down

# Build images
echo -e "${YELLOW}🔨 Building Docker images...${NC}"
docker-compose build --no-cache

# Start services
echo -e "${YELLOW}🚀 Starting services...${NC}"
docker-compose up -d

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to be healthy...${NC}"
sleep 10

# Check service health
echo -e "${YELLOW}🏥 Checking service health...${NC}"

# Check PostgreSQL
if docker-compose exec -T postgres pg_isready > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PostgreSQL is healthy${NC}"
else
    echo -e "${RED}❌ PostgreSQL is not healthy${NC}"
fi

# Check MinIO
if curl -f http://localhost:9000/minio/health/live > /dev/null 2>&1; then
    echo -e "${GREEN}✅ MinIO is healthy${NC}"
else
    echo -e "${RED}❌ MinIO is not healthy${NC}"
fi

# Check Server
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Server is healthy${NC}"
else
    echo -e "${RED}❌ Server is not healthy${NC}"
fi

# Check Client
if curl -f http://localhost:3000/ > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Client is healthy${NC}"
else
    echo -e "${RED}❌ Client is not healthy${NC}"
fi

# Run database migrations
echo -e "${YELLOW}📊 Running database migrations...${NC}"
docker-compose exec -T server npx prisma migrate deploy

echo -e "${GREEN}✅ Migrations completed${NC}"

# Optional: Seed database in development
if [ "$ENVIRONMENT" = "development" ]; then
    echo -e "${YELLOW}🌱 Seeding database...${NC}"
    docker-compose exec -T server npm run seed || echo -e "${YELLOW}⚠️  Seed failed (may already be seeded)${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo ""
echo "📌 Access your application:"
echo "  Frontend:      http://localhost:3000"
echo "  Backend API:   http://localhost:3001"
echo "  MinIO Console: http://localhost:9001"
echo "  MinIO API:     http://localhost:9000"
echo ""
echo "📝 View logs:"
echo "  docker-compose logs -f"
echo ""
echo "🛑 Stop services:"
echo "  docker-compose down"
