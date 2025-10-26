import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(request) {
  const authCheck = await requireAdmin(request)
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 })
  }

  try {
    const { db } = await connectDB()
    const users = await db.collection('users')
      .find({})
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray()

    // Remove sensitive data
    const sanitizedUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      priceTier: user.priceTier || 'standard',
      role: user.role || 'user',
      company: user.company,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    }))

    return NextResponse.json({ users: sanitizedUsers })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}
