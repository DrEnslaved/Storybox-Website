'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { CheckCircle, CreditCard, MapPin, Printer, XCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function OrderConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState('')

  useEffect(() => {
    if (params.orderId) {
      fetchOrder()
    }
  }, [params.orderId])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${params.orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
      } else {
        router.push('/account/orders')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      router.push('/account/orders')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async () => {
    if (!confirm('Сигурни ли сте, че искате да анулирате тази поръчка?')) {
      return
    }

    setCancelling(true)
    setCancelError('')

    try {
      const response = await fetch(`/api/orders/${params.orderId}/cancel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        // Refresh order data
        await fetchOrder()
        alert('Поръчката е анулирана успешно')
      } else {
        const data = await response.json()
        setCancelError(data.error || 'Грешка при анулиране на поръчката')
      }
    } catch (error) {
      console.error('Error cancelling order:', error)
      setCancelError('Грешка при анулиране на поръчката')
    } finally {
      setCancelling(false)
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Зареждане...</div>
      </div>
    )
  }

  if (!order) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6 md:mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-brand-green rounded-full mb-4">
            <CheckCircle className="text-white" size={48} />
          </div>
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
            Благодарим за поръчката!
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-4">
            Вашата поръчка е приета успешно
          </p>
          <div className="inline-block bg-gray-100 px-4 md:px-6 py-2 md:py-3 rounded-lg">
            <span className="text-sm text-gray-600">Номер на поръчка:</span>
            <div className="text-lg md:text-xl font-bold text-brand-green mt-1">#{order.id}</div>
          </div>
        </div>

        {/* Bank Transfer Instructions */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="text-brand-green" size={28} />
            <h2 className="text-2xl font-bold text-gray-900">Инструкции за плащане</h2>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 md:p-6 mb-6">
            <p className="text-amber-800 font-semibold mb-2">
              Моля, извършете банковия трансфер на следните банкови данни:
            </p>
            <p className="text-sm text-amber-700">
              Поръчката ще бъде обработена след получаване на плащането
            </p>
          </div>

          <div className="space-y-4 bg-gray-50 p-4 md:p-6 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">Бенефициент:</div>
                <div className="font-bold text-gray-900">STORVBOX EOOD</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">IBAN:</div>
                <div className="font-bold text-gray-900">BG80 BNBG 9661 3000 1234 56</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">БИК:</div>
                <div className="font-bold text-gray-900">BNBGBGSD</div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Банка:</div>
                <div className="font-bold text-gray-900">БНБ - Българска Народна Банка</div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="text-sm text-gray-600 mb-1">Основание за плащане:</div>
              <div className="font-bold text-gray-900 bg-white px-4 py-2 rounded">
                Поръчка #{order.id}
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="text-sm text-gray-600 mb-1">Сума за плащане:</div>
              <div className="text-3xl font-bold text-brand-green">
                {order.total.toFixed(2)} лв
              </div>
              <div className="text-sm text-gray-600 mt-1">*Без ДДС</div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="text-brand-green" size={28} />
            <h2 className="text-2xl font-bold text-gray-900">Адрес за доставка</h2>
          </div>
          <div className="space-y-2 text-gray-700">
            <p className="font-semibold">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.phone}</p>
            <p>{order.shippingAddress.address}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
            {order.notes && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600 mb-1">Бележки:</p>
                <p className="text-gray-700">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6 md:mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Поръчани продукти</h2>
          <div className="space-y-4">
            {order.items && Array.isArray(order.items) && order.items.map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b last:border-b-0">
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">{item.name || item.title}</div>
                  {item.variant?.title && (
                    <div className="text-xs text-gray-500">{item.variant.title}</div>
                  )}
                  <div className="text-sm text-gray-600">
                    {item.quantity} x {(item.price || item.unit_price / 100 || 0).toFixed(2)} лв
                  </div>
                </div>
                <div className="font-bold text-brand-green">
                  {((item.price || item.unit_price / 100 || 0) * item.quantity).toFixed(2)} лв
                </div>
              </div>
            ))}
            {(!order.items || !Array.isArray(order.items) || order.items.length === 0) && (
              <div className="text-center text-gray-500 py-4">
                Няма продукти в тази поръчка
              </div>
            )}
          </div>
          <div className="mt-6 pt-6 border-t flex justify-between items-center">
            <span className="text-xl font-semibold">Общо:</span>
            <span className="text-3xl font-bold text-brand-green">
              {(order.total || 0).toFixed(2)} лв
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Cancel button - only show if order can be cancelled */}
          {order.status && ['pending_payment', 'processing'].includes(order.status) && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="flex items-center justify-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelling ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Анулиране...
                </>
              ) : (
                <>
                  <XCircle size={20} />
                  Анулирай поръчката
                </>
              )}
            </button>
          )}
          
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <Printer size={20} />
            Отпечатай
          </button>
          <Link
            href="/account/orders"
            className="text-center bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Виж моите поръчки
          </Link>
          <Link
            href="/shop"
            className="text-center border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Продължи пазаруването
          </Link>
        </div>

        {/* Cancel Error Message */}
        {cancelError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
            {cancelError}
          </div>
        )}

        {/* Contact Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">
            За въпроси относно вашата поръчка:
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center items-center text-sm">
            <a href="tel:+359898973000" className="text-brand-green hover:text-brand-green-dark font-semibold">
              +359 898 973 000
            </a>
            <span className="hidden sm:inline text-gray-400">|</span>
            <a href="mailto:office@storvbox.bg" className="text-brand-green hover:text-brand-green-dark font-semibold">
              office@storvbox.bg
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}