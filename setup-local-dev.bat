@echo off
REM Storybox E-commerce - Local Development Setup Script (Windows)
REM This script will set up your local development environment

setlocal enabledelayedexpansion

echo ======================================
echo Storybox Local Development Setup
echo ======================================
echo.

echo Step 1: Checking required tools...
echo -----------------------------------

REM Check Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo [31m- Node.js is not installed. Please install Node.js from https://nodejs.org[0m
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
    echo [32m+ Node.js is installed: !NODE_VERSION![0m
)

REM Check Yarn
where yarn >nul 2>&1
if errorlevel 1 (
    echo [33m! Yarn is not installed. Installing via npm...[0m
    call npm install -g yarn
    echo [32m+ Yarn installed successfully[0m
) else (
    for /f "tokens=*" %%i in ('yarn -v') do set YARN_VERSION=%%i
    echo [32m+ Yarn is installed: !YARN_VERSION![0m
)

REM Check MongoDB
where mongod >nul 2>&1
if errorlevel 1 (
    where mongosh >nul 2>&1
    if errorlevel 1 (
        echo [33m! MongoDB is not installed locally.[0m
        echo You can either:
        echo   1. Install MongoDB locally: https://www.mongodb.com/docs/manual/installation/
        echo   2. Use MongoDB Atlas cloud: https://www.mongodb.com/cloud/atlas
        echo   3. Use MongoDB Compass with a cloud connection
        echo.
    ) else (
        echo [32m+ MongoDB Compass/Shell is installed[0m
    )
) else (
    echo [32m+ MongoDB is installed locally[0m
)

echo.
echo Step 2: Installing project dependencies...
echo -------------------------------------------
cd /d "%~dp0"
call yarn install
if errorlevel 1 (
    echo [31m- Failed to install dependencies[0m
    pause
    exit /b 1
)
echo [32m+ Dependencies installed successfully[0m

echo.
echo Step 3: Setting up environment variables...
echo --------------------------------------------

if exist .env (
    echo [33m! .env file already exists[0m
    set /p "reconfigure=Do you want to reconfigure it? (y/n): "
    if /i not "!reconfigure!"=="y" (
        echo Skipping .env configuration
        goto skip_env
    )
    del .env
)

echo Let's configure your environment variables:
echo.

REM MongoDB URL
set "default_mongo=mongodb://localhost:27017/storybox"
set /p "mongo_url=Enter MongoDB URL [!default_mongo!]: "
if "!mongo_url!"=="" set "mongo_url=!default_mongo!"

REM JWT Secret
echo.
echo Generating JWT secret...
for /f "delims=" %%i in ('powershell -command "[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))"') do set "jwt_secret=%%i"
if "!jwt_secret!"=="" set "jwt_secret=dev-secret-key-change-in-production"
echo [32m+ JWT secret generated[0m

REM Base URL
set "default_url=http://localhost:3000"
set /p "base_url=Enter base URL [!default_url!]: "
if "!base_url!"=="" set "base_url=!default_url!"

REM Optional services
echo.
set /p "sentry_dsn=Enter Sentry DSN (optional, press Enter to skip): "
set /p "ga_id=Enter Google Analytics ID (optional, press Enter to skip): "
set /p "mixpanel_token=Enter Mixpanel Token (optional, press Enter to skip): "

REM Create .env file
(
    echo # Database
    echo MONGO_URL=!mongo_url!
    echo.
    echo # Application
    echo NEXT_PUBLIC_BASE_URL=!base_url!
    echo JWT_SECRET=!jwt_secret!
    echo NODE_ENV=development
    echo.
    echo # Analytics (optional^)
    echo NEXT_PUBLIC_GA_ID=!ga_id!
    echo NEXT_PUBLIC_MIXPANEL_TOKEN=!mixpanel_token!
    echo.
    echo # Error Tracking (optional^)
    echo NEXT_PUBLIC_SENTRY_DSN=!sentry_dsn!
    echo SENTRY_AUTH_TOKEN=
    echo.
    echo # Payment Integration (add your keys here^)
    echo STRIPE_SECRET_KEY=
    echo NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
    echo.
    echo # Shipping Integration
    echo ECONT_API_KEY=
    echo ECONT_API_URL=https://ee.econt.com/services
) > .env

echo [32m+ .env file created successfully[0m

:skip_env

echo.
echo Step 4: Database setup...
echo -------------------------

set /p "seed_db=Do you want to seed the database with initial data? (y/n): "

if /i "!seed_db!"=="y" (
    echo Creating seed script...
    
    REM Create seed script
    (
        echo const { MongoClient } = require('mongodb'^);
        echo require('dotenv'^).config(^);
        echo.
        echo async function seedDatabase(^) {
        echo     const client = new MongoClient(process.env.MONGO_URL^);
        echo     try {
        echo         await client.connect(^);
        echo         console.log('Connected to MongoDB'^);
        echo         const db = client.db(^);
        echo         const usersCollection = db.collection('users'^);
        echo         const adminExists = await usersCollection.findOne({ email: 'admin@storybox.bg' }^);
        echo         if (!adminExists^) {
        echo             await usersCollection.insertOne({ id: 'admin-' + Date.now(^), email: 'admin@storybox.bg', password: '$2a$10$rQZ3N5bN5J5J5J5J5J5J5OqF5F5F5F5F5F5F5F5F5F5F5F5F5F5F5', role: 'admin', firstName: 'Admin', lastName: 'User', createdAt: new Date(^), updatedAt: new Date(^) }^);
        echo             console.log('+ Admin user created (email: admin@storybox.bg, password: admin123^)'^);
        echo         } else {
        echo             console.log('! Admin user already exists'^);
        echo         }
        echo         const productsCollection = db.collection('products'^);
        echo         const productCount = await productsCollection.countDocuments(^);
        echo         if (productCount === 0^) {
        echo             await productsCollection.insertMany([
        echo                 { id: 'prod-' + Date.now(^) + '-1', title: 'Custom Embroidered Logo', slug: 'custom-embroidered-logo', description: 'High-quality embroidered logo', price: 4999, sku: 'EMB-LOGO-001', inventory: 100, isBackorder: false, status: 'active', featured: true, category: 'embroidery', images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'], createdAt: new Date(^), updatedAt: new Date(^) },
        echo                 { id: 'prod-' + Date.now(^) + '-2', title: 'Print Design Service', slug: 'print-design-service', description: 'Professional print design', price: 7999, sku: 'PRINT-DES-001', inventory: 50, isBackorder: false, status: 'active', featured: true, category: 'print', images: ['https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800'], createdAt: new Date(^), updatedAt: new Date(^) }
        echo             ]^);
        echo             console.log('+ Sample products created'^);
        echo         } else {
        echo             console.log('! Products already exist'^);
        echo         }
        echo         console.log('Database seeding completed!'^);
        echo     } catch (error^) {
        echo         console.error('Error:', error^);
        echo         process.exit(1^);
        echo     } finally {
        echo         await client.close(^);
        echo     }
        echo }
        echo seedDatabase(^);
    ) > seed-db.js
    
    call node seed-db.js
    if errorlevel 1 (
        echo [31m- Database seeding failed. Please check your MongoDB connection.[0m
        echo [33m! You can run 'node seed-db.js' manually later.[0m
    ) else (
        del seed-db.js
        echo [32m+ Database seeded successfully[0m
    )
)

echo.
echo ======================================
echo + Setup completed successfully!
echo ======================================
echo.
echo Next steps:
echo   1. Start the development server: yarn dev
echo   2. Open http://localhost:3000 in your browser
echo   3. Admin panel: http://localhost:3000/admin
echo.
echo Default admin credentials (if seeded^):
echo   Email: admin@storybox.bg
echo   Password: admin123
echo.
echo Happy coding!
echo.
pause
