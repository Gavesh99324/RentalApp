```mermaid
graph TB
    subgraph "Client Layer"
        CLIENT[Next.js Frontend<br/>Port 3000]
    end
    
    subgraph "API Layer"
        SERVER[Express Server<br/>Port 3001]
    end
    
    subgraph "Data Layer"
        POSTGRES[(PostgreSQL<br/>Port 5432)]
        MINIO[MinIO Storage<br/>Port 9000<br/>Console: 9001]
    end
    
    subgraph "Management"
        PGADMIN[pgAdmin<br/>Port 5050]
    end
    
    CLIENT -->|HTTP/HTTPS| SERVER
    SERVER -->|SQL Queries| POSTGRES
    SERVER -->|S3 API| MINIO
    PGADMIN -.->|Manage| POSTGRES
    
    style CLIENT fill:#61dafb,stroke:#333,stroke-width:2px
    style SERVER fill:#68a063,stroke:#333,stroke-width:2px
    style POSTGRES fill:#336791,stroke:#333,stroke-width:2px,color:#fff
    style MINIO fill:#C72E49,stroke:#333,stroke-width:2px,color:#fff
    style PGADMIN fill:#3D6E93,stroke:#333,stroke-width:2px,color:#fff
```

## Service URLs

- **Frontend:** http://localhost:3000
- **API:** http://localhost:3001
- **API Health:** http://localhost:3001/health
- **MinIO Console:** http://localhost:9001 (minioadmin/minioadmin123)
- **MinIO API:** http://localhost:9000
- **PostgreSQL:** localhost:5432 (rentalapp/changeme123)
- **pgAdmin:** http://localhost:5050 (admin@rentalapp.com/admin123)

## Data Flow

1. User accesses **Frontend** (Next.js)
2. Frontend calls **Backend API** (Express)
3. Backend queries **PostgreSQL** for data
4. Backend stores/retrieves images from **MinIO**
5. **pgAdmin** manages database (optional)

## Docker Volumes

- `postgres_data` - Database persistence
- `minio_data` - File storage persistence
- `pgadmin_data` - pgAdmin settings

## Networks

- `rentalapp-network` - Bridge network connecting all services
