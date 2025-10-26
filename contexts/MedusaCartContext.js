'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext({})

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null) // Medusa cart object
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [initialized, setInitialized] = useState(false)

  // Debug: Log cart changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('🛒 Cart updated:', cart?.id, 'Items:', cart?.items?.length || 0)
    }
  }, [cart])

  // Initialize cart on mount
  useEffect(() => {
    if (!initialized && typeof window !== 'undefined') {
      setInitialized(true)
      initializeCart()
    }
  }, [initialized])

  const initializeCart = async () => {
    console.log('🛒 Initializing cart...')
    try {
      // Check if we have a cart ID in localStorage
      const savedCartId = localStorage.getItem('medusa_cart_id')
      console.log('📦 Saved cart ID:', savedCartId)
      
      if (savedCartId) {
        console.log('🔍 Fetching existing cart...')
        // Try to retrieve the existing cart
        const response = await fetch(`/api/cart/${savedCartId}`)
        console.log('📡 Cart fetch response:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('✅ Cart loaded:', data.cart?.id, 'Items:', data.cart?.items?.length)
          setCart(data.cart)
          setLoading(false)
          return
        } else {
          console.log('⚠️ Cart not found, creating new...')
        }
      }
      
      // Create a new cart if no valid cart exists
      await createNewCart()
    } catch (error) {
      console.error('❌ Error initializing cart:', error)
      setLoading(false)
    }
  }

  const createNewCart = async () => {
    console.log('🆕 Creating new cart...')
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ New cart created:', data.cart?.id)
        setCart(data.cart)
        localStorage.setItem('medusa_cart_id', data.cart.id)
      } else {
        console.error('❌ Failed to create cart:', response.status)
      }
    } catch (error) {
      console.error('❌ Error creating cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (variantId, quantity = 1) => {
    try {
      // Ensure we have a cart
      if (!cart) {
        await createNewCart()
      }

      const cartId = cart?.id || localStorage.getItem('medusa_cart_id')
      
      const response = await fetch(`/api/cart/${cartId}/line-items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variant_id: variantId, quantity })
      })

      if (response.ok) {
        const data = await response.json()
        setCart(data.cart)
        setIsOpen(true)
        return { success: true }
      }
      
      return { success: false, error: 'Failed to add item' }
    } catch (error) {
      console.error('Error adding to cart:', error)
      return { success: false, error: error.message }
    }
  }

  const removeFromCart = async (lineItemId) => {
    try {
      const cartId = cart?.id
      if (!cartId) return

      const response = await fetch(`/api/cart/${cartId}/line-items/${lineItemId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        const data = await response.json()
        setCart(data.cart)
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
    }
  }

  const updateQuantity = async (lineItemId, quantity) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(lineItemId)
        return
      }

      const cartId = cart?.id
      if (!cartId) return

      const response = await fetch(`/api/cart/${cartId}/line-items/${lineItemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity })
      })

      if (response.ok) {
        const data = await response.json()
        setCart(data.cart)
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
    }
  }

  const clearCart = async () => {
    try {
      // Create a new cart (effectively clearing the old one)
      localStorage.removeItem('medusa_cart_id')
      await createNewCart()
    } catch (error) {
      console.error('Error clearing cart:', error)
    }
  }

  const getTotal = () => {
    if (!cart?.items) return 0
    // Medusa stores amounts in cents
    return (cart.total || 0) / 100
  }

  const getSubtotal = () => {
    if (!cart?.items) return 0
    return (cart.subtotal || 0) / 100
  }

  const getTax = () => {
    if (!cart?.items) return 0
    return (cart.tax_total || 0) / 100
  }

  const getItemCount = () => {
    if (!cart?.items) return 0
    return cart.items.reduce((count, item) => count + item.quantity, 0)
  }

  const refreshCart = async () => {
    const cartId = cart?.id || localStorage.getItem('medusa_cart_id')
    if (!cartId) return

    try {
      const response = await fetch(`/api/cart/${cartId}`)
      if (response.ok) {
        const data = await response.json()
        setCart(data.cart)
      }
    } catch (error) {
      console.error('Error refreshing cart:', error)
    }
  }

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotal,
      getSubtotal,
      getTax,
      getItemCount,
      refreshCart,
      isOpen,
      setIsOpen
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
