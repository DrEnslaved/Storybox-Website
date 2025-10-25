import { NextResponse } from 'next/server'

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'

// GET: Fetch cart by ID
export async function GET(request, { params }) {
  try {
    const cartId = params.cartId
    
    const response = await fetch(`${MEDUSA_URL}/store/carts/${cartId}`, {
      headers: { 'Content-Type': 'application/json' }
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
