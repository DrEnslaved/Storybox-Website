import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'

// Public endpoint for fetching products on the shop page
export async function GET(request) {
  try {
    const { db } = await connectToDatabase()
    
    // Only fetch active and public products
    const products = await db.collection('products')
      .find({
        status: 'active',
        visibility: { $in: ['public', null] } // null for backwards compatibility
      })
      .sort({ createdAt: -1 })
      .toArray()

    // Transform to match shop page format
    const transformedProducts = products.map(product => ({
      id: product.id || product._id.toString(),
      name: product.name,
      slug: product.seo?.slug || product.name.toLowerCase().replace(/\s+/g, '-'),
      description: product.description || '',
      image: product.coverImage || product.images?.[0] || null,
      images: product.gallery || [],
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
      featured: product.featured
    }))

    return NextResponse.json({ 
      products: transformedProducts,
      source: 'admin_products'
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
