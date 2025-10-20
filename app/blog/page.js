'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: 'Как да изберем правилната техника за персонализация',
      excerpt: 'Разгледайте различните методи за персонализация на текстил и научете кога е най-подходящ всеки от тях.',
      image: 'https://images.unsplash.com/photo-1497997092403-f091fcf5b6c4?w=800',
      category: 'Съвети',
      date: '15 Януари 2025',
      author: 'STORVBOX Team'
    },
    {
      id: 2,
      title: 'Тенденции в корпоративното облекло за 2025',
      excerpt: 'Открийте най-новите тенденции в дизайна на корпоративни униформи и работно облекло.',
      image: 'https://images.unsplash.com/photo-1623919268210-99a34497afde?w=800',
      category: 'Тенденции',
      date: '10 Януари 2025',
      author: 'STORVBOX Team'
    },
    {
      id: 3,
      title: 'Предимствата на машинната бродерия',
      excerpt: 'Защо машинната бродерия е най-качественият метод за персонализация на текстил.',
      image: 'https://images.unsplash.com/photo-1526290766257-c015850e4629?w=800',
      category: 'Технологии',
      date: '5 Януари 2025',
      author: 'STORVBOX Team'
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-green to-green-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Блог</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Полезни статии, съвети и новини от света на персонализацията на текстил
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600">Очаквайте скоро нови статии...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
                >
                  <div className="relative h-64">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-brand-green text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-2">
                      {post.date} • {post.author}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h2>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <Link
                      href={`/blog/${post.id}`}
                      className="text-brand-green font-semibold hover:text-brand-green-dark inline-flex items-center gap-1"
                    >
                      Прочети повече →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Абонирайте се за новини</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Получавайте последни новини, съвети и специални оферти директно на вашия имейл
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Вашият имейл адрес"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green"
            />
            <button className="bg-brand-green hover:bg-brand-green-dark text-white px-6 py-3 rounded-md font-semibold transition-colors">
              Абонирай се
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}