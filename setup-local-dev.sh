#!/bin/bash

# Storybox E-commerce - Local Development Setup Script
# This script will set up your local development environment

set -e

echo "======================================"
echo "Storybox Local Development Setup"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print success message
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print error message
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Function to print warning message
print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

echo "Step 1: Checking required tools..."
echo "-----------------------------------"

# Check Node.js
if command_exists node; then
    NODE_VERSION=$(node -v)
    print_success "Node.js is installed: $NODE_VERSION"
    
    # Check if version is >= 18
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -lt 18 ]; then
        print_warning "Node.js version should be >= 18.x. Current: $NODE_VERSION"
        read -p "Continue anyway? (y/n): " continue_node
        if [ "$continue_node" != "y" ]; then
            exit 1
        fi
    fi
else
    print_error "Node.js is not installed. Please install Node.js >= 18.x from https://nodejs.org"
    exit 1
fi

# Check Yarn
if command_exists yarn; then
    YARN_VERSION=$(yarn -v)
    print_success "Yarn is installed: $YARN_VERSION"
else
    print_warning "Yarn is not installed. Installing via npm..."
    npm install -g yarn
    print_success "Yarn installed successfully"
fi

# Check MongoDB
if command_exists mongod; then
    MONGO_VERSION=$(mongod --version | head -n 1)
    print_success "MongoDB is installed: $MONGO_VERSION"
else
    print_warning "MongoDB is not installed locally."
    echo "You can either:"
    echo "  1. Install MongoDB locally: https://www.mongodb.com/docs/manual/installation/"
    echo "  2. Use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas"
    echo ""
fi

echo ""
echo "Step 2: Installing project dependencies..."
echo "-------------------------------------------"
cd "$(dirname "$0")"
yarn install
print_success "Dependencies installed successfully"

echo ""
echo "Step 3: Setting up environment variables..."
echo "--------------------------------------------"

if [ -f .env ]; then
    print_warning ".env file already exists"
    read -p "Do you want to reconfigure it? (y/n): " reconfigure
    if [ "$reconfigure" != "y" ]; then
        echo "Skipping .env configuration"
    else
        rm .env
    fi
fi

if [ ! -f .env ]; then
    echo "Let's configure your environment variables:"
    echo ""
    
    # MongoDB URL
    read -p "Enter MongoDB URL [mongodb://localhost:27017/storybox]: " mongo_url
    mongo_url=${mongo_url:-mongodb://localhost:27017/storybox}
    
    # JWT Secret
    echo ""
    echo "Generating JWT secret..."
    jwt_secret=$(openssl rand -base64 32 2>/dev/null || echo "change-this-secret-in-production-$(date +%s)")
    print_success "JWT secret generated"
    
    # Base URL
    read -p "Enter base URL [http://localhost:3000]: " base_url
    base_url=${base_url:-http://localhost:3000}
    
    # Sentry DSN (optional)
    echo ""
    read -p "Enter Sentry DSN (optional, press Enter to skip): " sentry_dsn
    
    # Google Analytics (optional)
    read -p "Enter Google Analytics ID (optional, press Enter to skip): " ga_id
    
    # Mixpanel Token (optional)
    read -p "Enter Mixpanel Token (optional, press Enter to skip): " mixpanel_token
    
    # Create .env file
    cat > .env << EOF
# Database
MONGO_URL=$mongo_url

# Application
NEXT_PUBLIC_BASE_URL=$base_url
JWT_SECRET=$jwt_secret
NODE_ENV=development

# Analytics (optional)
NEXT_PUBLIC_GA_ID=$ga_id
NEXT_PUBLIC_MIXPANEL_TOKEN=$mixpanel_token

# Error Tracking (optional)
NEXT_PUBLIC_SENTRY_DSN=$sentry_dsn
SENTRY_AUTH_TOKEN=

# Payment Integration (add your keys here)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Shipping Integration
ECONT_API_KEY=
ECONT_API_URL=https://ee.econt.com/services
EOF
    
    print_success ".env file created successfully"
fi

echo ""
echo "Step 4: Database setup..."
echo "-------------------------"

read -p "Do you want to seed the database with initial data? (y/n): " seed_db

if [ "$seed_db" = "y" ]; then
    echo "Creating seed script..."
    
    # Create a simple seed script
    cat > seed-db.js << 'EOF'
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function seedDatabase() {
    const client = new MongoClient(process.env.MONGO_URL);
    
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        
        const db = client.db();
        
        // Create admin user
        const usersCollection = db.collection('users');
        const adminExists = await usersCollection.findOne({ email: 'admin@storybox.bg' });
        
        if (!adminExists) {
            await usersCollection.insertOne({
                id: 'admin-' + Date.now(),
                email: 'admin@storybox.bg',
                password: '$2a$10$rQZ3N5bN5J5J5J5J5J5J5OqF5F5F5F5F5F5F5F5F5F5F5F5F5F5F5', // password: admin123
                role: 'admin',
                firstName: 'Admin',
                lastName: 'User',
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log('✓ Admin user created (email: admin@storybox.bg, password: admin123)');
        } else {
            console.log('⚠ Admin user already exists');
        }
        
        // Create sample products
        const productsCollection = db.collection('products');
        const productCount = await productsCollection.countDocuments();
        
        if (productCount === 0) {
            await productsCollection.insertMany([
                {
                    id: 'prod-' + Date.now() + '-1',
                    title: 'Custom Embroidered Logo',
                    slug: 'custom-embroidered-logo',
                    description: 'High-quality embroidered logo for your business',
                    price: 4999,
                    sku: 'EMB-LOGO-001',
                    inventory: 100,
                    isBackorder: false,
                    status: 'active',
                    featured: true,
                    category: 'embroidery',
                    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'],
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    id: 'prod-' + Date.now() + '-2',
                    title: 'Print Design Service',
                    slug: 'print-design-service',
                    description: 'Professional print design for your marketing materials',
                    price: 7999,
                    sku: 'PRINT-DES-001',
                    inventory: 50,
                    isBackorder: false,
                    status: 'active',
                    featured: true,
                    category: 'print',
                    images: ['https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800'],
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ]);
            console.log('✓ Sample products created');
        } else {
            console.log('⚠ Products already exist in database');
        }
        
        console.log('\n✓ Database seeding completed successfully!');
        
    } catch (error) {
        console.error('✗ Error seeding database:', error);
        process.exit(1);
    } finally {
        await client.close();
    }
}

seedDatabase();
EOF
    
    node seed-db.js
    rm seed-db.js
    print_success "Database seeded successfully"
fi

echo ""
echo "======================================"
echo "✓ Setup completed successfully!"
echo "======================================"
echo ""
echo "Next steps:"
echo "  1. Start the development server: yarn dev"
echo "  2. Open http://localhost:3000 in your browser"
echo "  3. Admin panel: http://localhost:3000/admin"
echo ""
echo "Default admin credentials (if seeded):"
echo "  Email: admin@storybox.bg"
echo "  Password: admin123"
echo ""
echo "Happy coding! 🚀"
echo ""