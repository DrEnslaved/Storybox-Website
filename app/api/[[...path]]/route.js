import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'
import { encrypt, decrypt, setSession, getSession, clearSession } from '../../../lib/auth'
import { connectToDatabase } from '../../../lib/db'

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017'
const DB_NAME = process.env.DB_NAME || 'storvbox_db'

let cachedClient = null
let cachedDb = null

async function connectToDB() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb }
  }

  const client = await MongoClient.connect(MONGO_URL)
  const db = client.db(DB_NAME)

  cachedClient = client
  cachedDb = db

  return { client, db }
}

export async function GET(request) {
  const url = new URL(request.url)
  const pathname = url.pathname

  // Medusa products proxy endpoint
  if (pathname === '/api/medusa/products') {
    try {
      const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'
      
      // Login to get admin token
      const authRes = await fetch(`${MEDUSA_URL}/auth/user/emailpass`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@storybox.bg',
          password: 'Pandora2019+'
        })
      })
      
      if (!authRes.ok) {
        throw new Error('Failed to authenticate with Medusa')
      }
      
      const authData = await authRes.json()
      const token = authData.token
      
      // Fetch products from admin API
      const productsRes = await fetch(`${MEDUSA_URL}/admin/products?fields=*variants,*images&limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!productsRes.ok) {
        throw new Error('Failed to fetch products from Medusa')
      }
      
      const productsData = await productsRes.json()
      
      // Transform Medusa products to match frontend expectations
      const transformedProducts = (productsData.products || []).map(product => ({
        id: product.id,
        name: product.title,
        slug: product.handle,
        description: product.description,
        image: product.images?.[0]?.url || product.thumbnail,
        images: product.images?.map(img => img.url) || [],
        priceTiers: product.variants?.map(variant => ({
          tierName: variant.title?.toLowerCase() || 'standard',
          price: variant.prices?.[0]?.amount ? variant.prices[0].amount / 100 : 0,
          variantId: variant.id,
          sku: variant.sku
        })) || [],
        inStock: true,
        medusaProduct: true,
        variants: product.variants || []
      }))
      
      return NextResponse.json({ 
        products: transformedProducts,
        source: 'medusa' 
      })
    } catch (error) {
      console.error('Error fetching Medusa products:', error)
      return NextResponse.json(
        { error: 'Грешка при зареждане на продуктите от Medusa', products: [] },
        { status: 500 }
      )
    }
  }

  // Get all products (MongoDB fallback)
  if (pathname === '/api/products') {
    try {
      const { db } = await connectToDB()
      const products = await db.collection('products')
        .find({ inStock: true })
        .sort({ createdAt: -1 })
        .toArray()
      
      return NextResponse.json({ products })
    } catch (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        { error: 'Грешка при зареждане на продуктите', products: [] },
        { status: 500 }
      )
    }
  }

  // Medusa: Get cart by ID
  const cartGetMatch = pathname.match(/^\/api\/medusa\/cart\/([^/]+)$/)
  if (cartGetMatch) {
    const cartId = cartGetMatch[1]
    try {
      const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'
      const response = await fetch(`${MEDUSA_URL}/store/carts/${cartId}`, {
        headers: { 'Content-Type': 'application/json' }
      })
      
      if (!response.ok) {
        return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
      }
      
      const data = await response.json()
      return NextResponse.json({ cart: data.cart })
    } catch (error) {
      console.error('Error fetching cart:', error)
      return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
    }
  }

  // Medusa: Get product by handle
  const medusaProductMatch = pathname.match(/^\/api\/medusa\/products\/([^/]+)$/)
  if (medusaProductMatch) {
    const handle = medusaProductMatch[1]
    try {
      const MEDUSA_URL = process.env.MEDUSA_BACKEND_URL || 'http://localhost:9000'
      
      // Login to get admin token
      const authRes = await fetch(`${MEDUSA_URL}/auth/user/emailpass`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@storybox.bg',
          password: 'Pandora2019+'
        })
      })
      
      const authData = await authRes.json()
      const token = authData.token
      
      // Fetch product by handle
      const productsRes = await fetch(`${MEDUSA_URL}/admin/products?handle=${handle}&fields=*variants,*images,*variants.prices`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const productsData = await productsRes.json()
      const product = productsData.products?.[0]
      
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }
      
      // Transform to match frontend expectations
      const transformed = {
        id: product.id,
        name: product.title,
        slug: product.handle,
        description: product.description,
        image: product.images?.[0]?.url || product.thumbnail,
        images: product.images?.map(img => img.url) || [],
        variants: product.variants?.map(variant => ({
          id: variant.id,
          title: variant.title,
          sku: variant.sku,
          price: variant.prices?.[0]?.amount ? variant.prices[0].amount / 100 : 0,
          currency: variant.prices?.[0]?.currency_code || 'bgn',
          inventory_quantity: variant.inventory_quantity || 999
        })) || [],
        inStock: true,
        medusaProduct: true
      }
      
      return NextResponse.json({ product: transformed })
    } catch (error) {
      console.error('Error fetching Medusa product:', error)
      return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
    }
  }

  // Get single product by slug (MongoDB fallback)
  const slugMatch = pathname.match(/^\/api\/products\/(.+)$/)
  if (slugMatch) {
    const slug = slugMatch[1]
    try {
      const { db } = await connectToDB()
      const product = await db.collection('products').findOne({ slug })
      
      if (!product) {
        return NextResponse.json(
          { error: 'Продуктът не е намерен' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({ product })
    } catch (error) {
      console.error('Error fetching product:', error)
      return NextResponse.json(
        { error: 'Грешка при зареждане на продукта' },
        { status: 500 }
      )
    }
  }

  // Get user orders
  if (pathname === '/api/orders') {
    try {
      const session = await getSession()
      if (!session) {
        return NextResponse.json(
          { error: 'Неоторизиран достъп' },
          { status: 401 }
        )
      }

      const { db } = await connectToDB()
      const orders = await db.collection('orders')
        .find({ userId: session.userId })
        .sort({ createdAt: -1 })
        .toArray()
      
      return NextResponse.json({ orders })
    } catch (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json(
        { error: 'Грешка при зареждане на поръчките' },
        { status: 500 }
      )
    }
  }

  // Get single order
  const orderMatch = pathname.match(/^\/api\/orders\/(.+)$/)
  if (orderMatch) {
    const orderId = orderMatch[1]
    try {
      const session = await getSession()
      if (!session) {
        return NextResponse.json(
          { error: 'Неоторизиран достъп' },
          { status: 401 }
        )
      }

      const { db } = await connectToDB()
      const order = await db.collection('orders').findOne({ 
        id: orderId,
        userId: session.userId 
      })
      
      if (!order) {
        return NextResponse.json(
          { error: 'Поръчката не е намерена' },
          { status: 404 }
        )
      }
      
      return NextResponse.json({ order })
    } catch (error) {
      console.error('Error fetching order:', error)
      return NextResponse.json(
        { error: 'Грешка при зареждане на поръчката' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ message: 'STORVBOX API is running' })
}

export async function POST(request) {
  const url = new URL(request.url)
  const pathname = url.pathname

  // Medusa: Create new cart
  if (pathname === '/api/medusa/cart') {
    try {
