'use client'
import { PortableText } from '@portabletext/react'
import { urlFor } from '@/lib/sanity'
import Image from 'next/image'

const components = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null
      }
      return (
        <div className="my-8">
          <Image
            src={urlFor(value).width(800).url()}
            alt={value.alt || ' '}
            width={800}
            height={450}
            className="rounded-lg"
          />
          {value.caption && (
            <p className="text-sm text-gray-600 mt-2 text-center">
              {value.caption}
            </p>
          )}
        </div>
      )
    },
  },
  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold my-6">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold my-5">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold my-4">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-bold my-3">{children}</h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-green-500 pl-4 my-4 italic text-gray-700">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => <p className="my-4 leading-7">{children}</p>,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="my-4 ml-6 list-disc space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="my-4 ml-6 list-decimal space-y-2">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith('/')
        ? 'noreferrer noopener'
        : undefined
      return (
        <a
          href={value.href}
          rel={rel}
          className="text-green-600 hover:text-green-700 underline"
        >
          {children}
        </a>
      )
    },
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
  },
}

export default function PortableTextRenderer({ value }) {
  return <PortableText value={value} components={components} />
}
