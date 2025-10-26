import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'
import { ObjectId } from 'mongodb'

export async function PATCH(request, { params }) {
  const authCheck = await requireAdmin(request)
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 })
  }

  try {
    const { productId } = params
    const updates = await request.json()
    const { db } = await connectToDatabase()

    const allowedUpdates = {}
    if (updates.name) allowedUpdates.name = updates.name
    if (updates.sku) allowedUpdates.sku = updates.sku
    if (updates.quantity !== undefined) allowedUpdates.quantity = parseInt(updates.quantity)
    if (updates.price !== undefined) allowedUpdates.price = parseFloat(updates.price)
    if (updates.category) allowedUpdates.category = updates.category
    if (updates.status) allowedUpdates.status = updates.status
    allowedUpdates.updatedAt = new Date()

    const result = await db.collection('products').updateOne(
      { _id: new ObjectId(productId) },
      { $set: allowedUpdates }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const authCheck = await requireAdmin(request)
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 })
  }

  try {
    const { productId } = params
    const { db } = await connectToDatabase()

    const result = await db.collection('products').deleteOne({
      _id: new ObjectId(productId)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
