import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'
import { ObjectId } from 'mongodb'

export async function POST(request, { params }) {
  const authCheck = await requireAdmin(request)
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 })
  }

  try {
    const { orderId } = params
    const { reason } = await request.json()

    const { db } = await connectToDatabase()
    
    // Update order status to annulled
    const result = await db.collection('orders').updateOne(
      { _id: new ObjectId(orderId) },
      { 
        $set: { 
          status: 'annulled',
          annulledAt: new Date(),
          annulledBy: 'admin',
          annulmentReason: reason || 'Admin annulled'
        }
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Order annulled successfully' 
    })
  } catch (error) {
    console.error('Error annulling order:', error)
    return NextResponse.json({ error: 'Failed to annul order' }, { status: 500 })
  }
}
