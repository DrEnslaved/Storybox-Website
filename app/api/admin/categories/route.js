import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request) {
  const authCheck = await requireAdmin(request)
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 })
  }

  try {
    const { db } = await connectToDatabase()
    const categories = await db.collection('product_categories')
      .find({})
      .sort({ name: 1 })
      .toArray()

    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request) {
  const authCheck = await requireAdmin(request)
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 })
  }

  try {
    const { name, slug, description } = await request.json()
    const { db } = await connectToDatabase()

    const newCategory = {
      id: uuidv4(),
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description: description || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await db.collection('product_categories').insertOne(newCategory)

    return NextResponse.json({ success: true, category: newCategory })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
