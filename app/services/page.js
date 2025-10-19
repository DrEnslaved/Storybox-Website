'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Scissors, Droplet, Image as ImageIcon, Zap, ArrowRight } from 'lucide-react'

export default function ServicesPage() {
  const services = [
    {
      id: 1,
      icon: <Scissors className="w-16 h-16 text-green-700" />,
      title: 'Машинна бродерия',
      description: 'Добра бродерия винаги прави страхотно впечатление. Качеството е в детайлите.',
      longDescription: 'Машинната бродерия е най-качественият начин за персонализация на текстил. Използваме най-съвременното оборудване за създаване на траен и елегантен изглед на вашите продукти. Подходяща за корпоративни облекла, промоционални материали, спортни екипи и много повече.',
      features: [
        'Висока прецизност и детайлност',
        'Устойчивост на износване',
        'Богата гама от цветове',
        'Подходяща за всякакви текстилни материали',
        'Обеми от 1 до 5000 броя'
      ],
      image: 'https://images.unsplash.com/photo-1497997092403-f091fcf5b6c4?w=800',
      slug: 'machine-embroidery'
    },
    {
      id: 2,
      icon: <Droplet className="w-16 h-16 text-green-700" />,
      title: 'Сублимация',
      description: 'Впечатяваме Вашия проект в материя или върху предмет. Качество при високи тиражи.',
      longDescription: 'Сублимационният печат предлага ярки цветове и фотографско качество. Технологията позволява трансфер на изображения върху полиестерни материали чрез термичен процес. Идеална за спортни екипи, знамена, рекламни материали и персонализирани подаръци.',
      features: [
        'Фотореалистично качество',
        'Ярки и наситени цветове',
        'Устойчивост на изпиране',
        'Пълноцветен печат',
        'Подходяща за полиестерни тъкани'
      ],
      image: 'https://images.unsplash.com/photo-1503694978374-8a2fa686963a?w=800',
      slug: 'sublimation'
    },
    {
      id: 3,
      icon: <ImageIcon className="w-16 h-16 text-green-700" />,
      title: 'Трансферен печат',
      description: 'Лесен начин за прехвърляне на образци, надписи и цифри на различни материали.',
      longDescription: 'Трансферният печат е универсален метод за нанасяне на дизайни върху текстил, керамика и други материали. Използва се за малки серии и персонализация. Подходящ за промоционални продукти, тениски, чаши и рекламни материали.',
      features: [
        'Бързо изпълнение',
        'Подходящ за малки и средни серии',
        'Разнообразие от материали',
        'Икономична ценова политика',
        'Възможност за персонализация'
      ],
      image: 'https://images.unsplash.com/photo-1569852741721-ee5a94bf719e?w=800',
      slug: 'transfer-print'
    },
    {
      id: 4,
      icon: <Zap className="w-16 h-16 text-green-700" />,
      title: 'Лазерно рязане и kroене',
      description: 'Добавете контури, изрежете форми, прерязвайте идеи - бързо, прецизно и ефектно.',
      longDescription: 'Лазерното рязане и гравиране предлага непревзходена прецизност и възможности за детайлизация. Подходящо за създаване на сложни форми, персонализирани продукти и прототипи. Работим с широка гама от материали.',
      features: [
        'Изключителна прецизност',
        'Рязане на сложни форми',
        'Подходящо за дърво, акрил, картон и др.',
        'Бързо изпълнение',
        'Персонализирани проекти'
      ],
      image: 'https://images.unsplash.com/photo-1738162837451-2041c1418f54?w=800',
      slug: 'laser-cutting'
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-700 to-green-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Нашите услуги</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Предлагаме пълен спектър от услуги за персонализация на текстил и материали с най-високо качество
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="space-y-20">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-12 items-center`}
              >
                <div className="lg:w-1/2">
                  <div className="relative h-96 rounded-lg overflow-hidden shadow-2xl">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                
                <div className="lg:w-1/2">
                  <div className="mb-6">{service.icon}</div>
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">{service.title}</h2>
                  <p className="text-xl text-gray-700 mb-6">{service.longDescription}</p>
                  
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Предимства:</h3>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-700 mt-1">✓</span>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link
                    href="/contact"
                    className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-md font-semibold transition-colors inline-flex items-center gap-2"
                  >
                    Поискайте оферта
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Имате въпроси?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Свържете се с нас за безплатна консултация и подробна оферта за вашия проект
          </p>
          <Link
            href="/contact"
            className="bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-md text-lg font-semibold transition-colors inline-flex items-center gap-2"
          >
            Свържете се с нас
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}