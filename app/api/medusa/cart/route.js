import { NextResponse } from 'next/server'

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'

// POST: Create new cart
export async function POST(request) {
  try {
    const response = await fetch(`${MEDUSA_URL}/store/carts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        region_id: 'reg_01K8EFA3PT2R7FCEA5RJ2J6B1G',
        sales_channel_id: 'sc_01K8EFA3PT2R7FCEA5RJ2J6B1G'
      })
    })
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to create cart' }, { status: 500 })
    }
    
    const data = await response.json()
    return NextResponse.json({ cart: data.cart })
  } catch (error) {
    console.error('Error creating cart:', error)
    return NextResponse.json({ error: 'Failed to create cart' }, { status: 500 })
  }
}
