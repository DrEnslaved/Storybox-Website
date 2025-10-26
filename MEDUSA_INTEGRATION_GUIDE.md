# Medusa Commerce Platform Integration - Complete Guide

## Overview
Successfully integrated Medusa.js commerce platform into the STORVBOX embroidery business website. Medusa now serves as the backend for product catalog, inventory, pricing, and order management.

---

## Architecture

### Services Running
- **Next.js Frontend**: Port 3000 (existing)
- **MongoDB**: Port 27017 (existing, for auth/users)
- **PostgreSQL 15**: Port 5432 (new, for Medusa data)
- **Redis**: Port 6379 (new, for Medusa caching)
- **Medusa Backend**: Port 9000 (new, commerce engine)

### Supervisor Configuration
All services are managed by supervisor and auto-restart:
- `/etc/supervisor/conf.d/postgresql.conf`
- `/etc/supervisor/conf.d/redis.conf`
- `/etc/supervisor/conf.d/medusa.conf`

---

## Medusa Admin Access

**Admin Dashboard**: http://localhost:9000/app

**Credentials**:
- **Email**: admin@storybox.bg
- **Password**: Pandora2019+

### Admin Dashboard Features
- Product Management (CRUD operations)
- Inventory Management
- Order Processing
- Customer Management
- Pricing & Discounts
- Analytics & Reports

---

## Database Configuration

### PostgreSQL
- **Database**: medusa_db
- **User**: medusa
- **Password**: medusa_password
- **Connection**: localhost:5432

### Redis
- **Host**: localhost
- **Port**: 6379
- **No password** (local development)

---

## Products Created

✅ **3 Products with Multi-tier Pricing** (Standard, Premium, VIP):

1. **Брандирани тениски с бродерия** (Branded T-shirts with Embroidery)
   - SKUs: EMBR-TSHIRT-STD, EMBR-TSHIRT-PREM, EMBR-TSHIRT-VIP
   - Prices: 25.00 BGN, 22.00 BGN, 20.00 BGN

2. **Сублимационен печат върху чаши** (Sublimation Print on Mugs)
   - SKUs: SUBL-MUG-STD, SUBL-MUG-PREM, SUBL-MUG-VIP
   - Prices: 12.00 BGN, 10.00 BGN, 9.00 BGN

3. **Трансферен печат върху текстил** (Transfer Print on Textiles)
   - SKUs: TRANS-TEXT-STD, TRANS-TEXT-PREM, TRANS-TEXT-VIP
   - Prices: 18.00 BGN, 16.00 BGN, 14.00 BGN

---

## Frontend Integration

### API Endpoints

#### Get Medusa Products
```bash
GET /api/medusa/products
```
Returns transformed products from Medusa admin API with:
- Product details (id, name, slug, description)
- Images array
- Price tiers (transformed from Medusa variants)
- Variant information

#### Fallback MongoDB Products
```bash
GET /api/products
```
Legacy endpoint, maintained for backwards compatibility.

### Shop Page Integration
- **File**: `/app/app/shop/page.js`
- **Behavior**: Automatically fetches from Medusa first, falls back to MongoDB
- **Status**: ✅ Working - displaying 3 Medusa products

---

## Environment Variables

### `/app/.env`
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=your_database_name
NEXT_PUBLIC_BASE_URL=https://adminpanel-dev-1.preview.emergentagent.com
CORS_ORIGINS=*

# Medusa Configuration
MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
```

### `/app/medusa-backend/.env`
```env
DATABASE_URL=postgresql://medusa:medusa_password@localhost:5432/medusa_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=supersecret_medusa_jwt_key_change_in_production
COOKIE_SECRET=supersecret_medusa_cookie_key_change_in_production

# CORS - Allow Next.js frontend
STORE_CORS=http://localhost:3000,http://0.0.0.0:3000
ADMIN_CORS=http://localhost:9000,http://localhost:7001,http://localhost:3000
AUTH_CORS=http://localhost:3000,http://0.0.0.0:3000

# Medusa Admin
MEDUSA_ADMIN_BACKEND_URL=http://localhost:9000
MEDUSA_ADMIN_ONBOARDING_TYPE=default

# Port
PORT=9000
```

---

## How to Add New Products

### Option 1: Via Admin Dashboard (Recommended)
1. Go to http://localhost:9000/app
2. Login with admin@storybox.bg / Pandora2019+
3. Navigate to "Products" → "Add Product"
4. Fill in:
   - Title (Bulgarian name)
   - Handle (URL-friendly slug)
   - Description
   - Options (e.g., "Ниво" with values: Standard, Premium, VIP)
   - Variants (one per pricing tier)
   - Images (URLs or upload)
   - Pricing for each variant
5. Save and publish

### Option 2: Via API Script
Use the `/app/setup-medusa-complete.js` script as a template.

---

## Sales Channel Configuration

- **Sales Channel ID**: sc_01K8EFA3PT2R7FCEA5RJ2J6B1G
- **Name**: Web Storefront
- All products are associated with this channel

---

## Next Steps / Pending Tasks

### High Priority
1. **Create Publishable API Key**
   - Navigate to Settings → API Keys in Medusa Admin
   - Create key for storefront
   - Add to `/app/.env` as `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
   - Update `/app/lib/medusa-client.js` to use the key

2. **Update Product Detail Page** (`/app/app/shop/[slug]/page.js`)
   - Fetch product by handle from Medusa
   - Display variant selection
   - Add to cart with Medusa variant ID

3. **Integrate Medusa Cart**
   - Replace MongoDB cart with Medusa cart API
   - Update `/app/contexts/CartContext.js`
   - Use Medusa cart session

4. **Checkout Integration**
   - Update `/app/app/checkout/page.js`
   - Use Medusa checkout workflow
   - Add payment provider (bank transfer details)

### Medium Priority
5. **Order Management**
   - Fetch orders from Medusa
   - Display in account dashboard
   - Order tracking integration

6. **Customer Sync**
   - Sync existing MongoDB users to Medusa customers
   - Implement customer-specific pricing (VIP tiers)

7. **Inventory Management**
   - Configure stock tracking
   - Low stock notifications

### Low Priority
8. **Migrate Remaining MongoDB Products**
   - Export from MongoDB
   - Import to Medusa
   - Update any references

9. **Add More Products**
   - Laser cutting products
   - Additional embroidery options
   - Promotional items

10. **Email Notifications**
    - Order confirmation emails
    - Shipping updates

---

## Useful Commands

### Service Management
```bash
# Check all services
sudo supervisorctl status

# Restart Medusa
sudo supervisorctl restart medusa

# View Medusa logs
tail -f /var/log/supervisor/medusa.out.log
tail -f /var/log/supervisor/medusa.err.log

# Restart PostgreSQL
sudo supervisorctl restart postgresql

# Restart Redis
sudo supervisorctl restart redis
```

### Medusa CLI
```bash
cd /app/medusa-backend

# Run migrations
npx medusa db:migrate

# Create admin user
npx medusa user -e email@example.com -p password

# Build Medusa
yarn build

# Start development
yarn dev

# Start production
yarn start
```

### Database Access
```bash
# PostgreSQL
sudo -u postgres psql -d medusa_db

# Check Medusa tables
sudo -u postgres psql -d medusa_db -c "\dt"

# Redis
redis-cli
```

---

## Troubleshooting

### Medusa Not Starting
```bash
# Check logs
tail -100 /var/log/supervisor/medusa.err.log

# Check PostgreSQL connection
sudo -u postgres psql -c "SELECT 1"

# Check Redis
redis-cli ping
```

### Products Not Showing
```bash
# Test Medusa API proxy
curl http://localhost:3000/api/medusa/products | jq .

# Test Medusa directly (needs auth)
curl http://localhost:9000/store/products
```

### Database Issues
```bash
# Reset Medusa database (WARNING: Deletes all data)
sudo -u postgres psql -c "DROP DATABASE medusa_db;"
sudo -u postgres psql -c "CREATE DATABASE medusa_db OWNER medusa;"
cd /app/medusa-backend && npx medusa db:migrate
```

---

## File Changes Summary

### New Files
- `/app/medusa-backend/*` - Complete Medusa installation
- `/app/lib/medusa-client.js` - Medusa SDK wrapper
- `/app/setup-medusa-complete.js` - Product seeding script
- `/etc/supervisor/conf.d/postgresql.conf`
- `/etc/supervisor/conf.d/redis.conf`
- `/etc/supervisor/conf.d/medusa.conf`

### Modified Files
- `/app/.env` - Added Medusa URLs
- `/app/app/api/[[...path]]/route.js` - Added `/api/medusa/products` endpoint
- `/app/app/shop/page.js` - Updated to fetch from Medusa
- `/app/package.json` - Added `@medusajs/js-sdk`

---

## Support & Documentation

- **Medusa Docs**: https://docs.medusajs.com
- **Medusa Admin**: http://localhost:9000/app
- **API Reference**: https://docs.medusajs.com/api/admin
- **GitHub**: https://github.com/medusajs/medusa

---

**Last Updated**: October 25, 2025
**Version**: 1.0
**Status**: ✅ Phase 1 Complete - Infrastructure & Product Display Working
