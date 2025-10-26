'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext({})

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  // Initialize cart from localStorage on mount
  useEffect(() => {
    initializeCart()
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('storybox_cart', JSON.stringify(cart))
    }
  }, [cart, loading])

  const initializeCart = () => {
    try {
      const savedCart = localStorage.getItem('storybox_cart')
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error('Error loading cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (product, quantity = 1) => {
    try {
      // Check if item already exists in cart
      const existingItemIndex = cart.items.findIndex(
        item => item.id === product.id || item.variant_id === product.variant_id
      )

      let updatedItems
      if (existingItemIndex > -1) {
        // Update quantity of existing item
        updatedItems = [...cart.items]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        }
      } else {
        // Add new item
        const cartItem = {
          id: product.id || product.variant_id,
          variant_id: product.variant_id || product.id,
          title: product.title || product.name,
          description: product.description,
          thumbnail: product.thumbnail || product.image,
          quantity: quantity,
          unit_price: product.price || product.unit_price || 0,
          subtotal: (product.price || product.unit_price || 0) * quantity,
          product: product
        }
        updatedItems = [...cart.items, cartItem]
      }

      // Calculate new total
      const newTotal = updatedItems.reduce((sum, item) => {
        return sum + (item.unit_price * item.quantity)
      }, 0)

      setCart({
        items: updatedItems,
        total: newTotal,
        subtotal: newTotal,
        tax_total: 0,
        shipping_total: 0
      })

      setIsOpen(true)
      return { success: true, message: 'Продуктът е добавен в количката' }
    } catch (error) {
      console.error('Error adding to cart:', error)
      return { success: false, message: 'Грешка при добавяне в количката' }
    }
  }

  const removeFromCart = async (itemId) => {
    try {
      const updatedItems = cart.items.filter(item => 
        item.id !== itemId && item.variant_id !== itemId
      )

      const newTotal = updatedItems.reduce((sum, item) => {
        return sum + (item.unit_price * item.quantity)
      }, 0)

      setCart({
        items: updatedItems,
        total: newTotal,
        subtotal: newTotal,
        tax_total: 0,
        shipping_total: 0
      })

      return { success: true }
    } catch (error) {
      console.error('Error removing from cart:', error)
      return { success: false }
    }
  }

  const updateQuantity = async (itemId, quantity) => {
    try {
      if (quantity <= 0) {
        return removeFromCart(itemId)
      }

      const updatedItems = cart.items.map(item => {
        if (item.id === itemId || item.variant_id === itemId) {
          return {
            ...item,
            quantity: quantity,
            subtotal: item.unit_price * quantity
          }
        }
        return item
      })

      const newTotal = updatedItems.reduce((sum, item) => {
        return sum + (item.unit_price * item.quantity)
      }, 0)

      setCart({
        items: updatedItems,
        total: newTotal,
        subtotal: newTotal,
        tax_total: 0,
        shipping_total: 0
      })

      return { success: true }
    } catch (error) {
      console.error('Error updating quantity:', error)
      return { success: false }
    }
  }

  const clearCart = () => {
    setCart({ items: [], total: 0 })
    localStorage.removeItem('storybox_cart')
  }

  const getItemCount = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    cart,
    loading,
    isOpen,
    setIsOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemCount,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
