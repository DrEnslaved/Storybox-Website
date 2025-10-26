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
    
    const products = await db.collection('products')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    const productsWithDetails = products.map(product => ({
      id: product.id || product._id.toString(),
      name: product.name || product.title,
      sku: product.sku || 'N/A',
      quantity: product.inventory?.amount || product.quantity || 0,
      price: product.price || 0,
      category: product.category || 'Uncategorized',
      status: product.status || 'active',
      coverImage: product.coverImage || product.images?.[0] || null,
      createdAt: product.createdAt,
      variants: product.variants || []
    }))

    const totalProducts = productsWithDetails.length
    const totalQuantity = productsWithDetails.reduce((sum, p) => {
      const mainQty = p.quantity || 0
      const variantQty = p.variants.reduce((vSum, v) => vSum + (v.inventory?.amount || 0), 0)
      return sum + mainQty + variantQty
    }, 0)
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
      id: uuidv4(),
      // Basic Info
      name: productData.name,
      description: productData.description || '',
      sku: productData.sku,
      
      // Images
      coverImage: productData.coverImage || null,
      gallery: productData.gallery || [],
      
      // Pricing
      price: parseFloat(productData.price) || 0,
      compareAtPrice: parseFloat(productData.compareAtPrice) || null,
      salePrice: parseFloat(productData.salePrice) || null,
      costPrice: parseFloat(productData.costPrice) || null,
      taxClass: productData.taxClass || 'standard',
      
      // Inventory
      inventory: {
        amount: parseInt(productData.inventory?.amount) || 0,
        status: productData.inventory?.status || 'in_stock',
        minQuantity: parseInt(productData.inventory?.minQuantity) || 1,
        maxQuantity: parseInt(productData.inventory?.maxQuantity) || 999,
        allowBackorder: productData.inventory?.allowBackorder || false,
        backorderMessage: productData.inventory?.backorderMessage || '',
        stockAlertThreshold: parseInt(productData.inventory?.stockAlertThreshold) || 10
      },
      
      // Shipping
      shipping: {
        weight: parseFloat(productData.shipping?.weight) || 0,
        dimensions: {
          length: parseFloat(productData.shipping?.dimensions?.length) || 0,
          width: parseFloat(productData.shipping?.dimensions?.width) || 0,
          height: parseFloat(productData.shipping?.dimensions?.height) || 0,
          unit: productData.shipping?.dimensions?.unit || 'cm'
        },
        class: productData.shipping?.class || 'standard'
      },
      
      // Organization
      category: productData.category || 'Uncategorized',
      tags: productData.tags || [],
      status: productData.status || 'active',
      visibility: productData.visibility || 'public',
      featured: productData.featured || false,
      badges: productData.badges || [],
      
      // SEO
      seo: {
        title: productData.seo?.title || productData.name,
        description: productData.seo?.description || '',
        slug: productData.seo?.slug || productData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      },
      
      // B2B
      b2b: {
        moq: parseInt(productData.b2b?.moq) || 1,
        bulkPricing: productData.b2b?.bulkPricing || [],
        leadTime: productData.b2b?.leadTime || '',
        customFields: productData.b2b?.customFields || {}
      },
      
      // Variants
      variants: productData.variants || [],
      
      // Related Products
      relatedProducts: productData.relatedProducts || [],
      
      // Metadata
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: authCheck.admin.email
    }

    await db.collection('products').insertOne(newProduct)

    return NextResponse.json({
      success: true,
      productId: newProduct.id
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product', details: error.message }, { status: 500 })
  }
}
