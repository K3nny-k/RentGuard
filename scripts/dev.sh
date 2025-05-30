#!/bin/bash

# RentGuard Development Setup Script
# This script starts all services and sets up the development environment

set -e

echo "🚀 Starting RentGuard Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null && ! command -v docker &> /dev/null; then
    echo "❌ Docker Compose is not available. Please install Docker Compose."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. You may want to customize the values."
fi

# Function to wait for service to be ready
wait_for_service() {
    local service=$1
    local port=$2
    local max_attempts=30
    local attempt=1

    echo "⏳ Waiting for $service to be ready on port $port..."
    
    while [ $attempt -le $max_attempts ]; do
        if nc -z localhost $port 2>/dev/null; then
            echo "✅ $service is ready!"
            return 0
        fi
        echo "   Attempt $attempt/$max_attempts - $service not ready yet..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "❌ $service failed to start within expected time"
    return 1
}

# Start infrastructure services first
echo "🐘 Starting PostgreSQL and MinIO..."
docker-compose up -d db minio

# Wait for database to be ready
wait_for_service "PostgreSQL" 5432
wait_for_service "MinIO" 9000

# Setup backend
echo "🔧 Setting up backend..."
cd backend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Load environment variables for Prisma
export $(grep -v '^#' ../.env | xargs)

# Generate Prisma client
echo "🔄 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate dev --name init

# Seed the database
echo "🌱 Seeding database..."
npx prisma db seed

# Start backend in development mode
echo "🚀 Starting backend API..."
npm run start:dev &
BACKEND_PID=$!

cd ..

# Setup frontend
echo "🎨 Setting up frontend..."
cd frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start frontend in development mode
echo "🚀 Starting frontend..."
npm run dev &
FRONTEND_PID=$!

cd ..

# Wait for services to start
wait_for_service "Backend API" 3001
wait_for_service "Frontend" 3000

echo ""
echo "🎉 RentGuard Development Environment is ready!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:3001"
echo "📚 API Docs: http://localhost:3001/api/docs"
echo "🗄️ MinIO Console: http://localhost:9001 (minioadmin/minioadmin)"
echo "🐘 Database: localhost:5432"
echo ""
echo "📋 Demo Credentials:"
echo "   Landlord 1: landlord1@example.com / password123"
echo "   Landlord 2: landlord2@example.com / password123"
echo "   Admin: admin@rentguard.com / password123"
echo ""
echo "🛑 To stop all services, press Ctrl+C"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping development environment..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    docker-compose down
    echo "✅ Development environment stopped"
}

# Set trap to cleanup on script exit
trap cleanup EXIT

# Wait for user to stop the script
wait 