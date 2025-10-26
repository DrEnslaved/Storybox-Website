'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Package, Search, Edit, Trash2, Plus, ArrowLeft, Loader2, AlertTriangle, Upload, X, Save, Image as ImageIcon } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'

// Import React Quill dynamically to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })
import 'react-quill/dist/quill.snow.css'

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [stats, setStats] = useState({ totalProducts: 0, totalQuantity: 0, lowStockCount: 0 })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [uploadingImages, setUploadingImages] = useState(false)

  // Form state for comprehensive product
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    description: '',
    sku: '',
    
    // Images
    coverImage: null,
    gallery: [],
    
    // Pricing
    price: 0,
    compareAtPrice: null,
    salePrice: null,
    costPrice: null,
    taxClass: 'standard',
    
    // Inventory
    inventory: {
      amount: 0,
      status: 'in_stock',
      minQuantity: 1,
      maxQuantity: 999,
      allowBackorder: false,
      backorderMessage: '',
      stockAlertThreshold: 10
    },
    
    // Shipping
    shipping: {
      weight: 0,
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
        unit: 'cm'
      },
      class: 'standard'
    },
    
    // Organization
    category: '',
    tags: [],
    status: 'active',
    visibility: 'public',
    featured: false,
    badges: [],
    
    // SEO
    seo: {
      title: '',
      description: '',
      slug: ''
    },
    
    // B2B
    b2b: {
      moq: 1,
      bulkPricing: [],
      leadTime: '',
      customFields: {}
    },
    
    // Variants
    variants: []
  })

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchProducts(token)
    fetchCategories(token)
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

  const fetchCategories = async (token) => {
    try {
      const response = await fetch('/api/admin/categories', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleImageUpload = async (file, type = 'cover') => {
    const token = localStorage.getItem('admin_token')
    setUploadingImages(true)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })
      
      if (response.ok) {
        const data = await response.json()
        
        if (type === 'cover') {
          setFormData(prev => ({ ...prev, coverImage: data.url }))
        } else {
          setFormData(prev => ({ ...prev, gallery: [...prev.gallery, data.url] }))
        }
        
        alert('Изображението е качено успешно')
      } else {
        alert('Грешка при качване на изображение')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Грешка при качване на изображение')
    } finally {
      setUploadingImages(false)
    }
  }

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('admin_token')
    
    try {
      const url = editingProduct 
        ? `/api/admin/products/${editingProduct.id}`
        : '/api/admin/products'
      
      const method = editingProduct ? 'PATCH' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        alert(editingProduct ? 'Продуктът е обновен успешно' : 'Продуктът е добавен успешно')
        setShowForm(false)
        resetForm()
        fetchProducts(token)
      } else {
        const error = await response.json()
        alert(`Грешка: ${error.error}`)
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Грешка при запазване на продукт')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      sku: '',
      coverImage: null,
      gallery: [],
      price: 0,
      compareAtPrice: null,
      salePrice: null,
      costPrice: null,
      taxClass: 'standard',
      inventory: {
        amount: 0,
        status: 'in_stock',
        minQuantity: 1,
        maxQuantity: 999,
        allowBackorder: false,
        backorderMessage: '',
        stockAlertThreshold: 10
      },
      shipping: {
        weight: 0,
        dimensions: { length: 0, width: 0, height: 0, unit: 'cm' },
        class: 'standard'
      },
      category: '',
      tags: [],
      status: 'active',
      visibility: 'public',
      featured: false,
      badges: [],
      seo: { title: '', description: '', slug: '' },
      b2b: { moq: 1, bulkPricing: [], leadTime: '', customFields: {} },
      variants: []
    })
    setEditingProduct(null)
  }

  const handleEdit = async (product) => {
    const token = localStorage.getItem('admin_token')
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        // Ensure all nested objects and arrays exist
        const productData = {
          ...data.product,
          gallery: data.product.gallery || [],
          tags: data.product.tags || [],
          badges: data.product.badges || [],
          variants: data.product.variants || [],
          inventory: data.product.inventory || {
            amount: 0,
            status: 'in_stock',
            minQuantity: 1,
            maxQuantity: 999,
            allowBackorder: false,
            backorderMessage: '',
            stockAlertThreshold: 10
          },
          shipping: data.product.shipping || {
            weight: 0,
            dimensions: { length: 0, width: 0, height: 0, unit: 'cm' },
            class: 'standard'
          },
          seo: data.product.seo || { title: '', description: '', slug: '' },
          b2b: data.product.b2b || {
            moq: 1,
            bulkPricing: [],
            leadTime: '',
            customFields: {}
          }
        }
        setFormData(productData)
        setEditingProduct(product)
        setShowForm(true)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
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

  const addVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          id: uuidv4(),
          name: '',
          attributes: { color: '', material: '', size: '' },
          sku: '',
          price: prev.price,
          inventory: { amount: 0, status: 'in_stock' },
          coverImage: null,
          gallery: []
        }
      ]
    }))
  }

  const removeVariant = (variantId) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter(v => v.id !== variantId)
    }))
  }

  const updateVariant = (variantId, field, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map(v => 
        v.id === variantId ? { ...v, [field]: value } : v
      )
    }))
  }

  const addBulkPricing = () => {
    setFormData(prev => ({
      ...prev,
      b2b: {
        ...prev.b2b,
        bulkPricing: [...prev.b2b.bulkPricing, { qty: 0, price: 0 }]
      }
    }))
  }

  const removeBulkPricing = (index) => {
    setFormData(prev => ({
      ...prev,
      b2b: {
        ...prev.b2b,
        bulkPricing: prev.b2b.bulkPricing.filter((_, i) => i !== index)
      }
    }))
  }

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Form Header */}
        <header className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => {
                    setShowForm(false)
                    resetForm()
                  }}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                  {editingProduct ? 'Редактиране на продукт' : 'Добавяне на продукт'}
                </h1>
              </div>
              <button
                onClick={handleSubmit}
                disabled={uploadingImages}
                className="flex items-center gap-2 px-6 py-2 bg-brand-green text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                <Save size={20} />
                Запази продукт
              </button>
            </div>
          </div>
        </header>

        {/* Comprehensive Product Form */}
        <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Content - Left Column (2/3) */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Основна информация</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Име на продукт *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green"
                      placeholder="напр. Бродирана тениска"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Описание *</label>
                    <ReactQuill
                      theme="snow"
                      value={formData.description}
                      onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                      className="bg-white"
                      modules={{
                        toolbar: [
                          [{ 'header': [1, 2, 3, false] }],
                          ['bold', 'italic', 'underline'],
                          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                          ['link'],
                          ['clean']
                        ]
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU (Артикулен номер) *</label>
                    <input
                      type="text"
                      required
                      value={formData.sku}
                      onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green"
                      placeholder="напр. TSHIRT-001"
                    />
                  </div>
                </div>
              </div>

              {/* Images Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Изображения</h2>
                
                {/* Cover Image */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Главно изображение *</label>
                  {formData.coverImage ? (
                    <div className="relative w-full h-64 border-2 border-gray-200 rounded-lg overflow-hidden">
                      <img src={formData.coverImage} alt="Cover" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, coverImage: null }))}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="mx-auto mb-2 text-gray-400" size={48} />
                      <p className="text-sm text-gray-600 mb-2">Качете главно изображение</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            handleImageUpload(e.target.files[0], 'cover')
                          }
                        }}
                        className="hidden"
                        id="cover-upload"
                      />
                      <label
                        htmlFor="cover-upload"
                        className="inline-block px-4 py-2 bg-brand-green text-white rounded-lg cursor-pointer hover:bg-green-600"
                      >
                        Избери файл
                      </label>
                    </div>
                  )}
                </div>

                {/* Gallery Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Галерия (2-5 изображения)
                  </label>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {(formData.gallery || []).map((img, index) => (
                      <div key={index} className="relative aspect-square border-2 border-gray-200 rounded-lg overflow-hidden">
                        <img src={img} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {formData.gallery.length < 5 && (
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files[0]) {
                            handleImageUpload(e.target.files[0], 'gallery')
                          }
                        }}
                        className="hidden"
                        id="gallery-upload"
                      />
                      <label
                        htmlFor="gallery-upload"
                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <Plus size={16} />
                        Добави изображение
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Ценообразуване</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Цена (лв) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Цена за сравнение (лв)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.compareAtPrice || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, compareAtPrice: e.target.value ? parseFloat(e.target.value) : null }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green"
                      placeholder="За показване на отстъпка"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Промоционална цена (лв)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.salePrice || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, salePrice: e.target.value ? parseFloat(e.target.value) : null }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Себестойност (лв)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.costPrice || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, costPrice: e.target.value ? parseFloat(e.target.value) : null }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green"
                      placeholder="Само за админи"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Данъчна класа</label>
                    <select
                      value={formData.taxClass}
                      onChange={(e) => setFormData(prev => ({ ...prev, taxClass: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green"
                    >
                      <option value="standard">Стандартна (20% ДДС)</option>
                      <option value="reduced">Намалена (9% ДДС)</option>
                      <option value="zero">Без ДДС</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Inventory */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Налични количества</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Количество *</label>
                    <input
                      type="number"
                      required
                      value={formData.inventory.amount}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        inventory: { ...prev.inventory, amount: parseInt(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                    <select
                      value={formData.inventory.status}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        inventory: { ...prev.inventory, status: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green"
                    >
                      <option value="in_stock">В наличност</option>
                      <option value="out_of_stock">Изчерпан</option>
                      <option value="backorder">Предварителна поръчка</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Мин. количество</label>
                    <input
                      type="number"
                      value={formData.inventory.minQuantity}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        inventory: { ...prev.inventory, minQuantity: parseInt(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Макс. количество</label>
                    <input
                      type="number"
                      value={formData.inventory.maxQuantity}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        inventory: { ...prev.inventory, maxQuantity: parseInt(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.inventory.allowBackorder}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          inventory: { ...prev.inventory, allowBackorder: e.target.checked }
                        }))}
                        className="rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Разрешаване на предварителни поръчки</span>
                    </label>
                  </div>
                  {formData.inventory.allowBackorder && (
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Съобщение за предварителна поръчка</label>
                      <input
                        type="text"
                        value={formData.inventory.backorderMessage}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          inventory: { ...prev.inventory, backorderMessage: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green"
                        placeholder="напр. Изпраща се след 2-3 седмици"
                      />
                    </div>
                  )}
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Праг за сигнал (ниско количество)</label>
                    <input
                      type="number"
                      value={formData.inventory.stockAlertThreshold}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        inventory: { ...prev.inventory, stockAlertThreshold: parseInt(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Доставка (за Econt)</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Тегло (кг)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.shipping.weight}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        shipping: { ...prev.shipping, weight: parseFloat(e.target.value) }
                      }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Клас на доставка</label>
                    <select
                      value={formData.shipping.class}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        shipping: { ...prev.shipping, class: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green"
                    >
                      <option value="standard">Стандартна</option>
                      <option value="express">Експресна</option>
                      <option value="bulky">Габаритна</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Дължина (см)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.shipping.dimensions.length}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        shipping: {
                          ...prev.shipping,
                          dimensions: { ...prev.shipping.dimensions, length: parseFloat(e.target.value) }
                        }
                      }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Широчина (см)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.shipping.dimensions.width}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        shipping: {
                          ...prev.shipping,
                          dimensions: { ...prev.shipping.dimensions, width: parseFloat(e.target.value) }
                        }
                      }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Височина (см)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.shipping.dimensions.height}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        shipping: {
                          ...prev.shipping,
                          dimensions: { ...prev.shipping.dimensions, height: parseFloat(e.target.value) }
                        }
                      }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green"
                    />
                  </div>
                </div>
              </div>

              {/* SEO Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">SEO Оптимизация</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SEO заглавие</label>
                    <input
                      type="text"
                      value={formData.seo.title}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        seo: { ...prev.seo, title: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green"
                      placeholder={formData.name || 'Автоматично от името'}
                    />
                    <p className="text-xs text-gray-500 mt-1">Оптимално: 50-60 символа</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SEO описание</label>
                    <textarea
                      value={formData.seo.description}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        seo: { ...prev.seo, description: e.target.value }
                      }))}
                      rows={3}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green"
                      placeholder="Кратко описание за търсачки"
                    />
                    <p className="text-xs text-gray-500 mt-1">Оптимално: 150-160 символа</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL slug</label>
                    <input
                      type="text"
                      value={formData.seo.slug}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        seo: { ...prev.seo, slug: e.target.value }
                      }))}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green"
                      placeholder="автоматично-от-името"
                    />
                    <p className="text-xs text-gray-500 mt-1">Използва се в URL адреса</p>
                  </div>
                </div>
              </div>

              {/* B2B Settings */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">B2B Настройки</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Минимална поръчка (MOQ)</label>
                      <input
                        type="number"
                        value={formData.b2b.moq}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          b2b: { ...prev.b2b, moq: parseInt(e.target.value) }
                        }))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Срок на доставка</label>
                      <input
                        type="text"
                        value={formData.b2b.leadTime}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          b2b: { ...prev.b2b, leadTime: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-green"
                        placeholder="напр. 2-3 седмици"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ценообразуване за количества</label>
                    {formData.b2b.bulkPricing.map((tier, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="number"
                          placeholder="Количество"
                          value={tier.qty}
                          onChange={(e) => {
                            const newBulkPricing = [...formData.b2b.bulkPricing]
                            newBulkPricing[index].qty = parseInt(e.target.value)
                            setFormData(prev => ({
                              ...prev,
                              b2b: { ...prev.b2b, bulkPricing: newBulkPricing }
                            }))
                          }}
                          className="flex-1 px-3 py-2 border rounded-lg"
                        />
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Цена"
                          value={tier.price}
                          onChange={(e) => {
                            const newBulkPricing = [...formData.b2b.bulkPricing]
                            newBulkPricing[index].price = parseFloat(e.target.value)
                            setFormData(prev => ({
                              ...prev,
                              b2b: { ...prev.b2b, bulkPricing: newBulkPricing }
                            }))
                          }}
                          className="flex-1 px-3 py-2 border rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeBulkPricing(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addBulkPricing}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      <Plus size={16} />
                      Добави ниво
                    </button>
                  </div>
                </div>
              </div>

              {/* Variants Section */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Варианти на продукта</h2>
                <p className="text-sm text-gray-600 mb-4">Добавете варианти като размер, цвят или материал</p>
                
                {formData.variants.map((variant, vIndex) => (
                  <div key={variant.id} className="border-2 border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-900">Вариант #{vIndex + 1}</h3>
                      <button
                        type="button"
                        onClick={() => removeVariant(variant.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Цвят</label>
                        <input
                          type="text"
                          value={variant.attributes.color}
                          onChange={(e) => {
                            const newVariants = [...formData.variants]
                            newVariants[vIndex].attributes.color = e.target.value
                            setFormData(prev => ({ ...prev, variants: newVariants }))
                          }}
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="напр. Червен"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Материал</label>
                        <input
                          type="text"
                          value={variant.attributes.material}
                          onChange={(e) => {
                            const newVariants = [...formData.variants]
                            newVariants[vIndex].attributes.material = e.target.value
                            setFormData(prev => ({ ...prev, variants: newVariants }))
                          }}
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="напр. Памук"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Размер</label>
                        <input
                          type="text"
                          value={variant.attributes.size}
                          onChange={(e) => {
                            const newVariants = [...formData.variants]
                            newVariants[vIndex].attributes.size = e.target.value
                            setFormData(prev => ({ ...prev, variants: newVariants }))
                          }}
                          className="w-full px-3 py-2 border rounded-lg"
                          placeholder="напр. 42 или XL"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">SKU варианта</label>
                        <input
                          type="text"
                          value={variant.sku}
                          onChange={(e) => {
                            const newVariants = [...formData.variants]
                            newVariants[vIndex].sku = e.target.value
                            setFormData(prev => ({ ...prev, variants: newVariants }))
                          }}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Цена (лв)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={variant.price}
                          onChange={(e) => {
                            const newVariants = [...formData.variants]
                            newVariants[vIndex].price = parseFloat(e.target.value)
                            setFormData(prev => ({ ...prev, variants: newVariants }))
                          }}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Количество</label>
                        <input
                          type="number"
                          value={variant.inventory.amount}
                          onChange={(e) => {
                            const newVariants = [...formData.variants]
                            newVariants[vIndex].inventory.amount = parseInt(e.target.value)
                            setFormData(prev => ({ ...prev, variants: newVariants }))
                          }}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addVariant}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Plus size={16} />
                  Добави вариант
                </button>
              </div>
            </div>

            {/* Right Sidebar - Organization & Settings */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Status & Visibility */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-gray-900 mb-4">Статус на публикация</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="active">Активен</option>
                      <option value="draft">Чернова</option>
                      <option value="archived">Архивиран</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Видимост</label>
                    <select
                      value={formData.visibility}
                      onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="public">Публичен</option>
                      <option value="hidden">Скрит</option>
                      <option value="search_only">Само при търсене</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Представен продукт</span>
                  </label>
                </div>
              </div>

              {/* Organization */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-gray-900 mb-4">Организация</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="">Без категория</option>
                      <option value="Бродерия">Бродерия</option>
                      <option value="Печат">Печат</option>
                      <option value="Облекло">Облекло</option>
                      <option value="Аксесоари">Аксесоари</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Тагове</label>
                    <input
                      type="text"
                      value={formData.tags.join(', ')}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                      }))}
                      className="w-full px-3 py-2 border rounded-lg"
                      placeholder="тагове, разделени, със запетая"
                    />
                  </div>
                </div>
              </div>

              {/* Product Badges */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-gray-900 mb-4">Значки на продукта</h3>
                <div className="space-y-2">
                  {['Ново', 'Разпродажба', 'Популярно', 'Ограничено'].map(badge => (
                    <label key={badge} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.badges.includes(badge)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({ ...prev, badges: [...prev.badges, badge] }))
                          } else {
                            setFormData(prev => ({
                              ...prev,
                              badges: prev.badges.filter(b => b !== badge)
                            }))
                          }
                        }}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-700">{badge}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="sticky bottom-0 bg-white border-t shadow-lg p-4 flex justify-between items-center">
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                resetForm()
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Отказ
            </button>
            <button
              type="submit"
              disabled={uploadingImages}
              className="px-6 py-2 bg-brand-green text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
            >
              {editingProduct ? 'Обнови продукт' : 'Създай продукт'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  // Product List View
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft size={24} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Управление на продукти</h1>
                <p className="text-sm text-gray-600">
                  Общо: {stats.totalProducts} продукта | Количество: {stats.totalQuantity} бр.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-green-600"
            >
              <Plus size={20} />
              Добави продукт
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Всички продукти</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalProducts}</p>
              </div>
              <Package className="text-blue-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Общо количество</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalQuantity}</p>
              </div>
              <Package className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Нисък запас</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.lowStockCount}</p>
              </div>
              <AlertTriangle className="text-orange-600" size={32} />
            </div>
          </div>
        </div>

        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Търсене по име, SKU или категория..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent"
            />
          </div>
        </div>

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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Изображение</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Продукт</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Категория</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Цена</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Количество</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Статус</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Действия</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                        <Package className="mx-auto mb-2 text-gray-400" size={48} />
                        <p>Няма намерени продукти</p>
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.coverImage ? (
                            <img src={product.coverImage} alt={product.name} className="h-12 w-12 object-cover rounded" />
                          ) : (
                            <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                              <ImageIcon size={24} className="text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-900">{product.sku}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{product.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">{product.price.toFixed(2)} лв</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.quantity === 0 ? 'bg-red-100 text-red-800' : 
                            product.quantity < 10 ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {product.quantity} бр.
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {product.status === 'active' ? 'Активен' : product.status === 'draft' ? 'Чернова' : 'Архивиран'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-brand-green hover:text-green-700 mr-3"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="text-red-600 hover:text-red-800"
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
    </div>
  )
}
