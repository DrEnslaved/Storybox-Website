import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'yhhlq588',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'sbxdataset',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN, // Only used for write operations
})

// Helper function to generate image URLs
const builder = imageUrlBuilder(client)

export function urlFor(source) {
  return builder.image(source)
}

// Reusable GROQ queries
export const queries = {
  // Get all published blog posts
  posts: `*[_type == "post" && publishedAt <= now()] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    "author": author->{name, image},
    "categories": categories[]->{title, slug, color},
    featured
  }`,

  // Get single post by slug
  postBySlug: `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    mainImage,
    body,
    "author": author->{name, slug, image, bio},
    "categories": categories[]->{title, slug, color},
    seo
  }`,

  // Get featured posts
  featuredPosts: `*[_type == "post" && featured == true && publishedAt <= now()] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    publishedAt,
    excerpt,
    mainImage,
    "author": author->{name, image}
  }`,

  // Get all projects
  projects: `*[_type == "project"] | order(completedAt desc) {
    _id,
    title,
    slug,
    client,
    mainImage,
    services,
    completedAt,
    featured
  }`,

  // Get single project by slug
  projectBySlug: `*[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    client,
    mainImage,
    gallery,
    services,
    completedAt,
    description,
    challenge,
    solution,
    results,
    testimonial
  }`,

  // Get all services
  services: `*[_type == "service"] | order(order asc) {
    _id,
    title,
    slug,
    icon,
    image,
    shortDescription,
    pricing,
    order
  }`,

  // Get single service by slug
  serviceBySlug: `*[_type == "service" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    icon,
    image,
    shortDescription,
    fullDescription,
    features,
    pricing
  }`,

  // Get all categories
  categories: `*[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    color
  }`,
}
