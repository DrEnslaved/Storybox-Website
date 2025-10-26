import { client, queries, urlFor } from '@/lib/sanity'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Calendar, User, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import PortableTextRenderer from '@/components/PortableTextRenderer'

export const revalidate = 60

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await client.fetch(`*[_type == "post"]{ "slug": slug.current }`)
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const post = await client.fetch(queries.postBySlug, { slug: params.slug })

  if (!post) {
    return {
      title: 'Статия не е намерена',
    }
  }

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    keywords: post.seo?.keywords,
    openGraph: {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      images: post.seo?.ogImage
        ? [urlFor(post.seo.ogImage).width(1200).height(630).url()]
        : post.mainImage
        ? [urlFor(post.mainImage).width(1200).height(630).url()]
        : [],
    },
  }
}

async function getPost(slug) {
  try {
    const post = await client.fetch(queries.postBySlug, { slug })
    return post
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back button */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Обратно към блога</span>
          </Link>
        </div>
      </div>

      {/* Hero Image */}
      {post.mainImage && (
        <div className="relative w-full h-[400px] md:h-[500px] bg-gray-100">
          <Image
            src={urlFor(post.mainImage).width(1920).height(800).url()}
            alt={post.mainImage.alt || post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Article */}
      <article className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Categories */}
          {post.categories && post.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/blog/category/${category.slug.current}`}
                  className="inline-flex items-center px-4 py-2 rounded-md font-medium text-sm transition-all"
                  style={{
                    backgroundColor: `${category.color || '#10b981'}15`,
                    color: category.color || '#10b981',
                    border: `1px solid ${category.color || '#10b981'}40`,
                  }}
                >
                  {category.title}
                </Link>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b text-sm text-gray-600">
            {post.author && (
              <div className="flex items-center gap-2">
                {post.author.image && (
                  <Image
                    src={urlFor(post.author.image).width(40).height(40).url()}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div>
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span className="font-medium text-gray-900">
                      {post.author.name}
                    </span>
                  </div>
                </div>
              </div>
            )}
            {post.publishedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(post.publishedAt), 'd MMMM yyyy')}</span>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-green-600 hover:prose-a:text-green-700">
            {post.body && <PortableTextRenderer value={post.body} />}
          </div>

          {/* Author Bio */}
          {post.author?.bio && (
            <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start gap-4">
                {post.author.image && (
                  <Image
                    src={urlFor(post.author.image).width(80).height(80).url()}
                    alt={post.author.name}
                    width={80}
                    height={80}
                    className="rounded-full"
                  />
                )}
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900">
                    За автора: {post.author.name}
                  </h3>
                  <div className="text-gray-600 prose prose-sm">
                    <PortableTextRenderer value={post.author.bio} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Back to blog button */}
          <div className="mt-12 pt-8 border-t">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Всички статии
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
