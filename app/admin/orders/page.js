'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShoppingBag, Search, ArrowLeft, Loader2, Eye, Filter, X, Package, Edit2, Save } from 'lucide-react'

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [totalOrders, setTotalOrders] = useState(0)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [editingStatus, setEditingStatus] = useState(null)
  const [newStatus, setNewStatus] = useState('')
  const [adminNotes, setAdminNotes] = useState('')

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
    setNewStatus(order.status)
    setAdminNotes(order.adminNotes || '')
    setShowOrderModal(true)
  }

  const handleUpdateStatus = async (orderId, status) => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    setUpdatingStatus(true)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, notes: adminNotes })
      })

      if (response.ok) {
        // Update local state
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status, adminNotes } : order
        ))
        
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status, adminNotes })
        }
        
        setEditingStatus(null)
        alert('Статусът беше обновен успешно')
      } else {
        alert('Грешка при обновяване на статуса')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Грешка при обновяване на статуса')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const filteredOrders = orders.filter(order =>
    order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.shippingAddress?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items?.some(item => item.sku?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      annulled: 'bg-gray-100 text-gray-800',
      backorder_pending: 'bg-orange-100 text-orange-800'
    }
    return badges[status] || badges.pending
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'Чакаща',
      processing: 'В процес',
      shipped: 'Изпратена',
      delivered: 'Доставена',
      cancelled: 'Отменена',
      annulled: 'Анулирана',
      backorder_pending: 'Предварителна поръчка'
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
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Търсене по ID, потребител, SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green"
              >
                <option value="all">Всички статуси</option>
                <option value="pending">Чакащи</option>
                <option value="processing">В процес</option>
                <option value="shipped">Изпратени</option>
                <option value="delivered">Доставени</option>
                <option value="backorder_pending">Предварителни поръчки</option>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Клиент</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Продукти (SKU)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Сума</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Действия</th>
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
                          <div className="text-sm font-mono text-gray-900">
                            #{order.id?.substring(0, 8)}...
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.shippingAddress?.name || order.userId}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.shippingAddress?.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {Array.isArray(order.items) && order.items.length > 0 ? (
                              order.items.map((item, idx) => (
                                <div key={idx} className="mb-1">
                                  <span className="font-medium">{item.title || item.name || 'Product'}</span>
                                  {item.sku && (
                                    <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                                      SKU: {item.sku}
                                    </span>
                                  )}
                                  <span className="text-gray-500 ml-2">x{item.quantity || 1}</span>
                                </div>
                              ))
                            ) : (
                              <span className="text-gray-500 italic">Няма продукти</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {order.total?.toFixed(2) || '0.00'} лв
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingStatus === order.id ? (
                            <div className="flex items-center gap-2">
                              <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="text-xs border rounded px-2 py-1"
                                disabled={updatingStatus}
                              >
                                <option value="pending">Чакаща</option>
                                <option value="processing">В процес</option>
                                <option value="shipped">Изпратена</option>
                                <option value="delivered">Доставена</option>
                                <option value="backorder_pending">Предварителна</option>
                                <option value="cancelled">Отменена</option>
                                <option value="annulled">Анулирана</option>
                              </select>
                              <button
                                onClick={() => handleUpdateStatus(order.id, newStatus)}
                                disabled={updatingStatus}
                                className="text-green-600 hover:text-green-800"
                              >
                                <Save size={16} />
                              </button>
                              <button
                                onClick={() => setEditingStatus(null)}
                                className="text-gray-600 hover:text-gray-800"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                                {getStatusText(order.status)}
                              </span>
                              <button
                                onClick={() => {
                                  setEditingStatus(order.id)
                                  setNewStatus(order.status)
                                }}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <Edit2 size={14} />
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('bg-BG')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="text-brand-green hover:text-green-700"
                          >
                            <Eye size={18} />
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Детайли на поръчка #{selectedOrder.id?.substring(0, 8)}
              </h2>
              <button
                onClick={() => setShowOrderModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Update */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-bold text-gray-900 mb-3">Промяна на статус</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="pending">Чакаща</option>
                      <option value="processing">В процес</option>
                      <option value="shipped">Изпратена</option>
                      <option value="delivered">Доставена</option>
                      <option value="backorder_pending">Предварителна поръчка</option>
                      <option value="cancelled">Отменена</option>
                      <option value="annulled">Анулирана</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Бележки</label>
                    <input
                      type="text"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Добави бележки..."
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, newStatus)}
                  disabled={updatingStatus}
                  className="mt-3 w-full bg-brand-green text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
                >
                  {updatingStatus ? 'Обновяване...' : 'Обнови статус'}
                </button>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Информация за клиента</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Име</p>
                    <p className="font-medium">{selectedOrder.shippingAddress?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedOrder.shippingAddress?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Телефон</p>
                    <p className="font-medium">{selectedOrder.shippingAddress?.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Адрес</p>
                    <p className="font-medium">
                      {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}
                    </p>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Продукти</h3>
                <div className="border rounded-lg divide-y">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="p-4 flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.title || item.name}</p>
                        {item.sku && (
                          <p className="text-sm text-gray-600">
                            SKU: <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{item.sku}</span>
                          </p>
                        )}
                        {item.variant_title && (
                          <p className="text-sm text-gray-500">Вариант: {item.variant_title}</p>
                        )}
                        <p className="text-sm text-gray-500">Количество: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{item.price?.toFixed(2)} лв</p>
                        <p className="text-sm text-gray-500">
                          Общо: {(item.price * item.quantity).toFixed(2)} лв
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Обща сума:</span>
                  <span className="text-brand-green">{selectedOrder.total?.toFixed(2)} лв</span>
                </div>
              </div>

              {/* Admin Notes */}
              {selectedOrder.adminNotes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-yellow-800">Бележки от админ:</p>
                  <p className="text-sm text-yellow-700 mt-1">{selectedOrder.adminNotes}</p>
                </div>
              )}

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <p>Създадена на:</p>
                  <p className="font-medium">{new Date(selectedOrder.createdAt).toLocaleString('bg-BG')}</p>
                </div>
                {selectedOrder.updatedAt && (
                  <div>
                    <p>Обновена на:</p>
                    <p className="font-medium">{new Date(selectedOrder.updatedAt).toLocaleString('bg-BG')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
