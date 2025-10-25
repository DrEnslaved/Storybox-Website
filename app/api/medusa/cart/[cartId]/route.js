import { NextResponse } from 'next/server'

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

// GET: Fetch cart by ID
export async function GET(request, { params }) {
  try {
    const cartId = params.cartId
    
    const headers = {
      'Content-Type': 'application/json'
    }
    
    if (PUBLISHABLE_KEY) {
      headers['x-publishable-api-key'] = PUBLISHABLE_KEY
    }
    
    const response = await fetch(`${MEDUSA_URL}/store/carts/${cartId}`, {
      headers
    })
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
    }
    
    const data = await response.json()
    return NextResponse.json({ cart: data.cart })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
}
