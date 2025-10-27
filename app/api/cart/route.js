import { NextResponse } from 'next/server'

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

// Create a new cart
export async function POST(request) {
  try {
    if (!PUBLISHABLE_KEY) {
      console.error('Missing NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY')
      return NextResponse.json({ 
        error: 'Configuration error',
        message: 'Publishable key is required'
      }, { status: 500 })
    }

    // Get Bulgaria region dynamically
    const regionsRes = await fetch(`${MEDUSA_BACKEND_URL}/store/regions`, {
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_KEY,
      }
    })

    let region_id
    if (regionsRes.ok) {
      const regionsData = await regionsRes.json()
      const bgRegion = regionsData.regions?.find(r => r.currency_code === 'bgn')
      region_id = bgRegion?.id || regionsData.regions?.[0]?.id
    }

    if (!region_id) {
      return NextResponse.json({ 
        error: 'No region found',
        message: 'Please create a region in Medusa admin'
      }, { status: 500 })
    }

    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ region_id })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.error('Failed to create cart:', response.status, errorData)
      return NextResponse.json(errorData, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json({ cart: data.cart })
  } catch (error) {
    console.error('Error creating cart:', error)
    return NextResponse.json({ 
      error: 'Failed to create cart',
      message: error.message 
    }, { status: 500 })
  }
}
