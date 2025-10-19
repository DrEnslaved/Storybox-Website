'use client'

import './globals.css'
import Link from 'next/link'
import { Phone, Mail, MapPin } from 'lucide-react'

export default function RootLayout({ children }) {
  return (
    <html lang="bg">
      <body>
        {/* Top Bar */}
        <div className="bg-green-700 text-white py-2 px-4 text-sm">
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
              <Link href="/" className="flex items-center">
                <div className="text-2xl font-bold">
                  <span className="text-green-700">STORVBOX</span>
                  <div className="text-xs text-gray-600 font-normal">Embroidery Print Design</div>
                </div>
              </Link>

              {/* Navigation Links */}
              <div className="hidden md:flex items-center gap-8">
                <Link href="/" className="text-gray-700 hover:text-green-700 font-medium transition-colors">
                  НАЧАЛО
                </Link>
                <Link href="/services" className="text-gray-700 hover:text-green-700 font-medium transition-colors">
                  УСЛУГИ
                </Link>
                <Link href="/projects" className="text-gray-700 hover:text-green-700 font-medium transition-colors">
                  ПРОЕКТИ
                </Link>
                <Link href="/blog" className="text-gray-700 hover:text-green-700 font-medium transition-colors">
                  БЛОГ
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-green-700 font-medium transition-colors">
                  ЗА НАС
                </Link>
                <Link href="/contact" className="bg-green-700 text-white px-6 py-2 rounded-md hover:bg-green-800 font-medium transition-colors">
                  КОНТАКТИ
                </Link>
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

        {/* Main Content */}
        <main className="min-h-screen">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold text-green-500 mb-4">STORVBOX</h3>
                <p className="text-gray-400 text-sm">
                  Професионални услуги по машинна бродерия, сублимация, трансферен печат и лазерно рязане.
                </p>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">Услуги</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><Link href="/services" className="hover:text-green-500">Машинна бродерия</Link></li>
                  <li><Link href="/services" className="hover:text-green-500">Сублимация</Link></li>
                  <li><Link href="/services" className="hover:text-green-500">Трансферен печат</Link></li>
                  <li><Link href="/services" className="hover:text-green-500">Лазерно рязане</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold mb-4">За нас</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><Link href="/about" className="hover:text-green-500">Кои сме ние</Link></li>
                  <li><Link href="/projects" className="hover:text-green-500">Нашите проекти</Link></li>
                  <li><Link href="/blog" className="hover:text-green-500">Блог</Link></li>
                  <li><Link href="/contact" className="hover:text-green-500">Контакти</Link></li>
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
              <p>&copy; 2025 STORVBOX. Всички права запазени.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}