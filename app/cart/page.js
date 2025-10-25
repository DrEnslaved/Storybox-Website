'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/MedusaCartContext'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotal, getItemCount, clearCart, loading } = useCart()

  const handleUpdateQuantity = (lineItemId, newQuantity, min = 1, max = 5000) => {
    const validQuantity = Math.max(min, Math.min(max, newQuantity))
    updateQuantity(lineItemId, validQuantity)
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
          <ShoppingBag className="mx-auto mb-6 text-gray-400" size={80} />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Количката е празна
          </h2>
          <p className="text-gray-600 mb-8">
            Добавете продукти от нашия магазин
          </p>
          <Link
            href="/shop"
            className="inline-block bg-brand-green hover:bg-brand-green-dark text-white px-6 md:px-8 py-3 md:py-4 rounded-lg text-base md:text-lg font-semibold transition-colors"
          >
            Разгледай продукти
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Количка</h1>
          <p className="text-gray-600">{getItemCount()} продукта в количката</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              const thumbnail = item.thumbnail || item.variant?.product?.thumbnail
              const title = item.title || item.variant?.product?.title
              const unitPrice = (item.unit_price || 0) / 100 // Medusa stores in cents
              const subtotal = (item.subtotal || 0) / 100
              
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md p-4 md:p-6"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <div className="relative w-full sm:w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
                        {thumbnail ? (
                          <Image
                            src={thumbnail}
                            alt={title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Няма изображение
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="block mb-2">
                        <h3 className="text-lg md:text-xl font-bold text-gray-900 line-clamp-2">
                          {title}
                        </h3>
                        {item.variant?.title && (
                          <p className="text-sm text-gray-600 mt-1">
                            Вариант: {item.variant.title}
                          </p>
                        )}
                      </div>
                      
                      <div className="text-brand-green font-bold text-xl mb-4">
                        {unitPrice.toFixed(2)} лв / бр.
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="flex items-center border-2 border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, 1, 5000)}
                            className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={18} />
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1, 1, 5000)}
                            className="w-16 md:w-20 text-center border-x-2 border-gray-300 py-2 focus:outline-none"
                            min="1"
                            max="5000"
                          />
                          <button
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, 1, 5000)}
                            className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity >= 5000}
                          >
                            <Plus size={18} />
                          </button>
                        </div>

                        <div className="text-gray-900 font-bold text-lg">
                          Общо: {subtotal.toFixed(2)} лв
                        </div>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="self-start sm:self-center p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              )
            })}

            {/* Clear Cart */}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 transition-colors flex items-center gap-2 text-sm"
                aria-label="Изпразни количката"
              >
                <Trash2 size={16} />
                Изпразни количката
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Обобщение
              </h2>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-600">
                  <span>Брой продукти:</span>
                  <span className="font-semibold">{getItemCount()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Междинен итог:</span>
                  <span className="font-semibold">{getTotal().toFixed(2)} лв</span>
                </div>
              </div>

              <div className="mb-6">
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

              <div className="space-y-3">
                <Link
                  href="/checkout"
                  className="w-full block text-center bg-brand-green hover:bg-brand-green-dark text-white px-6 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  Към поръчка
                  <ArrowRight size={20} />
                </Link>

                <Link
                  href="/shop"
                  className="w-full block text-center border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Продължи пазаруването
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 text-center">
                  Нуждаете се от помощ?{' '}
                  <Link href="/contact" className="text-brand-green hover:text-brand-green-dark font-semibold">
                    Свържете се с нас
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}