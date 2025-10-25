// lib/medusa-client.js - Medusa API Client for Next.js
import Medusa from "@medusajs/js-sdk"

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9000'

// Initialize Medusa client
export const medusaClient = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === 'development',
  // publishableApiKey will be set later when available
})

// Helper functions for product fetching
export async function getAllProducts(params = {}) {
  try {
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      // Fallback: try admin endpoint (temporary until publishable key is set up)
      return await getProductsViaAdmin(params)
    }
    
    const data = await response.json()
    return data.products || []
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function getProductByHandle(handle) {
  try {
    const products = await getAllProducts()
    return products.find(p => p.handle === handle)
  } catch (error) {
    console.error('Error fetching product by handle:', error)
    return null
  }
}

export async function getProductById(id) {
  try {
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error('Product not found')
    }
    
    const data = await response.json()
    return data.product
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

// Temporary admin-based fetch (will be replaced with proper publishable key)
async function getProductsViaAdmin(params = {}) {
  try {
    // This is a backend-only call, we'll proxy through our API
    const response = await fetch('/api/medusa-proxy?endpoint=products', {
      method: 'GET',
    })
    
    if (!response.ok) {
      return []
    }
    
    const data = await response.json()
    return data.products || []
  } catch (error) {
    console.error('Error fetching products via admin:', error)
    return []
  }
}

// Cart management functions
export async function createCart(region_id = 'reg_01K8EFA3PT2R7FCEA5RJ2J6B1G') {
  try {
    const response = await medusaClient.store.cart.create({
      region_id,
    })
    return response.cart
  } catch (error) {
    console.error('Error creating cart:', error)
    return null
  }
}

export async function addToCart(cartId, variantId, quantity = 1) {
  try {
    const response = await medusaClient.store.cart.lineItems.create(cartId, {
      variant_id: variantId,
      quantity,
    })
    return response.cart
  } catch (error) {
    console.error('Error adding to cart:', error)
    return null
  }
}

export async function getCart(cartId) {
  try {
    const response = await medusaClient.store.cart.retrieve(cartId)
    return response.cart
  } catch (error) {
    console.error('Error fetching cart:', error)
    return null
  }
}

export async function updateLineItem(cartId, lineItemId, quantity) {
  try {
    const response = await medusaClient.store.cart.lineItems.update(
      cartId,
      lineItemId,
      { quantity }
    )
    return response.cart
  } catch (error) {
    console.error('Error updating line item:', error)
    return null
  }
}

export async function deleteLineItem(cartId, lineItemId) {
  try {
    const response = await medusaClient.store.cart.lineItems.delete(
      cartId,
      lineItemId
    )
    return response.cart
  } catch (error) {
    console.error('Error deleting line item:', error)
    return null
  }
}

// Region and currency helpers
export async function getRegions() {
  try {
    const response = await medusaClient.store.region.list()
    return response.regions || []
  } catch (error) {
    console.error('Error fetching regions:', error)
    return []
  }
}
