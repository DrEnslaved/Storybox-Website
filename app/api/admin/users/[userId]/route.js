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
    const { userId } = params
    const updates = await request.json()

    const { db } = await connectToDatabase()
    
    // Only allow updating specific fields
    const allowedUpdates = {}
    if (updates.priceTier) allowedUpdates.priceTier = updates.priceTier
    if (updates.role) allowedUpdates.role = updates.role
    if (updates.name) allowedUpdates.name = updates.name
    if (updates.company) allowedUpdates.company = updates.company

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { $set: allowedUpdates }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'User updated' })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const authCheck = await requireAdmin(request)
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 })
  }

  try {
    const { userId } = params
    const { db } = await connectToDatabase()

    const result = await db.collection('users').deleteOne({
      _id: new ObjectId(userId)
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'User deleted' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
