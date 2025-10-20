'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function ProjectsPage() {
  const projects = [
    {
      id: 1,
      title: 'Корпоративни облекла за големи компании',
      category: 'Корпоративни',
      description: 'Брандирани униформи и работно облекло за над 500 служители на водеща компания в България',
      image: 'https://images.unsplash.com/photo-1623919268210-99a34497afde?w=800',
      technologies: ['Машинна бродерия', 'Трансферен печат'],
      results: 'Над 2000 бр. персонализирани изделия'
    },
    {
      id: 2,
      title: 'Промоционални материали',
      category: 'Рекламни материали',
      description: 'Пълна гама рекламни продукти - чанти, тениски, шапки, за национална маркетинг кампания',
      image: 'https://images.pexels.com/photos/7692240/pexels-photo-7692240.jpeg?w=800',
      technologies: ['Сублимация', 'Машинна бродерия', 'Трансферен печат'],
      results: '5000+ промоционални артикула'
    },
    {
      id: 3,
      title: 'Спортни екипи - Футболен клуб',
      category: 'Спорт',
      description: 'Професионална бродерия на спортни облекла за футболен тим включващ екипи, тениски и аксесоари',
      image: 'https://images.unsplash.com/photo-1526290766257-c015850e4629?w=800',
      technologies: ['Машинна бродерия', 'Сублимация'],
      results: 'Пълна екипировка за 25 играча'
    },
    {
      id: 4,
      title: 'Персонализирани подаръци',
      category: 'Подаръци',
      description: 'Уникални корпоративни подаръци с лазерно гравиране и бродерия за годишна корпоративна среща',
      image: 'https://images.pexels.com/photos/12331829/pexels-photo-12331829.jpeg?w=800',
      technologies: ['Лазерно рязане', 'Машинна бродерия'],
      results: '300 уникални подаръка'
    },
    {
      id: 5,
      title: 'Ресторантска верига - Униформи',
      category: 'Хорека',
      description: 'Елегантни персонализирани униформи за персонала на ресторантска верига с 15 обекта',
      image: 'https://images.unsplash.com/photo-1615286922420-c6b348ffbd62?w=800',
      technologies: ['Машинна бродерия'],
      results: 'Облекла за 200+ служители'
    },
    {
      id: 6,
      title: 'Event мърчандайз',
      category: 'События',
      description: 'Продукция на мърчандайз материали за музикален фестивал - тениски, шапки, торби',
      image: 'https://images.unsplash.com/photo-1746021375246-7dc8ab0583f0?w=800',
      technologies: ['Сублимация', 'Трансферен печат'],
      results: '3000+ артикула за 3 дни'
    }
  ]

  const categories = ['Всички', 'Корпоративни', 'Рекламни материали', 'Спорт', 'Подаръци', 'Хорека', 'События']

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-green to-green-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Нашите проекти</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Вижте някои от успешните проекти, които сме реализирали за нашите клиенти
          </p>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="bg-white py-8 shadow-sm sticky top-[73px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full border-2 border-brand-green text-brand-green hover:bg-brand-green hover:text-white transition-colors font-medium"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
              >
                <div className="relative h-64">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-brand-green text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {project.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Използвани технологии:</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <p className="text-brand-green font-semibold">{project.results}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Готови за вашия проект?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Нека направим и вашия проект реалност. Свържете се с нас за консултация
          </p>
          <Link
            href="/contact"
            className="bg-brand-green hover:bg-brand-green-dark text-white px-8 py-4 rounded-md text-lg font-semibold transition-colors"
          >
            Започнете сега
          </Link>
        </div>
      </section>
    </div>
  )
}