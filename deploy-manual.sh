#!/bin/bash

echo "🚀 Setting up RentGuard - Manual Deployment"

# Check if running as root
if [ "$EUID" -eq 0 ]; then
  echo "❌ Please don't run this script as root"
  exit 1
fi

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
echo "📱 Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
echo "🗄️ Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# Install other tools
echo "🔧 Installing additional tools..."
sudo apt install -y nginx curl wget git

# Install PM2
echo "⚡ Installing PM2..."
sudo npm install -g pm2

# Create logs directory
mkdir -p logs

# Start and enable PostgreSQL
echo "🔄 Starting PostgreSQL..."
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database and user
echo "🗃️ Setting up database..."
sudo -u postgres psql << 'EOF'
CREATE DATABASE rentguard;
CREATE USER rentguard_user WITH PASSWORD 'rentguard123';
GRANT ALL PRIVILEGES ON DATABASE rentguard TO rentguard_user;
ALTER USER rentguard_user CREATEDB;
\q
EOF

# Setup backend
echo "🔧 Setting up backend..."
cd backend

# Install dependencies
npm install

# Copy environment file
cp ../config/backend.env .env

# Run migrations
npx prisma migrate deploy
npx prisma db seed

# Build the application
npm run build

# Start with PM2
pm2 start ../config/ecosystem.config.js --only rentguard-backend

cd ..

# Setup frontend
echo "🎨 Setting up frontend..."
cd frontend

# Install dependencies
npm install

# Copy environment file
cp ../config/frontend.env .env.local

# Build the application
npm run build

# Start with PM2
pm2 start ../config/ecosystem.config.js --only rentguard-frontend

cd ..

# Setup nginx
echo "🌐 Setting up nginx..."
sudo cp config/nginx.conf /etc/nginx/sites-available/rentguard
sudo ln -sf /etc/nginx/sites-available/rentguard /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx config
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

# Setup MinIO
echo "📦 Setting up MinIO..."
bash config/setup-minio.sh

# Configure firewall
echo "🔒 Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 9000/tcp
sudo ufw allow 9001/tcp
sudo ufw --force enable

# Save PM2 configuration
pm2 save
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp $HOME

echo "✅ Deployment complete!"
echo ""
echo "📊 Service Status:"
pm2 status
echo ""
echo "🌐 Your application is now available at:"
echo "   Main App: http://20.55.40.193"
echo "   MinIO Console: http://20.55.40.193:9001"
echo ""
echo "📝 To manage services:"
echo "   pm2 status           - Check service status"
echo "   pm2 logs             - View logs"
echo "   pm2 restart all      - Restart all services"
echo "   sudo systemctl status nginx  - Check nginx"
echo "   sudo systemctl status minio  - Check MinIO" 