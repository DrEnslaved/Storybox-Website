import { NextResponse } from 'next/server'

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

// Complete cart and create order
export async function POST(request) {
  try {
    const body = await request.json()
    const { cartId, email, shippingAddress, customerName } = body

    if (!cartId) {
      return NextResponse.json({ error: 'Cart ID required' }, { status: 400 })
    }

    // 1. Update cart with customer email
    console.log('Updating cart with email:', email)
    const updateEmailRes = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ email })
    })

    if (!updateEmailRes.ok) {
      const error = await updateEmailRes.text()
      console.error('Failed to update email:', error)
      return NextResponse.json({ error: 'Failed to update cart email' }, { status: 500 })
    }

    // 2. Add shipping address to cart
    console.log('Adding shipping address...')
    const addressRes = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_KEY,
      },
      body: JSON.stringify({
        shipping_address: {
          first_name: shippingAddress.firstName || customerName?.split(' ')[0] || '',
          last_name: shippingAddress.lastName || customerName?.split(' ').slice(1).join(' ') || '',
          address_1: shippingAddress.address,
          city: shippingAddress.city,
          postal_code: shippingAddress.postalCode,
          country_code: 'bg',
          phone: shippingAddress.phone,
        }
      })
    })

    if (!addressRes.ok) {
      const error = await addressRes.text()
      console.error('Failed to add shipping address:', error)
      return NextResponse.json({ error: 'Failed to add shipping address' }, { status: 500 })
    }

    // 3. Complete the cart to create an order
    console.log('Completing cart to create order...')
    const completeRes = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_KEY,
      }
    })

    if (!completeRes.ok) {
      const error = await completeRes.text()
      console.error('Failed to complete cart:', error)
      return NextResponse.json({ error: 'Failed to complete order', details: error }, { status: 500 })
    }

    const completeData = await completeRes.json()
    
    console.log('Order created successfully:', completeData.order?.id)
    
    return NextResponse.json({ 
      success: true,
      order: completeData.order,
      orderId: completeData.order?.id,
      message: 'Order created successfully'
    })

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ 
      error: 'Failed to create order',
      message: error.message 
    }, { status: 500 })
  }
}
