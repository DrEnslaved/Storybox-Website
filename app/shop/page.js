'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { Filter, Search, ShoppingCart, X, SlidersHorizontal, Package } from 'lucide-react'

export default function ShopPage() {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [activePriceRange, setActivePriceRange] = useState({ min: 0, max: 1000 })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
        
        // Calculate price range from products
        if (data.products && data.products.length > 0) {
          const prices = data.products.map(p => getProductPrice(p)).filter(p => p > 0)
          if (prices.length > 0) {
            const minPrice = Math.floor(Math.min(...prices))
            const maxPrice = Math.ceil(Math.max(...prices))
            setPriceRange({ min: minPrice, max: maxPrice })
            setActivePriceRange({ min: minPrice, max: maxPrice })
          }
        }
        
        console.log(`Products loaded from ${data.source}:`, data.products?.length)
      } else {
        console.error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get unique categories from products
  const categories = useMemo(() => {
    const uniqueCategories = new Set()
    products.forEach(product => {
      if (product.category) {
        uniqueCategories.add(product.category)
      }
    })
    
    return [
      { value: 'all', label: 'Всички продукти', count: products.length },
      ...Array.from(uniqueCategories).map(cat => ({
        value: cat,
        label: cat,
        count: products.filter(p => p.category === cat).length
      }))
    ]
  }, [products])

  const getProductPrice = (product) => {
    const userTier = user?.priceTier || 'standard'
    const tierPrice = product.priceTiers?.find(t => t.tierName === userTier)
    
    if (tierPrice) {
      return tierPrice.price
    }
    
    if (product.price != null) {
      return product.price
    }
    
    return product.priceTiers?.[0]?.price || 0
  }

  const filteredProducts = products.filter(product => {
    const price = getProductPrice(product)
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPrice = price >= activePriceRange.min && price <= activePriceRange.max
    
    return matchesCategory && matchesSearch && matchesPrice
  })

  const handleResetFilters = () => {
    setSelectedCategory('all')
    setSearchQuery('')
    setActivePriceRange(priceRange)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Зареждане...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-green to-brand-green-dark text-white py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">Нашият магазин</h1>
            <p className="text-lg md:text-xl">
              Разгледайте нашата гама от персонализирани продукти и услуги за вашия бизнес
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Bar */}
      <section className="bg-white shadow-sm sticky top-[73px] z-40 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4">
            {/* Top Row: Search and Filter Button */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Търсене на продукти..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                  aria-label="Търсене на продукти"
                />
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-brand-green text-brand-green rounded-md hover:bg-brand-green hover:text-white transition-colors"
                aria-label="Покажи филтри"
                aria-expanded={showFilters}
              >
                <SlidersHorizontal size={20} />
                <span>Филтри</span>
                {(selectedCategory !== 'all' || activePriceRange.min !== priceRange.min || activePriceRange.max !== priceRange.max) && (
                  <span className="ml-1 px-2 py-0.5 bg-brand-green text-white text-xs rounded-full">
                    {[
                      selectedCategory !== 'all' ? 1 : 0,
                      (activePriceRange.min !== priceRange.min || activePriceRange.max !== priceRange.max) ? 1 : 0
                    ].reduce((a, b) => a + b, 0)}
                  </span>
                )}
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="border-t pt-4 space-y-4">
                {/* Category Filter */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Filter size={18} />
                      Категория
                    </h3>
                    {selectedCategory !== 'all' && (
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className="text-sm text-brand-green hover:underline"
                      >
                        Изчисти
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.value}
                        onClick={() => setSelectedCategory(category.value)}
                        className={`px-4 py-2 rounded-full border-2 transition-colors text-sm ${
                          selectedCategory === category.value
                            ? 'bg-brand-green border-brand-green text-white'
                            : 'border-gray-300 text-gray-700 hover:border-brand-green hover:text-brand-green'
                        }`}
                        aria-pressed={selectedCategory === category.value}
                      >
                        {category.label} ({category.count})
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Ценови диапазон</h3>
                    {(activePriceRange.min !== priceRange.min || activePriceRange.max !== priceRange.max) && (
                      <button
                        onClick={() => setActivePriceRange(priceRange)}
                        className="text-sm text-brand-green hover:underline"
                      >
                        Изчисти
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    {/* Price Display */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">От:</span>
                        <span className="font-semibold text-brand-green">{activePriceRange.min.toFixed(0)} лв</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">До:</span>
                        <span className="font-semibold text-brand-green">{activePriceRange.max.toFixed(0)} лв</span>
                      </div>
                    </div>

                    {/* Range Sliders */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">Минимална цена</label>
                        <input
                          type="range"
                          min={priceRange.min}
                          max={priceRange.max}
                          step="1"
                          value={activePriceRange.min}
                          onChange={(e) => {
                            const newMin = parseInt(e.target.value)
                            if (newMin <= activePriceRange.max) {
                              setActivePriceRange(prev => ({ ...prev, min: newMin }))
                            }
                          }}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-green"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 mb-1 block">Максимална цена</label>
                        <input
                          type="range"
                          min={priceRange.min}
                          max={priceRange.max}
                          step="1"
                          value={activePriceRange.max}
                          onChange={(e) => {
                            const newMax = parseInt(e.target.value)
                            if (newMax >= activePriceRange.min) {
                              setActivePriceRange(prev => ({ ...prev, max: newMax }))
                            }
                          }}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-green"
                        />
                      </div>
                    </div>

                    {/* Number Inputs */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="number"
                          min={priceRange.min}
                          max={activePriceRange.max}
                          value={activePriceRange.min}
                          onChange={(e) => {
                            const newMin = parseInt(e.target.value) || priceRange.min
                            if (newMin <= activePriceRange.max && newMin >= priceRange.min) {
                              setActivePriceRange(prev => ({ ...prev, min: newMin }))
                            }
                          }}
                          className="w-full px-3 py-2 border rounded-md text-sm"
                          placeholder="Мин."
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          min={activePriceRange.min}
                          max={priceRange.max}
                          value={activePriceRange.max}
                          onChange={(e) => {
                            const newMax = parseInt(e.target.value) || priceRange.max
                            if (newMax >= activePriceRange.min && newMax <= priceRange.max) {
                              setActivePriceRange(prev => ({ ...prev, max: newMax }))
                            }
                          }}
                          className="w-full px-3 py-2 border rounded-md text-sm"
                          placeholder="Макс."
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reset All Filters */}
                {(selectedCategory !== 'all' || activePriceRange.min !== priceRange.min || activePriceRange.max !== priceRange.max || searchQuery) && (
                  <div className="pt-3 border-t">
                    <button
                      onClick={handleResetFilters}
                      className="w-full px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                      <X size={16} />
                      Изчисти всички филтри
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Active Filters Summary */}
            {!showFilters && (selectedCategory !== 'all' || activePriceRange.min !== priceRange.min || activePriceRange.max !== priceRange.max) && (
              <div className="flex flex-wrap gap-2 items-center text-sm">
                <span className="text-gray-600">Активни филтри:</span>
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-green text-white rounded-full">
                    {categories.find(c => c.value === selectedCategory)?.label}
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="hover:bg-green-600 rounded-full p-0.5"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
                {(activePriceRange.min !== priceRange.min || activePriceRange.max !== priceRange.max) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-green text-white rounded-full">
                    {activePriceRange.min} - {activePriceRange.max} лв
                    <button
                      onClick={() => setActivePriceRange(priceRange)}
                      className="hover:bg-green-600 rounded-full p-0.5"
                    >
                      <X size={14} />
                    </button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600">
              Показани <span className="font-semibold text-brand-green">{filteredProducts.length}</span> {filteredProducts.length === 1 ? 'продукт' : 'продукта'} от <span className="font-semibold">{products.length}</span>
            </p>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 md:py-20 bg-white rounded-lg shadow">
              <Package className="mx-auto mb-4 text-gray-400" size={64} />
              <p className="text-xl font-semibold text-gray-900 mb-2">Няма намерени продукти</p>
              <p className="text-gray-500 mb-4">Опитайте с различна категория или ценови диапазон</p>
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-6 py-2 bg-brand-green text-white rounded-md hover:bg-green-600"
              >
                <X size={18} />
                Изчисти филтрите
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow flex flex-col h-full"
                >
                  <Link href={`/shop/${product.slug}`}>
                    <div className="relative h-48 md:h-64 bg-gray-200">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      {product.inventory?.status === 'backorder' && (
                        <div className="absolute top-2 right-2">
                          <span className="bg-orange-500 text-white px-3 py-1 rounded-md font-semibold text-sm">
                            Предварителна поръчка
                          </span>
                        </div>
                      )}
                      {product.inventory?.status === 'out_of_stock' && !product.inventory?.allowBackorder && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold">
                            Изчерпан
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  <div className="p-4 flex flex-col h-full">
                    <div className="mb-2">
                      <span className="inline-block bg-brand-green text-white text-xs px-2 py-1 rounded">
                        {product.categoryName}
                      </span>
                    </div>
                    
                    <Link href={`/shop/${product.slug}`}>
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 hover:text-brand-green transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                      {product.description?.replace(/<[^>]*>/g, '') || 'Персонализирани продукти за вашия бизнес'}
                    </p>
                    
                    {/* Stock Status Badge */}
                    {product.inventory?.status === 'backorder' && (
                      <div className="mb-3">
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                          📦 Предварителна поръчка
                        </span>
                      </div>
                    )}
                    
                    {/* Price and Button - Always at bottom */}
                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="text-2xl font-bold text-brand-green">
                            {getProductPrice(product)?.toFixed(2) || '0.00'} лв
                          </div>
                          {product.inventory?.minQuantity > 1 && (
                            <div className="text-xs text-gray-500">
                              Мин. {product.inventory.minQuantity} бр.
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Link
                        href={`/shop/${product.slug}`}
                        className={`w-full block text-center px-4 py-3 rounded-md font-semibold transition-colors ${
                          product.inventory?.status === 'backorder'
                            ? 'bg-orange-500 hover:bg-orange-600 text-white'
                            : product.inventory?.status === 'out_of_stock' && !product.inventory?.allowBackorder
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-brand-green hover:bg-brand-green-dark text-white'
                        }`}
                        aria-label={`Виж ${product.name}`}
                      >
                        {product.inventory?.status === 'backorder' ? (
                          <span className="flex items-center justify-center gap-2">
                            <ShoppingCart size={18} />
                            Заявка за поръчка
                          </span>
                        ) : product.inventory?.status === 'out_of_stock' && !product.inventory?.allowBackorder ? (
                          'Изчерпан'
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <ShoppingCart size={18} />
                            Виж детайли
                          </span>
                        )}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-green text-white py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-6">Не намирате това, което търсите?</h2>
          <p className="text-lg md:text-xl mb-6 md:mb-8 max-w-2xl mx-auto">
            Свържете се с нас за персонализирана оферта за вашия проект
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-brand-green hover:bg-gray-100 px-6 md:px-8 py-3 md:py-4 rounded-md text-base md:text-lg font-semibold transition-colors"
          >
            Поискайте оферта
          </Link>
        </div>
      </section>
    </div>
  )
}