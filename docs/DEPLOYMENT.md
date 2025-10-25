# Deployment Guide - Storybox Platform

Guide for deploying Storybox to production.

## Prerequisites

- Domain name configured
- SSL certificate (Let's Encrypt recommended)
- Server with minimum 4GB RAM
- PostgreSQL, MongoDB, Redis (managed services recommended)

## Production Architecture

```
┌─────────────────┐
│   Cloudflare    │ ← DNS, CDN, DDoS Protection
└────────┬────────┘
         │
┌────────▼────────┐
│   Nginx/Caddy   │ ← Reverse Proxy, SSL
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼───┐
│Next.js│ │Medusa│
│ :3000 │ │:9000 │
└───┬───┘ └──┬───┘
    │        │
┌───▼────────▼───┐
│   PostgreSQL   │
│   MongoDB      │
│   Redis        │
└────────────────┘
```

## Step 1: Prepare Production Environment

### Update Environment Variables

Create production `.env`:

```env
# Production URLs
NEXT_PUBLIC_BASE_URL=https://storybox.bg
MEDUSA_BACKEND_URL=https://api.storybox.bg
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.storybox.bg

# Database (use managed services)
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/storybox_prod
DATABASE_URL=postgresql://user:pass@host:5432/medusa_prod
REDIS_URL=redis://user:pass@host:6379

# Strong secrets (generate new ones!)
JWT_SECRET=$(openssl rand -base64 32)
COOKIE_SECRET=$(openssl rand -base64 32)

# Production settings
NODE_ENV=production
CORS_ORIGINS=https://storybox.bg
```

## Step 2: Database Setup

### MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Create database user
4. Whitelist IP addresses
5. Get connection string

### PostgreSQL (Managed)

Options:
- DigitalOcean Managed PostgreSQL
- AWS RDS
- Google Cloud SQL
- Heroku Postgres

### Redis (Managed)

Options:
- Redis Cloud
- DigitalOcean Managed Redis
- AWS ElastiCache

## Step 3: Build Applications

### Build Next.js

```bash
# Install dependencies
yarn install --production=false

# Build
yarn build

# Test production build locally
yarn start
```

### Build Medusa

```bash
cd medusa-backend
yarn install --production=false
yarn build

# Run migrations on production DB
DATABASE_URL=your_prod_url npx medusa db:migrate

# Create admin user
npx medusa user -e admin@storybox.bg -p SecurePassword
```

## Step 4: Server Setup (DigitalOcean Example)

### Create Droplet

```bash
# Ubuntu 22.04 LTS
# 4GB RAM minimum
# Add your SSH key
```

### Install Dependencies

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Yarn
npm install -g yarn

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx
sudo apt-get install nginx
```

### Deploy Application

```bash
# Clone repository
git clone <your-repo> /var/www/storybox
cd /var/www/storybox

# Install dependencies
yarn install --production

# Build
yarn build

# Setup Medusa
cd medusa-backend
yarn install --production
yarn build
```

## Step 5: Process Management with PM2

### Create PM2 Ecosystem

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'storybox-frontend',
      cwd: '/var/www/storybox',
      script: 'yarn',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      instances: 2,
      exec_mode: 'cluster',
      max_memory_restart: '1G'
    },
    {
      name: 'storybox-medusa',
      cwd: '/var/www/storybox/medusa-backend',
      script: 'yarn',
      args: 'start',
      env: {
        NODE_ENV: 'production',
        PORT: 9000
      },
      instances: 1,
      max_memory_restart: '1G'
    }
  ]
}
```

### Start Services

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Step 6: Nginx Configuration

### Frontend (storybox.bg)

Create `/etc/nginx/sites-available/storybox`:

```nginx
server {
    listen 80;
    server_name storybox.bg www.storybox.bg;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Medusa API (api.storybox.bg)

Create `/etc/nginx/sites-available/storybox-api`:

```nginx
server {
    listen 80;
    server_name api.storybox.bg;

    location / {
        proxy_pass http://localhost:9000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Enable Sites

```bash
sudo ln -s /etc/nginx/sites-available/storybox /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/storybox-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 7: SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificates
sudo certbot --nginx -d storybox.bg -d www.storybox.bg
sudo certbot --nginx -d api.storybox.bg

# Auto-renewal
sudo certbot renew --dry-run
```

## Step 8: Monitoring

### PM2 Monitoring

```bash
# View logs
pm2 logs

# Monitor processes
pm2 monit

# Restart apps
pm2 restart all
```

### Log Files

```bash
# Application logs
pm2 logs storybox-frontend
pm2 logs storybox-medusa

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Step 9: Backup Strategy

### Database Backups

```bash
# MongoDB backup
mongodump --uri="$MONGO_URL" --out=/backups/mongo-$(date +%Y%m%d)

# PostgreSQL backup
pg_dump $DATABASE_URL > /backups/postgres-$(date +%Y%m%d).sql
```

### Automated Backups (Cron)

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/backup-script.sh
```

## Step 10: Performance Optimization

### Enable Caching

```nginx
# Add to Nginx config
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g;
proxy_cache my_cache;
proxy_cache_valid 200 1h;
```

### Enable Gzip

```nginx
gzip on;
gzip_vary on;
gzip_types text/plain text/css application/json application/javascript;
```

### CDN (Cloudflare)

1. Point domain to Cloudflare
2. Enable caching for static assets
3. Enable Brotli compression
4. Set up page rules for caching

## Security Checklist

- [ ] SSL certificates installed
- [ ] Strong JWT secrets (32+ characters)
- [ ] Strong database passwords
- [ ] Firewall configured (UFW)
- [ ] SSH key authentication only
- [ ] Fail2ban installed
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Security headers set
- [ ] Regular updates scheduled

## Deployment Checklist

- [ ] Environment variables set
- [ ] Databases migrated
- [ ] Admin user created
- [ ] Products imported
- [ ] PM2 configured and running
- [ ] Nginx configured
- [ ] SSL certificates installed
- [ ] DNS records updated
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Test complete user journey
- [ ] Load testing performed

## Rollback Plan

```bash
# Keep previous version
cp -r /var/www/storybox /var/www/storybox-backup

# Rollback if needed
pm2 stop all
rm -rf /var/www/storybox
mv /var/www/storybox-backup /var/www/storybox
pm2 restart all
```

## Support

For deployment issues:
- Check PM2 logs: `pm2 logs`
- Check Nginx logs: `/var/log/nginx/error.log`
- Verify services: `pm2 status`
