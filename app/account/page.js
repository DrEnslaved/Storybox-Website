'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { User, Package, Settings, LogOut } from 'lucide-react'

export default function AccountPage() {
  const router = useRouter()
  const { user, logout, loading } = useAuth()
  const [recentOrders, setRecentOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (user) {
      fetchRecentOrders()
    }
  }, [user, loading, router])

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setRecentOrders(data.orders.slice(0, 3))
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoadingOrders(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Зареждане...</div>
      </div>
    )
  }

  const getStatusBadge = (status) => {
    const badges = {
      pending_payment: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Чака плащане' },
      processing: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Обработва се' },
      completed: { bg: 'bg-brand-green', text: 'text-white', label: 'Завършена' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', label: 'Отказана' }
    }
    const badge = badges[status] || badges.pending_payment
    return (
      <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs font-semibold`}>
        {badge.label}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Моят акаунт</h1>
          <p className="text-gray-600">Добре дошли, {user.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 bg-brand-green rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-bold text-lg text-center">{user.name}</h3>
                <p className="text-sm text-gray-600 text-center break-all">{user.email}</p>
                <div className="mt-2">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {user.priceTier === 'standard' && 'Стандартен'}
                    {user.priceTier === 'premium' && 'Премиум'}
                    {user.priceTier === 'vip' && 'VIP'}
                  </span>
                </div>
              </div>

              <nav className="space-y-2">
                <Link
                  href="/account"
                  className="flex items-center gap-3 px-4 py-3 bg-brand-green text-white rounded-lg font-semibold"
                >
                  <User size={20} />
                  Преглед
                </Link>
                <Link
                  href="/account/orders"
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold transition-colors"
                >
                  <Package size={20} />
                  Поръчки
                </Link>
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-semibold transition-colors"
                >
                  <LogOut size={20} />
                  Изход
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <Package className="text-brand-green mb-3" size={32} />
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {recentOrders.length}
                </div>
                <div className="text-gray-600">Последни поръчки</div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <Settings className="text-brand-green mb-3" size={32} />
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {user.priceTier === 'vip' ? 'VIP' : user.priceTier === 'premium' ? 'Премиум' : 'Стандарт'}
                </div>
                <div className="text-gray-600">Ценова група</div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <User className="text-brand-green mb-3" size={32} />
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  Активен
                </div>
                <div className="text-gray-600">Статус на акаунта</div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Последни поръчки</h2>
                <Link
                  href="/account/orders"
                  className="text-brand-green hover:text-brand-green-dark font-semibold"
                >
                  Виж всички →
                </Link>
              </div>

              {loadingOrders ? (
                <div className="text-center py-8 text-gray-600">Зареждане...</div>
              ) : recentOrders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-gray-600 mb-4">Нямате поръчки все още</p>
                  <Link
                    href="/shop"
                    className="inline-block bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    Разгледай продукти
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-lg p-4 hover:border-brand-green transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                        <div>
                          <div className="font-semibold text-gray-900">
                            Поръчка #{order.id.substring(0, 8)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString('bg-BG')}
                          </div>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="text-sm text-gray-600">
                          {order.items?.length || 0} продукта
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-brand-green font-bold text-lg">
                            {order.total?.toFixed(2)} лв
                          </div>
                          <Link
                            href={`/account/orders`}
                            className="text-brand-green hover:text-brand-green-dark font-semibold text-sm"
                          >
                            Детайли →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Бързи действия</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/shop"
                  className="border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white px-6 py-4 rounded-lg font-semibold transition-colors text-center"
                >
                  Пазарувай
                </Link>
                <Link
                  href="/contact"
                  className="border-2 border-gray-300 text-gray-700 hover:bg-gray-100 px-6 py-4 rounded-lg font-semibold transition-colors text-center"
                >
                  Свържи се с нас
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}