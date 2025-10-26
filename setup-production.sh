#!/bin/bash

# Storybox E-commerce - Production Deployment Setup Script
# This script will set up the production environment

set -e

echo "======================================"
echo "Storybox Production Deployment Setup"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo "⚠ WARNING: This script will configure a PRODUCTION environment"
read -p "Are you sure you want to continue? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo "Setup cancelled"
    exit 0
fi

echo ""
echo "Step 1: System Requirements Check..."
echo "-------------------------------------"

# Check if running as root or with sudo
if [ "$EUID" -eq 0 ]; then
    print_warning "Running as root"
fi

# Check OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    print_success "Operating System: Linux"
    OS_TYPE="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    print_success "Operating System: macOS"
    OS_TYPE="mac"
else
    print_warning "Unsupported OS: $OSTYPE"
    OS_TYPE="other"
fi

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node -v)
    print_success "Node.js: $NODE_VERSION"
else
    print_error "Node.js not found. Installing..."
    if [ "$OS_TYPE" = "linux" ]; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    elif [ "$OS_TYPE" = "mac" ]; then
        brew install node
    fi
fi

# Check Yarn
if command_exists yarn; then
    print_success "Yarn: $(yarn -v)"
else
    print_warning "Yarn not found. Installing..."
    npm install -g yarn
fi

# Check PM2 or Supervisor
if command_exists pm2; then
    print_success "PM2 is installed"
    PROCESS_MANAGER="pm2"
elif command_exists supervisorctl; then
    print_success "Supervisor is installed"
    PROCESS_MANAGER="supervisor"
else
    print_warning "No process manager found. Installing PM2..."
    npm install -g pm2
    PROCESS_MANAGER="pm2"
fi

echo ""
echo "Step 2: Installing Dependencies..."
echo "-----------------------------------"
cd "$(dirname "$0")"
yarn install --production=false
print_success "Dependencies installed"

echo ""
echo "Step 3: Production Environment Configuration..."
echo "------------------------------------------------"

if [ -f .env ]; then
    print_warning ".env file exists"
    read -p "Overwrite? (y/n): " overwrite
    if [ "$overwrite" != "y" ]; then
        print_warning "Keeping existing .env file"
        skip_env=true
    fi
fi

if [ "$skip_env" != true ]; then
    echo "Configure production environment:"
    echo ""
    
    # MongoDB URL
    echo "MongoDB Configuration:"
    read -p "Enter production MongoDB URL: " mongo_url
    while [ -z "$mongo_url" ]; do
        print_error "MongoDB URL is required"
        read -p "Enter production MongoDB URL: " mongo_url
    done
    
    # Domain/Base URL
    echo ""
    read -p "Enter production domain (e.g., https://storybox.bg): " base_url
    while [ -z "$base_url" ]; do
        print_error "Base URL is required"
        read -p "Enter production domain: " base_url
    done
    
    # JWT Secret
    echo ""
    echo "Generating secure JWT secret..."
    jwt_secret=$(openssl rand -base64 48)
    print_success "JWT secret generated"
    
    # Sentry
    echo ""
    read -p "Enter Sentry DSN (required for error tracking): " sentry_dsn
    read -p "Enter Sentry Auth Token (for source maps): " sentry_auth
    
    # Analytics
    echo ""
    read -p "Enter Google Analytics ID: " ga_id
    read -p "Enter Mixpanel Token: " mixpanel_token
    
    # Payment
    echo ""
    echo "Payment Integration (Stripe):"
    read -p "Enter Stripe Secret Key: " stripe_secret
    read -p "Enter Stripe Publishable Key: " stripe_public
    
    # Shipping
    echo ""
    echo "Shipping Integration (Econt):"
    read -p "Enter Econt API Key: " econt_key
    
    # Create production .env
    cat > .env << EOF
# Database
MONGO_URL=$mongo_url

# Application
NEXT_PUBLIC_BASE_URL=$base_url
JWT_SECRET=$jwt_secret
NODE_ENV=production

# Analytics
NEXT_PUBLIC_GA_ID=$ga_id
NEXT_PUBLIC_MIXPANEL_TOKEN=$mixpanel_token

# Error Tracking
NEXT_PUBLIC_SENTRY_DSN=$sentry_dsn
SENTRY_AUTH_TOKEN=$sentry_auth

# Payment Integration
STRIPE_SECRET_KEY=$stripe_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$stripe_public

# Shipping Integration
ECONT_API_KEY=$econt_key
ECONT_API_URL=https://ee.econt.com/services
EOF
    
    chmod 600 .env
    print_success "Production .env created with secure permissions"
fi

echo ""
echo "Step 4: Building Application..."
echo "--------------------------------"
yarn build
print_success "Application built successfully"

echo ""
echo "Step 5: Setting up Process Manager..."
echo "--------------------------------------"

if [ "$PROCESS_MANAGER" = "pm2" ]; then
    # Create PM2 ecosystem file
    cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'storybox',
    script: 'node_modules/next/dist/bin/next',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
EOF
    
    mkdir -p logs
    
    # Start with PM2
    pm2 start ecosystem.config.js
    pm2 save
    
    # Setup PM2 to start on boot
    read -p "Configure PM2 to start on system boot? (y/n): " setup_boot
    if [ "$setup_boot" = "y" ]; then
        pm2 startup
        print_warning "Follow the command above to complete startup configuration"
    fi
    
    print_success "PM2 configured and started"
    
elif [ "$PROCESS_MANAGER" = "supervisor" ]; then
    print_success "Using existing Supervisor configuration"
    sudo supervisorctl restart all
fi

echo ""
echo "Step 6: Database Initialization..."
echo "-----------------------------------"

read -p "Create admin user? (y/n): " create_admin

if [ "$create_admin" = "y" ]; then
    read -p "Enter admin email: " admin_email
    read -sp "Enter admin password: " admin_password
    echo ""
    
    # Create admin user script
    cat > create-admin.js << EOF
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
    const client = new MongoClient(process.env.MONGO_URL);
    try {
        await client.connect();
        const db = client.db();
        const usersCollection = db.collection('users');
        
        const hashedPassword = await bcrypt.hash('$admin_password', 10);
        
        await usersCollection.insertOne({
            id: 'admin-' + Date.now(),
            email: '$admin_email',
            password: hashedPassword,
            role: 'admin',
            firstName: 'Admin',
            lastName: 'User',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        
        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
    }
}

createAdmin();
EOF
    
    node create-admin.js
    rm create-admin.js
    print_success "Admin user created"
fi

echo ""
echo "======================================"
echo "✓ Production Setup Complete!"
echo "======================================"
echo ""
echo "Application Status:"
if [ "$PROCESS_MANAGER" = "pm2" ]; then
    pm2 status
else
    sudo supervisorctl status
fi
echo ""
echo "Your application should be running at: $base_url"
echo ""
echo "Important Next Steps:"
echo "  1. Configure your web server (Nginx/Apache) as reverse proxy"
echo "  2. Set up SSL certificates (Let's Encrypt recommended)"
echo "  3. Configure firewall rules"
echo "  4. Set up automated backups for MongoDB"
echo "  5. Configure monitoring and alerting"
echo ""
print_warning "Make sure to secure your .env file and never commit it to version control"
echo ""