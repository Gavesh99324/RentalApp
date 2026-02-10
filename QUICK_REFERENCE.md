# 🚀 Quick Reference Guide

## Essential Commands

### First Time Setup
```bash
# 1. Copy environment file
cp .env.example .env

# 2. Edit with your values
nano .env

# 3. Deploy (Windows)
deploy.bat

# 3. Deploy (Linux/Mac)
chmod +x deploy.sh
./deploy.sh
```

### Daily Usage
```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f

# Restart service
docker-compose restart server
```

### Database
```bash
# Migrate
docker-compose exec server npx prisma migrate deploy

# Seed
docker-compose exec server npm run seed

# Access psql
docker-compose exec postgres psql -U rentalapp -d rentalapp_db

# Backup
docker-compose exec postgres pg_dump -U rentalapp rentalapp_db > backup.sql
```

### MinIO
```bash
# Access console
http://localhost:9001
User: minioadmin
Pass: minioadmin123

# Check bucket
docker-compose exec minio mc ls myminio
```

## Important URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | - |
| API | http://localhost:3001 | - |
| API Health | http://localhost:3001/health | - |
| MinIO Console | http://localhost:9001 | minioadmin / minioadmin123 |
| MinIO API | http://localhost:9000 | - |
| PostgreSQL | localhost:5432 | rentalapp / changeme123 |
| pgAdmin | http://localhost:5050 | admin@rentalapp.com / admin123 |

## Environment Variables Priority

### Must Change for Production
- `JWT_SECRET` - Generate: `openssl rand -base64 32`
- `POSTGRES_PASSWORD` - Strong password
- `MINIO_ROOT_PASSWORD` - Strong password
- `CORS_ORIGIN` - Your production domain
- `NEXT_PUBLIC_API_BASE_URL` - Your API URL
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` - Get from mapbox.com

### AWS Cognito
- `NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID`
- `NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID`

## Health Checks

```bash
# Check all services
docker-compose ps

# Test server health
curl http://localhost:3001/health

# Test client
curl http://localhost:3000/

# Test MinIO
curl http://localhost:9000/minio/health/live

# Test PostgreSQL
docker-compose exec postgres pg_isready
```

## Troubleshooting Quick Fixes

### Service won't start
```bash
docker-compose logs service-name
docker-compose restart service-name
```

### Database issues
```bash
docker-compose restart postgres
docker-compose exec server npx prisma migrate deploy
```

### Port conflicts
Edit .env and change ports:
```
CLIENT_PORT=3001
SERVER_PORT=3002
```

### Clean restart
```bash
docker-compose down -v
docker-compose up -d
```

## File Structure

```
RentalApp/
├── .env                    # Your config (DO NOT COMMIT!)
├── .env.example            # Template
├── docker-compose.yml      # All services
├── deploy.sh / deploy.bat  # Deployment scripts
├── client/                 # Next.js frontend
│   ├── Dockerfile
│   ├── .env.example
│   └── src/
├── server/                 # Express backend
│   ├── Dockerfile
│   ├── .env.example
│   ├── prisma/
│   └── src/
└── docs/
    ├── README.md
    ├── DOCKER_DEPLOYMENT.md
    └── PRODUCTION_READINESS.md
```

## Production Checklist

- [ ] Copy and configure .env
- [ ] Change all default passwords
- [ ] Generate strong JWT_SECRET
- [ ] Configure CORS_ORIGIN
- [ ] Get Mapbox token
- [ ] Configure AWS Cognito
- [ ] Test locally first
- [ ] Set up domain and SSL
- [ ] Configure backups
- [ ] Set up monitoring

## Docker Cheat Sheet

```bash
# View running containers
docker ps

# View all containers
docker ps -a

# View images
docker images

# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# View logs (last 100 lines)
docker-compose logs --tail=100

# Follow logs
docker-compose logs -f service-name

# Execute command in container
docker-compose exec service-name command

# Access container shell
docker-compose exec service-name sh

# View container stats
docker stats

# Rebuild single service
docker-compose build service-name

# Restart single service
docker-compose restart service-name

# Stop single service
docker-compose stop service-name
```

## Common Error Messages

### "port is already allocated"
```bash
# Find process using port
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Mac/Linux

# Change port in .env
CLIENT_PORT=3001
```

### "Cannot connect to the Docker daemon"
- Start Docker Desktop
- Check Docker service is running

### "database does not exist"
```bash
# Recreate database
docker-compose down -v
docker-compose up -d
docker-compose exec server npx prisma migrate deploy
```

### "MinIO bucket not found"
```bash
# Recreate bucket
docker-compose restart minio-init
```

## Security Notes

⚠️ **NEVER commit:**
- `.env` files
- Database credentials
- API keys
- JWT secrets

✅ **ALWAYS:**
- Use `.env.example` as template
- Change default passwords
- Use strong secrets in production
- Enable HTTPS in production
- Configure proper CORS

## Getting Help

1. Check logs: `docker-compose logs service-name`
2. Check [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md#-troubleshooting)
3. Check [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md)
4. Open GitHub issue

## Next Steps

1. ✅ Complete .env configuration
2. ✅ Run deployment script
3. ✅ Test application
4. ✅ Review security checklist
5. ✅ Set up backups
6. ✅ Plan production deployment
