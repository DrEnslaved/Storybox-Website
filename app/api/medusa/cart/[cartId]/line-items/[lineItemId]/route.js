import { NextResponse } from 'next/server'

const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'

// PUT: Update line item quantity
export async function PUT(request, { params }) {
  try {
    const { cartId, lineItemId } = params
    const { quantity } = await request.json()
    
    const response = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/line-items/${lineItemId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity })
    })
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
    }
    
    const data = await response.json()
    return NextResponse.json({ cart: data.cart })
  } catch (error) {
    console.error('Error updating line item:', error)
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 })
  }
}

// DELETE: Remove line item from cart
export async function DELETE(request, { params }) {
  try {
    const { cartId, lineItemId } = params
    
    const response = await fetch(`${MEDUSA_URL}/store/carts/${cartId}/line-items/${lineItemId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    })
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 })
    }
    
    const data = await response.json()
    return NextResponse.json({ cart: data.cart })
  } catch (error) {
    console.error('Error deleting line item:', error)
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 })
  }
}
