import { z } from 'zod'

// User registration validation
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number').optional(),
  company: z.string().max(200).optional(),
})

// User login validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Contact form validation
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number').optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
})

// Product review validation
export const reviewSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(5).max(100),
  comment: z.string().min(10).max(1000),
})

// Checkout validation
export const checkoutSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone number'),
  address: z.string().min(5).max(200),
  city: z.string().min(2).max(100),
  postalCode: z.string().regex(/^[0-9]{4,10}$/, 'Invalid postal code'),
  country: z.string().min(2).max(2), // ISO country code
})

// Order annulment validation
export const annulOrderSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  reason: z.string().min(10, 'Please provide a reason').max(500),
})

// Helper function to validate and return errors
export function validateData(schema, data) {
  try {
    const validated = schema.parse(data)
    return { success: true, data: validated, errors: null }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
      return { success: false, data: null, errors }
    }
    return { success: false, data: null, errors: [{ field: 'general', message: 'Validation failed' }] }
  }
}

// Sanitize string input to prevent XSS
export function sanitizeString(str) {
  if (typeof str !== 'string') return str
  
  return str
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

// Sanitize object recursively
export function sanitizeObject(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? sanitizeString(obj) : obj
  }
  
  const sanitized = Array.isArray(obj) ? [] : {}
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      sanitized[key] = sanitizeObject(obj[key])
    }
  }
  
  return sanitized
}
