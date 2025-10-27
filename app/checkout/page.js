'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useCart } from '@/contexts/MedusaCartContext'
import { CreditCard, MapPin, Package, ArrowLeft, Loader2, Truck, Home } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { cart, getTotal, clearCart, loading } = useCart()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [deliveryMethod, setDeliveryMethod] = useState('courier') // 'courier' or 'pickup'
  
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  })

  const [pickupLocation] = useState({
    name: 'Storybox Централен Офис',
    address: 'ул. Примерна 123',
    city: 'София',
    postalCode: '1000',
    phone: '+359899973002',
    workingHours: 'Понеделник-Петък: 9:00-18:00'
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

    // Validate based on delivery method
    if (deliveryMethod === 'courier') {
      if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address || 
          !shippingAddress.city || !shippingAddress.postalCode) {
        setError('Моля, попълнете всички задължителни полета за адрес на доставка')
        return
      }
    } else {
      // For pickup, only phone and name are required
      if (!shippingAddress.fullName || !shippingAddress.phone) {
        setError('Моля, попълнете име и телефон за вдигане на поръчката')
        return
      }
    }

    setIsProcessing(true)

    try {
      // Split fullName into first and last name
      const nameParts = shippingAddress.fullName.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || nameParts[0]

      // Prepare address based on delivery method
      const addressData = deliveryMethod === 'pickup' 
        ? {
            firstName,
            lastName,
            phone: shippingAddress.phone,
            address: pickupLocation.address,
            city: pickupLocation.city,
            postalCode: pickupLocation.postalCode,
          }
        : {
            firstName,
            lastName,
            phone: shippingAddress.phone,
            address: shippingAddress.address,
            city: shippingAddress.city,
            postalCode: shippingAddress.postalCode,
          }

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartId: cart.id,
          email: user.email,
          customerName: shippingAddress.fullName,
          shippingAddress: addressData,
          deliveryMethod,
          notes: shippingAddress.notes || (deliveryMethod === 'pickup' ? 'Вдигане от офис' : '')
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Clear cart immediately after successful order
        await clearCart()
        // Navigate to order confirmation
        router.push(`/order-confirmation/${data.orderId}`)
      } else {
        const error = await response.json()
        setError(error.error || 'Грешка при поръчката. Моля опитайте отново.')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setError('Грешка при обработка на поръчката. Моля опитайте отново.')
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
              {/* Delivery Method Selection */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Метод на доставка</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Courier Option */}
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('courier')}
                    className={`relative p-6 border-2 rounded-lg transition-all ${
                      deliveryMethod === 'courier'
                        ? 'border-brand-green bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <Truck className={deliveryMethod === 'courier' ? 'text-brand-green' : 'text-gray-400'} size={32} />
                      <div className="flex-1 text-left">
                        <h3 className="font-bold text-lg mb-1">Куриер</h3>
                        <p className="text-sm text-gray-600">Доставка до адрес</p>
                        <p className="text-sm text-gray-500 mt-2">2-3 работни дни</p>
                      </div>
                    </div>
                    {deliveryMethod === 'courier' && (
                      <div className="absolute top-3 right-3 bg-brand-green text-white rounded-full p-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>

                  {/* Pickup Option */}
                  <button
                    type="button"
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`relative p-6 border-2 rounded-lg transition-all ${
                      deliveryMethod === 'pickup'
                        ? 'border-brand-green bg-green-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <Home className={deliveryMethod === 'pickup' ? 'text-brand-green' : 'text-gray-400'} size={32} />
                      <div className="flex-1 text-left">
                        <h3 className="font-bold text-lg mb-1">Вдигане</h3>
                        <p className="text-sm text-gray-600">От офис</p>
                        <p className="text-sm text-gray-500 mt-2">Безплатно</p>
                      </div>
                    </div>
                    {deliveryMethod === 'pickup' && (
                      <div className="absolute top-3 right-3 bg-brand-green text-white rounded-full p-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>

                {/* Pickup Location Info */}
                {deliveryMethod === 'pickup' && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">📍 Локация за вдигане:</h4>
                    <p className="text-sm text-gray-700"><strong>{pickupLocation.name}</strong></p>
                    <p className="text-sm text-gray-600">{pickupLocation.address}, {pickupLocation.city} {pickupLocation.postalCode}</p>
                    <p className="text-sm text-gray-600">Телефон: {pickupLocation.phone}</p>
                    <p className="text-sm text-gray-500 mt-1">{pickupLocation.workingHours}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 mb-6">
                <MapPin className="text-brand-green" size={24} />
                <h2 className="text-2xl font-bold text-gray-900">
                  {deliveryMethod === 'courier' ? 'Адрес за доставка' : 'Информация за контакт'}
                </h2>
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
                {cart.items.map((item) => {
                  const thumbnail = item.thumbnail || item.variant?.product?.thumbnail
                  const title = item.title || item.variant?.product?.title
                  const unitPrice = (item.unit_price || 0) / 100
                  const subtotal = (item.subtotal || 0) / 100
                  
                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative w-16 h-16 flex-shrink-0 bg-gray-200 rounded overflow-hidden">
                        {thumbnail ? (
                          <Image
                            src={thumbnail}
                            alt={title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            N/A
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm line-clamp-2">{title}</h4>
                        {item.variant?.title && (
                          <p className="text-xs text-gray-500">{item.variant.title}</p>
                        )}
                        <div className="text-sm text-gray-600">
                          {item.quantity} x {unitPrice.toFixed(2)} лв
                        </div>
                      </div>
                      <div className="text-brand-green font-bold">
                        {subtotal.toFixed(2)} лв
                      </div>
                    </div>
                  )
                })}
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