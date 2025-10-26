import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'
import { ObjectId } from 'mongodb'

export async function GET(request, { params }) {
  const authCheck = await requireAdmin(request)
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 })
  }

  try {
    const { orderId } = params
    const { db } = await connectToDatabase()

    const order = await db.collection('orders').findOne({ _id: new ObjectId(orderId) })

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({
      order: {
        ...order,
        id: order._id.toString(),
        _id: undefined
      }
    })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  const authCheck = await requireAdmin(request)
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 })
  }

  try {
    const { orderId } = params
    const { status, notes } = await request.json()
    const { db } = await connectToDatabase()

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'annulled', 'backorder_pending']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const updateData = {
      updatedAt: new Date(),
      updatedBy: authCheck.admin.email
    }

    if (status) {
      updateData.status = status
    }

    if (notes !== undefined) {
      updateData.adminNotes = notes
    }

    const result = await db.collection('orders').updateOne(
      { _id: new ObjectId(orderId) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}
