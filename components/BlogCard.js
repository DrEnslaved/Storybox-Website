import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import { Calendar, User } from 'lucide-react'
import { format } from 'date-fns'

export default function BlogCard({ post }) {
  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Image */}
      {post.mainImage && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={urlFor(post.mainImage).width(600).height(400).url()}
            alt={post.mainImage.alt || post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.map((category) => (
              <span
                key={category._id}
                className="text-xs font-semibold px-2 py-1 rounded"
                style={{
                  backgroundColor: category.color || '#10b981',
                  color: '#ffffff',
                }}
              >
                {category.title}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-bold mb-2 group-hover:text-green-600 transition-colors">
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {post.author && (
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>{post.author.name}</span>
            </div>
          )}
          {post.publishedAt && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(post.publishedAt), 'd MMM yyyy')}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
