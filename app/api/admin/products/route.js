import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/db'
import { requireAdmin } from '@/lib/admin-auth'

export async function GET(request) {
  const authCheck = await requireAdmin(request)
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 })
  }

  try {
    const { db } = await connectToDatabase()
    
    // Get products from products collection
    const products = await db.collection('products')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    const productsWithDetails = products.map(product => ({
      id: product._id.toString(),
      name: product.name || product.title,
      sku: product.sku || 'N/A',
      quantity: product.quantity || 0,
      price: product.price || 0,
      category: product.category || 'Uncategorized',
      status: product.status || 'active',
      createdAt: product.createdAt,
      _id: undefined
    }))

    // Calculate totals
    const totalProducts = productsWithDetails.length
    const totalQuantity = productsWithDetails.reduce((sum, p) => sum + (p.quantity || 0), 0)
    const lowStockCount = productsWithDetails.filter(p => (p.quantity || 0) < 10).length

    return NextResponse.json({
      products: productsWithDetails,
      stats: {
        totalProducts,
        totalQuantity,
        lowStockCount
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request) {
  const authCheck = await requireAdmin(request)
  if (!authCheck.authorized) {
    return NextResponse.json({ error: authCheck.error }, { status: 401 })
  }

  try {
    const productData = await request.json()
    const { db } = await connectToDatabase()

    const newProduct = {
      name: productData.name,
      sku: productData.sku,
      quantity: parseInt(productData.quantity) || 0,
      price: parseFloat(productData.price) || 0,
      category: productData.category || 'Uncategorized',
      status: productData.status || 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    const result = await db.collection('products').insertOne(newProduct)

    return NextResponse.json({
      success: true,
      productId: result.insertedId.toString()
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
