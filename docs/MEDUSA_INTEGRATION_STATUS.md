# Medusa E-commerce Integration Status

## ✅ Completed

### Infrastructure
- **PostgreSQL**: Installed and running on port 5432
  - Database: `medusa_db`
  - User: `medusa_user`
  - Password: `medusa_password`

- **Redis**: Installed and running on port 6379
  - Used for caching and session management

- **Medusa Backend**: Running on port 9000
  - Managed by supervisor
  - Auto-starts on system boot
  - Logs: `/var/log/supervisor/medusa.out.log`

### Database Setup
- All Medusa migrations completed (150+ migrations)
- Database schema created for:
  - Products & Variants
  - Cart & Checkout
  - Orders & Fulfillment
  - Customers
  - Payments
  - Promotions
  - Regions & Currencies
  - Inventory Management
  - And many more modules

### Admin Access
- **Email**: `admin@storybox.bg`
- **Password**: `admin123456`
- **Admin Panel**: http://localhost:9000/app
- **API Base URL**: http://localhost:9000

### Frontend Integration
- Installed `@medusajs/js-sdk` in Next.js app
- Installed `@tanstack/react-query` for data fetching
- Created `/app/lib/medusa-client.js` with:
  - Medusa SDK client configuration
  - Helper functions for products
  - Cart management functions
  - Region/currency helpers

### Environment Variables
Added to `/app/.env`:
```
MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_b042920521eb561c6f953a7240c88f24c8561551c6874cb8959187cb770fa700
```

Added to `/app/medusa-backend/.env`:
```
DATABASE_URL=postgres://medusa_user:medusa_password@localhost:5432/medusa_db
REDIS_URL=redis://localhost:6379
STORE_CORS=http://localhost:3000,https://postgres-cart-flow.preview.emergentagent.com
ADMIN_CORS=http://localhost:7001,http://localhost:9000
JWT_SECRET=storybox_medusa_secret_key_2025
COOKIE_SECRET=storybox_cookie_secret_2025
```

## 📋 Next Steps

### 1. Create Sample Product via Medusa Admin UI
Since the CLI seeding didn't work due to Medusa v2 API changes, create products via the Admin UI:

1. Open http://localhost:9000/app
2. Login with `admin@storybox.bg` / `admin123456`
3. Go to **Products** → **Add Product**
4. Create sample product:
   - **Title**: Българска Бродирана Риза
   - **Handle**: bulgarska-brodirana-riza
   - **Description**: Традиционна българска риза с ръчна бродерия
   - **Status**: Published
   - **Options**: Add "Размер" option
   - **Variants**: Create S, M, L, XL variants
   - **Price**: 120.00 BGN per variant
   - **SKUs**: BGR-SHIRT-S, BGR-SHIRT-M, BGR-SHIRT-L, BGR-SHIRT-XL
   - **Inventory**: 10, 15, 12, 8 respectively

### 2. Create Bulgaria Region
1. In Admin UI, go to **Settings** → **Regions**
2. Click **Add Region**
3. Configure:
   - **Name**: Bulgaria
   - **Currency**: BGN (Bulgarian Lev)
   - **Countries**: Bulgaria (BG)
   - **Tax Rate**: 20% (Bulgarian VAT)
   - **Payment Providers**: Select available providers
   - **Fulfillment Providers**: Select manual fulfillment

### 3. Update Next.js Shop Pages
Replace MongoDB product fetching with Medusa:

**Files to update:**
- `/app/app/shop/page.js` - Product listing
- `/app/app/shop/[slug]/page.js` - Product details
- `/app/app/cart/page.js` - Cart (replace SimpleCartContext)
- `/app/app/checkout/page.js` - Checkout flow

**Implementation:**
- Use `getAllProducts()` from `/app/lib/medusa-client.js`
- Display product variants properly
- Implement cart with Medusa cart API
- Update price display to show BGN currency

### 4. Remove Old MongoDB Products
Once Medusa is fully integrated:
```javascript
// Clean up old MongoDB products
const db = await connectToDatabase();
await db.collection('admin_products').deleteMany({});
```

### 5. Testing Checklist
- [ ] View products from Medusa in shop page
- [ ] Product detail page shows variants
- [ ] Add to cart functionality works
- [ ] Cart persists in Medusa backend
- [ ] Checkout creates order in Medusa
- [ ] Admin can manage orders in Medusa Admin
- [ ] Inventory updates after purchase

## 🔧 Useful Commands

**Check Medusa Status:**
```bash
sudo supervisorctl status medusa
```

**View Medusa Logs:**
```bash
tail -f /var/log/supervisor/medusa.out.log
tail -f /var/log/supervisor/medusa.err.log
```

**Restart Medusa:**
```bash
sudo supervisorctl restart medusa
```

**Access PostgreSQL:**
```bash
psql -U medusa_user -d medusa_db -h localhost
```

**Access Redis:**
```bash
redis-cli
```

**Create Admin User (if needed):**
```bash
cd /app/medusa-backend
npx medusa user --email admin@storybox.bg --password admin123456
```

## 📚 Resources

- **Medusa Docs**: https://docs.medusajs.com/
- **Admin UI Guide**: https://docs.medusajs.com/admin/quickstart
- **JS SDK Docs**: https://docs.medusajs.com/resources/references/js-sdk
- **Products API**: https://docs.medusajs.com/api/store#products
- **Cart API**: https://docs.medusajs.com/api/store#carts

## ⚠️ Important Notes

1. **Medusa v2**: This installation uses Medusa v2, which has significant API changes from v1
2. **Redis**: Currently using in-memory fake Redis for development. For production, use actual Redis
3. **Event Bus**: Using local event bus (not recommended for production)
4. **Authentication**: MongoDB still handles user authentication, Medusa handles products/orders only
5. **Sanity**: Blog functionality unchanged, still using Sanity CMS

## 🎯 Current Status

**Infrastructure**: ✅ Complete  
**Database**: ✅ Complete  
**Admin User**: ✅ Created  
**Frontend SDK**: ✅ Installed  
**Sample Product**: ⏳ Pending (create via Admin UI)  
**Shop Integration**: ⏳ Next step  
**Cart Integration**: ⏳ Next step  
**Checkout Integration**: ⏳ Next step
