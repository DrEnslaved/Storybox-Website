import { NextResponse } from 'next/server'

// Public endpoint for fetching a single product by slug from Medusa
export async function GET(request, { params }) {
  try {
    const { slug } = params
    const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'
    const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
    
    // Fetch all products and find by handle (slug)
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/products?region_id=reg_01K8H69A87F81C7HE74RZENY8S`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(PUBLISHABLE_KEY && { 'x-publishable-api-key': PUBLISHABLE_KEY }),
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error('Medusa API error for product detail:', response.status)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const data = await response.json()
    console.log(`Found ${data.products?.length || 0} products, searching for slug: ${slug}`)
    
    const medusaProduct = data.products?.find(p => p.handle === slug)

    if (!medusaProduct) {
      console.error(`Product not found with slug: ${slug}`)
      console.log('Available handles:', data.products?.map(p => p.handle))
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Transform Medusa product
    const firstVariant = medusaProduct.variants?.[0]
    const price = firstVariant?.calculated_price?.calculated_amount 
      ? firstVariant.calculated_price.calculated_amount / 100
      : 0

    const productImages = medusaProduct.images || []
    const firstImage = productImages[0]?.url || '/placeholder-product.svg'

    const transformedProduct = {
      id: medusaProduct.id,
      name: medusaProduct.title,
      slug: medusaProduct.handle,
      description: medusaProduct.description || '',
      image: firstImage,
      images: productImages.length > 0 ? productImages.map(img => img.url) : [firstImage],
      price: price,
      category: medusaProduct.collection?.title || medusaProduct.type?.value || 'Други',
      categoryName: medusaProduct.collection?.title || medusaProduct.type?.value || 'Други',
      variants: medusaProduct.variants?.map(variant => ({
        id: variant.id,
        title: variant.title,
        sku: variant.sku,
        price: variant.calculated_price?.calculated_amount 
          ? variant.calculated_price.calculated_amount / 100
          : 0,
        inventory_quantity: variant.inventory_quantity || 0,
        options: variant.options?.map(opt => ({
          option: opt.option?.title || '',
          value: opt.value
        })) || [],
      })) || [],
      options: medusaProduct.options?.map(opt => ({
        id: opt.id,
        title: opt.title,
        values: opt.values?.map(v => v.value) || []
      })) || [],
      inventory: {
        status: 'in_stock',
        amount: firstVariant?.inventory_quantity || 100,
        minQuantity: 1,
      },
      metadata: medusaProduct.metadata || {}
    }

    return NextResponse.json({ 
      product: transformedProduct,
      source: 'medusa'
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}
