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

// GET: Fetch all products
export async function GET(request) {
  try {
    const token = await getMedusaAdminToken()
    if (!token) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
    }
    
    const response = await fetch(`${MEDUSA_URL}/admin/products?fields=*variants,*images,*variants.prices&limit=100`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }
    
    const data = await response.json()
    
    // Transform products for frontend
    const transformedProducts = (data.products || []).map(product => ({
      id: product.id,
      name: product.title,
      slug: product.handle,
      description: product.description,
      image: product.images?.[0]?.url || product.thumbnail,
      images: product.images?.map(img => img.url) || [],
      priceTiers: product.variants?.map(variant => ({
        tierName: variant.title?.toLowerCase() || 'standard',
        price: variant.prices?.[0]?.amount ? variant.prices[0].amount / 100 : 0,
        variantId: variant.id,
        sku: variant.sku
      })) || [],
      inStock: true,
      medusaProduct: true,
      variants: product.variants || []
    }))
    
    return NextResponse.json({ 
      products: transformedProducts,
      source: 'medusa' 
    })
  } catch (error) {
    console.error('Error fetching Medusa products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
