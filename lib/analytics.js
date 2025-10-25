import mixpanel from 'mixpanel-browser'
import ReactGA from 'react-ga4'

// Initialize flags
let isGAInitialized = false
let isMixpanelInitialized = false

// Google Analytics 4 Configuration
export const initGA = () => {
  if (typeof window !== 'undefined' && !isGAInitialized) {
    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-SCGB18BB4Q'
    ReactGA.initialize(measurementId, {
      gaOptions: {
        anonymizeIp: true,
        cookieFlags: 'SameSite=None;Secure',
      },
    })
    isGAInitialized = true
    console.log('Google Analytics initialized:', measurementId)
  }
}

// Mixpanel Configuration
export const initMixpanel = () => {
  if (typeof window !== 'undefined' && !isMixpanelInitialized) {
    const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || '808cc4090780281afa6d384844cc37ff'
    mixpanel.init(token, {
      debug: process.env.NODE_ENV === 'development',
      track_pageview: true,
      persistence: 'localStorage',
    })
    isMixpanelInitialized = true
    console.log('Mixpanel initialized:', token)
  }
}

// Initialize both analytics platforms
export const initAnalytics = () => {
  initGA()
  initMixpanel()
}

// Page View Tracking
export const trackPageView = (url) => {
  if (typeof window === 'undefined') return

  // Google Analytics
  if (isGAInitialized) {
    ReactGA.send({ hitType: 'pageview', page: url })
  }

  // Mixpanel
  if (isMixpanelInitialized) {
    mixpanel.track('Page View', {
      page: url,
      title: document.title,
    })
  }
}

// Event Tracking
export const trackEvent = (eventName, eventData = {}) => {
  if (typeof window === 'undefined') return

  // Google Analytics
  if (isGAInitialized) {
    ReactGA.event({
      category: eventData.category || 'General',
      action: eventName,
      label: eventData.label,
      value: eventData.value,
      ...eventData,
    })
  }

  // Mixpanel
  if (isMixpanelInitialized) {
    mixpanel.track(eventName, eventData)
  }
}

// E-commerce: Product View
export const trackProductView = (product) => {
  trackEvent('Product Viewed', {
    category: 'E-commerce',
    product_id: product.id,
    product_name: product.name || product.title,
    product_price: product.price,
    currency: 'BGN',
  })

  // GA4 E-commerce
  if (isGAInitialized) {
    ReactGA.event('view_item', {
      currency: 'BGN',
      value: product.price,
      items: [{
        item_id: product.id,
        item_name: product.name || product.title,
        price: product.price,
      }],
    })
  }
}

// E-commerce: Add to Cart
export const trackAddToCart = (product, quantity = 1) => {
  trackEvent('Product Added to Cart', {
    category: 'E-commerce',
    product_id: product.id,
    product_name: product.name || product.title,
    product_price: product.price,
    quantity: quantity,
    currency: 'BGN',
  })

  // GA4 E-commerce
  if (isGAInitialized) {
    ReactGA.event('add_to_cart', {
      currency: 'BGN',
      value: product.price * quantity,
      items: [{
        item_id: product.id,
        item_name: product.name || product.title,
        price: product.price,
        quantity: quantity,
      }],
    })
  }
}

// E-commerce: Remove from Cart
export const trackRemoveFromCart = (product, quantity = 1) => {
  trackEvent('Product Removed from Cart', {
    category: 'E-commerce',
    product_id: product.id,
    product_name: product.name || product.title,
    quantity: quantity,
  })

  // GA4 E-commerce
  if (isGAInitialized) {
    ReactGA.event('remove_from_cart', {
      currency: 'BGN',
      value: product.price * quantity,
      items: [{
        item_id: product.id,
        item_name: product.name || product.title,
        price: product.price,
        quantity: quantity,
      }],
    })
  }
}

// E-commerce: Begin Checkout
export const trackBeginCheckout = (cart) => {
  const totalValue = cart.total || 0
  const items = cart.items || []

  trackEvent('Checkout Started', {
    category: 'E-commerce',
    cart_value: totalValue,
    item_count: items.length,
    currency: 'BGN',
  })

  // GA4 E-commerce
  if (isGAInitialized) {
    ReactGA.event('begin_checkout', {
      currency: 'BGN',
      value: totalValue,
      items: items.map(item => ({
        item_id: item.id || item.product_id,
        item_name: item.title || item.name,
        price: item.unit_price || item.price,
        quantity: item.quantity,
      })),
    })
  }
}

// E-commerce: Purchase
export const trackPurchase = (order) => {
  const totalValue = order.total || 0
  const items = order.items || []

  trackEvent('Purchase Completed', {
    category: 'E-commerce',
    transaction_id: order.id,
    order_value: totalValue,
    item_count: items.length,
    currency: 'BGN',
  })

  // GA4 E-commerce
  if (isGAInitialized) {
    ReactGA.event('purchase', {
      transaction_id: order.id,
      currency: 'BGN',
      value: totalValue,
      tax: order.tax_total || 0,
      shipping: order.shipping_total || 0,
      items: items.map(item => ({
        item_id: item.id || item.product_id,
        item_name: item.title || item.name,
        price: item.unit_price || item.price,
        quantity: item.quantity,
      })),
    })
  }
}

// User Authentication
export const trackUserLogin = (method = 'email') => {
  trackEvent('User Login', {
    category: 'Authentication',
    method: method,
  })

  if (isGAInitialized) {
    ReactGA.event('login', { method })
  }
}

export const trackUserSignup = (method = 'email') => {
  trackEvent('User Signup', {
    category: 'Authentication',
    method: method,
  })

  if (isGAInitialized) {
    ReactGA.event('sign_up', { method })
  }
}

// User Identification (Mixpanel)
export const identifyUser = (userId, userProperties = {}) => {
  if (typeof window === 'undefined') return

  if (isMixpanelInitialized) {
    mixpanel.identify(userId)
    if (Object.keys(userProperties).length > 0) {
      mixpanel.people.set(userProperties)
    }
  }

  // GA4 User ID
  if (isGAInitialized) {
    ReactGA.set({ userId })
  }
}

// Contact Form Submission
export const trackContactForm = (formType = 'contact') => {
  trackEvent('Contact Form Submitted', {
    category: 'Lead Generation',
    form_type: formType,
  })
}

// Search
export const trackSearch = (searchTerm, resultCount = 0) => {
  trackEvent('Search', {
    category: 'Engagement',
    search_term: searchTerm,
    result_count: resultCount,
  })

  if (isGAInitialized) {
    ReactGA.event('search', {
      search_term: searchTerm,
    })
  }
}

// Social Share
export const trackSocialShare = (platform, contentType = 'product') => {
  trackEvent('Social Share', {
    category: 'Social',
    platform: platform,
    content_type: contentType,
  })

  if (isGAInitialized) {
    ReactGA.event('share', {
      method: platform,
      content_type: contentType,
    })
  }
}

// Order Annulment
export const trackOrderAnnulment = (orderId, reason) => {
  trackEvent('Order Annulled', {
    category: 'E-commerce',
    order_id: orderId,
    reason: reason,
  })
}

// Export Mixpanel instance for advanced usage
export { mixpanel }
