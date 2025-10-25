import rateLimit from 'next-rate-limit'

// Rate limiter for API routes
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
})

// Standard rate limit - 100 requests per minute
export async function applyRateLimit(request) {
  try {
    await limiter.check(100, 'CACHE_TOKEN') // 100 requests per minute
  } catch {
    throw new Error('Rate limit exceeded')
  }
}

// Strict rate limit for authentication endpoints - 10 requests per minute
export async function applyStrictRateLimit(request) {
  try {
    await limiter.check(10, 'CACHE_TOKEN') // 10 requests per minute
  } catch {
    throw new Error('Too many attempts. Please try again later.')
  }
}

// Generous rate limit for public endpoints - 200 requests per minute
export async function applyGenerousRateLimit(request) {
  try {
    await limiter.check(200, 'CACHE_TOKEN') // 200 requests per minute
  } catch {
    throw new Error('Rate limit exceeded')
  }
}
