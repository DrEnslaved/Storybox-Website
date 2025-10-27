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
