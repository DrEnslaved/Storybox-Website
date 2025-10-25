'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { Filter, Search, ShoppingCart } from 'lucide-react'

export default function ShopPage() {
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    { value: 'all', label: 'Всички' },
    { value: 'embroidery', label: 'Машинна бродерия' },
    { value: 'sublimation', label: 'Сублимация' },
    { value: 'transfer', label: 'Трансферен печат' },
    { value: 'laser', label: 'Лазерно рязане' }
  ]

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      // Fetch from Medusa using new clean API
      let response = await fetch('/api/medusa/products')
      let source = 'medusa'
      
      if (!response.ok) {
        // Fallback to MongoDB
        response = await fetch('/api/products')
        source = 'mongodb'
      }
      
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
        console.log(`Products loaded from ${source}:`, data.products?.length)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const getProductPrice = (product) => {
    const userTier = user?.priceTier || 'standard'
    const tierPrice = product.priceTiers?.find(t => t.tierName === userTier)
    return tierPrice ? tierPrice.price : product.priceTiers?.[0]?.price || 0
  }

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

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

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              aria-label="Покажи филтри"
              aria-expanded={showFilters}
            >
              <Filter size={20} />
              Филтри
            </button>

            {/* Desktop Categories */}
            <div className="hidden md:flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-full border-2 transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-brand-green border-brand-green text-white'
                      : 'border-brand-green text-brand-green hover:bg-brand-green hover:text-white'
                  }`}
                  aria-pressed={selectedCategory === category.value}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Categories */}
          {showFilters && (
            <div className="md:hidden mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => {
                    setSelectedCategory(category.value)
                    setShowFilters(false)
                  }}
                  className={`px-4 py-2 rounded-full border-2 transition-colors ${
                    selectedCategory === category.value
                      ? 'bg-brand-green border-brand-green text-white'
                      : 'border-brand-green text-brand-green hover:bg-brand-green hover:text-white'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 md:py-20">
              <p className="text-xl text-gray-600">Няма намерени продукти</p>
              <p className="text-gray-500 mt-2">Опитайте с различна категория или търсене</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
                >
                  <Link href={`/shop/${product.slug}`}>
                    <div className="relative h-48 md:h-64 bg-gray-200">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="bg-red-600 text-white px-4 py-2 rounded-md font-semibold">
                            Изчерпан
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                  
                  <div className="p-4">
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
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-2xl font-bold text-brand-green">
                          {getProductPrice(product).toFixed(2)} лв
                        </div>
                        {product.minQuantity > 1 && (
                          <div className="text-xs text-gray-500">
                            Мин. {product.minQuantity} бр.
                          </div>
                        )}
                      </div>
                      
                      <Link
                        href={`/shop/${product.slug}`}
                        className="w-full sm:w-auto bg-brand-green hover:bg-brand-green-dark text-white px-4 py-2 rounded-md font-semibold transition-colors text-center flex items-center justify-center gap-2"
                        aria-label={`Виж ${product.name}`}
                      >
                        <ShoppingCart size={16} />
                        <span className="hidden sm:inline">Виж</span>
                        <span className="sm:hidden">Детайли</span>
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