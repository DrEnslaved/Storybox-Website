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

  // Get all products
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

  // Get single product by slug
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

  // Auth Routes
  if (pathname === '/api/auth/register') {
    try {
      const { name, email, password } = await request.json()

      if (!name || !email || !password) {
        return NextResponse.json(
          { error: 'Всички полета са задължителни' },
          { status: 400 }
        )
      }

      const { db } = await connectToDB()

      const existingUser = await db.collection('users').findOne({ email })
      if (existingUser) {
        return NextResponse.json(
          { error: 'Потребителят вече съществува' },
          { status: 400 }
        )
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const userId = uuidv4()

      const user = {
        id: userId,
        name,
        email,
        password: hashedPassword,
        role: 'customer',
        priceTier: 'standard',
        createdAt: new Date().toISOString()
      }

      await db.collection('users').insertOne(user)

      const sessionData = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        priceTier: user.priceTier
      }

      await setSession(sessionData)

      return NextResponse.json(
        { message: 'Регистрацията е успешна', user: { id: user.id, name: user.name, email: user.email, role: user.role } },
        { status: 201 }
      )
    } catch (error) {
      console.error('Registration error:', error)
      return NextResponse.json(
        { error: 'Грешка при регистрация' },
        { status: 500 }
      )
    }
  }

  if (pathname === '/api/auth/login') {
    try {
      const { email, password } = await request.json()

      if (!email || !password) {
        return NextResponse.json(
          { error: 'Имейл и парола са задължителни' },
          { status: 400 }
        )
      }

      const { db } = await connectToDB()

      const user = await db.collection('users').findOne({ email })
      if (!user) {
        return NextResponse.json(
          { error: 'Неверен имейл или парола' },
          { status: 401 }
        )
      }

      const validPassword = await bcrypt.compare(password, user.password)
      if (!validPassword) {
        return NextResponse.json(
          { error: 'Неверен имейл или парола' },
          { status: 401 }
        )
      }

      const sessionData = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        priceTier: user.priceTier || 'standard'
      }

      await setSession(sessionData)

      return NextResponse.json(
        { message: 'Входът е успешен', user: { id: user.id, name: user.name, email: user.email, role: user.role } },
        { status: 200 }
      )
    } catch (error) {
      console.error('Login error:', error)
      return NextResponse.json(
        { error: 'Грешка при вход' },
        { status: 500 }
      )
    }
  }

  if (pathname === '/api/auth/google-callback') {
    try {
      const { id, email, name, picture, session_token } = await request.json()

      const { db } = await connectToDB()

      let user = await db.collection('users').findOne({ email })
      
      if (!user) {
        const userId = id || uuidv4()
        user = {
          id: userId,
          email,
          name,
          picture,
          role: 'customer',
          priceTier: 'standard',
          authProvider: 'google',
          createdAt: new Date().toISOString()
        }
        await db.collection('users').insertOne(user)
      }

      const sessionData = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        priceTier: user.priceTier || 'standard',
        picture: user.picture
      }

      await setSession(sessionData)

      return NextResponse.json(
        { message: 'Входът е успешен', user: sessionData },
        { status: 200 }
      )
    } catch (error) {
      console.error('Google callback error:', error)
      return NextResponse.json(
        { error: 'Грешка при Google автентикация' },
        { status: 500 }
      )
    }
  }

  if (pathname === '/api/auth/logout') {
    await clearSession()
    return NextResponse.json({ message: 'Изходът е успешен' })
  }

  // Quote Request Endpoint
  if (pathname === '/api/quote-request') {
    try {
      const body = await request.json()
      const { name, email, phone, company, serviceType, quantity, description, timeline } = body

      if (!name || !email || !phone || !serviceType || !quantity || !description) {
        return NextResponse.json(
          { error: 'Моля, попълнете всички задължителни полета' },
          { status: 400 }
        )
      }

      const { db } = await connectToDB()

      const quoteRequest = {
        id: uuidv4(),
        name,
        email,
        phone,
        company: company || '',
        serviceType,
        quantity: parseInt(quantity),
        description,
        timeline: timeline || '',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await db.collection('quote_requests').insertOne(quoteRequest)

      return NextResponse.json(
        { 
          message: 'Заявката беше изпратена успешно!',
          requestId: quoteRequest.id 
        },
        { status: 201 }
      )
    } catch (error) {
      console.error('Error creating quote request:', error)
      return NextResponse.json(
        { error: 'Грешка при изпращане на заявката' },
        { status: 500 }
      )
    }
  }

  // Create Order
  if (pathname === '/api/orders/create') {
    try {
      const session = await getSession()
      if (!session) {
        return NextResponse.json(
          { error: 'Моля, влезте в профила си' },
          { status: 401 }
        )
      }

      const { items, total, shippingAddress, notes } = await request.json()

      if (!items || items.length === 0 || !shippingAddress) {
        return NextResponse.json(
          { error: 'Моля, попълнете всички задължителни полета' },
          { status: 400 }
        )
      }

      const { db } = await connectToDB()

      const order = {
        id: uuidv4(),
        userId: session.userId,
        userEmail: session.email,
        userName: session.name,
        items,
        total,
        shippingAddress,
        notes: notes || '',
        status: 'pending_payment',
        paymentMethod: 'bank_transfer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await db.collection('orders').insertOne(order)

      return NextResponse.json(
        { 
          message: 'Поръчката е създадена успешно!',
          orderId: order.id 
        },
        { status: 201 }
      )
    } catch (error) {
      console.error('Error creating order:', error)
      return NextResponse.json(
        { error: 'Грешка при създаване на поръчка' },
        { status: 500 }
      )
    }
  }

  // Seed sample product (for initial setup)
  if (pathname === '/api/seed-product') {
    try {
      const { db } = await connectToDB()
      
      // Check if product already exists
      const existing = await db.collection('products').findOne({ slug: 'brandirani-teniski-s-broderia' })
      if (existing) {
        return NextResponse.json({ message: 'Sample product already exists', productId: existing.id })
      }

      const product = {
        id: uuidv4(),
        name: 'Брандирани тениски с бродерия',
        slug: 'brandirani-teniski-s-broderia',
        description: 'Висококачествени памучни тениски с машинна бродерия на лого или текст. Идеални за корпоративни събития, екипни облекла и промоционални кампании. Минимална поръчка: 10 броя. Срок на изработка: 5-7 работни дни.',
        category: 'embroidery',
        categoryName: 'Машинна бродерия',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
        images: [
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
          'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800'
        ],
        priceTiers: [
          { tierName: 'standard', price: 25.00 },
          { tierName: 'premium', price: 22.00 },
          { tierName: 'vip', price: 20.00 }
        ],
        sku: 'EMBR-TSHIRT-001',
        inStock: true,
        minQuantity: 10,
        maxQuantity: 5000,
        features: [
          'Висока устойчивост на изпиране',
          '100% памучна тъкан, 180g/m²',
          'Персонализация с лого',
          'Доставка за 5-7 работни дни'
        ],
        metaDescription: 'Брандирани тениски с машинна бродерия в София, България. Качествена персонализация за корпоративни клиенти.',
        metaKeywords: ['бродирани тениски софия', 'корпоративни облекла'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await db.collection('products').insertOne(product)

      return NextResponse.json(
        { message: 'Sample product created successfully', productId: product.id },
        { status: 201 }
      )
    } catch (error) {
      console.error('Error seeding product:', error)
      return NextResponse.json(
        { error: 'Failed to seed product' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 })
}