'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Package, User, LogOut, FileText, XCircle, Loader2 } from 'lucide-react'

export default function OrdersPage() {
  const router = useRouter()
  const { user, logout, loading } = useAuth()
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [cancellingOrder, setCancellingOrder] = useState(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (user) {
      fetchOrders()
    }
  }, [user, loading, router])

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Моите поръчки</h1>
          <p className="text-gray-600">Преглед на всички ваши поръчки</p>
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
              </div>

              <nav className="space-y-2">
                <Link
                  href="/account"
                  className="flex items-center gap-3 px-4 py-3 text-gray-brand hover:bg-gray-100 rounded-lg font-semibold transition-colors"
                >
                  <User size={20} />
                  Преглед
                </Link>
                <Link
                  href="/account/orders"
                  className="flex items-center gap-3 px-4 py-3 bg-brand-green text-white rounded-lg font-semibold"
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

          {/* Orders List */}
          <div className="md:col-span-3">
            {loadingOrders ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <div className="text-gray-600">Зареждане...</div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Package className="mx-auto mb-4 text-gray-400" size={64} />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Нямате поръчки</h2>
                <p className="text-gray-600 mb-6">
                  Започнете пазаруване от нашия магазин
                </p>
                <Link
                  href="/shop"
                  className="inline-block bg-brand-green hover:bg-brand-green-dark text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold transition-colors"
                >
                  Разгледай продукти
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 pb-4 border-b">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            Поръчка #{order.id.substring(0, 8)}
                          </h3>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Дата: {new Date(order.createdAt).toLocaleDateString('bg-BG', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-brand-green">
                          {order.total.toFixed(2)} лв
                        </div>
                        <div className="text-sm text-gray-600">
                          {order.items?.length || 0} продукта
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="mb-4">
                      <div className="space-y-2">
                        {order.items && Array.isArray(order.items) ? (
                          order.items.map((item, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center text-sm"
                            >
                              <span className="text-gray-700">
                                {item.name || item.title} <span className="text-gray-500">x{item.quantity}</span>
                              </span>
                              <span className="font-semibold text-gray-900">
                                {((item.price || item.unit_price / 100 || 0) * item.quantity).toFixed(2)} лв
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-sm text-gray-500">Няма информация за продуктите</div>
                        )}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="mb-4 text-sm text-gray-600">
                      <div className="font-semibold text-gray-900 mb-1">Адрес за доставка:</div>
                      {order.shippingAddress.fullName}, {order.shippingAddress.city}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href={`/order-confirmation/${order.id}`}
                        className="flex items-center justify-center gap-2 bg-brand-green hover:bg-brand-green-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                      >
                        <FileText size={16} />
                        Виж детайли
                      </Link>
                      {order.status === 'pending_payment' && (
                        <button className="flex items-center justify-center gap-2 border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                          Платете сега
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}