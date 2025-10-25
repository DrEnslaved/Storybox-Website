import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'
import { encrypt, decrypt, setSession, getSession, clearSession } from '../../../lib/auth'

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

  // Get all products (MongoDB - legacy fallback)
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

  // Get single product by slug (MongoDB - legacy)
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

  return NextResponse.json({ message: 'API is running' })
}

export async function POST(request) {
  const url = new URL(request.url)
  const pathname = url.pathname

  // Auth: Register
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

      return NextResponse.json({
        message: 'Регистрацията е успешна',
        user: { id: user.id, name: user.name, email: user.email, role: user.role, priceTier: user.priceTier }
      })
    } catch (error) {
      console.error('Registration error:', error)
      return NextResponse.json(
        { error: 'Грешка при регистрацията' },
        { status: 500 }
      )
    }
  }

  // Auth: Login
  if (pathname === '/api/auth/login') {
    try {
      const { email, password } = await request.json()

      if (!email || !password) {
        return NextResponse.json(
          { error: 'Email и парола са задължителни' },
          { status: 400 }
        )
      }

      const { db } = await connectToDB()
      const user = await db.collection('users').findOne({ email })

      if (!user) {
        return NextResponse.json(
          { error: 'Невалиден email или парола' },
          { status: 401 }
        )
      }

      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return NextResponse.json(
          { error: 'Невалиден email или парола' },
          { status: 401 }
        )
      }

      const sessionData = {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        priceTier: user.priceTier
      }

      await setSession(sessionData)

      return NextResponse.json({
        message: 'Успешен вход',
        user: { id: user.id, name: user.name, email: user.email, role: user.role, priceTier: user.priceTier }
      })
    } catch (error) {
      console.error('Login error:', error)
      return NextResponse.json(
        { error: 'Грешка при входа' },
        { status: 500 }
      )
    }
  }

  // Auth: Logout
  if (pathname === '/api/auth/logout') {
    try {
      await clearSession()
      return NextResponse.json({ message: 'Успешен изход' })
    } catch (error) {
      console.error('Logout error:', error)
      return NextResponse.json(
        { error: 'Грешка при изхода' },
        { status: 500 }
      )
    }
  }

  // Contact form
  if (pathname === '/api/contact') {
    try {
      const formData = await request.json()
      const { db } = await connectToDB()

      const submission = {
        id: uuidv4(),
        ...formData,
        type: 'contact',
        createdAt: new Date().toISOString()
      }

      await db.collection('contact_submissions').insertOne(submission)

      return NextResponse.json(
        { message: 'Съобщението е изпратено успешно!' },
        { status: 201 }
      )
    } catch (error) {
      console.error('Error saving contact form:', error)
      return NextResponse.json(
        { error: 'Грешка при изпращане на съобщението' },
        { status: 500 }
      )
    }
  }

  // Quote request form
  if (pathname === '/api/quote') {
    try {
      const formData = await request.json()
      const { db } = await connectToDB()

      const submission = {
        id: uuidv4(),
        ...formData,
        type: 'quote',
        status: 'pending',
        createdAt: new Date().toISOString()
      }

      await db.collection('quote_requests').insertOne(submission)

      return NextResponse.json(
        { 
          message: 'Заявката за оферта е получена успешно!',
          quoteId: submission.id 
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

  return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 })
}

export async function PUT(request) {
  const url = new URL(request.url)
  const pathname = url.pathname

  // Cancel/Annul Order
  const cancelOrderMatch = pathname.match(/^\/api\/orders\/(.+)\/cancel$/)
  if (cancelOrderMatch) {
    const orderId = cancelOrderMatch[1]
    try {
      const session = await getSession()
      if (!session) {
        return NextResponse.json(
          { error: 'Неоторизиран достъп' },
          { status: 401 }
        )
      }

      const { db } = await connectToDB()

      // Find the order and verify ownership
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

      // Check if order can be cancelled (only pending_payment and processing status)
      if (!['pending_payment', 'processing'].includes(order.status)) {
        return NextResponse.json(
          { error: 'Тази поръчка не може да бъде анулирана' },
          { status: 400 }
        )
      }

      // Update order status to cancelled
      await db.collection('orders').updateOne(
        { id: orderId },
        { 
          $set: { 
            status: 'cancelled',
            cancelledAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          } 
        }
      )

      return NextResponse.json(
        { 
          message: 'Поръчката е анулирана успешно',
          orderId: orderId 
        },
        { status: 200 }
      )
    } catch (error) {
      console.error('Error cancelling order:', error)
      return NextResponse.json(
        { error: 'Грешка при анулиране на поръчка' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 })
}

