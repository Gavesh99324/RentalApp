# 🏠 RentalApp - Complete Rental Property Management Platform

A modern, full-stack rental property management application built with Next.js, Express, PostgreSQL, and MinIO.

## 🚀 Quick Start with Docker

### Prerequisites

- [Docker](https://www.docker.com/get-started) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd RentalApp

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env  # or use your preferred editor
```

### 2. Deploy

**On Linux/Mac:**
```bash
chmod +x deploy.sh
./deploy.sh development
```

**On Windows:**
```bash
deploy.bat development
```

### 3. Access Application

- **Frontend:** http://localhost:3000
- **API:** http://localhost:3001
- **MinIO Console:** http://localhost:9001 (user: minioadmin, pass: minioadmin123)

---

## 📋 What's Included

### Services

- **PostgreSQL 16** - Production database with PostGIS
- **MinIO** - S3-compatible object storage for property images
- **Express.js API** - RESTful backend with Prisma ORM
- **Next.js 15 Frontend** - Modern React-based UI
- **pgAdmin** - Database management (optional)

### Features

✅ Property listing and search with Mapbox integration  
✅ User authentication with AWS Cognito  
✅ Image upload and storage with MinIO  
✅ Application management for tenants  
✅ Manager dashboard for property owners  
✅ Responsive design with Tailwind CSS  
✅ Docker containerization for easy deployment  
✅ Health checks and monitoring  

---

## 🛠️ Development

### Manual Setup (Without Docker)

#### Server Setup

```bash
cd server

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database URL and credentials

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Seed database (optional)
npm run seed

# Start development server
npm run dev
```

#### Client Setup

```bash
cd client

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with API URL and Mapbox token

# Start development server
npm run dev
```

### Prerequisites for Manual Setup

- Node.js 20+
- PostgreSQL 14+ with PostGIS extension
- MinIO or AWS S3 account
- AWS Cognito user pool
- Mapbox API token

---

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild images
docker-compose build --no-cache

# Run migrations
docker-compose exec server npx prisma migrate deploy

# Seed database
docker-compose exec server npm run seed

# Access PostgreSQL
docker-compose exec postgres psql -U rentalapp -d rentalapp_db
```

For detailed Docker documentation, see [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md)

---

## 📝 Configuration

### Required Environment Variables

#### Server (.env)
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://user:pass@localhost:5432/db
JWT_SECRET=your-secret-key
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin123
AWS_S3_BUCKET_NAME=rentalapp-properties
AWS_ENDPOINT=http://minio:9000
CORS_ORIGIN=http://localhost:3000
```

#### Client (.env)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID=your_pool_id
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID=your_client_id
```

See `.env.example` files for complete configuration options.

---

## 🏗️ Architecture

```
RentalApp/
├── client/              # Next.js frontend
│   ├── src/
│   │   ├── app/        # App router pages
│   │   ├── components/ # React components
│   │   ├── state/      # Redux store
│   │   └── types/      # TypeScript types
│   └── Dockerfile
├── server/             # Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── middleware/
│   ├── prisma/
│   │   └── schema.prisma
│   └── Dockerfile
└── docker-compose.yml
```

---

## 🔐 Security

### Before Production:

1. **Change Default Credentials**
   - PostgreSQL password
   - MinIO root credentials
   - JWT secret

2. **Generate Strong Secrets**
   ```bash
   openssl rand -base64 32  # For JWT_SECRET
   ```

3. **Configure CORS**
   - Set `CORS_ORIGIN` to your production domain

4. **Enable HTTPS**
   - Use reverse proxy (Nginx/Traefik)
   - Configure SSL certificates

5. **Review Security Checklist**
   - See [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md)

---

## 📊 Database

### Migrations

```bash
# Create migration
cd server
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (development only!)
npx prisma migrate reset
```

### Backup & Restore

```bash
# Backup
docker-compose exec postgres pg_dump -U rentalapp rentalapp_db > backup.sql

# Restore
docker-compose exec -T postgres psql -U rentalapp rentalapp_db < backup.sql
```

---

## 🧪 Testing

```bash
# Server tests (when implemented)
cd server
npm test

# Client tests (when implemented)
cd client
npm test
```

---

## 📦 Production Deployment

### Recommended Hosting Options

1. **Simple Deployment** (Easiest)
   - Frontend: [Vercel](https://vercel.com) (free)
   - Backend: [Railway](https://railway.app) ($5-10/month)
   - Database: [Supabase](https://supabase.com) (free tier)
   - Storage: Keep MinIO or use [Cloudinary](https://cloudinary.com) (free tier)

2. **AWS Deployment**
   - Frontend: AWS Amplify / CloudFront + S3
   - Backend: ECS / Elastic Beanstalk
   - Database: RDS PostgreSQL
   - Storage: S3 + CloudFront

3. **Self-Hosted VPS**
   - Use Docker Compose on DigitalOcean, Linode, etc.
   - Set up Nginx reverse proxy
   - Configure SSL with Let's Encrypt
   - Estimated cost: $20-40/month

### Deployment Checklist

- [ ] Update all environment variables
- [ ] Change default passwords
- [ ] Configure domain and DNS
- [ ] Set up SSL certificates
- [ ] Configure CORS for production domain
- [ ] Run database migrations
- [ ] Set up automated backups
- [ ] Configure monitoring and logging
- [ ] Test all functionality
- [ ] Set up CI/CD pipeline (optional)

See [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md) for complete checklist.

---

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Change ports in .env
CLIENT_PORT=3001
SERVER_PORT=3002
```

**Database connection errors:**
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# View logs
docker-compose logs postgres
```

**MinIO connection errors:**
```bash
# Check MinIO health
curl http://localhost:9000/minio/health/live

# Recreate bucket
docker-compose restart minio-init
```

For more troubleshooting, see [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md#-troubleshooting)

---

## 📚 Documentation

- [Docker Deployment Guide](DOCKER_DEPLOYMENT.md) - Complete Docker setup and management
- [Production Readiness Checklist](PRODUCTION_READINESS.md) - Security and deployment guidelines
- [Mapbox Setup](client/MAPBOX_SETUP.md) - Mapbox configuration guide

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Backend with [Express.js](https://expressjs.com/) and [Prisma](https://www.prisma.io/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Maps powered by [Mapbox](https://www.mapbox.com/)
- Authentication with [AWS Cognito](https://aws.amazon.com/cognito/)

---

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting guides

---

**Made with ❤️ for property management**
