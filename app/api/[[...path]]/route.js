import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017'
const DB_NAME = process.env.DB_NAME || 'storvbox_db'

let cachedClient = null
let cachedDb = null

async function connectToDatabase() {
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
  return NextResponse.json({ message: 'STORVBOX API is running' })
}

export async function POST(request) {
  const url = new URL(request.url)
  const pathname = url.pathname

  // Quote Request Endpoint
  if (pathname === '/api/quote-request') {
    try {
      const body = await request.json()
      const { name, email, phone, company, serviceType, quantity, description, timeline } = body

      // Validation
      if (!name || !email || !phone || !serviceType || !quantity || !description) {
        return NextResponse.json(
          { error: 'Моля, попълнете всички задължителни полета' },
          { status: 400 }
        )
      }

      const { db } = await connectToDatabase()

      // Create quote request document
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

  // Contact Form Endpoint
  if (pathname === '/api/contact') {
    try {
      const body = await request.json()
      const { name, email, phone, subject, message } = body

      if (!name || !email || !message) {
        return NextResponse.json(
          { error: 'Моля, попълнете всички задължителни полета' },
          { status: 400 }
        )
      }

      const { db } = await connectToDatabase()

      const contactMessage = {
        id: uuidv4(),
        name,
        email,
        phone: phone || '',
        subject: subject || 'Общо запитване',
        message,
        status: 'unread',
        createdAt: new Date().toISOString()
      }

      await db.collection('contact_messages').insertOne(contactMessage)

      return NextResponse.json(
        { message: 'Съобщението беше изпратено успешно!' },
        { status: 201 }
      )
    } catch (error) {
      console.error('Error creating contact message:', error)
      return NextResponse.json(
        { error: 'Грешка при изпращане на съобщението' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ error: 'Endpoint not found' }, { status: 404 })
}