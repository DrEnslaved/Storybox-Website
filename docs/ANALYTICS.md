# Analytics Integration Guide

## Overview

The Storybox application uses **dual analytics tracking** with both Google Analytics 4 (GA4) and Mixpanel for comprehensive user behavior insights.

## Platform Setup

### Google Analytics 4
- **Measurement ID:** `G-SCGB18BB4Q`
- **Dashboard:** https://analytics.google.com/
- **Features:** Page views, events, e-commerce tracking, user demographics

### Mixpanel
- **Project Token:** `808cc4090780281afa6d384844cc37ff`
- **Dashboard:** https://mixpanel.com/
- **Features:** User behavior, cohort analysis, retention, funnels

## Tracked Events

### Automatic Tracking

#### Page Views
Automatically tracked on every route change:
```javascript
- Homepage: /
- Shop: /shop
- Product Detail: /shop/[slug]
- Cart: /cart
- Checkout: /checkout
- Account: /account
- etc.
```

### E-commerce Events

#### 1. Product Viewed
**Triggered:** When user views product detail page
```javascript
trackProductView({
  id: 'product_123',
  name: 'Custom T-Shirt',
  price: 29.99
})
```

**Data Tracked:**
- Product ID
- Product Name
- Price
- Currency (BGN)

#### 2. Add to Cart
**Triggered:** When user adds product to cart
```javascript
trackAddToCart(product, quantity)
```

**Data Tracked:**
- Product ID
- Product Name
- Price
- Quantity
- Total Value

#### 3. Remove from Cart
**Triggered:** When user removes item from cart
```javascript
trackRemoveFromCart(product, quantity)
```

#### 4. Begin Checkout
**Triggered:** When user starts checkout process
```javascript
trackBeginCheckout(cart)
```

**Data Tracked:**
- Cart Value
- Item Count
- Product Details

#### 5. Purchase Completed
**Triggered:** On successful order placement
```javascript
trackPurchase(order)
```

**Data Tracked:**
- Transaction ID
- Total Value
- Tax
- Shipping
- Items Purchased

### User Authentication Events

#### Login
```javascript
trackUserLogin('email') // or 'google'
```

#### Signup
```javascript
trackUserSignup('email') // or 'google'
```

#### User Identification
```javascript
identifyUser(userId, {
  name: 'John Doe',
  email: 'john@example.com',
  accountType: 'B2B'
})
```

### Engagement Events

#### Contact Form
```javascript
trackContactForm('contact') // or 'quote'
```

#### Search
```javascript
trackSearch('embroidery shirts', 10) // searchTerm, resultCount
```

#### Social Share
```javascript
trackSocialShare('facebook', 'product')
```

#### Order Annulment
```javascript
trackOrderAnnulment(orderId, 'Customer request')
```

## Implementation Examples

### In Product Page
```javascript
'use client'
import { trackProductView } from '@/lib/analytics'

export default function ProductPage({ product }) {
  useEffect(() => {
    trackProductView(product)
  }, [product])
  
  return (
    // ...
  )
}
```

### In Cart Component
```javascript
import { trackAddToCart, trackRemoveFromCart } from '@/lib/analytics'

const handleAddToCart = (product) => {
  // Add to cart logic
  addToCart(product)
  
  // Track event
  trackAddToCart(product, 1)
}
```

### In Checkout Flow
```javascript
import { trackBeginCheckout, trackPurchase } from '@/lib/analytics'

// On checkout page load
useEffect(() => {
  trackBeginCheckout(cart)
}, [])

// On successful order
const handleOrderComplete = (order) => {
  trackPurchase(order)
}
```

### In Authentication
```javascript
import { trackUserLogin, trackUserSignup, identifyUser } from '@/lib/analytics'

// After successful login
const handleLogin = async (credentials) => {
  const user = await login(credentials)
  trackUserLogin('email')
  identifyUser(user.id, {
    name: user.name,
    email: user.email
  })
}
```

## Analytics Dashboard Access

### Google Analytics 4

**Key Metrics to Monitor:**
1. **Real-time:** Active users right now
2. **Acquisition:** Traffic sources (organic, direct, referral)
3. **Engagement:** Page views, session duration, bounce rate
4. **Monetization:** E-commerce performance
   - Transaction count
   - Revenue
   - Average order value
5. **Retention:** Returning users

**Useful Reports:**
- **Explorations → Funnel:** Checkout conversion funnel
- **Monetization → E-commerce purchases:** Revenue analysis
- **Engagement → Pages and screens:** Most viewed pages

### Mixpanel

**Key Features:**
1. **Insights:** Analyze event trends over time
2. **Funnels:** Conversion analysis
   - Example: Product View → Add to Cart → Checkout → Purchase
3. **Retention:** How many users come back
4. **Cohorts:** Group users by behavior
5. **User Profiles:** Individual user journeys

**Sample Funnels to Create:**
```
Purchase Funnel:
Step 1: Product Viewed
Step 2: Product Added to Cart
Step 3: Checkout Started
Step 4: Purchase Completed

Conversion Rate: (Purchases / Product Views) * 100%
```

```
User Onboarding:
Step 1: Page View
Step 2: User Signup
Step 3: First Purchase

Activation Rate: (First Purchases / Signups) * 100%
```

## Privacy & Compliance

### GDPR Compliance
- IP anonymization enabled in GA4
- Cookie consent required (already implemented)
- User data deletion available on request

### Cookie Consent Integration
Analytics only initialize after user accepts cookies:
```javascript
// In CookieConsent.js
onAccept={() => {
  initAnalytics() // Only called after consent
}}
```

## Debugging

### Enable Debug Mode

**In Browser Console:**
```javascript
// Check if analytics initialized
console.log('GA initialized:', window.gtag !== undefined)
console.log('Mixpanel initialized:', window.mixpanel !== undefined)

// Manually track event for testing
import { trackEvent } from '@/lib/analytics'
trackEvent('Test Event', { test: true })
```

**Mixpanel Debug Mode:**
Set `NODE_ENV=development` to see Mixpanel events in console

### Verify Events in Real-time

**Google Analytics:**
1. Go to GA4 Dashboard
2. Click "Reports" → "Real-time"
3. Perform action on site
4. See event appear in dashboard (10-30 second delay)

**Mixpanel:**
1. Go to Mixpanel Dashboard
2. Click "Events" → "Live View"
3. Perform action on site
4. See event appear immediately

## Custom Event Tracking

To add new custom events:

```javascript
import { trackEvent } from '@/lib/analytics'

// Simple event
trackEvent('Button Clicked', {
  category: 'Engagement',
  button_name: 'Get Quote',
  location: 'Homepage Hero'
})

// E-commerce event with custom properties
trackEvent('Product Filter Applied', {
  category: 'E-commerce',
  filter_type: 'Category',
  filter_value: 'T-Shirts',
  result_count: 25
})
```

## Performance Impact

- **Bundle Size:** ~50KB (gzipped)
- **Load Time:** Asynchronous, non-blocking
- **User Privacy:** IP anonymization, consent-based

## Troubleshooting

### Events Not Showing

1. **Check Console Errors:**
   - Open browser DevTools → Console
   - Look for analytics-related errors

2. **Verify Credentials:**
   - Check `.env` file has correct IDs
   - Ensure environment variables loaded (restart Next.js)

3. **Check Cookie Consent:**
   - Analytics only work after user accepts cookies
   - Clear cookies and re-accept to test

4. **Ad Blockers:**
   - Some ad blockers prevent GA4/Mixpanel
   - Test in incognito mode or disable blockers

### Missing E-commerce Data

- Ensure product data structure matches expected format
- Check cart/order objects have required fields (id, price, items)
- Verify events called at right time in user flow

## Best Practices

1. **Event Naming:** Use consistent, descriptive names
2. **Property Structure:** Keep event properties consistent
3. **User Privacy:** Always respect cookie consent
4. **Testing:** Test in development before production
5. **Documentation:** Document custom events added

## Support Resources

- **Google Analytics 4:** https://support.google.com/analytics/
- **Mixpanel Docs:** https://docs.mixpanel.com/
- **GA4 E-commerce:** https://developers.google.com/analytics/devguides/collection/ga4/ecommerce

## Next Steps

1. ✅ Analytics implementation complete
2. Set up GA4 goals and conversions
3. Create Mixpanel funnels for key flows
4. Configure custom reports
5. Set up automated insights/alerts
6. Review analytics data weekly

---

**Last Updated:** 2025-01-25  
**Status:** Production Ready  
**Platforms:** Google Analytics 4 + Mixpanel
