import { NextResponse } from 'next/server'

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'

async function getMedusaAdminToken() {
  try {
    const authRes = await fetch(`${MEDUSA_URL}/auth/user/emailpass`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@storybox.bg',
        password: 'Pandora2019+'
      })
    })
    
    if (!authRes.ok) throw new Error('Failed to authenticate')
    
    const authData = await authRes.json()
    return authData.token
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

// GET: Fetch product by handle
export async function GET(request, { params }) {
  try {
    const handle = params.handle
    const token = await getMedusaAdminToken()
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
    }
    
    const response = await fetch(`${MEDUSA_URL}/admin/products?handle=${handle}&fields=*variants,*images,*variants.prices`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
    }
    
    const data = await response.json()
    const product = data.products?.[0]
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    
    // Transform product for frontend
    const transformed = {
      id: product.id,
      name: product.title,
      slug: product.handle,
      description: product.description,
      image: product.images?.[0]?.url || product.thumbnail,
      images: product.images?.map(img => img.url) || [],
      variants: product.variants?.map(variant => ({
        id: variant.id,
        title: variant.title,
        sku: variant.sku,
        price: variant.prices?.[0]?.amount ? variant.prices[0].amount / 100 : 0,
        currency: variant.prices?.[0]?.currency_code || 'bgn',
        inventory_quantity: variant.inventory_quantity || 999
      })) || [],
      inStock: true,
      medusaProduct: true,
      minQuantity: 10,
      maxQuantity: 5000
    }
    
    return NextResponse.json({ product: transformed })
  } catch (error) {
    console.error('Error fetching Medusa product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}
