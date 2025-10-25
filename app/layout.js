'use client'

import React, { useState } from 'react'
import './globals.css'
import Link from 'next/link'
import { Phone, Mail, MapPin, ShoppingCart, User } from 'lucide-react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { CartProvider, useCart } from '@/contexts/MedusaCartContext'
import CookieConsentBanner from '@/components/CookieConsent'

function Navigation() {
  const { user, logout } = useAuth()
  const { getItemCount } = useCart()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <>
      {/* Top Bar */}
      <div className="bg-brand-green text-white py-2 px-4 text-sm">
        <div className="container mx-auto flex flex-wrap justify-between items-center">
          <div className="flex gap-4 flex-wrap">
            <a href="tel:+359898973000" className="flex items-center gap-1 hover:text-green-200">
              <Phone size={14} />
              +359 898 973 000
            </a>
            <a href="mailto:office@storvbox.bg" className="flex items-center gap-1 hover:text-green-200">
              <Mail size={14} />
              office@storvbox.bg
            </a>
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              гр. Стралджа 27, ж.к. Горубляне, 1138 София
            </span>
          </div>
          <div className="flex gap-3">
            <a href="#" className="hover:text-green-200">Facebook</a>
            <a href="#" className="hover:text-green-200">Instagram</a>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">Storybox</span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-brand-green font-medium transition-colors">
                НАЧАЛО
              </Link>
              <Link href="/services" className="text-gray-700 hover:text-brand-green font-medium transition-colors">
                УСЛУГИ
              </Link>
              <Link href="/shop" className="text-gray-700 hover:text-brand-green font-medium transition-colors">
                МАГАЗИН
              </Link>
              <Link href="/projects" className="text-gray-700 hover:text-brand-green font-medium transition-colors">
                ПРОЕКТИ
              </Link>
              <Link href="/blog" className="text-gray-700 hover:text-brand-green font-medium transition-colors">
                БЛОГ
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-brand-green font-medium transition-colors">
                ЗА НАС
              </Link>
              <Link href="/contact" className="bg-brand-green text-white px-6 py-2 rounded-md hover:bg-brand-green-dark font-medium transition-colors">
                КОНТАКТИ
              </Link>
              
              {/* Cart Icon */}
              <Link href="/cart" className="relative text-gray-700 hover:text-brand-green">
                <ShoppingCart size={24} />
                {getItemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-green text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getItemCount()}
                  </span>
                )}
              </Link>

              {/* User Account */}
              {user ? (
                <div className="relative flex items-center gap-2">
                  <Link 
                    href="/account"
                    className="flex items-center gap-2 text-gray-700 hover:text-brand-green transition-colors"
                  >
                    <User size={20} />
                    <span className="text-sm">{user.name}</span>
                  </Link>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="text-gray-700 hover:text-brand-green transition-colors p-1"
                    aria-label="Menu"
                  >
                    <svg 
                      className="w-4 h-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-50 top-full">
                      <Link 
                        href="/account/orders" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Моите поръчки
                      </Link>
                      <button 
                        onClick={() => { logout(); setIsDropdownOpen(false); }} 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Изход
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="flex items-center gap-2 text-gray-700 hover:text-brand-green">
                  <User size={20} />
                  <span className="text-sm">Вход</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-brand-green-light mb-4">Storybox</h3>
            <p className="text-gray-400 text-sm">
              Професионални услуги по машинна бродерия, сублимация, трансферен печат и лазерно рязане.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Услуги</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/services" className="hover:text-brand-green-light">Машинна бродерия</Link></li>
              <li><Link href="/services" className="hover:text-brand-green-light">Сублимация</Link></li>
              <li><Link href="/services" className="hover:text-brand-green-light">Трансферен печат</Link></li>
              <li><Link href="/services" className="hover:text-brand-green-light">Лазерно рязане</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">За нас</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/about" className="hover:text-brand-green-light">Кои сме ние</Link></li>
              <li><Link href="/projects" className="hover:text-brand-green-light">Нашите проекти</Link></li>
              <li><Link href="/blog" className="hover:text-brand-green-light">Блог</Link></li>
              <li><Link href="/contact" className="hover:text-brand-green-light">Контакти</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Контакти</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-start gap-2">
                <Phone size={16} className="mt-1 flex-shrink-0" />
                <span>+359 898 973 000</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail size={16} className="mt-1 flex-shrink-0" />
                <span>office@storvbox.bg</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>гр. Стралджа 27, ж.к. Горубляне, 1138 София</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 Storybox. Всички права запазени.</p>
        </div>
      </div>
    </footer>
  )
}

export default function RootLayout({ children }) {
  return (
    <html lang="bg">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="\u041f\u0440\u043e\u0444\u0435\u0441\u0438\u043e\u043d\u0430\u043b\u043d\u0438 \u0443\u0441\u043b\u0443\u0433\u0438 \u043f\u043e \u043c\u0430\u0448\u0438\u043d\u043d\u0430 \u0431\u0440\u043e\u0434\u0435\u0440\u0438\u044f, \u0441\u0443\u0431\u043b\u0438\u043c\u0430\u0446\u0438\u044f, \u0442\u0440\u0430\u043d\u0441\u0444\u0435\u0440\u0435\u043d \u043f\u0435\u0447\u0430\u0442 \u0438 \u043b\u0430\u0437\u0435\u0440\u043d\u043e \u0440\u044f\u0437\u0430\u043d\u0435 \u0432 \u0421\u043e\u0444\u0438\u044f, \u0411\u044a\u043b\u0433\u0430\u0440\u0438\u044f" />
        <meta name="keywords" content="\u043c\u0430\u0448\u0438\u043d\u043d\u0430 \u0431\u0440\u043e\u0434\u0435\u0440\u0438\u044f \u0441\u043e\u0444\u0438\u044f, \u0431\u0440\u043e\u0434\u0435\u0440\u0438\u044f \u0431\u044a\u043b\u0433\u0430\u0440\u0438\u044f, \u0441\u0443\u0431\u043b\u0438\u043c\u0430\u0446\u0438\u044f \u043f\u0435\u0447\u0430\u0442, \u0442\u0440\u0430\u043d\u0441\u0444\u0435\u0440\u0435\u043d \u043f\u0435\u0447\u0430\u0442, \u043b\u0430\u0437\u0435\u0440\u043d\u043e \u0440\u044f\u0437\u0430\u043d\u0435, \u043a\u043e\u0440\u043f\u043e\u0440\u0430\u0442\u0438\u0432\u043d\u0438 \u043e\u0431\u043b\u0435\u043a\u043b\u0430 \u0441\u043e\u0444\u0438\u044f, machine embroidery sofia bulgaria" />
        <meta name="author" content="STORVBOX" />
        <meta name="geo.region" content="BG-22" />
        <meta name="geo.placename" content="Sofia" />
        <meta name="geo.position" content="42.697708;23.321868" />
        <meta name="ICBM" content="42.697708, 23.321868" />
        <link rel="canonical" href="https://storvbox-business.preview.emergentagent.com" />
        <title>STORVBOX - \u041c\u0430\u0448\u0438\u043d\u043d\u0430 \u0411\u0440\u043e\u0434\u0435\u0440\u0438\u044f \u0438 \u0422\u0435\u043a\u0441\u0442\u0438\u043b\u0435\u043d \u041f\u0435\u0447\u0430\u0442 | \u0421\u043e\u0444\u0438\u044f, \u0411\u044a\u043b\u0433\u0430\u0440\u0438\u044f</title>
      </head>
      <body>
        <AuthProvider>
          <CartProvider>
            <Navigation />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <CookieConsentBanner />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
