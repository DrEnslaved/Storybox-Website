# Installation Guide - Storybox E-commerce Platform

Complete step-by-step guide to set up the Storybox platform locally.

## System Requirements

- **OS:** Ubuntu 20.04+ / Debian 11+ / macOS / Windows WSL2
- **Node.js:** 18.x or higher
- **Yarn:** 1.22.x or higher
- **PostgreSQL:** 15.x or higher
- **MongoDB:** 6.x or higher
- **Redis:** 7.x or higher
- **RAM:** Minimum 4GB (8GB recommended)
- **Disk:** 10GB free space

## Step 1: Clone Repository

```bash
git clone <your-repository-url>
cd storybox-business
```

## Step 2: Install Dependencies

```bash
# Install root dependencies
yarn install

# Install Medusa dependencies
cd medusa-backend
yarn install
cd ..
```

## Step 3: Database Setup

### PostgreSQL

```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
```

```sql
CREATE USER medusa WITH PASSWORD 'medusa_password' CREATEDB;
CREATE DATABASE medusa_db OWNER medusa;
\q
```

### MongoDB

```bash
# Install MongoDB (Ubuntu/Debian)
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Verify
mongo --eval 'db.runCommand({ connectionStatus: 1 })'
```

### Redis

```bash
# Install Redis
sudo apt-get install redis-server

# Start Redis
sudo systemctl start redis
sudo systemctl enable redis

# Verify
redis-cli ping
# Should return: PONG
```

## Step 4: Environment Configuration

### Main Application (.env)

Create `.env` in project root:

```env
# MongoDB
MONGO_URL=mongodb://localhost:27017
DB_NAME=storybox_db

# Next.js
NEXT_PUBLIC_BASE_URL=http://localhost:3000
CORS_ORIGINS=*

# Medusa
MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=your_key_here

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
COOKIE_SECRET=your-cookie-secret-key-minimum-32-characters

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=yhhlq588
NEXT_PUBLIC_SANITY_DATASET=sbxdataset
SANITY_API_TOKEN=your-sanity-token
```

### Medusa Backend (.env)

Create `medusa-backend/.env`:

```env
DATABASE_URL=postgresql://medusa:medusa_password@localhost:5432/medusa_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=supersecret_medusa_jwt_key_change_in_production
COOKIE_SECRET=supersecret_medusa_cookie_key_change_in_production

# CORS
STORE_CORS=http://localhost:3000,http://0.0.0.0:3000
ADMIN_CORS=http://localhost:9000,http://localhost:7001,http://localhost:3000
AUTH_CORS=http://localhost:3000,http://0.0.0.0:3000

# Medusa Admin
MEDUSA_ADMIN_BACKEND_URL=http://localhost:9000
MEDUSA_ADMIN_ONBOARDING_TYPE=default

# Port
PORT=9000
```

## Step 5: Medusa Setup

### Run Database Migrations

```bash
cd medusa-backend
npx medusa db:migrate
```

### Create Admin User

```bash
npx medusa user -e admin@storybox.bg -p YourSecurePassword
```

### Create Region

```bash
node ../setup-region.js
```

This creates Bulgaria region with BGN currency.

### Create Publishable API Key

```bash
node ../create-publishable-key.js
```

Copy the generated key and add to `.env`:
```env
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxxxxxxxxxxxx
```

### Seed Sample Products (Optional)

```bash
node ../setup-medusa-complete.js
```

## Step 6: Supervisor Setup (Production-like)

For development with all services running:

### Install Supervisor

```bash
sudo apt-get install supervisor
```

### Configure Services

Create `/etc/supervisor/conf.d/nextjs.conf`:

```ini
[program:nextjs]
command=yarn dev
directory=/path/to/storybox-business
autostart=true
autorestart=true
stdout_logfile=/var/log/supervisor/nextjs.out.log
stderr_logfile=/var/log/supervisor/nextjs.err.log
```

Create `/etc/supervisor/conf.d/medusa.conf`:

```ini
[program:medusa]
command=yarn dev
directory=/path/to/storybox-business/medusa-backend
autostart=true
autorestart=true
stdout_logfile=/var/log/supervisor/medusa.out.log
stderr_logfile=/var/log/supervisor/medusa.err.log
```

### Start Services

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start all
```

## Step 7: Verify Installation

### Check Services

```bash
# PostgreSQL
psql -U medusa -d medusa_db -c "SELECT 1"

# MongoDB
mongo storybox_db --eval "db.stats()"

# Redis
redis-cli ping

# Medusa
curl http://localhost:9000/health

# Next.js
curl http://localhost:3000
```

### Access Applications

- **Frontend:** http://localhost:3000
- **Medusa Admin:** http://localhost:9000/app
  - Email: admin@storybox.bg
  - Password: (your password)

## Step 8: Development Workflow

### Start Development

```bash
# Terminal 1: Next.js
yarn dev

# Terminal 2: Medusa
cd medusa-backend
yarn dev
```

OR use supervisor:

```bash
sudo supervisorctl start all
sudo supervisorctl status
```

### Watch Logs

```bash
# Next.js
tail -f /var/log/supervisor/nextjs.out.log

# Medusa
tail -f /var/log/supervisor/medusa.out.log
```

## Common Issues

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 9000
lsof -ti:9000 | xargs kill -9
```

### Database Connection Error

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check MongoDB is running
sudo systemctl status mongodb

# Verify credentials in .env files
```

### Redis Connection Error

```bash
# Check Redis is running
sudo systemctl status redis

# Test connection
redis-cli ping
```

### Medusa Migrations Fail

```bash
# Drop and recreate database
sudo -u postgres psql -c "DROP DATABASE medusa_db;"
sudo -u postgres psql -c "CREATE DATABASE medusa_db OWNER medusa;"

# Run migrations again
cd medusa-backend
npx medusa db:migrate
```

## Next Steps

1. **Add Products:** Go to Medusa Admin → Products
2. **Configure Sanity:** Add services, projects, blog posts
3. **Test Cart Flow:** Register user, add to cart, checkout
4. **Customize:** Update branding, colors, content

See [MEDUSA_INTEGRATION.md](./MEDUSA_INTEGRATION.md) for detailed Medusa usage.
