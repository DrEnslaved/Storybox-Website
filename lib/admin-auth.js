import jwt from 'jsonwebtoken'

const ADMIN_CREDENTIALS = {
  email: 'admin@storybox.bg',
  password: 'yxlnLfy6F46vqM1lnF7tUrcdM',
  role: 'admin',
  name: 'Admin'
}

export function verifyAdminToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    return decoded.role === 'admin' ? decoded : null
  } catch (error) {
    return null
  }
}

export function createAdminToken(adminData) {
  return jwt.sign(
    {
      email: adminData.email,
      role: 'admin',
      name: adminData.name
    },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  )
}

export function validateAdminCredentials(email, password) {
  if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
    return {
      email: ADMIN_CREDENTIALS.email,
      name: ADMIN_CREDENTIALS.name,
      role: ADMIN_CREDENTIALS.role
    }
  }
  return null
}

export async function requireAdmin(request) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authorized: false, error: 'No token provided' }
  }

  const token = authHeader.substring(7)
  const admin = verifyAdminToken(token)

  if (!admin) {
    return { authorized: false, error: 'Invalid or expired token' }
  }

  return { authorized: true, admin }
}
