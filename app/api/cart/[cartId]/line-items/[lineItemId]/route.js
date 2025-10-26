import { NextResponse } from 'next/server'

const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

// Update line item quantity
export async function PATCH(request, { params }) {
  try {
    const { cartId, lineItemId } = params
    const body = await request.json()

    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}/line-items/${lineItemId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_KEY,
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Failed to update line item:', error)
      return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
    }

    const data = await response.json()
    return NextResponse.json({ cart: data.cart })
  } catch (error) {
    console.error('Error updating line item:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// Delete line item from cart
export async function DELETE(request, { params }) {
  try {
    const { cartId, lineItemId } = params

    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/carts/${cartId}/line-items/${lineItemId}`, {
      method: 'DELETE',
      headers: {
        'x-publishable-api-key': PUBLISHABLE_KEY,
      }
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Failed to delete line item:', error)
      return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 })
    }

    const data = await response.json()
    return NextResponse.json({ cart: data.cart })
  } catch (error) {
    console.error('Error deleting line item:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
