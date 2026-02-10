#!/bin/bash
set -e

# This script runs when PostgreSQL container initializes
echo "Initializing RentalApp database..."

# Add PostGIS extension for geographic queries
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE EXTENSION IF NOT EXISTS postgis;
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EOSQL

echo "PostgreSQL initialization complete!"
