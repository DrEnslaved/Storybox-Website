'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Search, ArrowLeft, Loader2, Eye, Filter, Calendar } from 'lucide-react'

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [totalOrders, setTotalOrders] = useState(0)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchOrders(token)
  }, [statusFilter])

  const fetchOrders = async (token) => {
    setLoading(true)
    try {
      const url = statusFilter === 'all' 
        ? '/api/admin/orders'
        : `/api/admin/orders?status=${statusFilter}`
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
        setTotalOrders(data.total)
      } else if (response.status === 401) {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowOrderModal(true)
  }

  const handleAnnulOrder = async (orderId) => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    if (!confirm('Сигурни ли сте, че искате да анулирате тази поръчка?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/annul`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        // Update the order status in the local state
        setOrders(orders.map(order => 
          order.id === orderId 
            ? { ...order, status: 'annulled' }
            : order
        ))
        
        // Update selected order if it's the one being annulled
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: 'annulled' })
        }
        
        alert('Поръчката беше успешно анулирана')
      } else if (response.status === 401) {
        router.push('/admin/login')
      } else {
        alert('Грешка при анулиране на поръчката')
      }
    } catch (error) {
      console.error('Error annulling order:', error)
      alert('Грешка при анулиране на поръчката')
    }
  }

  const filteredOrders = orders.filter(order =>
    order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.shippingAddress?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      annulled: 'bg-gray-100 text-gray-800'
    }
    return badges[status] || badges.pending
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'Чакаща',
      processing: 'В процес',
      completed: 'Завършена',
      cancelled: 'Отменена',
      annulled: 'Анулирана'
    }
    return texts[status] || status
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin/dashboard"
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft size={24} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Управление на поръчки</h1>
                <p className="text-sm text-gray-600">Общо: {totalOrders} поръчки</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Търсене по ID, потребител..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent appearance-none"
              >
                <option value="all">Всички статуси</option>
                <option value="pending">Чакащи</option>
                <option value="processing">В процес</option>
                <option value="completed">Завършени</option>
                <option value="cancelled">Отменени</option>
                <option value="annulled">Анулирани</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="animate-spin text-brand-green" size={48} />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID Поръчка
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Клиент
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Стоки
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Обща сума
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        <ShoppingBag className="mx-auto mb-2 text-gray-400" size={48} />
                        <p>Няма намерени поръчки</p>
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            #{order.id?.substring(0, 8)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.shippingAddress?.name || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.shippingAddress?.email || ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.items?.length || 0} артикула
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {(order.total || 0).toFixed(2)} лв
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('bg-BG') : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="text-brand-green hover:text-green-700 inline-flex items-center gap-1"
                          >
                            <Eye size={18} />
                            <span>Преглед</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Order Details Modal */}
      {showOrderModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 my-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Поръчка #{selectedOrder.id?.substring(0, 8)}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString('bg-BG') : ''}
                </p>
              </div>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Status */}
            <div className="mb-6">
              <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusBadge(selectedOrder.status)}`}>
                {getStatusText(selectedOrder.status)}
              </span>
            </div>

            {/* Customer Info */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Информация за клиента</h4>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <p className="text-sm"><span className="font-medium">Име:</span> {selectedOrder.shippingAddress?.name}</p>
                <p className="text-sm"><span className="font-medium">Email:</span> {selectedOrder.shippingAddress?.email}</p>
                <p className="text-sm"><span className="font-medium">Телефон:</span> {selectedOrder.shippingAddress?.phone}</p>
                <p className="text-sm"><span className="font-medium">Адрес:</span> {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
                {selectedOrder.notes && (
                  <p className="text-sm"><span className="font-medium">Бележки:</span> {selectedOrder.notes}</p>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Поръчани артикули</h4>
              <div className="border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Продукт</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Цена</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Количество</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Общо</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedOrder.items?.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.title || item.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{(item.unit_price || item.price || 0).toFixed(2)} лв</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 text-right">{(item.subtotal || (item.unit_price || item.price || 0) * item.quantity).toFixed(2)} лв</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Обща сума:</span>
                <span className="text-2xl font-bold text-brand-green">{(selectedOrder.total || 0).toFixed(2)} лв</span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowOrderModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Затвори
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}