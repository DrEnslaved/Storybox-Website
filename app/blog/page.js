import { client, queries } from '@/lib/sanity'
import BlogCard from '@/components/BlogCard'
import Link from 'next/link'

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
    <div className="min-h-screen">
      {/* Hero Section - matching homepage style */}
      <div className="relative bg-gradient-to-r from-green-600 to-green-700 py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Блог
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Новини, съвети и вдъхновение за бродерия и печат
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="px-6 py-2 bg-white border-2 border-gray-200 rounded-md hover:border-green-600 hover:bg-green-50 transition-all font-medium"
              >
                Всички
              </Link>
              {categories.map((category) => (\n                <Link
                  key={category._id}
                  href={`/blog/category/${category.slug.current}`}
                  className="px-6 py-2 bg-white border-2 rounded-md hover:bg-green-50 transition-all font-medium"
                  style={{
                    borderColor: category.color || '#10b981',
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
            <h2 className="text-2xl font-bold mb-6">Избрани статии</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <BlogCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* All Posts */}
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg mb-2">
              Все още няма публикувани статии.
            </p>
            <p className="text-gray-500">
              Очаквайте скоро нови публикации!
            </p>
          </div>
        ) : (
          <div>
            {featuredPosts.length > 0 && (
              <h2 className="text-2xl font-bold mb-6">Всички статии</h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
