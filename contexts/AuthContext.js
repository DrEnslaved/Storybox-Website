'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    processGoogleCallback()
  }, [])

  const processGoogleCallback = async () => {
    const hash = window.location.hash
    if (hash && hash.includes('session_id')) {
      const sessionId = hash.split('session_id=')[1]?.split('&')[0]
      if (sessionId) {
        setLoading(true)
        try {
          const response = await fetch('https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data', {
            headers: {
              'X-Session-ID': sessionId
            }
          })
          
          if (response.ok) {
            const data = await response.json()
            await fetch('/api/auth/google-callback', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data)
            })
            
            window.location.hash = ''
            await checkAuth()
            router.push('/account')
          }
        } catch (error) {
          console.error('Google auth error:', error)
        } finally {
          setLoading(false)
        }
      }
    }
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