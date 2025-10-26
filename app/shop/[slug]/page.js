'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/MedusaCartContext'
import { ShoppingCart, Check, Minus, Plus, ArrowLeft, Loader2 } from 'lucide-react'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { addToCart, loading: cartLoading } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(10)
  const [selectedImage, setSelectedImage] = useState(0)
  const [addedToCart, setAddedToCart] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    if (params.slug) {
      fetchProduct()
    }
  }, [params.slug])

  const fetchProduct = async () => {
    try {
      // Fetch from admin products (MongoDB)
      const response = await fetch(`/api/products/${params.slug}`)
      
      if (response.ok) {
        const data = await response.json()
        setProduct(data.product)
        
        // Set default variant if available, or create a default one for products without variants
        if (data.product.variants && data.product.variants.length > 0) {
          setSelectedVariant(data.product.variants[0])
        } else {
          // Create a default variant for products without variants
          setSelectedVariant({
            id: data.product.id,
            title: 'Standard',
            price: data.product.price
          })
        }
        
        setQuantity(data.product.inventory?.minQuantity || 1)
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

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant)
  }

  const getCurrentPrice = () => {
    if (selectedVariant) {
      return selectedVariant.price
    }
    
    // Try price tiers first (for backwards compatibility)
    if (product?.priceTiers) {
      const userTier = user?.priceTier || 'standard'
      const tierPrice = product.priceTiers.find(t => t.tierName === userTier)
      if (tierPrice) {
        return tierPrice.price
      }
      if (product.priceTiers[0]?.price) {
        return product.priceTiers[0].price
      }
    }
    
    // Fall back to direct price field (new admin products)
    if (product?.price != null) {
      return product.price
    }
    
    return 0
  }

  const handleAddToCart = async () => {
    if (!product || !selectedVariant) return
    
    setAddingToCart(true)
    
    try {
      // Create product object for cart
      const cartProduct = {
        id: selectedVariant.id,
        variant_id: selectedVariant.id,
        title: product.title,
        description: product.description,
        thumbnail: product.thumbnail || product.image,
        price: selectedVariant.price || getCurrentPrice(),
        variant_title: selectedVariant.title
      }
      
      const result = await addToCart(cartProduct, quantity)
      
      if (result.success) {
        setAddedToCart(true)
        setTimeout(() => setAddedToCart(false), 3000)
      } else {
        alert('Грешка при добавяне в количката: ' + (result.message || 'Моля опитайте отново'))
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Грешка при добавяне в количката')
    } finally {
      setAddingToCart(false)
    }
  }

  const updateQuantity = (newQuantity) => {
    const min = product?.minQuantity || 1
    const max = product?.maxQuantity || 5000
    const validQuantity = Math.max(min, Math.min(max, newQuantity))
    setQuantity(validQuantity)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-green" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Продуктът не е намерен</h1>
        <Link href="/shop" className="text-brand-green hover:underline">
          Назад към магазина
        </Link>
      </div>
    )
  }

  const currentPrice = getCurrentPrice()
  const images = product.images || [product.image].filter(Boolean)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-brand-green mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад към магазина</span>
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Images Section */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
                {images[selectedImage] ? (
                  <Image
                    src={images[selectedImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Няма изображение
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx 
                          ? 'border-brand-green ring-2 ring-brand-green ring-offset-2' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info Section */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                {product.sku && (
                  <p className="text-sm text-gray-500">SKU: {selectedVariant?.sku || product.sku}</p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-brand-green">
                    {currentPrice.toFixed(2)} лв
                  </span>
                  <span className="text-gray-500">/ бр.</span>
                </div>
                
                {/* Stock Status */}
                {product.inventory?.status === 'in_stock' && product.inventory?.amount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                      <Check className="w-4 h-4 mr-1" />
                      В наличност ({product.inventory.amount} бр.)
                    </span>
                  </div>
                )}
                
                {product.inventory?.status === 'backorder' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-800">
                        📦 Предварителна поръчка
                      </span>
                    </div>
                    {product.inventory?.backorderMessage && (
                      <p className="text-sm text-gray-600 italic">
                        {product.inventory.backorderMessage}
                      </p>
                    )}
                    <p className="text-sm text-gray-700 bg-orange-50 p-3 rounded-lg border border-orange-200">
                      <strong>Забележка:</strong> Този продукт е на предварителна поръчка. Вашата заявка ще бъде изпратена за одобрение и ще получите потвърждение за срока на доставка.
                    </p>
                  </div>
                )}
                
                {product.inventory?.status === 'out_of_stock' && !product.inventory?.allowBackorder && (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                      ❌ Изчерпан
                    </span>
                  </div>
                )}
              </div>

              {/* Variant Selection - Only show if user logged in OR only 1 variant */}
              {product.variants && product.variants.length > 0 && user && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Вашето ценово ниво:
                  </label>
                  <div className="p-4 rounded-lg border-2 border-brand-green bg-green-50">
                    <div className="font-semibold text-sm text-gray-900">
                      {selectedVariant?.title}
                    </div>
                    <div className="text-lg font-bold text-brand-green mt-1">
                      {selectedVariant?.price.toFixed(2)} лв
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-2">
                    Персонална цена за вашето ниво: <span className="font-semibold capitalize">{user.priceTier}</span>
                  </p>
                </div>
              )}
              
              {/* Show login prompt if not logged in */}
              {!user && product.variants && product.variants.length > 0 && (
                <div className="p-4 rounded-lg border-2 border-gray-200 bg-gray-50">
                  <p className="text-sm text-gray-600 mb-2">
                    Цената зависи от вашето ценово ниво
                  </p>
                  <Link href="/login" className="text-brand-green hover:underline font-semibold">
                    Влезте в профила си
                  </Link>
                  {' '}за да видите вашата персонална цена
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Описание
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">
                    Характеристики
                  </h2>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Количество:
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => updateQuantity(quantity - (product.minQuantity || 1))}
                      className="p-3 hover:bg-gray-100 transition-colors"
                      disabled={quantity <= (product.minQuantity || 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => updateQuantity(parseInt(e.target.value) || 1)}
                      className="w-20 text-center border-x border-gray-300 py-2 focus:outline-none"
                      min={product.minQuantity || 1}
                      max={product.maxQuantity || 5000}
                    />
                    <button
                      onClick={() => updateQuantity(quantity + (product.minQuantity || 10))}
                      className="p-3 hover:bg-gray-100 transition-colors"
                      disabled={quantity >= (product.maxQuantity || 5000)}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {product.minQuantity && (
                    <span className="text-sm text-gray-500">
                      Минимална поръчка: {product.minQuantity} бр.
                    </span>
                  )}
                </div>
              </div>

              {/* Total */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Обща сума:</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {(currentPrice * quantity).toFixed(2)} лв
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={
                  !selectedVariant || 
                  addingToCart || 
                  cartLoading || 
                  (product.inventory?.status === 'out_of_stock' && !product.inventory?.allowBackorder)
                }
                className={`w-full py-4 rounded-lg font-semibold text-lg 
                         transition-all flex items-center justify-center gap-2
                         disabled:opacity-50 disabled:cursor-not-allowed ${
                           product.inventory?.status === 'backorder'
                             ? 'bg-orange-500 hover:bg-orange-600 text-white'
                             : 'bg-brand-green hover:bg-green-600 text-white'
                         }`}
              >
                {addingToCart ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Добавяне...</span>
                  </>
                ) : addedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Добавено в количката!</span>
                  </>
                ) : product.inventory?.status === 'backorder' ? (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Заявка за предварителна поръчка</span>
                  </>
                ) : product.inventory?.status === 'out_of_stock' && !product.inventory?.allowBackorder ? (
                  <span>Временно недостъпен</span>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Добави в количката</span>
                  </>
                )}
              </button>
              
              {product.inventory?.status === 'out_of_stock' && !product.inventory?.allowBackorder && (
                <p className="text-center text-sm text-gray-500">
                  Свържете се с нас за наличност: <a href="tel:+359899973002" className="text-brand-green hover:underline">+359 899 973 002</a>
                </p>
              )}

              {!user && (
                <p className="text-sm text-center text-gray-600">
                  <Link href="/login" className="text-brand-green hover:underline">
                    Влезте в профила си
                  </Link>
                  {' '}за да видите вашата персонална цена
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
