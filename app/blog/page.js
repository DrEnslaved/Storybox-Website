import { client, queries } from '@/lib/sanity'
import BlogCard from '@/components/BlogCard'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const revalidate = 60 // Revalidate every 60 seconds

async function getPosts() {
  try {
    const posts = await client.fetch(queries.posts)
    return posts || []
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

async function getCategories() {
  try {
    const categories = await client.fetch(queries.categories)
    return categories || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export default async function BlogPage() {
  const posts = await getPosts()
  const categories = await getCategories()

  const featuredPosts = posts.filter((post) => post.featured)
  const regularPosts = posts.filter((post) => !post.featured)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Блог</h1>
          <p className="text-xl opacity-90">
            Новини, съвети и вдъхновение за бродерия и печат
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Категории</h2>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/blog"
                className="px-4 py-2 bg-white rounded-full shadow hover:shadow-md transition-shadow"
              >
                Всички
              </Link>
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/blog/category/${category.slug.current}`}
                  className="px-4 py-2 bg-white rounded-full shadow hover:shadow-md transition-shadow"
                  style={{
                    borderLeft: `4px solid ${category.color || '#10b981'}`,
                  }}
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Избрани статии</h2>
              <ArrowRight className="w-6 h-6 text-green-600" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* All Posts */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Все още няма публикувани статии.
            </p>
            <p className="text-gray-500 mt-2">
              Очаквайте скоро нови публикации!
            </p>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-6">
              {featuredPosts.length > 0 ? 'Всички статии' : 'Последни статии'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
