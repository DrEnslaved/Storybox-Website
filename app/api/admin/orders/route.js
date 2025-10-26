import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(request) {
  const authCheck = await requireAdmin(request)
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')
    const skip = parseInt(searchParams.get('skip') || '0')

    const { db } = await connectDB()
    
    let query = {}
    if (status) {
      query.status = status
    }

    const orders = await db.collection('orders')
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const total = await db.collection('orders').countDocuments(query)

    const ordersWithDetails = orders.map(order => ({
      ...order,
      id: order._id.toString(),
      _id: undefined
    }))

    return NextResponse.json({
      orders: ordersWithDetails,
      total,
      page: Math.floor(skip / limit) + 1,
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
