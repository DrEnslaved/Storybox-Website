import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
)

export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

export async function decrypt(token) {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    return null
  }
}

export async function getSession() {
  const cookieStore = cookies()
  const sessionToken = cookieStore.get('session_token')?.value
  
  if (!sessionToken) {
    return null
  }
  
  return await decrypt(sessionToken)
}

export async function setSession(sessionData) {
  const token = await encrypt(sessionData)
  const cookieStore = cookies()
  
  cookieStore.set('session_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/'
  })
  
  return token
}

export async function clearSession() {
  const cookieStore = cookies()
  cookieStore.delete('session_token')
}

export function requireAuth(handler) {
  return async (request, context) => {
    const session = await getSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Неоторизиран достъп' },
        { status: 401 }
      )
    }
    
    // Add session to request
    request.session = session
    return handler(request, context)
  }
}

export function requireAdmin(handler) {
  return async (request, context) => {
    const session = await getSession()
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json(
        { error: 'Достъп отказан' },
        { status: 403 }
      )
    }
    
    request.session = session
    return handler(request, context)
  }
}