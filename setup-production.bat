@echo off
REM Storybox E-commerce - Production Deployment Setup Script (Windows)
REM This script will set up the production environment

setlocal enabledelayedexpansion

echo ======================================
echo Storybox Production Deployment Setup
echo ======================================
echo.

echo [33mWARNING: This script will configure a PRODUCTION environment[0m
set /p confirm="Are you sure you want to continue? (yes/no): "
if /i not "!confirm!"=="yes" (
    echo Setup cancelled
    exit /b 0
)

echo.
echo Step 1: System Requirements Check...
echo -------------------------------------

REM Check Node.js
where node >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node -v') do echo [32m+ Node.js: %%i[0m
) else (
    echo [31m- Node.js not found. Please install from https://nodejs.org[0m
    pause
    exit /b 1
)

REM Check Yarn
where yarn >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('yarn -v') do echo [32m+ Yarn: %%i[0m
) else (
    echo [33m! Installing Yarn...[0m
    call npm install -g yarn
)

REM Check PM2
where pm2 >nul 2>&1
if %errorlevel% equ 0 (
    echo [32m+ PM2 is installed[0m
    set PROCESS_MANAGER=pm2
) else (
    echo [33m! Installing PM2...[0m
    call npm install -g pm2
    set PROCESS_MANAGER=pm2
)

echo.
echo Step 2: Installing Dependencies...
echo -----------------------------------
cd /d "%~dp0"
call yarn install --production=false
if %errorlevel% neq 0 (
    echo [31m- Failed to install dependencies[0m
    pause
    exit /b 1
)
echo [32m+ Dependencies installed[0m

echo.
echo Step 3: Production Environment Configuration...
echo ------------------------------------------------

if exist .env (
    echo [33m! .env file exists[0m
    set /p overwrite="Overwrite? (y/n): "
    if /i not "!overwrite!"=="y" (
        echo [33m! Keeping existing .env file[0m
        goto :skip_env
    )
)

echo Configure production environment:
echo.

REM MongoDB URL
echo MongoDB Configuration:
set /p mongo_url="Enter production MongoDB URL: "
if "!mongo_url!"==" " (
    echo [31m- MongoDB URL is required[0m
    pause
    exit /b 1
)

REM Base URL
echo.
set /p base_url="Enter production domain (e.g., https://storybox.bg): "
if "!base_url!"==" " (
    echo [31m- Base URL is required[0m
    pause
    exit /b 1
)

REM JWT Secret
echo.
echo Generating secure JWT secret...
for /f %%i in ('powershell -command "[Convert]::ToBase64String((1..48 | ForEach-Object { Get-Random -Maximum 256 }))"') do set jwt_secret=%%i
echo [32m+ JWT secret generated[0m

REM Sentry
echo.
set /p sentry_dsn="Enter Sentry DSN: "
set /p sentry_auth="Enter Sentry Auth Token: "

REM Analytics
echo.
set /p ga_id="Enter Google Analytics ID: "
set /p mixpanel_token="Enter Mixpanel Token: "

REM Payment
echo.
echo Payment Integration (Stripe):
set /p stripe_secret="Enter Stripe Secret Key: "
set /p stripe_public="Enter Stripe Publishable Key: "

REM Shipping
echo.
echo Shipping Integration (Econt):
set /p econt_key="Enter Econt API Key: "

REM Create .env
(
    echo # Database
    echo MONGO_URL=!mongo_url!
    echo.
    echo # Application
    echo NEXT_PUBLIC_BASE_URL=!base_url!
    echo JWT_SECRET=!jwt_secret!
    echo NODE_ENV=production
    echo.
    echo # Analytics
    echo NEXT_PUBLIC_GA_ID=!ga_id!
    echo NEXT_PUBLIC_MIXPANEL_TOKEN=!mixpanel_token!
    echo.
    echo # Error Tracking
    echo NEXT_PUBLIC_SENTRY_DSN=!sentry_dsn!
    echo SENTRY_AUTH_TOKEN=!sentry_auth!
    echo.
    echo # Payment Integration
    echo STRIPE_SECRET_KEY=!stripe_secret!
    echo NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=!stripe_public!
    echo.
    echo # Shipping Integration
    echo ECONT_API_KEY=!econt_key!
    echo ECONT_API_URL=https://ee.econt.com/services
) > .env

echo [32m+ Production .env created[0m

:skip_env

echo.
echo Step 4: Building Application...
echo --------------------------------
call yarn build
if %errorlevel% neq 0 (
    echo [31m- Build failed[0m
    pause
    exit /b 1
)
echo [32m+ Application built successfully[0m

echo.
echo Step 5: Setting up PM2...
echo ---------------------------

REM Create PM2 ecosystem file
(
    echo module.exports = {
    echo   apps: [{
    echo     name: 'storybox',
    echo     script: 'node_modules/next/dist/bin/next',
    echo     args: 'start',
    echo     instances: 'max',
    echo     exec_mode: 'cluster',
    echo     env: {
    echo       NODE_ENV: 'production',
    echo       PORT: 3000
    echo     },
    echo     error_file: './logs/pm2-error.log',
    echo     out_file: './logs/pm2-out.log',
    echo     log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    echo     merge_logs: true
    echo   }]
    echo };
) > ecosystem.config.js

if not exist logs mkdir logs

REM Start with PM2
start /b pm2 start ecosystem.config.js
call pm2 save

echo [32m+ PM2 configured and started[0m

echo.
echo ======================================
echo + Production Setup Complete!
echo ======================================
echo.
echo Application Status:
call pm2 status
echo.
echo Your application should be running at: !base_url!
echo.
echo Important Next Steps:
echo   1. Configure your web server (IIS) as reverse proxy
echo   2. Set up SSL certificates
echo   3. Configure Windows Firewall rules
echo   4. Set up automated backups for MongoDB
echo   5. Configure monitoring and alerting
echo.
echo [33m! Make sure to secure your .env file[0m
echo.
pause
