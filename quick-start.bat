@echo off
REM Storybox E-commerce - Quick Start Script (Windows)
REM Fast setup for developers who already have prerequisites installed

setlocal enabledelayedexpansion

echo ======================================
echo Storybox Quick Start
echo ======================================
echo.

echo Quick prerequisite check...

REM Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [31m- Node.js not found. Please run setup-local-dev.bat instead[0m
    pause
    exit /b 1
)

REM Check Yarn
where yarn >nul 2>&1
if %errorlevel% neq 0 (
    echo [33m! Yarn not found. Installing...[0m
    call npm install -g yarn
)

echo [32m+ Prerequisites OK[0m

echo.
echo Installing dependencies...
cd /d "%~dp0"
call yarn install
if %errorlevel% neq 0 (
    echo [31m- Failed to install dependencies[0m
    pause
    exit /b 1
)
echo [32m+ Dependencies installed[0m

echo.
if not exist .env (
    echo [33m! No .env file found[0m
    echo Creating basic .env file...
    
    REM Generate JWT secret
    for /f %%i in ('powershell -command "[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))"') do set jwt_secret=%%i
    
    (
        echo # Database
        echo MONGO_URL=mongodb://localhost:27017/storybox
        echo.
        echo # Application
        echo NEXT_PUBLIC_BASE_URL=http://localhost:3000
        echo JWT_SECRET=!jwt_secret!
        echo NODE_ENV=development
        echo.
        echo # Analytics (optional^)
        echo NEXT_PUBLIC_GA_ID=
        echo NEXT_PUBLIC_MIXPANEL_TOKEN=
        echo.
        echo # Error Tracking (optional^)
        echo NEXT_PUBLIC_SENTRY_DSN=
        echo SENTRY_AUTH_TOKEN=
        echo.
        echo # Payment Integration
        echo STRIPE_SECRET_KEY=
        echo NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
        echo.
        echo # Shipping Integration
        echo ECONT_API_KEY=
        echo ECONT_API_URL=https://ee.econt.com/services
    ) > .env
    
    echo [32m+ .env file created with defaults[0m
    echo [33m! Update .env with your actual values before running in production[0m
) else (
    echo [32m+ Using existing .env file[0m
)

echo.
echo Checking MongoDB connection...

REM Check if MongoDB is accessible
where mongosh >nul 2>&1
if %errorlevel% equ 0 (
    mongosh --eval "db.version()" --quiet >nul 2>&1
    if %errorlevel% equ 0 (
        echo [32m+ MongoDB is running[0m
    ) else (
        echo [33m! MongoDB not accessible. Make sure it's running or update MONGO_URL in .env[0m
    )
) else (
    echo [33m! MongoDB client not found locally. Using configured MONGO_URL from .env[0m
)

echo.
echo ======================================
echo + Quick Start Complete!
echo ======================================
echo.
echo Ready to start:
echo   yarn dev
echo.
echo Then open:
echo   Frontend: http://localhost:3000
echo   Admin:    http://localhost:3000/admin
echo.
echo Need full setup? Run: setup-local-dev.bat
echo.
pause
