import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import { Calendar, User } from 'lucide-react'
import { format } from 'date-fns'

export default function BlogCard({ post }) {
  return (
    <Link
      href={`/blog/${post.slug.current}`}
      className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      {post.mainImage && (
        <div className="relative h-56 overflow-hidden bg-gray-100">
          <Image
            src={urlFor(post.mainImage).width(600).height(400).url()}
            alt={post.mainImage.alt || post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-5">
        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.map((category) => (
              <span
                key={category._id}
                className="inline-block text-xs font-medium px-2 py-1 rounded"
                style={{
                  backgroundColor: `${category.color || '#10b981'}20`,
                  color: category.color || '#10b981',
                }}
              >
                {category.title}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-gray-500 pt-3 border-t border-gray-100">
          {post.author && (
            <div className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>{post.author.name}</span>
            </div>
          )}
          {post.publishedAt && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{format(new Date(post.publishedAt), 'd.MM.yyyy')}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
