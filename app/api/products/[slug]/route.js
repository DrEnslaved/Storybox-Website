import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'

// Public endpoint for fetching a single product by slug
export async function GET(request, { params }) {
  try {
    const { slug } = params
    const { db } = await connectToDatabase()
    
    // Find product by slug or by name-based slug
    const product = await db.collection('products').findOne({
      $or: [
        { 'seo.slug': slug },
        { id: slug },
        { sku: slug }
      ],
      status: 'active'
    })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Transform to match shop page format
    const transformedProduct = {
      id: product.id || product._id.toString(),
      name: product.name,
      slug: product.seo?.slug || product.name.toLowerCase().replace(/\s+/g, '-'),
      description: product.description || '',
      image: product.coverImage || product.images?.[0] || null,
      images: [product.coverImage, ...product.gallery].filter(Boolean),
      price: product.price || 0,
      compareAtPrice: product.compareAtPrice,
      salePrice: product.salePrice,
      category: product.category,
      tags: product.tags || [],
      badges: product.badges || [],
      inStock: product.inventory?.amount > 0,
      inventory: product.inventory,
      variants: product.variants || [],
      priceTiers: product.b2b?.bulkPricing || [],
      sku: product.sku,
      shipping: product.shipping,
      seo: product.seo,
      featured: product.featured
    }

    return NextResponse.json({ product: transformedProduct })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}
