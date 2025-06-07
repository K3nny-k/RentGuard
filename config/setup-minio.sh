#!/bin/bash

echo "📦 Setting up MinIO..."

# Download MinIO
echo "⬇️ Downloading MinIO..."
wget -q https://dl.min.io/server/minio/release/linux-amd64/minio -O /tmp/minio
sudo chmod +x /tmp/minio
sudo mv /tmp/minio /usr/local/bin/

# Create MinIO user and directories
echo "👤 Creating MinIO user and directories..."
sudo useradd -r minio-user -s /sbin/nologin 2>/dev/null || echo "User minio-user already exists"
sudo mkdir -p /opt/minio/data
sudo chown -R minio-user:minio-user /opt/minio

# Create MinIO environment file
echo "⚙️ Creating MinIO configuration..."
sudo tee /etc/default/minio > /dev/null << 'EOF'
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin123
MINIO_VOLUMES="/opt/minio/data"
MINIO_OPTS="--console-address :9001"
MINIO_SERVER_URL="http://20.55.40.193:9000"
EOF

# Create MinIO systemd service
echo "🔧 Creating MinIO service..."
sudo tee /etc/systemd/system/minio.service > /dev/null << 'EOF'
[Unit]
Description=MinIO
Documentation=https://docs.min.io
Wants=network-online.target
After=network-online.target
AssertFileIsExecutable=/usr/local/bin/minio

[Service]
WorkingDirectory=/usr/local/

User=minio-user
Group=minio-user

ProtectProc=invisible

EnvironmentFile=-/etc/default/minio
ExecStartPre=/bin/bash -c "if [ -z \"${MINIO_VOLUMES}\" ]; then echo \"Variable MINIO_VOLUMES not set in /etc/default/minio\"; exit 1; fi"
ExecStart=/usr/local/bin/minio server $MINIO_VOLUMES $MINIO_OPTS

# MinIO SIGTERM handler is at 30s; MaxTimeoutStopSec should be greater
TimeoutStopSec=40s
KillMode=mixed
KillSignal=SIGTERM

# Let systemd restart this service always
Restart=always

# Specifies the maximum file descriptor number that can be opened by this process
LimitNOFILE=65536

# Specifies the maximum number of threads this process can create
TasksMax=infinity

# Disable timeout logic and wait until process is stopped
TimeoutStopSec=infinity
SendSIGKILL=no

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and start MinIO
echo "🚀 Starting MinIO service..."
sudo systemctl daemon-reload
sudo systemctl enable minio
sudo systemctl start minio

# Wait a moment for service to start
sleep 3

# Check service status
if sudo systemctl is-active --quiet minio; then
    echo "✅ MinIO service started successfully"
    echo "🌐 MinIO Console: http://20.55.40.193:9001"
    echo "📁 MinIO API: http://20.55.40.193:9000"
    echo "🔑 Username: minioadmin"
    echo "🔑 Password: minioadmin123"
else
    echo "❌ MinIO service failed to start"
    echo "📋 Check logs with: sudo journalctl -u minio"
fi 