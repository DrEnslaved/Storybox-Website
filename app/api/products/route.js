import { NextResponse } from 'next/server'

// Public endpoint for fetching products from Medusa
export async function GET(request) {
  try {
    const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'
    const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
    
    if (!PUBLISHABLE_KEY) {
      console.error('Missing NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY')
      return NextResponse.json({ 
        error: 'Configuration error',
        message: 'Publishable key is required' 
      }, { status: 500 })
    }
    
    // Fetch products from Medusa store API (region resolved automatically by Medusa based on currency)
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_KEY,
      },
      cache: 'no-store', // Disable caching for fresh data
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Medusa API error:', response.status, response.statusText, errorText)
      return NextResponse.json({ 
        error: 'Failed to fetch products',
        details: errorText
      }, { status: response.status })
    }

    const data = await response.json()
    const medusaProducts = data.products || []

    // Transform Medusa products to match shop page format
    const transformedProducts = medusaProducts.map(product => {
      // Get the first variant's price (Medusa v2 stores prices in variants)
      const firstVariant = product.variants?.[0]
      const price = firstVariant?.calculated_price?.calculated_amount 
        ? firstVariant.calculated_price.calculated_amount / 100 // Convert from cents to currency
        : 0

      // Get product images
      const productImages = product.images || []
      const firstImage = productImages[0]?.url || '/placeholder-product.svg'

      return {
        id: product.id,
        name: product.title,
        slug: product.handle,
        description: product.description || '',
        image: firstImage,
        images: productImages.map(img => img.url),
        price: price,
        compareAtPrice: null,
        salePrice: null,
        category: product.collection?.title || product.type?.value || 'Други',
        categoryName: product.collection?.title || product.type?.value || 'Други',
        tags: product.tags?.map(tag => tag.value) || [],
        badges: [],
        inStock: true, // Medusa handles inventory differently
        inventory: {
          status: 'in_stock',
          amount: firstVariant?.inventory_quantity || 0,
          minQuantity: 1,
        },
        variants: product.variants?.map(variant => ({
          id: variant.id,
          title: variant.title,
          sku: variant.sku,
          price: variant.calculated_price?.calculated_amount 
            ? variant.calculated_price.calculated_amount / 100
            : 0,
          inventory_quantity: variant.inventory_quantity || 0,
          options: variant.options || [],
        })) || [],
        priceTiers: [],
        sku: firstVariant?.sku || '',
        shipping: {},
        featured: false,
        metadata: product.metadata || {}
      }
    })

    return NextResponse.json({ 
      products: transformedProducts,
      source: 'medusa',
      count: transformedProducts.length
    })
  } catch (error) {
    console.error('Error fetching products from Medusa:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch products',
      message: error.message
    }, { status: 500 })
  }
}
