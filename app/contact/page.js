'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Phone, Mail, MapPin, Send } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceType: '',
    quantity: '',
    description: '',
    timeline: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const services = [
    'Машинна бродерия',
    'Сублимация',
    'Трансферен печат',
    'Лазерно рязане',
    'Друго'
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch('/api/quote-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          serviceType: '',
          quantity: '',
          description: '',
          timeline: ''
        })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1746021375246-7dc8ab0583f0?w=1920"
            alt="Контакти"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        </div>
        
        <div className="container mx-auto px-4 z-10 relative text-white text-center">
          <h1 className="text-5xl font-bold mb-6">Свържете се с нас</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Готови сме да ви помогнем с вашия проект. Попълнете формуляра или ни се обадете директно
          </p>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <div className="bg-brand-green text-white p-8 rounded-lg h-full">
                <h2 className="text-2xl font-bold mb-8">Контактна информация</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Телефон</h3>
                      <p>+359899973002</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Имейл</h3>
                      <p>office@storybox.bg</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">Адрес</h3>
                      <p>гр. София</p>
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <h3 className="font-semibold mb-4">Работно време</h3>
                  <div className="space-y-2 text-sm">
                    <p>Понеделник - Петък: 9:00 - 18:00</p>
                    <p>Събота: 10:00 - 14:00</p>
                    <p>Неделя: Почивка</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote Request Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Поискайте оферта</h2>
                <p className="text-gray-600 mb-8">
                  Попълнете формуляра и ние ще се свържем с вас в рамките на 24 часа с подробна оферта.
                </p>

                {submitStatus === 'success' && (
                  <div className="mb-6 bg-green-100 border border-green-400 text-brand-green px-4 py-3 rounded">
                    <p className="font-semibold">Благодарим за заявката!</p>
                    <p className="text-sm">Ще се свържем с вас скоро.</p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p className="font-semibold">Грешка при изпращане</p>
                    <p className="text-sm">Моля, опитайте отново или ни се обадете директно.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Име и фамилия *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Имейл *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Телефон *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                      />
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                        Компания
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-2">
                        Тип услуга *
                      </label>
                      <select
                        id="serviceType"
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                      >
                        <option value="">Изберете...</option>
                        {services.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                        Количество *
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        min="1"
                        max="5000"
                        required
                        placeholder="1-5000"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                      Желан срок
                    </label>
                    <input
                      type="text"
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                      placeholder="Напр. 2 седмици"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Описание на проекта *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Моля, опишете какво имате предвид за проекта..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-green hover:bg-brand-green-dark text-white px-8 py-4 rounded-md text-lg font-semibold transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>Изпращане...</>
                    ) : (
                      <>
                        <Send size={20} />
                        Изпрати заявка
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-0">
        <div className="w-full h-96 bg-gray-200">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2934.5982947935995!2d23.289634315473445!3d42.67556797916493!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDQwJzMyLjAiTiAyM8KwMTcnMjguMCJF!5e0!3m2!1sen!2sbg!4v1234567890123!5m2!1sen!2sbg"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>
    </div>
  )
}