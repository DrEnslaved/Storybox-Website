'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const { register, loading } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Паролите не съвпадат')
      return
    }

    if (password.length < 6) {
      setError('Паролата трябва да е поне 6 символа')
      return
    }

    setIsSubmitting(true)
    const result = await register(name, email, password)
    if (result.success) {
      router.push('/account')
    } else {
      setError(result.error)
    }
    setIsSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Зареждане...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Регистрация</h2>

          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Име и фамилия
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Имейл
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Парола
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Потвърдете парола
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-green hover:bg-brand-green-dark text-white px-4 py-3 rounded-md font-semibold transition-colors disabled:bg-gray-400"
            >
              {isSubmitting ? 'Регистрация...' : 'Регистрирай се'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Вече имате профил?{' '}
              <Link href="/login" className="text-brand-green hover:text-brand-green-dark font-semibold">
                Влезте
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}