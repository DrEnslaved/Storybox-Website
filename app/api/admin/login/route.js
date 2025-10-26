import { NextResponse } from 'next/server'
import { validateAdminCredentials, createAdminToken } from '@/lib/admin-auth'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    const admin = validateAdminCredentials(email, password)

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    const token = createAdminToken(admin)

    return NextResponse.json({
      success: true,
      token,
      admin: {
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    })
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
