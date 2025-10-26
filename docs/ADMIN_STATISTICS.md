# Admin Dashboard Statistics Documentation

## Overview
The admin dashboard displays key business metrics. Statistics are calculated to reflect actual business performance by excluding incomplete and cancelled orders.

## Statistics Displayed

### 1. Users (Общо потребители)
- **Count:** Total registered users
- **Includes:** All active user accounts
- **Excludes:** None (all users counted)

### 2. Completed Orders (Завършени поръчки)
- **Count:** Orders that are confirmed and being fulfilled
- **Includes:**
  - `processing` - Orders being prepared
  - `shipped` - Orders sent to customers
  - `delivered` - Orders received by customers

- **Excludes:**
  - `pending` - Awaiting payment/confirmation
  - `backorder_pending` - Pre-orders awaiting approval
  - `cancelled` - Customer cancelled
  - `annulled` - Admin cancelled

**Rationale:** Only count orders that represent confirmed business

### 3. Sales Revenue (Приход от продажби)
- **Amount:** Sum of total from completed orders only
- **Currency:** Bulgarian Lev (лв)
- **Includes:** Same statuses as completed orders
- **Excludes:** Same as completed orders

**Rationale:** Revenue should only reflect actual/expected income, not potential or cancelled orders

## Order Status Lifecycle

```
Customer Places Order
        ↓
   [pending] ← Not counted in stats
        ↓
Admin Confirms/Customer Pays
        ↓
   [processing] ← ✅ COUNTED IN STATS
        ↓
   [shipped] ← ✅ COUNTED IN STATS
        ↓
   [delivered] ← ✅ COUNTED IN STATS

Alternative Paths:
[pending] → [cancelled] ← ❌ NOT COUNTED
[pending] → [annulled] ← ❌ NOT COUNTED
[pending] → [backorder_pending] ← ❌ NOT COUNTED (awaiting approval)
```

## Statistics Calculation Logic

### Frontend (Dashboard)
```javascript
// Filter completed orders
const completedStatuses = ['delivered', 'shipped', 'processing']
const completedOrders = orders.filter(order => 
  completedStatuses.includes(order.status)
)

// Calculate stats
stats.orders = completedOrders.length
stats.revenue = completedOrders.reduce((sum, order) => 
  sum + (order.total || 0), 0
)
```

### Why This Approach?

**Financial Accuracy:**
- Pending orders may not complete (abandoned carts, payment failures)
- Cancelled orders represent no revenue
- Annulled orders are administrative corrections
- Backorder orders are pending approval

**Business Intelligence:**
- Processing = Confirmed sale, preparing fulfillment
- Shipped = In transit, payment received
- Delivered = Complete transaction

**Reporting Standards:**
- Matches accounting practices
- Reflects actual business performance
- Provides accurate forecasting data

## Dashboard Labels

### Before (Misleading)
```
Общо поръчки: 150
Общ приход: 15,000 лв
```
*Included cancelled/pending orders*

### After (Accurate)
```
Завършени поръчки: 120
(В процес, Изпратени, Доставени)

Приход от продажби: 12,000 лв
(Без анулирани/чакащи)
```
*Clear what's included/excluded*

## Future Enhancements

### Additional Statistics
- [ ] Pending orders count (awaiting action)
- [ ] Cancellation rate (cancelled/total)
- [ ] Average order value (revenue/orders)
- [ ] Revenue by status breakdown
- [ ] Monthly/yearly trends
- [ ] Product performance metrics
- [ ] Customer lifetime value

### Advanced Filtering
- [ ] Date range selector
- [ ] Export statistics to CSV
- [ ] Compare periods (MoM, YoY)
- [ ] Revenue forecasting
- [ ] Inventory turnover

### Visual Enhancements
- [ ] Charts and graphs
- [ ] Trend indicators (↑↓)
- [ ] Color-coded performance
- [ ] Real-time updates

## API Considerations

Currently, statistics are calculated client-side by fetching all orders and filtering. For better performance with large datasets:

**Recommended: Server-side Aggregation**
```javascript
// Future API endpoint
GET /api/admin/stats

Response:
{
  users: 500,
  orders: {
    completed: 120,
    pending: 15,
    cancelled: 10,
    annulled: 5
  },
  revenue: {
    total: 12000,
    byStatus: {
      processing: 3000,
      shipped: 5000,
      delivered: 4000
    }
  }
}
```

## Testing Checklist

- [ ] Create pending order → Not counted
- [ ] Process order → Counted
- [ ] Ship order → Counted
- [ ] Deliver order → Counted
- [ ] Cancel order → Removed from count
- [ ] Annul order → Removed from count
- [ ] Verify revenue matches completed orders
- [ ] Check labels are clear
- [ ] Test with zero orders
- [ ] Test with large datasets

## Related Files
- `/app/app/admin/dashboard/page.js` - Dashboard component
- `/app/app/api/admin/orders/route.js` - Orders API
- `/app/docs/ADMIN_STATISTICS.md` - This file

---

**Status:** ✅ Implemented
**Version:** 1.0.0
**Last Updated:** 2025-01-26
**Impact:** Accurate business metrics in admin dashboard
