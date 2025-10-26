import { NextResponse } from 'next/server'

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

// Get order by ID
export async function GET(request, { params }) {
  try {
    const { orderId } = params

    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/orders/${orderId}`, {
      headers: {
        'x-publishable-api-key': PUBLISHABLE_KEY,
      }
    })

    if (!response.ok) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const data = await response.json()
    return NextResponse.json({ order: data.order })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
