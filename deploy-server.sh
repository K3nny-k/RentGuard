#!/bin/bash

echo "🚀 Setting up RentGuard Production Server..."

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential packages
echo "🔧 Installing essential packages..."
sudo apt install -y curl wget git ufw fail2ban unzip

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
echo "🔗 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Configure firewall
echo "🔒 Configuring firewall..."
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 9000/tcp
sudo ufw allow 9001/tcp
sudo ufw --force enable

# Configure fail2ban
echo "🛡️ Configuring fail2ban..."
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Create nginx directory
echo "📁 Creating nginx directory..."
mkdir -p nginx

# Set up log rotation
echo "📝 Setting up log rotation..."
sudo tee /etc/logrotate.d/docker-compose > /dev/null <<EOF
/opt/rentguard/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    notifempty
    create 644 root root
}
EOF

# Create logs directory
mkdir -p logs

echo "✅ Server setup complete!"
echo ""
echo "🔄 Please log out and log back in to apply Docker group changes."
echo "Then run the following commands:"
echo "  1. cp production.env .env"
echo "  2. nano .env  # Edit with your secure passwords"
echo "  3. docker-compose -f docker-compose.prod.yml up -d --build"
echo ""
echo "🌐 Your application will be available at: http://20.55.40.193" 