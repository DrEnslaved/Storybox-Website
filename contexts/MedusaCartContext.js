'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react'

const CartContext = createContext({})

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const initRef = useRef(false)

  // Initialize cart only once
  useEffect(() => {
    if (initRef.current) return
    initRef.current = true
    
    const init = async () => {
      try {
        const savedCartId = localStorage.getItem('medusa_cart_id')
        
        if (savedCartId) {
          // Try to fetch existing cart
          const res = await fetch(`/api/cart/${savedCartId}`)
          if (res.ok) {
            const { cart: fetchedCart } = await res.json()
            setCart(fetchedCart)
            setLoading(false)
            return
          }
        }
        
        // Create new cart if no valid one exists
        const res = await fetch('/api/cart', { method: 'POST' })
        if (res.ok) {
          const { cart: newCart } = await res.json()
          setCart(newCart)
          localStorage.setItem('medusa_cart_id', newCart.id)
        }
      } catch (error) {
        console.error('Cart init error:', error)
      } finally {
        setLoading(false)
      }
    }
    
    init()
  }, [])

  const addToCart = async (variantId, quantity = 1) => {
    try {
      const cartId = cart?.id || localStorage.getItem('medusa_cart_id')
      if (!cartId) {
        console.error('No cart available')
        return { success: false, error: 'No cart' }
      }
      
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
      localStorage.removeItem('medusa_cart_id')
      const res = await fetch('/api/cart', { method: 'POST' })
      if (res.ok) {
        const { cart: newCart } = await res.json()
        setCart(newCart)
        localStorage.setItem('medusa_cart_id', newCart.id)
      }
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
