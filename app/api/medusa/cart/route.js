import { NextResponse } from 'next/server'

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

// POST: Create new cart
export async function POST(request) {
  try {
    const headers = {
      'Content-Type': 'application/json'
    }
    
    if (PUBLISHABLE_KEY) {
      headers['x-publishable-api-key'] = PUBLISHABLE_KEY
    }
    
    const response = await fetch(`${MEDUSA_URL}/store/carts`, {
      method: 'POST',
      headers,
      body: JSON.stringify({})
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Medusa cart creation error:', errorData)
      return NextResponse.json({ error: 'Failed to create cart', details: errorData }, { status: 500 })
    }
    
    const data = await response.json()
    return NextResponse.json({ cart: data.cart })
  } catch (error) {
    console.error('Error creating cart:', error)
    return NextResponse.json({ error: 'Failed to create cart' }, { status: 500 })
  }
}
