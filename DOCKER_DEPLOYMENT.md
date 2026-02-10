# 🐳 Docker Deployment Guide

## Quick Start

### 1️⃣ Setup Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your actual values
nano .env   # or use your preferred editor
```

**Important:** Update these values in `.env`:
- `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- `POSTGRES_PASSWORD` - Use a strong password
- `MINIO_ROOT_PASSWORD` - Use a strong password
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` - Get from mapbox.com
- AWS Cognito credentials

### 2️⃣ Build and Start All Services

```bash
# Build and start all containers
docker-compose up -d

# View logs
docker-compose logs -f

# Check service health
docker-compose ps
```

### 3️⃣ Initialize Database

```bash
# Run Prisma migrations
docker-compose exec server npx prisma migrate deploy

# Seed database with sample data (optional for development)
docker-compose exec server npm run seed
```

### 4️⃣ Access Services

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **MinIO Console:** http://localhost:9001
  - Username: `minioadmin` (or your MINIO_ROOT_USER)
  - Password: `minioadmin123` (or your MINIO_ROOT_PASSWORD)
- **MinIO API:** http://localhost:9000
- **PostgreSQL:** localhost:5432
- **pgAdmin (optional):** http://localhost:5050 (run with `--profile tools`)

---

## 📦 What's Included

### Services

1. **PostgreSQL** - Production-grade database with PostGIS extension
2. **MinIO** - S3-compatible object storage for images
3. **Backend Server** - Express + Prisma API
4. **Frontend Client** - Next.js 15 application
5. **pgAdmin** (optional) - Database management GUI

### Features

- ✅ Health checks for all services
- ✅ Automatic database initialization with PostGIS
- ✅ MinIO bucket auto-creation on startup
- ✅ Multi-stage Docker builds for optimized images
- ✅ Non-root users for security
- ✅ Volume persistence for data
- ✅ Network isolation
- ✅ Environment-based configuration

---

## 🔧 Common Commands

### Start/Stop Services

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes (deletes data!)
docker-compose down -v

# Restart a specific service
docker-compose restart server
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f server
docker-compose logs -f postgres
docker-compose logs -f minio
```

### Execute Commands in Containers

```bash
# Run Prisma migrations
docker-compose exec server npx prisma migrate deploy

# Generate Prisma client
docker-compose exec server npx prisma generate

# Seed database
docker-compose exec server npm run seed

# Access PostgreSQL shell
docker-compose exec postgres psql -U rentalapp -d rentalapp_db

# Access server shell
docker-compose exec server sh
```

### Database Management

```bash
# Create migration
docker-compose exec server npx prisma migrate dev --name migration_name

# Reset database (development only!)
docker-compose exec server npx prisma migrate reset

# View Prisma Studio
docker-compose exec server npx prisma studio
```

### MinIO Management

```bash
# List buckets
docker-compose exec minio mc ls myminio

# Create bucket manually
docker-compose exec minio mc mb myminio/new-bucket

# Set public read access
docker-compose exec minio mc anonymous set download myminio/bucket-name
```

---

## 🏗️ Build & Deploy

### Development

```bash
# Build with cache
docker-compose build

# Build without cache (force rebuild)
docker-compose build --no-cache

# Build specific service
docker-compose build server
```

### Production

```bash
# Set environment to production
export NODE_ENV=production

# Build for production
docker-compose -f docker-compose.yml build

# Start in production mode
docker-compose -f docker-compose.yml up -d
```

---

## 🔐 Security Best Practices

### Before Production Deployment:

1. **Generate Strong Secrets**
   ```bash
   # JWT Secret
   openssl rand -base64 32
   
   # Database Password
   openssl rand -base64 24
   
   # MinIO Password
   openssl rand -base64 24
   ```

2. **Update Environment Variables**
   - Change all default passwords
   - Use strong JWT_SECRET
   - Configure CORS_ORIGIN to your domain
   - Use production database URL
   - Configure proper AWS Cognito credentials

3. **Enable HTTPS**
   - Add reverse proxy (Nginx/Traefik)
   - Configure SSL certificates (Let's Encrypt)
   - Force HTTPS redirects

4. **Harden Docker**
   - Run as non-root users (already configured)
   - Limit container resources
   - Use Docker secrets for sensitive data
   - Enable Docker Content Trust

---

## 🐛 Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs service-name

# Check container status
docker-compose ps

# Restart service
docker-compose restart service-name
```

### Database connection errors

```bash
# Check if PostgreSQL is ready
docker-compose exec postgres pg_isready

# Check database logs
docker-compose logs postgres

# Verify DATABASE_URL in server
docker-compose exec server printenv DATABASE_URL
```

### MinIO issues

```bash
# Check MinIO health
curl http://localhost:9000/minio/health/live

# Check MinIO logs
docker-compose logs minio

# Recreate bucket
docker-compose exec minio mc mb myminio/rentalapp-properties --ignore-existing
```

### "Cannot connect to API" errors

```bash
# Check server logs
docker-compose logs server

# Verify server is running
docker-compose ps server

# Check health endpoint
curl http://localhost:3001/health

# Check network
docker network inspect rentalapp_rentalapp-network
```

### Port already in use

```bash
# Find process using port
lsof -i :3000   # On Mac/Linux
netstat -ano | findstr :3000   # On Windows

# Change port in .env file
CLIENT_PORT=3001
SERVER_PORT=3002
```

---

## 📊 Monitoring

### Health Checks

```bash
# Check all health statuses
docker-compose ps

# Test health endpoints
curl http://localhost:3001/health
curl http://localhost:3000/
```

### Resource Usage

```bash
# View resource stats
docker stats

# View disk usage
docker system df

# Clean up unused resources
docker system prune -a
```

---

## 🚀 Production Deployment Options

### Option 1: Docker on VPS (DigitalOcean, Linode, etc.)

1. Copy project to server
2. Install Docker & Docker Compose
3. Configure production `.env`
4. Run `docker-compose up -d`
5. Set up Nginx reverse proxy
6. Configure SSL with Let's Encrypt

### Option 2: AWS ECS/Fargate

1. Push images to ECR
2. Create ECS task definitions
3. Configure ALB
4. Set up RDS for PostgreSQL
5. Use EFS for MinIO data

### Option 3: Kubernetes (Advanced)

1. Convert docker-compose to K8s manifests
2. Set up Helm charts
3. Deploy to EKS, GKE, or AKS
4. Configure Ingress
5. Set up managed database

---

## 📝 Backup & Restore

### Database Backup

```bash
# Backup database
docker-compose exec postgres pg_dump -U rentalapp rentalapp_db > backup.sql

# Restore database
docker-compose exec -T postgres psql -U rentalapp rentalapp_db < backup.sql
```

### MinIO Backup

```bash
# Backup MinIO data
docker-compose exec minio mc mirror myminio/rentalapp-properties /backup

# Restore MinIO data
docker-compose exec minio mc mirror /backup myminio/rentalapp-properties
```

---

## 🎯 Next Steps

1. ✅ Configure environment variables
2. ✅ Start services with `docker-compose up -d`
3. ✅ Run database migrations
4. ✅ Seed database (optional)
5. ✅ Test application at http://localhost:3000
6. ✅ Review logs for errors
7. ✅ Set up backups
8. ✅ Configure monitoring
9. ✅ Plan production deployment

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [MinIO Documentation](https://min.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
