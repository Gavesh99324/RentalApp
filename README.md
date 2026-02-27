# Rental Property Management Platform


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
