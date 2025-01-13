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
if ! command -v nginx &> /dev/null || ! command -v certbot &> /dev/null; then
    echo "📦 Installing Nginx and Certbot..."
    apt-get update
    apt-get install -y nginx certbot python3-certbot-nginx apache2-utils
fi

# Check for existing domain configuration
DOMAIN_CONFIG="/etc/nginx/.domain_name"
if [ -f "$DOMAIN_CONFIG" ]; then
    DOMAIN_NAME=$(cat "$DOMAIN_CONFIG")
    echo "📝 Using existing domain: $DOMAIN_NAME"
    read -p "Would you like to use a different domain? (y/N) " change_domain
    if [[ $change_domain =~ ^[Yy]$ ]]; then
        read -p "Enter your domain name (e.g., example.com): " DOMAIN_NAME
        echo "$DOMAIN_NAME" > "$DOMAIN_CONFIG"
    fi
else
    # Prompt for domain name
    read -p "Enter your domain name (e.g., example.com): " DOMAIN_NAME
    echo "$DOMAIN_NAME" > "$DOMAIN_CONFIG"
fi

# Check if certificate already exists
if [ -d "/etc/letsencrypt/live/$DOMAIN_NAME" ]; then
    echo "📜 SSL certificate for $DOMAIN_NAME already exists"
else
    # Get SSL certificate
    echo "🔒 Obtaining SSL certificate for $DOMAIN_NAME..."
    certbot certonly --nginx -d $DOMAIN_NAME --non-interactive --agree-tos --email admin@$DOMAIN_NAME
fi

# Create password file if it doesn't exist
if [ ! -f "/etc/nginx/.htpasswd" ]; then
    echo "🔐 Setting up password protection..."
    read -p "Enter username for HTTP authentication: " AUTH_USER
    /usr/bin/htpasswd -c /etc/nginx/.htpasswd $AUTH_USER
else
    echo "🔐 Password protection already configured"
    read -p "Would you like to add/update a user? (y/N) " update_auth
    if [[ $update_auth =~ ^[Yy]$ ]]; then
        read -p "Enter username for HTTP authentication: " AUTH_USER
        /usr/bin/htpasswd /etc/nginx/.htpasswd $AUTH_USER
    fi
fi

# Create Nginx configuration
echo "🔧 Creating Nginx configuration..."
cat > /etc/nginx/sites-available/$DOMAIN_NAME << EOF
server {
    listen 443 ssl;
    server_name $DOMAIN_NAME;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN_NAME/privkey.pem;

    # Password protection
    auth_basic "Restricted Access";
    auth_basic_user_file /etc/nginx/.htpasswd;

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

# Enable the site if not already enabled
if [ ! -L "/etc/nginx/sites-enabled/$DOMAIN_NAME" ]; then
    echo "🔌 Enabling the site..."
    ln -sf /etc/nginx/sites-available/$DOMAIN_NAME /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
fi

# Test Nginx configuration
echo "🔍 Testing Nginx configuration..."
nginx -t

# Restart Nginx
echo "🔄 Restarting Nginx..."
systemctl restart nginx

echo "✅ Nginx setup complete!"
echo "🌐 Your application is now available at https://$DOMAIN_NAME"
echo "🔌 API endpoints are accessible at https://$DOMAIN_NAME/api/"
echo "🔐 Access requires HTTP Basic Authentication with your configured credentials" 