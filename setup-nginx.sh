#!/bin/bash

# Exit on error
set -e

echo "🚀 Starting Nginx setup with SSL..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use sudo)"
    exit 1
fi

# Install Nginx and Certbot if not already installed
echo "📦 Installing Nginx and Certbot..."
apt-get update
apt-get install -y nginx certbot python3-certbot-nginx

# Prompt for domain name
read -p "Enter your domain name (e.g., example.com): " DOMAIN_NAME

# Get SSL certificate
echo "🔒 Obtaining SSL certificate for $DOMAIN_NAME..."
certbot certonly --nginx -d $DOMAIN_NAME --non-interactive --agree-tos --email admin@$DOMAIN_NAME

# Create Nginx configuration
echo "🔧 Creating Nginx configuration..."
cat > /etc/nginx/sites-available/$DOMAIN_NAME << EOF
server {
    listen 443 ssl;
    server_name $DOMAIN_NAME;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN_NAME/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:5174;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # Backend
    location /api/ {
        proxy_pass http://localhost:5176;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name $DOMAIN_NAME;
    return 301 https://\$server_name\$request_uri;
}
EOF

# Enable the site
echo "🔌 Enabling the site..."
ln -sf /etc/nginx/sites-available/$DOMAIN_NAME /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
echo "🔍 Testing Nginx configuration..."
nginx -t

# Restart Nginx
echo "🔄 Restarting Nginx..."
systemctl restart nginx

echo "✅ Nginx setup complete!"
echo "🌐 Your application is now available at https://$DOMAIN_NAME"
echo "🔌 API endpoints are accessible at https://$DOMAIN_NAME/api/" 