'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getTotal, getItemCount, clearCart } = useCart()

  const handleUpdateQuantity = (productId, newQuantity, min = 1, max = 5000) => {
    const validQuantity = Math.max(min, Math.min(max, newQuantity))
    updateQuantity(productId, validQuantity)
  }

  if (cart.length === 0) {
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
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-4 md:p-6"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <Link href={`/shop/${item.slug}`} className="flex-shrink-0">
                    <div className="relative w-full sm:w-32 h-32 bg-gray-200 rounded-lg overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/shop/${item.slug}`}
                      className="block mb-2"
                    >
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 hover:text-brand-green transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                    </Link>
                    
                    <div className="text-brand-green font-bold text-xl mb-4">
                      {item.price.toFixed(2)} лв / бр.
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="flex items-center border-2 border-gray-300 rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(
                            item.id,
                            item.quantity - (item.minQuantity || 1),
                            item.minQuantity,
                            item.maxQuantity
                          )}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled={item.quantity <= (item.minQuantity || 1)}
                          aria-label="Намали количеството"
                        >
                          <Minus size={18} />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(
                            item.id,
                            parseInt(e.target.value) || item.minQuantity || 1,
                            item.minQuantity,
                            item.maxQuantity
                          )}
                          className="w-16 text-center py-2 focus:outline-none font-semibold"
                          min={item.minQuantity || 1}
                          max={item.maxQuantity || 5000}
                          aria-label="Количество"
                        />
                        <button
                          onClick={() => handleUpdateQuantity(
                            item.id,
                            item.quantity + (item.minQuantity || 1),
                            item.minQuantity,
                            item.maxQuantity
                          )}
                          className="p-2 hover:bg-gray-100 transition-colors"
                          disabled={item.quantity >= (item.maxQuantity || 5000)}
                          aria-label="Увеличи количеството"
                        >
                          <Plus size={18} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Subtotal: <strong className="text-brand-green text-lg">{(item.price * item.quantity).toFixed(2)} лв</strong></span>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto text-red-600 hover:text-red-800 transition-colors flex items-center gap-2"
                        aria-label="Премахни от количката"
                      >
                        <Trash2 size={18} />
                        <span className="hidden sm:inline">Премахни</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

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