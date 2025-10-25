'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/MedusaCartContext'
import { CreditCard, MapPin, Package, ArrowLeft, Loader2 } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { cart, getTotal, clearCart, loading } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  })

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    if (!user) {
      setError('Моля, влезте в профила си за да продължите')
      router.push('/login')
      return
    }

    if (!cart?.items || cart.items.length === 0) {
      setError('Количката ви е празна')
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart,
          total: getTotal(),
          shippingAddress,
          notes: shippingAddress.notes
        }),
      })

      if (response.ok) {
        const data = await response.json()
        clearCart()
        router.push(`/order-confirmation/${data.orderId}`)
      } else {
        const error = await response.json()
        setError(error.error || 'Грешка при поръчката')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setError('Грешка при обработка на поръчката')
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <Loader2 className="w-12 h-12 animate-spin text-brand-green" />
      </div>
    )
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center max-w-md mx-auto px-4">
          <Package className="mx-auto mb-6 text-gray-400" size={80} />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Количката е празна
          </h2>
          <p className="text-gray-600 mb-8">
            Добавете продукти преди да продължите с поръчката
          </p>
          <Link
            href="/shop"
            className="inline-block bg-brand-green hover:bg-brand-green-dark text-white px-6 md:px-8 py-3 md:py-4 rounded-lg text-base md:text-lg font-semibold transition-colors"
          >
            Към магазина
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-brand-green hover:text-brand-green-dark mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Обратно към количката
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Поръчка</h1>

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <MapPin className="text-brand-green" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">Адрес за доставка</h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Пълно име *
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={shippingAddress.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Телефон *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={shippingAddress.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="+359..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Адрес *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={shippingAddress.address}
                    onChange={handleInputChange}
                    required
                    placeholder="ул. ..., № ..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      Град *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleInputChange}
                      required
                      placeholder="София"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                    />
                  </div>

                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Пощенски код *
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={handleInputChange}
                      required
                      placeholder="1000"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Бележки към поръчката
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={shippingAddress.notes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Допълнителни инструкции за доставка..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                  ></textarea>
                </div>
              </div>

              {/* Payment Method Info */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="text-brand-green" size={24} />
                  <h3 className="text-xl font-bold text-gray-900">Метод на плащане</h3>
                </div>
                <div className="bg-white border-2 border-brand-green rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Банков трансфер</span>
                    <span className="text-brand-green font-semibold">Избрано</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Ще получите банковите данни след потвърждаване на поръчката
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-8 bg-brand-green hover:bg-brand-green-dark text-white px-6 py-4 rounded-lg text-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Обработка...' : 'Потвърди поръчката'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Вашата поръчка
              </h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm line-clamp-2">{item.name}</h4>
                      <div className="text-sm text-gray-600">
                        {item.quantity} x {item.price.toFixed(2)} лв
                      </div>
                    </div>
                    <div className="text-brand-green font-bold">
                      {(item.price * item.quantity).toFixed(2)} лв
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold">Общо:</span>
                  <span className="text-3xl font-bold text-brand-green">
                    {getTotal().toFixed(2)} лв
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  *Цените са в левове без ДДС
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}