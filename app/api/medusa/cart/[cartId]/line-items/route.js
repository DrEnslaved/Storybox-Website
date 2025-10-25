import { NextResponse } from 'next/server'

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

// POST: Add line item to cart
export async function POST(request, { params }) {
  try {
    const cartId = params.cartId
    const { variant_id, quantity } = await request.json()
    
    const headers = {
      'Content-Type': 'application/json'
    }
    
    if (PUBLISHABLE_KEY) {
      headers['x-publishable-api-key'] = PUBLISHABLE_KEY
    }
    
    const response = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/line-items`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ variant_id, quantity })
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Medusa add to cart error:', errorData)
      return NextResponse.json({ error: 'Failed to add item to cart', details: errorData }, { status: 500 })
    }
    
    const data = await response.json()
    return NextResponse.json({ cart: data.cart })
  } catch (error) {
    console.error('Error adding line item:', error)
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 })
  }
}
