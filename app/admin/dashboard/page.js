'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Users, ShoppingBag, FileText, TrendingUp, LogOut, ExternalLink, Package } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [admin, setAdmin] = useState(null)
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    revenue: 0
  })

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    const adminData = localStorage.getItem('admin_user')
    
    if (!token || !adminData) {
      router.push('/admin/login')
      return
    }

    setAdmin(JSON.parse(adminData))
    fetchStats(token)
  }, [])

  const fetchStats = async (token) => {
    try {
      // Fetch user count
      const usersRes = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setStats(prev => ({ ...prev, users: usersData.users.length }))
      }

      // Fetch orders
      const ordersRes = await fetch('/api/admin/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        
        // Only count completed orders (delivered, shipped, processing)
        // Exclude: pending, cancelled, annulled, backorder_pending
        const completedStatuses = ['delivered', 'shipped', 'processing']
        const completedOrders = ordersData.orders.filter(order => 
          completedStatuses.includes(order.status)
        )
        
        setStats(prev => ({ 
          ...prev, 
          orders: completedOrders.length,
          revenue: completedOrders.reduce((sum, order) => sum + (order.total || 0), 0)
        }))
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    router.push('/admin/login')
  }

  if (!admin) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {admin.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} />
              Изход
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Общо потребители</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.users}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Общо поръчки</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.orders}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ShoppingBag className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Общ приход</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.revenue.toFixed(2)} лв</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Management Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/admin/users"
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
          >
            <Users className="text-brand-green mb-3" size={32} />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Потребители</h3>
            <p className="text-sm text-gray-600">Управление на потребители и роли</p>
          </Link>

          <Link
            href="/admin/orders"
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
          >
            <ShoppingBag className="text-brand-green mb-3" size={32} />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Поръчки</h3>
            <p className="text-sm text-gray-600">Преглед и управление на поръчки</p>
          </Link>

          <Link
            href="/admin/products"
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
          >
            <Package className="text-brand-green mb-3" size={32} />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Продукти</h3>
            <p className="text-sm text-gray-600">Инвентар и SKU управление</p>
          </Link>

          <a
            href="https://sanity.io/manage"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <FileText className="text-brand-green" size={32} />
              <ExternalLink size={16} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Съдържание</h3>
            <p className="text-sm text-gray-600">Blog, Projects, Services (Sanity CMS)</p>
          </a>
        </div>

        {/* Quick Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">ℹ️ Информация</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• <strong>Продукти:</strong> Управлявайте чрез Sanity CMS</li>
            <li>• <strong>Blog & Projects:</strong> Достъп чрез Sanity Studio</li>
            <li>• <strong>Аналитика:</strong> Google Analytics 4 + Mixpanel</li>
            <li>• <strong>Сигурност:</strong> JWT токени с 8 часа валидност</li>
          </ul>
        </div>
      </main>
    </div>
  )
}