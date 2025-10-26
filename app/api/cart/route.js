import { NextResponse } from 'next/server'

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

// Create a new cart
export async function POST(request) {
  try {
    let body = {}
    try {
      body = await request.json()
    } catch (e) {
      // No body sent, use defaults
    }
    const { region_id = 'reg_01K8H69A87F81C7HE74RZENY8S' } = body

    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ region_id })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Failed to create cart:', error)
      return NextResponse.json({ error: 'Failed to create cart' }, { status: 500 })
    }

    const data = await response.json()
    return NextResponse.json({ cart: data.cart })
  } catch (error) {
    console.error('Error creating cart:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
