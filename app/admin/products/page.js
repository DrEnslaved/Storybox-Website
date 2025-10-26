'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Package, Search, Edit, Trash2, Plus, ArrowLeft, Loader2, AlertTriangle } from 'lucide-react'

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState({ totalProducts: 0, totalQuantity: 0, lowStockCount: 0 })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingProduct, setEditingProduct] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    quantity: 0,
    price: 0,
    category: '',
    status: 'active'
  })

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchProducts(token)
  }, [])

  const fetchProducts = async (token) => {
    try {
      const response = await fetch('/api/admin/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products)
        setStats(data.stats)
      } else if (response.status === 401) {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct({ ...product })
    setShowEditModal(true)
  }

  const handleUpdate = async () => {
    const token = localStorage.getItem('admin_token')
    try {
      const response = await fetch(`/api/admin/products/${editingProduct.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingProduct)
      })

      if (response.ok) {
        setShowEditModal(false)
        fetchProducts(token)
        alert('Продуктът е обновен успешно')
      } else {
        alert('Грешка при обновяване')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Грешка при обновяване')
    }
  }

  const handleAdd = async () => {
    const token = localStorage.getItem('admin_token')
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProduct)
      })

      if (response.ok) {
        setShowAddModal(false)
        setNewProduct({ name: '', sku: '', quantity: 0, price: 0, category: '', status: 'active' })
        fetchProducts(token)
        alert('Продуктът е добавен успешно')
      } else {
        alert('Грешка при добавяне')
      }
    } catch (error) {
      console.error('Error adding product:', error)
      alert('Грешка при добавяне')
    }
  }

  const handleDelete = async (productId, productName) => {
    if (!confirm(`Сигурни ли сте, че искате да изтриете ${productName}?`)) return

    const token = localStorage.getItem('admin_token')
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        fetchProducts(token)
        alert('Продуктът е изтрит успешно')
      } else {
        alert('Грешка при изтриване')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Грешка при изтриване')
    }
  }

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStockBadge = (quantity) => {
    if (quantity === 0) return 'bg-red-100 text-red-800'
    if (quantity < 10) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  const getStockText = (quantity) => {
    if (quantity === 0) return 'Изчерпан'
    if (quantity < 10) return 'Нисък запас'
    return 'В наличност'
  }

  return (
    <div className=\"min-h-screen bg-gray-50\">
      {/* Header */}
      <header className=\"bg-white shadow-sm border-b\">
        <div className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4\">
          <div className=\"flex items-center justify-between\">
            <div className=\"flex items-center gap-4\">
              <Link href=\"/admin/dashboard\" className=\"text-gray-600 hover:text-gray-900\">
                <ArrowLeft size={24} />
              </Link>
              <div>
                <h1 className=\"text-2xl font-bold text-gray-900\">Управление на продукти</h1>
                <p className=\"text-sm text-gray-600\">
                  Общо: {stats.totalProducts} продукта | Количество: {stats.totalQuantity} бр.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className=\"flex items-center gap-2 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-green-600\"
            >
              <Plus size={20} />
              Добави продукт
            </button>
          </div>
        </div>
      </header>

      <main className=\"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8\">
        {/* Stats Cards */}
        <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6 mb-6\">
          <div className=\"bg-white rounded-lg shadow p-6\">
            <div className=\"flex items-center justify-between\">
              <div>
                <p className=\"text-sm text-gray-600\">Всички продукти</p>
                <p className=\"text-3xl font-bold text-gray-900 mt-1\">{stats.totalProducts}</p>
              </div>
              <Package className=\"text-blue-600\" size={32} />
            </div>
          </div>
          <div className=\"bg-white rounded-lg shadow p-6\">
            <div className=\"flex items-center justify-between\">
              <div>
                <p className=\"text-sm text-gray-600\">Общо количество</p>
                <p className=\"text-3xl font-bold text-gray-900 mt-1\">{stats.totalQuantity}</p>
              </div>
              <Package className=\"text-green-600\" size={32} />
            </div>
          </div>
          <div className=\"bg-white rounded-lg shadow p-6\">
            <div className=\"flex items-center justify-between\">
              <div>
                <p className=\"text-sm text-gray-600\">Нисък запас</p>
                <p className=\"text-3xl font-bold text-gray-900 mt-1\">{stats.lowStockCount}</p>
              </div>
              <AlertTriangle className=\"text-orange-600\" size={32} />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className=\"mb-6 bg-white rounded-lg shadow p-4\">
          <div className=\"relative\">
            <Search className=\"absolute left-3 top-1/2 -translate-y-1/2 text-gray-400\" size={20} />
            <input
              type=\"text\"
              placeholder=\"Търсене по име, SKU или категория...\"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className=\"w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent\"
            />
          </div>
        </div>

        {/* Products Table */}
        {loading ? (
          <div className=\"flex justify-center items-center py-12\">
            <Loader2 className=\"animate-spin text-brand-green\" size={48} />
          </div>
        ) : (
          <div className=\"bg-white rounded-lg shadow overflow-hidden\">
            <div className=\"overflow-x-auto\">
              <table className=\"min-w-full divide-y divide-gray-200\">
                <thead className=\"bg-gray-50\">
                  <tr>
                    <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase\">SKU</th>
                    <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase\">Продукт</th>
                    <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase\">Категория</th>
                    <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase\">Цена</th>
                    <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase\">Количество</th>
                    <th className=\"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase\">Статус</th>
                    <th className=\"px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase\">Действия</th>
                  </tr>
                </thead>
                <tbody className=\"bg-white divide-y divide-gray-200\">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan=\"7\" className=\"px-6 py-8 text-center text-gray-500\">
                        <Package className=\"mx-auto mb-2 text-gray-400\" size={48} />
                        <p>Няма намерени продукти</p>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className=\"hover:bg-gray-50\">
                        <td className=\"px-6 py-4 whitespace-nowrap\">
                          <div className=\"text-sm font-mono text-gray-900\">{product.sku}</div>
                        </td>
                        <td className=\"px-6 py-4 whitespace-nowrap\">
                          <div className=\"text-sm font-medium text-gray-900\">{product.name}</div>
                        </td>
                        <td className=\"px-6 py-4 whitespace-nowrap\">
                          <div className=\"text-sm text-gray-500\">{product.category}</div>
                        </td>
                        <td className=\"px-6 py-4 whitespace-nowrap\">
                          <div className=\"text-sm font-semibold text-gray-900\">{product.price.toFixed(2)} лв</div>
                        </td>
                        <td className=\"px-6 py-4 whitespace-nowrap\">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStockBadge(product.quantity)}`}>
                            {product.quantity} бр. ({getStockText(product.quantity)})
                          </span>
                        </td>
                        <td className=\"px-6 py-4 whitespace-nowrap\">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {product.status === 'active' ? 'Активен' : 'Неактивен'}
                          </span>
                        </td>
                        <td className=\"px-6 py-4 whitespace-nowrap text-right text-sm font-medium\">
                          <button
                            onClick={() => handleEdit(product)}
                            className=\"text-brand-green hover:text-green-700 mr-3\"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className=\"text-red-600 hover:text-red-800\"
                          >
                            <Trash2 size={18} />
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

      {/* Edit Modal */}
      {showEditModal && editingProduct && (
        <div className=\"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4\">
          <div className=\"bg-white rounded-lg shadow-xl max-w-md w-full p-6\">
            <h3 className=\"text-xl font-bold text-gray-900 mb-4\">Редактиране на продукт</h3>
            <div className=\"space-y-4\">
              <div>
                <label className=\"block text-sm font-medium text-gray-700 mb-1\">Име</label>
                <input
                  type=\"text\"
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green\"
                />
              </div>
              <div>
                <label className=\"block text-sm font-medium text-gray-700 mb-1\">SKU</label>
                <input
                  type=\"text\"
                  value={editingProduct.sku || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                  className=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green\"
                />
              </div>
              <div className=\"grid grid-cols-2 gap-4\">
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-1\">Количество</label>
                  <input
                    type=\"number\"
                    value={editingProduct.quantity || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, quantity: parseInt(e.target.value) })}
                    className=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green\"
                  />
                </div>
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-1\">Цена (лв)</label>
                  <input
                    type=\"number\"
                    step=\"0.01\"
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                    className=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green\"
                  />
                </div>
              </div>
              <div>
                <label className=\"block text-sm font-medium text-gray-700 mb-1\">Категория</label>
                <input
                  type=\"text\"
                  value={editingProduct.category || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                  className=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green\"
                />
              </div>
              <div>
                <label className=\"block text-sm font-medium text-gray-700 mb-1\">Статус</label>
                <select
                  value={editingProduct.status || 'active'}
                  onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value })}
                  className=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green\"
                >
                  <option value=\"active\">Активен</option>
                  <option value=\"inactive\">Неактивен</option>
                </select>
              </div>
            </div>
            <div className=\"flex gap-3 mt-6\">
              <button
                onClick={() => setShowEditModal(false)}
                className=\"flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50\"
              >
                Отказ
              </button>
              <button
                onClick={handleUpdate}
                className=\"flex-1 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-green-600\"
              >
                Запази
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal - Similar structure to Edit Modal */}
      {showAddModal && (
        <div className=\"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4\">
          <div className=\"bg-white rounded-lg shadow-xl max-w-md w-full p-6\">
            <h3 className=\"text-xl font-bold text-gray-900 mb-4\">Добавяне на продукт</h3>
            <div className=\"space-y-4\">
              <div>
                <label className=\"block text-sm font-medium text-gray-700 mb-1\">Име *</label>
                <input
                  type=\"text\"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green\"
                  required
                />
              </div>
              <div>
                <label className=\"block text-sm font-medium text-gray-700 mb-1\">SKU *</label>
                <input
                  type=\"text\"
                  value={newProduct.sku}
                  onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
                  className=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green\"
                  required
                />
              </div>
              <div className=\"grid grid-cols-2 gap-4\">
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-1\">Количество</label>
                  <input
                    type=\"number\"
                    value={newProduct.quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
                    className=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green\"
                  />
                </div>
                <div>
                  <label className=\"block text-sm font-medium text-gray-700 mb-1\">Цена (лв)</label>
                  <input
                    type=\"number\"
                    step=\"0.01\"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                    className=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green\"
                  />
                </div>
              </div>
              <div>
                <label className=\"block text-sm font-medium text-gray-700 mb-1\">Категория</label>
                <input
                  type=\"text\"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className=\"w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green\"
                />
              </div>
            </div>
            <div className=\"flex gap-3 mt-6\">
              <button
                onClick={() => setShowAddModal(false)}
                className=\"flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50\"
              >
                Отказ
              </button>
              <button
                onClick={handleAdd}
                className=\"flex-1 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-green-600\"
              >
                Добави
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
