# Storybox E-commerce Setup Guide

This guide explains how to set up and run the Storybox e-commerce application using the provided setup scripts.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Setup Scripts Overview](#setup-scripts-overview)
- [Quick Start (Recommended for Developers)](#quick-start)
- [Local Development Setup](#local-development-setup)
- [Production Deployment](#production-deployment)
- [Manual Setup](#manual-setup)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required
- **Node.js** >= 18.x ([Download](https://nodejs.org/))
- **Yarn** package manager ([Install](https://yarnpkg.com/getting-started/install))
- **MongoDB** (local or cloud)
  - Local: [Installation Guide](https://www.mongodb.com/docs/manual/installation/)
  - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (recommended)

### Optional
- **PM2** or **Supervisor** (for production)
- **Git** (for version control)

---

## Setup Scripts Overview

We provide 6 setup scripts (3 for Linux/Mac, 3 for Windows):

| Script | Linux/Mac | Windows | Purpose |
|--------|-----------|---------|----------|
| **Quick Start** | `quick-start.sh` | `quick-start.bat` | Fast setup assuming prerequisites are installed |
| **Local Development** | `setup-local-dev.sh` | `setup-local-dev.bat` | Full local development environment setup |
| **Production** | `setup-production.sh` | `setup-production.bat` | Production deployment setup |

### Which Script Should I Use?

- **First time setup?** → Use **Local Development Setup**
- **Already set up, just need to reinstall?** → Use **Quick Start**
- **Deploying to production?** → Use **Production Deployment**

---

## Quick Start

### For developers who already have Node.js, Yarn, and MongoDB installed.

#### Linux/Mac

```bash
./quick-start.sh
yarn dev
```

#### Windows

```cmd
quick-start.bat
yarn dev
```

### What it does:
- ✅ Quick prerequisite check
- ✅ Installs dependencies
- ✅ Creates basic `.env` file (if missing)
- ✅ Checks MongoDB connection

### After running:
```bash
yarn dev
```

Open:
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

---

## Local Development Setup

### Complete setup for local development environment.

#### Linux/Mac

```bash
chmod +x setup-local-dev.sh
./setup-local-dev.sh
```

#### Windows

```cmd
setup-local-dev.bat
```

### What it does:

1. **Checks Required Tools**
   - Node.js (>= 18.x)
   - Yarn package manager
   - MongoDB (local or cloud)

2. **Installs Dependencies**
   - All Node.js packages via Yarn

3. **Environment Configuration** (Interactive)
   - MongoDB URL
   - JWT Secret (auto-generated)
   - Base URL
   - Sentry DSN (optional)
   - Google Analytics ID (optional)
   - Mixpanel Token (optional)

4. **Database Seeding** (Optional)
   - Creates admin user: `admin@storybox.bg` / `admin123`
   - Adds sample products

### Interactive Prompts

The script will ask you:

```
Enter MongoDB URL [mongodb://localhost:27017/storybox]: 
```
- Press Enter to use default
- Or enter your MongoDB Atlas URL

```
Enter Sentry DSN (optional, press Enter to skip):
```
- Press Enter to skip optional services
- Or paste your API keys

```
Do you want to seed the database with initial data? (y/n):
```
- Type `y` to create admin user and sample products
- Type `n` to skip

### After Setup

Start the development server:

```bash
yarn dev
```

Access the application:
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Admin Login**: `admin@storybox.bg` / `admin123`

---

## Production Deployment

### For deploying to production servers.

⚠️ **Warning**: This script configures a production environment. Make sure you have:
- Production MongoDB instance
- Production domain/URL
- All required API keys (Stripe, Sentry, etc.)

#### Linux/Mac

```bash
chmod +x setup-production.sh
sudo ./setup-production.sh
```

#### Windows (Run as Administrator)

```cmd
setup-production.bat
```

### What it does:

1. **System Requirements Check**
   - Validates OS and required tools
   - Installs PM2 process manager

2. **Dependency Installation**
   - Installs production dependencies

3. **Production Configuration** (Interactive)
   - Production MongoDB URL (required)
   - Production domain (required)
   - Secure JWT secret (auto-generated)
   - Sentry DSN & Auth Token
   - Google Analytics & Mixpanel
   - Stripe API keys
   - Econt shipping API key

4. **Application Build**
   - Builds optimized production bundle

5. **Process Manager Setup**
   - Configures PM2 or Supervisor
   - Sets up auto-restart on boot
   - Creates log files

6. **Database Initialization**
   - Creates production admin user

### Production Checklist

After running the script:

- [ ] Configure reverse proxy (Nginx/Apache/IIS)
- [ ] Set up SSL certificates (Let's Encrypt)
- [ ] Configure firewall rules
- [ ] Set up MongoDB backups
- [ ] Configure monitoring (Sentry, logs)
- [ ] Test all integrations (Stripe, Econt)
- [ ] Update DNS records
- [ ] Test admin panel access

### Managing Production Application

#### With PM2 (Linux/Mac):

```bash
# View status
pm2 status

# View logs
pm2 logs storybox

# Restart
pm2 restart storybox

# Stop
pm2 stop storybox

# Monitor
pm2 monit
```

#### With Supervisor:

```bash
# View status
sudo supervisorctl status

# Restart
sudo supervisorctl restart all

# View logs
tail -f /var/log/supervisor/nextjs.out.log
```

---

## Manual Setup

If you prefer manual setup or need custom configuration:

### 1. Install Dependencies

```bash
yarn install
```

### 2. Create `.env` File

Copy and configure:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Database
MONGO_URL=mongodb://localhost:27017/storybox

# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=your-secret-key-here
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
```

### 3. Start Development Server

```bash
yarn dev
```

### 4. Build for Production

```bash
yarn build
yarn start
```

---

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|----------|
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017/storybox` |
| `NEXT_PUBLIC_BASE_URL` | Application base URL | `http://localhost:3000` |
| `JWT_SECRET` | Secret for JWT tokens | Auto-generated |
| `NODE_ENV` | Environment mode | `development` or `production` |

### Optional Variables

| Variable | Description | Where to Get |
|----------|-------------|-------------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | [Google Analytics](https://analytics.google.com/) |
| `NEXT_PUBLIC_MIXPANEL_TOKEN` | Mixpanel project token | [Mixpanel](https://mixpanel.com/) |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry error tracking DSN | [Sentry](https://sentry.io/) |
| `SENTRY_AUTH_TOKEN` | Sentry auth token | [Sentry Settings](https://sentry.io/settings/) |
| `STRIPE_SECRET_KEY` | Stripe secret key | [Stripe Dashboard](https://dashboard.stripe.com/) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | [Stripe Dashboard](https://dashboard.stripe.com/) |
| `ECONT_API_KEY` | Econt shipping API key | [Econt](https://www.econt.com/) |

---

## Troubleshooting

### MongoDB Connection Issues

**Problem**: Cannot connect to MongoDB

**Solutions**:
1. Check if MongoDB is running:
   ```bash
   # Linux/Mac
   sudo systemctl status mongod
   
   # Or check process
   ps aux | grep mongod
   ```

2. For MongoDB Atlas:
   - Verify connection string format
   - Check IP whitelist in Atlas
   - Ensure credentials are correct

3. Test connection:
   ```bash
   # Using mongosh
   mongosh "your-connection-string"
   ```

### Port Already in Use

**Problem**: Port 3000 is already in use

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3001 yarn dev
```

### Permission Denied (Linux/Mac)

**Problem**: `Permission denied` when running scripts

**Solution**:
```bash
chmod +x setup-local-dev.sh
chmod +x setup-production.sh
chmod +x quick-start.sh
```

### Yarn Not Found

**Problem**: `yarn: command not found`

**Solution**:
```bash
npm install -g yarn
```

### Node Version Too Old

**Problem**: Node.js version is < 18.x

**Solution**:
1. Install Node Version Manager (nvm):
   ```bash
   # Linux/Mac
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   
   # Windows: Download from nodejs.org
   ```

2. Install Node.js 18+:
   ```bash
   nvm install 18
   nvm use 18
   ```

### Build Errors

**Problem**: Build fails with errors

**Solution**:
1. Clear cache and reinstall:
   ```bash
   rm -rf node_modules .next
   yarn install
   yarn build
   ```

2. Check Node.js version:
   ```bash
   node -v  # Should be >= 18.x
   ```

### Database Seeding Fails

**Problem**: Seeding script fails

**Solution**:
1. Ensure MongoDB is running and accessible
2. Check `.env` file has correct `MONGO_URL`
3. Verify database permissions
4. Try manual seeding:
   ```bash
   node scripts/seed-db.js
   ```

---

## Getting Help

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Project README](./README.md)
- [API Documentation](./docs/API.md)

### Common Commands

```bash
# Development
yarn dev              # Start dev server
yarn build            # Build for production
yarn start            # Start production server
yarn lint             # Run linter
yarn test             # Run tests

# Database
mongosh               # Open MongoDB shell

# Process Management
pm2 status            # View PM2 processes
pm2 logs              # View logs
sudo supervisorctl status  # View Supervisor status
```

---

## Next Steps

After successful setup:

1. **Explore the Admin Panel**
   - Go to http://localhost:3000/admin
   - Login with default credentials
   - Create products, manage orders

2. **Configure Integrations**
   - Set up Stripe for payments
   - Configure Econt for shipping
   - Add Sentry for error tracking

3. **Customize the Application**
   - Update branding colors
   - Add your products
   - Configure email templates

4. **Deploy to Production**
   - Run production setup script
   - Configure domain and SSL
   - Set up monitoring

---

**Happy coding! 🚀**