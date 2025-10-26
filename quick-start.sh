#!/bin/bash

# Storybox E-commerce - Quick Start Script
# Fast setup for developers who already have prerequisites installed

set -e

echo "======================================"
echo "Storybox Quick Start"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
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

# Quick checks
echo "Quick prerequisite check..."

if ! command_exists node; then
    print_error "Node.js not found. Please run setup-local-dev.sh instead"
    exit 1
fi

if ! command_exists yarn; then
    print_warning "Yarn not found. Installing..."
    npm install -g yarn
fi

print_success "Prerequisites OK"

echo ""
echo "Installing dependencies..."
cd "$(dirname "$0")"
yarn install
print_success "Dependencies installed"

echo ""
if [ ! -f .env ]; then
    print_warning "No .env file found"
    echo "Creating basic .env file..."
    
    # Generate JWT secret
    jwt_secret=$(openssl rand -base64 32 2>/dev/null || echo "dev-secret-$(date +%s)")
    
    cat > .env << EOF
# Database
MONGO_URL=mongodb://localhost:27017/storybox

# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=$jwt_secret
NODE_ENV=development

# Analytics (optional)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_MIXPANEL_TOKEN=

# Error Tracking (optional)
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=

# Payment Integration
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Shipping Integration
ECONT_API_KEY=
ECONT_API_URL=https://ee.econt.com/services
EOF
    
    print_success ".env file created with defaults"
    print_warning "Update .env with your actual values before running in production"
else
    print_success "Using existing .env file"
fi

echo ""
echo "Checking MongoDB connection..."

# Quick MongoDB check
if command_exists mongosh; then
    MONGO_CHECK=$(mongosh --eval "db.version()" --quiet 2>/dev/null || echo "fail")
    if [ "$MONGO_CHECK" != "fail" ]; then
        print_success "MongoDB is running"
    else
        print_warning "MongoDB not accessible. Make sure it's running or update MONGO_URL in .env"
    fi
elif command_exists mongo; then
    MONGO_CHECK=$(mongo --eval "db.version()" --quiet 2>/dev/null || echo "fail")
    if [ "$MONGO_CHECK" != "fail" ]; then
        print_success "MongoDB is running"
    else
        print_warning "MongoDB not accessible. Make sure it's running or update MONGO_URL in .env"
    fi
else
    print_warning "MongoDB client not found locally. Using configured MONGO_URL from .env"
fi

echo ""
echo "======================================"
echo "✓ Quick Start Complete!"
echo "======================================"
echo ""
echo "Ready to start:"
echo "  $ yarn dev"
echo ""
echo "Then open:"
echo "  Frontend: http://localhost:3000"
echo "  Admin:    http://localhost:3000/admin"
echo ""
echo "Need full setup? Run: ./setup-local-dev.sh"
echo ""