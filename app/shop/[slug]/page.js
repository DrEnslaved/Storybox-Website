'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/CartContext'
import { ShoppingCart, Check, Minus, Plus, ArrowLeft } from 'lucide-react'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(10)
  const [selectedImage, setSelectedImage] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    if (params.slug) {
      fetchProduct()
    }
  }, [params.slug])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.slug}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data.product)
        setQuantity(data.product.minQuantity || 1)
      } else {
        router.push('/shop')
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      router.push('/shop')
    } finally {
      setLoading(false)
    }
  }

  const getProductPrice = () => {
    if (!product) return 0
    const userTier = user?.priceTier || 'standard'
    const tierPrice = product.priceTiers?.find(t => t.tierName === userTier)
    return tierPrice ? tierPrice.price : product.priceTiers?.[0]?.price || 0
  }

  const handleAddToCart = () => {
    if (!product) return
    
    const price = getProductPrice()
    addToCart({
      id: product.id,
      name: product.name,
      price: price,
      image: product.image,
      slug: product.slug,
      minQuantity: product.minQuantity,
      maxQuantity: product.maxQuantity
    }, quantity)
    
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 3000)
  }

  const updateQuantity = (newQuantity) => {
    if (!product) return
    const min = product.minQuantity || 1
    const max = product.maxQuantity || 5000
    const validQuantity = Math.max(min, Math.min(max, newQuantity))
    setQuantity(validQuantity)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Зареждане...</div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  const price = getProductPrice()
  const totalPrice = (price * quantity).toFixed(2)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm flex-wrap" aria-label="Breadcrumb">
            <Link href="/" className="text-gray-600 hover:text-brand-green">Начало</Link>
            <span className="text-gray-400">/</span>
            <Link href="/shop" className="text-gray-600 hover:text-brand-green">Магазин</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium line-clamp-1">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-brand-green hover:text-brand-green-dark mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Обратно към магазина
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* Images */}
            <div>
              <div className="bg-white rounded-lg overflow-hidden shadow-lg mb-4">
                <div className="relative h-64 md:h-96 lg:h-[500px]">
                  <Image
                    src={product.images?.[selectedImage] || product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2 md:gap-4">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative h-20 md:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-brand-green'
                          : 'border-gray-200 hover:border-brand-green-light'
                      }`}
                      aria-label={`Виж изображение ${index + 1}`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} изображение ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                <div className="mb-4">
                  <span className="inline-block bg-brand-green text-white text-sm px-3 py-1 rounded">
                    {product.categoryName}
                  </span>
                </div>

                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                <div className="mb-6">
                  <div className="text-3xl md:text-4xl font-bold text-brand-green mb-2">
                    {price.toFixed(2)} лв <span className="text-xl text-gray-600">/ бр.</span>
                  </div>
                  {product.minQuantity > 1 && (
                    <p className="text-gray-600">
                      Минимална поръчка: <strong>{product.minQuantity} броя</strong>
                    </p>
                  )}
                </div>

                <div className="mb-6 pb-6 border-b">
                  <p className="text-gray-700 leading-relaxed">{product.description}</p>
                </div>

                {/* Features */}
                {product.features && product.features.length > 0 && (
                  <div className="mb-6 pb-6 border-b">
                    <h3 className="font-semibold text-lg mb-3">Характеристики:</h3>
                    <ul className="space-y-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="text-brand-green flex-shrink-0 mt-1" size={20} />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block font-semibold text-lg mb-3">
                    Количество:
                  </label>
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="flex items-center border-2 border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(quantity - (product.minQuantity || 1))}
                        className="p-3 hover:bg-gray-100 transition-colors"
                        disabled={quantity <= (product.minQuantity || 1)}
                        aria-label="Намали количеството"
                      >
                        <Minus size={20} />
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => updateQuantity(parseInt(e.target.value) || product.minQuantity)}
                        className="w-20 text-center py-2 focus:outline-none font-semibold text-lg"
                        min={product.minQuantity || 1}
                        max={product.maxQuantity || 5000}
                        aria-label="Количество"
                      />
                      <button
                        onClick={() => updateQuantity(quantity + (product.minQuantity || 1))}
                        className="p-3 hover:bg-gray-100 transition-colors"
                        disabled={quantity >= (product.maxQuantity || 5000)}
                        aria-label="Увеличи количеството"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    
                    <div className="text-gray-600">
                      Max: {product.maxQuantity || 5000} бр.
                    </div>
                  </div>
                </div>

                {/* Total Price */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Обща цена:</span>
                    <span className="text-2xl md:text-3xl font-bold text-brand-green">
                      {totalPrice} лв
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                {product.inStock ? (
                  <div className="space-y-3">
                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-brand-green hover:bg-brand-green-dark text-white px-6 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center gap-2"
                      aria-label="Добави в количката"
                    >
                      <ShoppingCart size={24} />
                      {addedToCart ? 'Добавено!' : 'Добави в количката'}
                    </button>
                    
                    <Link
                      href="/contact"
                      className="w-full block text-center border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white px-6 py-4 rounded-lg text-lg font-semibold transition-colors"
                    >
                      Поискай персонализирана оферта
                    </Link>
                  </div>
                ) : (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Този продукт временно не е наличен
                  </div>
                )}

                {/* SKU */}
                {product.sku && (
                  <div className="mt-6 text-sm text-gray-500">
                    Артикулен номер: {product.sku}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}