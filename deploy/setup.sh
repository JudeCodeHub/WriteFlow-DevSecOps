#!/bin/bash
# ============================================
# Writeflow Blog Platform - EC2 Setup Script
# Run this script on a fresh Ubuntu EC2 instance
# ============================================

set -e

echo "🛤️  Setting up Writeflow Blog Platform..."
echo "==========================================="

# --- Update system ---
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# --- Install Node.js 20.x ---
echo "📦 Installing Node.js 20.x..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# --- Install PostgreSQL ---
echo "📦 Installing PostgreSQL..."
sudo apt install -y postgresql postgresql-contrib

# --- Install Nginx ---
echo "📦 Installing Nginx..."
sudo apt install -y nginx

# --- Install PM2 (process manager) ---
echo "📦 Installing PM2..."
sudo npm install -g pm2

# --- Configure PostgreSQL ---
echo "🗄️  Configuring PostgreSQL..."
sudo -u postgres psql <<EOF
CREATE USER writeflow_user WITH PASSWORD 'writeflow_pass_2026';
CREATE DATABASE writeflow_db OWNER writeflow_user;
GRANT ALL PRIVILEGES ON DATABASE writeflow_db TO writeflow_user;
\c writeflow_db
GRANT ALL ON SCHEMA public TO writeflow_user;
EOF

echo "✅ PostgreSQL configured"

# --- Set up project directory ---
echo "📁 Setting up project..."
sudo mkdir -p /var/www/writeflow
sudo chown -R $USER:$USER /var/www/writeflow

# Copy project files (assumes you've transferred them to ~/Writeflow)
cp -r ~/Writeflow/* /var/www/writeflow/

# --- Install backend dependencies ---
echo "📦 Installing backend dependencies..."
cd /var/www/writeflow/backend
npm install --production

# --- Build frontend ---
echo "🔨 Building frontend..."
cd /var/www/writeflow/frontend
npm install
npm run build

# --- Configure Nginx ---
echo "🌐 Configuring Nginx..."
sudo cp /var/www/writeflow/deploy/writeflow-nginx.conf /etc/nginx/sites-available/writeflow
sudo ln -sf /etc/nginx/sites-available/writeflow /etc/nginx/sites-enabled/writeflow
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# --- Start backend with PM2 ---
echo "🚀 Starting backend with PM2..."
cd /var/www/writeflow/backend
pm2 start src/index.js --name writeflow-backend
pm2 save
pm2 startup systemd -u $USER --hp /home/$USER | tail -1 | sudo bash

echo ""
echo "==========================================="
echo "🎉 Writeflow is now live!"
echo "==========================================="
echo ""
echo "Access your blog at: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo '<your-ec2-public-ip>')"
echo ""
echo "Useful commands:"
echo "  pm2 status          - Check backend status"
echo "  pm2 logs            - View backend logs"
echo "  pm2 restart all     - Restart backend"
echo "  sudo systemctl restart nginx - Restart Nginx"
echo ""
