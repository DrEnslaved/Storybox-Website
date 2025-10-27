'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Simplified auth - just store user in localStorage
  // For checkout, we only need email
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem('user')
      }
    }
  }, [])

  const loginWithPassword = async (email, password) => {
    // Simplified login - just save email for checkout
    // Real auth is handled by Medusa for orders
    const mockUser = { email, name: email.split('@')[0] }
    setUser(mockUser)
    localStorage.setItem('user', JSON.stringify(mockUser))
    return { success: true }
  }

  const register = async (email, password, name) => {
    // Simplified registration
    const mockUser = { email, name: name || email.split('@')[0] }
    setUser(mockUser)
    localStorage.setItem('user', JSON.stringify(mockUser))
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    router.push('/')
  }

  const value = {
    user,
    loading,
    loginWithPassword,
    register,
    logout,
    loginWithGoogle: () => {}, // Disabled for now
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const loginWithGoogle = () => {
    const redirectUrl = `${window.location.origin}/account`
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`
  }

  const loginWithPassword = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      if (response.ok) {
        await checkAuth()
        return { success: true }
      } else {
        const error = await response.json()
        return { success: false, error: error.error }
      }
    } catch (error) {
      return { success: false, error: 'Грешка при вход' }
    }
  }

  const register = async (name, email, password) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      if (response.ok) {
        await checkAuth()
        return { success: true }
      } else {
        const error = await response.json()
        return { success: false, error: error.error }
      }
    } catch (error) {
      return { success: false, error: 'Грешка при регистрация' }
    }
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithPassword, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}