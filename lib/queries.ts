import { groq } from 'next-sanity'

export const servicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id,
    title,
    slug,
    description,
    icon,
    features,
    order
  }
`

export const projectsQuery = groq`
  *[_type == "project"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    technologies,
    publishedAt
  }
`

export const blogPostsQuery = groq`
  *[_type == "blogPost"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    mainImage,
    categories,
    excerpt,
    publishedAt
  }
`

export const companyInfoQuery = groq`
  *[_type == "companyInfo"][0] {
    _id,
    name,
    description,
    logo,
    contact,
    social
  }
`

// Single item queries
export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    icon,
    features
  }
`

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    body,
    technologies,
    publishedAt
  }
`

export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    mainImage,
    categories,
    excerpt,
    body,
    publishedAt
  }
`