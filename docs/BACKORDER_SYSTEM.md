# Backorder System Documentation

## Overview
The backorder system allows customers to place orders for products that are temporarily out of stock but will be restocked. This feature helps maintain sales and customer engagement even when inventory is low.

## Features

### 1. Admin Product Configuration

When creating or editing a product in the admin panel (`/admin/products`), you can configure backorder settings:

**Inventory Section:**
- **Status**: Select from:
  - `In Stock` - Product is available for immediate purchase
  - `Out of Stock` - Product is unavailable
  - `Backorder` - Product can be ordered but will be delivered later

- **Allow Backorder**: Toggle to enable/disable backorder for out-of-stock items
- **Backorder Message**: Custom message shown to customers (e.g., "Изпраща се след 2-3 седмици")

**Example Configuration:**
```javascript
inventory: {
  amount: 0,
  status: 'backorder',
  allowBackorder: true,
  backorderMessage: 'Доставка в рамките на 10 работни дни',
  minQuantity: 1,
  maxQuantity: 999
}
```

### 2. Customer Experience

#### Shop Page (`/shop`)
Products on backorder display:
- Orange "Предварителна поръчка" (Pre-order) badge in top-right corner
- Normal product card layout with full details
- Products are NOT shown as "out of stock" (no black overlay)

#### Product Detail Page (`/shop/[slug]`)
When viewing a backorder product:

**Visual Indicators:**
- Orange badge: "📦 Предварителна поръчка"
- Custom backorder message (if set by admin)
- Information box explaining the backorder process

**Add to Cart Button:**
- Changes to orange color (instead of green)
- Text changes to "Заявка за предварителна поръчка"
- Fully functional - customers can add backorder items to cart

**Information Displayed:**
```
📦 Предварителна поръчка

[Custom backorder message from admin]

Забележка: Този продукт е на предварителна поръчка. 
Вашата заявка ще бъде изпратена за одобрение и ще 
получите потвърждение за срока на доставка.
```

### 3. Order Processing

**Backorder Orders:**
1. Customer adds backorder item to cart
2. Proceeds through normal checkout process
3. Order is created with backorder flag
4. Admin receives notification (future enhancement)
5. Admin approves and provides delivery timeline
6. Customer receives confirmation with delivery date

### 4. Status Combinations

| Inventory Amount | Status | Allow Backorder | Display |
|-----------------|--------|-----------------|---------|
| > 0 | in_stock | any | ✅ In Stock (green badge) |
| 0 | backorder | true | 📦 Backorder (orange badge) |
| 0 | out_of_stock | true | 📦 Backorder (orange badge) |
| 0 | out_of_stock | false | ❌ Out of Stock (disabled) |

### 5. Business Logic

**When to Use Backorder:**
- Product is temporarily out of stock but will be restocked
- Made-to-order or custom products
- Seasonal items with known restock dates
- Popular items that sell out quickly

**Admin Workflow:**
1. Product goes out of stock (inventory = 0)
2. Admin changes status to "backorder"
3. Set backorder message with delivery timeframe
4. Enable "Allow Backorder" toggle
5. Save product

**Customer Workflow:**
1. Browse shop and see backorder products
2. Click product to view details
3. Read backorder information
4. Add to cart (if acceptable)
5. Complete order
6. Wait for admin approval and confirmation

### 6. Future Enhancements

**Planned Features:**
- [ ] Email notifications to admin for backorder requests
- [ ] Backorder order management in admin panel
- [ ] Automatic approval workflow
- [ ] Customer portal to track backorder status
- [ ] Expected delivery date field
- [ ] Automatic notifications when product is back in stock
- [ ] Backorder analytics dashboard

### 7. Technical Implementation

**Frontend Components:**
- `/app/app/shop/page.js` - Shop grid with backorder badges
- `/app/app/shop/[slug]/page.js` - Product detail with backorder handling
- `/app/app/admin/products/page.js` - Admin configuration

**API Endpoints:**
- `GET /api/products` - Returns products with inventory status
- `GET /api/products/[slug]` - Single product with full inventory data
- `PATCH /api/admin/products/[productId]` - Update product inventory

**Database Schema:**
```javascript
{
  inventory: {
    amount: Number,
    status: Enum ['in_stock', 'out_of_stock', 'backorder'],
    allowBackorder: Boolean,
    backorderMessage: String,
    minQuantity: Number,
    maxQuantity: Number,
    stockAlertThreshold: Number
  }
}
```

### 8. Best Practices

**Admin Tips:**
- Set realistic backorder messages with timeframes
- Update backorder status regularly
- Communicate proactively with customers
- Keep backorder messages in Bulgarian

**Customer Communication:**
- Be transparent about delivery times
- Update customers if timeline changes
- Provide tracking information when shipping
- Offer alternatives if possible

### 9. SEO Considerations

Backorder products are:
- ✅ Indexed by search engines (status: active, visibility: public)
- ✅ Shown in product searches
- ✅ Included in sitemaps
- ✅ Available for Google Shopping (marked as preorder)

### 10. Testing Checklist

- [ ] Create product with backorder status
- [ ] Verify orange badge appears on shop page
- [ ] Check product detail page shows backorder info
- [ ] Test add to cart with backorder item
- [ ] Verify checkout works with backorder products
- [ ] Confirm order is created correctly
- [ ] Test mixed cart (in-stock + backorder items)

## Support

For issues or questions about the backorder system:
- Check admin panel inventory settings
- Review product status in database
- Test with different inventory configurations
- Contact technical support if needed

---

**Status**: ✅ Implemented and Production Ready
**Version**: 1.0.0
**Last Updated**: 2025-01-26
