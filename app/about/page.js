'use client'

import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, Users, Award, Clock } from 'lucide-react'

export default function AboutPage() {
  const stats = [
    { number: '15+', label: 'Години опит' },
    { number: '500+', label: 'Доволни клиенти' },
    { number: '50000+', label: 'Изпълнени проекти' },
    { number: '100%', label: 'Удовлетвореност' }
  ]

  const values = [
    {
      icon: <CheckCircle className="w-12 h-12 text-brand-green" />,
      title: 'Качество',
      description: 'Използваме най-съвременното оборудване и материали за гарантиране на най-високо качество.'
    },
    {
      icon: <Users className="w-12 h-12 text-brand-green" />,
      title: 'Професионализъм',
      description: 'Нашият екип от опитни специалисти е на ваше разположение за консултация и подкрепа.'
    },
    {
      icon: <Clock className="w-12 h-12 text-brand-green" />,
      title: 'Бързина',
      description: 'Разбираме важността на сроковете и винаги доставяме навреме.'
    },
    {
      icon: <Award className="w-12 h-12 text-brand-green" />,
      title: 'Иновации',
      description: 'Следим най-новите технологии и тенденции в индустрията.'
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1758269664127-1f744a56e06c?w=1920"
            alt="За нас"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        </div>
        
        <div className="container mx-auto px-4 z-10 relative text-white">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">За нас</h1>
            <p className="text-xl leading-relaxed">
              STORVBOX е водеща компания в областта на машинната бродерия и персонализация на текстил в България. 
              С над 15 години опит, ние предлагаме висококачествени услуги за корпоративни клиенти и частни лица.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-brand-green mb-2">{stat.number}</div>
                <div className="text-gray-600 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Нашата история</h2>
              <div className="space-y-4 text-gray-700 text-lg">
                <p>
                  STORVBOX започна своята дейност през 2009 година с мисията да предостави 
                  на българския пазар професионални услуги по машинна бродерия и персонализация на текстил.
                </p>
                <p>
                  През годините разширихме нашите услуги, като добавихме сублимация, трансферен печат 
                  и лазерно рязане. Днес сме един от най-доверените партньори на водещи компании в България.
                </p>
                <p>
                  Нашият успех се крие в комбинацията от съвременни технологии, квалифициран персонал 
                  и индивидуален подход към всеки клиент.
                </p>
              </div>
            </div>
            
            <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1526290766257-c015850e4629?w=800"
                alt="Нашата работилница"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Нашите ценности</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Принципите, които ръководят нашата работа и определят нашия успех
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Нашият екип</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Професионалисти с дългогодишен опит, готови да реализират вашите идеи
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-3xl mx-auto">
            <p className="text-lg text-gray-700">
              Екипът на STORVBOX се състои от опитни специалисти в областта на машинната бродерия, 
              дизайна и текстилната индустрия. Всеки член на екипа е посветен на предоставянето на 
              най-добрите решения за нашите клиенти.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-green text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Готови да работим заедно?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Свържете се с нас и нека направим вашия проект реалност
          </p>
          <Link
            href="/contact"
            className="bg-white text-brand-green-dark hover:bg-gray-100 px-8 py-4 rounded-md text-lg font-semibold transition-colors inline-block"
          >
            Свържете се с нас
          </Link>
        </div>
      </section>
    </div>
  )
}