@echo off
REM RentalApp Deployment Script for Windows
REM Usage: deploy.bat [environment]

setlocal enabledelayedexpansion

set ENVIRONMENT=%1
if "%ENVIRONMENT%"=="" set ENVIRONMENT=development

echo.
echo ======================================
echo   RentalApp Deployment
echo   Environment: %ENVIRONMENT%
echo ======================================
echo.

REM Check if .env exists
if not exist .env (
    echo [ERROR] .env file not found!
    echo Please copy .env.example to .env and configure it:
    echo   copy .env.example .env
    exit /b 1
)

echo [OK] Environment file found

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running!
    exit /b 1
)

echo [OK] Docker is running
echo.

REM Stop existing containers
echo [INFO] Stopping existing containers...
docker-compose down

REM Build images
echo [INFO] Building Docker images...
docker-compose build --no-cache

REM Start services
echo [INFO] Starting services...
docker-compose up -d

REM Wait for services
echo [INFO] Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Run database migrations
echo [INFO] Running database migrations...
docker-compose exec -T server npx prisma migrate deploy

echo [OK] Migrations completed

REM Seed database in development
if "%ENVIRONMENT%"=="development" (
    echo [INFO] Seeding database...
    docker-compose exec -T server npm run seed
)

echo.
echo ======================================
echo   Deployment Complete!
echo ======================================
echo.
echo Access your application:
echo   Frontend:      http://localhost:3000
echo   Backend API:   http://localhost:3001
echo   MinIO Console: http://localhost:9001
echo   MinIO API:     http://localhost:9000
echo.
echo View logs:
echo   docker-compose logs -f
echo.
echo Stop services:
echo   docker-compose down
echo.

pause
