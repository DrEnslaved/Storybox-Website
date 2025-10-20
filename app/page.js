'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Scissors, Droplet, Image as ImageIcon, Zap, CheckCircle, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const services = [
    {
      icon: <Scissors className="w-12 h-12 text-brand-green" />,
      title: 'Машинна бродерия',
      description: 'Добра бродерия винаги прави страхотно впечатление. Качеството е в детайлите.',
      image: 'https://images.unsplash.com/photo-1497997092403-f091fcf5b6c4?w=600',
      slug: 'machine-embroidery'
    },
    {
      icon: <Droplet className="w-12 h-12 text-brand-green" />,
      title: 'Сублимация',
      description: 'Впечатяваме Вашия проект в материя или върху предмет. Качество при високи тиражи.',
      image: 'https://images.unsplash.com/photo-1503694978374-8a2fa686963a?w=600',
      slug: 'sublimation'
    },
    {
      icon: <ImageIcon className="w-12 h-12 text-brand-green" />,
      title: 'Трансферен печат',
      description: 'Лесен начин за прехвърляне на образци, надписи и цифри на различни материали.',
      image: 'https://images.unsplash.com/photo-1569852741721-ee5a94bf719e?w=600',
      slug: 'transfer-print'
    },
    {
      icon: <Zap className="w-12 h-12 text-brand-green" />,
      title: 'Лазерно рязане и кроене',
      description: 'Добавете контури, изрежете форми, прерязвайте идеи - бързо, прецизно и ефектно.',
      image: 'https://images.unsplash.com/photo-1738162837451-2041c1418f54?w=600',
      slug: 'laser-cutting'
    }
  ]

  const features = [
    {
      icon: <CheckCircle className="w-8 h-8 text-brand-green" />,
      title: 'Качество',
      description: 'Държим на качеството във всички наши проект. Вярваме в страхотното впечатление.'
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-brand-green" />,
      title: 'Екип с дългогодишен опит',
      description: 'Имаме повече от 15 години опит в областта на машинната бродерия и текстилния печат.'
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-brand-green" />,
      title: 'Кратки срокове',
      description: 'Високо качество на изработката в конкурентни срокове за изпълнение.'
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-brand-green" />,
      title: 'Бързата гама от услуги',
      description: 'Особен брандиране, можем да Ви дадем персонализиран опит върху всякакъв вид текстил.'
    }
  ]

  const projects = [
    {
      title: 'Корпоративни облекла',
      image: 'https://images.unsplash.com/photo-1623919268210-99a34497afde?w=600',
      description: 'Брандирани униформи за големи компании'
    },
    {
      title: 'Промоционални продукти',
      image: 'https://images.pexels.com/photos/7692240/pexels-photo-7692240.jpeg?w=600',
      description: 'Персонализирани рекламни материали'
    },
    {
      title: 'Спортни екипи',
      image: 'https://images.unsplash.com/photo-1526290766257-c015850e4629?w=600',
      description: 'Професионална бродерия на спортни облекла'
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1526290766257-c015850e4629?w=1920"
            alt="Машинна бродерия"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        </div>
        
        <div className="container mx-auto px-4 z-10 text-white">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Машинна бродерия
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Добрата бродерия винаги прави страхотно впечатление...
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/contact"
                className="bg-brand-green hover:bg-brand-green-dark text-white px-8 py-3 rounded-md text-lg font-semibold transition-colors inline-flex items-center gap-2"
              >
                Поискайте оферта
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/services"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-8 py-3 rounded-md text-lg font-semibold transition-colors border border-white/30"
              >
                Разгледайте услугите
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Нашите услуги</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Предлагаме пълен спектър от услуги за персонализация на текстил и материали
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="mb-4">{service.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <Link
                    href={`/services`}
                    className="text-brand-green font-semibold hover:text-brand-green-dark inline-flex items-center gap-1"
                  >
                    Повече информация
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Защо STORVBOX?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">{feature.icon}</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Избрани проекти</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Вижте някои от нашите последни реализации
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="relative h-64">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600">{project.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/projects"
              className="bg-brand-green hover:bg-brand-green-dark text-white px-8 py-3 rounded-md text-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              Вижте всички проекти
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1758269664127-1f744a56e06c?w=1920"
            alt="Контакт"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-green-900/80" />
        </div>
        
        <div className="container mx-auto px-4 z-10 relative text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Готови ли сте да започнем?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Свържете се с нас за безплатна консултация и оферта за вашия проект
          </p>
          <Link
            href="/contact"
            className="bg-white text-brand-green-dark hover:bg-gray-100 px-8 py-4 rounded-md text-lg font-semibold transition-colors inline-flex items-center gap-2"
          >
            Свържете се с нас
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}