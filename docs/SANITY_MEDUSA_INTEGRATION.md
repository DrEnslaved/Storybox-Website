# Sanity & Medusa Integration Strategy

This document outlines how **Sanity CMS** and **Medusa e-commerce** can be integrated into the Storybox platform to create a best-in-class e-commerce experience, complementing the existing MongoDB setup.

---

## 🎯 Strategic Vision: Three-System Architecture

### Current State (MongoDB Only)
- ✅ Users, orders, products all in MongoDB
- ⚠️ Basic localStorage cart
- ⚠️ No content management for blogs/projects
- ⚠️ Manual product management via admin panel

### Future State (MongoDB + Sanity + Medusa)
- ✅ **MongoDB**: User accounts, custom business logic, analytics
- ✅ **Sanity**: Content management (blogs, projects, services, pages)
- ✅ **Medusa**: E-commerce engine (products, cart, checkout, orders)
- ✅ Best tool for each job, seamless integration

---

## 🏗️ Architecture: Division of Responsibilities

```
┌─────────────────────────────────────────────────────────────┐
│                    STORYBOX PLATFORM                         │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐   ┌──────────────┐   ┌─────────────┐      │
│  │   MONGODB   │   │    SANITY    │   │   MEDUSA    │      │
│  │             │   │              │   │             │      │
│  │  • Users    │   │  • Blogs     │   │  • Products │      │
│  │  • Auth     │   │  • Projects  │   │  • Variants │      │
│  │  • Analytics│   │  • Services  │   │  • Cart     │      │
│  │  • Settings │   │  • Pages     │   │  • Checkout │      │
│  │  • Logs     │   │  • Media     │   │  • Orders   │      │
│  │             │   │  • SEO       │   │  • Shipping │      │
│  └─────────────┘   └──────────────┘   └─────────────┘      │
│         ▲                 ▲                   ▲              │
│         │                 │                   │              │
│         └─────────────────┴───────────────────┘              │
│                           │                                  │
│                   NEXT.JS FRONTEND                           │
│                  (Unified Experience)                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 System Responsibilities Breakdown

### 🟦 **MongoDB** - Custom Business Logic

**What it handles:**
- ✅ User authentication and profiles
- ✅ Admin user management
- ✅ Custom business rules (B2B pricing, bulk orders)
- ✅ Analytics and tracking data
- ✅ Application settings and configuration
- ✅ Audit logs and activity tracking
- ✅ Order enrichment (add custom fields to Medusa orders)

**Why keep it:**
- Full control over data structure
- Fast queries for custom logic
- No API rate limits
- Store sensitive data securely
- Bulgarian-specific business rules

**Example use cases:**
```javascript
// MongoDB handles user authentication
const user = await db.collection('users').findOne({ email })

// Custom B2B pricing logic
const b2bPricing = await db.collection('b2b_pricing').find({ userId })

// Analytics tracking
await db.collection('events').insertOne({ 
  userId, 
  action: 'product_view',
  productId 
})
```

---

### 🟩 **Sanity CMS** - Content Management

**What it handles:**
- ✅ Blog posts and articles
- ✅ Portfolio projects/case studies
- ✅ Service descriptions
- ✅ Static pages (About, Contact, FAQ)
- ✅ Media library (images, videos, PDFs)
- ✅ SEO meta data
- ✅ Marketing banners and promotions
- ✅ Testimonials and reviews

**Why use it:**
- 🎨 **Professional editing experience** - Real-time preview, drag-drop
- 👥 **Multi-user collaboration** - Content team can work without developers
- 🖼️ **Advanced media handling** - CDN, automatic optimization, focal points
- 🌍 **Multi-language ready** - Easy i18n for BG/EN
- 🔄 **Version history** - Undo changes, restore old versions
- 📱 **Mobile app** - Edit content from Sanity mobile app
- 🎯 **Structured content** - Rich text with custom components

**Current limitations it solves:**
- ❌ No blog system → ✅ Full-featured blog with categories, tags, authors
- ❌ Manual HTML editing → ✅ WYSIWYG editor with live preview
- ❌ No media management → ✅ Professional media library with search
- ❌ Developer-dependent → ✅ Content team independence

**Example content structure:**
```javascript
// Blog Post Schema in Sanity
{
  title: "Custom Embroidery Trends 2025",
  slug: "embroidery-trends-2025",
  author: { name: "Maria", avatar: "..." },
  publishedAt: "2025-06-01",
  category: "embroidery",
  mainImage: {
    asset: { url: "...", metadata: { ... } },
    hotspot: { x: 0.5, y: 0.3 } // Focal point
  },
  body: [ /* Rich portable text */ ],
  seo: {
    title: "...",
    description: "...",
    ogImage: "..."
  }
}

// Project/Portfolio Schema
{
  title: "Corporate Branding for TechCorp",
  client: "TechCorp Ltd",
  services: ["embroidery", "print-design"],
  images: [ /* Gallery */ ],
  description: [ /* Rich text */ ],
  results: "Increased brand recognition by 40%"
}
```

**Integration with Next.js:**
```javascript
// Fetch blog posts
import { client } from '@/lib/sanity'

export async function getBlogPosts() {
  return client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      title,
      slug,
      publishedAt,
      mainImage,
      excerpt
    }
  `)
}

// Display in Next.js
export default async function BlogPage() {
  const posts = await getBlogPosts()
  return <BlogGrid posts={posts} />
}
```

---

### 🟪 **Medusa** - E-commerce Engine

**What it handles:**
- ✅ Product catalog with variants (color, size, material)
- ✅ Shopping cart (persistent, multi-device)
- ✅ Checkout flow (address, payment, confirmation)
- ✅ Order management
- ✅ Inventory tracking
- ✅ Multi-currency support (BGN, EUR, USD)
- ✅ Multi-region shipping
- ✅ Discount codes and promotions
- ✅ Customer groups (retail vs B2B)
- ✅ Returns and exchanges
- ✅ Gift cards

**Why use it:**
- 🛒 **Production-grade cart** - Handles edge cases localStorage can't
- 💳 **Payment integrations** - Stripe already built-in
- 📦 **Shipping integrations** - Calculate rates, print labels
- 🌍 **International ready** - Multi-currency, multi-language, tax calculations
- 📊 **Sales analytics** - Built-in reports and dashboards
- 🔌 **Extensible** - Plugin system for custom functionality
- 🚀 **Battle-tested** - Used by thousands of stores

**Current limitations it solves:**
- ❌ localStorage cart limits → ✅ Persistent cart across devices
- ❌ No variant support → ✅ Full variant management (color, size, etc.)
- ❌ Manual inventory → ✅ Automatic inventory deduction
- ❌ Basic checkout → ✅ Professional checkout with validation
- ❌ Single currency → ✅ Multi-currency support
- ❌ No discounts → ✅ Flexible discount system
- ❌ Manual order management → ✅ Complete order lifecycle

**Example Medusa advantages:**

```javascript
// CURRENT (localStorage cart)
const cart = {
  items: [
    { id: 1, title: "Product", quantity: 2, price: 100 }
  ],
  total: 200
}
// Problems:
// - Lost if user clears browser
// - No variants
// - No inventory check
// - No multi-device sync

// WITH MEDUSA
const cart = await medusa.carts.retrieve(cartId)
{
  id: "cart_123",
  email: "user@example.com",
  items: [{
    variant: {
      id: "variant_456",
      title: "Embroidered Logo - Red - Size L",
      product: { /* Full product data */ },
      prices: [
        { amount: 4999, currency_code: "bgn" },
        { amount: 2550, currency_code: "eur" }
      ],
      inventory_quantity: 50
    },
    quantity: 2,
    subtotal: 9998,
    total: 9998
  }],
  shipping_address: { /* Customer address */ },
  shipping_methods: [{
    shipping_option: {
      name: "Econt - Express Delivery",
      amount: 599
    }
  }],
  subtotal: 9998,
  shipping_total: 599,
  tax_total: 2000,
  total: 12597
}
// Benefits:
// ✅ Persists across devices
// ✅ Real-time inventory checking
// ✅ Automatic tax calculation
// ✅ Shipping cost calculation
// ✅ Multi-currency
// ✅ Applied discounts
```

**Product with Variants:**
```javascript
// Simple product becomes powerful
{
  id: "prod_embroidered_logo",
  title: "Custom Embroidered Logo",
  description: "High-quality embroidered logo for your business",
  images: ["url1", "url2", "url3"],
  
  // Multiple variants
  variants: [
    {
      id: "variant_red_small",
      title: "Red / Small",
      options: [
        { name: "Color", value: "Red" },
        { name: "Size", value: "Small" }
      ],
      prices: [
        { currency_code: "bgn", amount: 4999 },
        { currency_code: "eur", amount: 2550 }
      ],
      inventory_quantity: 50
    },
    {
      id: "variant_blue_large",
      title: "Blue / Large",
      options: [
        { name: "Color", value: "Blue" },
        { name: "Size", value: "Large" }
      ],
      prices: [
        { currency_code: "bgn", amount: 5999 },
        { currency_code: "eur", amount: 3070 }
      ],
      inventory_quantity: 30
    }
  ]
}
```

---

## 🚀 Implementation Roadmap

### **Phase 1: Sanity CMS Integration** (Week 1-2)

**Goal**: Set up Sanity for content management

#### Step 1.1: Sanity Studio Setup
```bash
# Already installed, just need to configure
cd /app
npx sanity init --project-id your-project-id
```

#### Step 1.2: Create Content Schemas
```javascript
// sanity/schemas/blog.js
export default {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' }
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }]
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true }
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }]
    },
    {
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime'
    },
    {
      name: 'body',
      title: 'Body',
      type: 'blockContent' // Rich text
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        { name: 'title', type: 'string' },
        { name: 'description', type: 'text' },
        { name: 'keywords', type: 'array', of: [{ type: 'string' }] }
      ]
    }
  ]
}
```

#### Step 1.3: Blog Page Implementation
```javascript
// app/blog/page.js
import { client } from '@/lib/sanity'
import BlogCard from '@/components/BlogCard'

async function getBlogPosts() {
  return client.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      mainImage,
      publishedAt,
      excerpt,
      author->{name, image}
    }
  `)
}

export default async function BlogPage() {
  const posts = await getBlogPosts()
  
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8">Блог</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map(post => (
          <BlogCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  )
}
```

#### Step 1.4: Sanity Studio Access
```bash
# Run Sanity Studio locally
cd /app
npx sanity dev

# Access at: http://localhost:3333
# Or deploy to Sanity hosting: npx sanity deploy
```

**Benefits achieved:**
- ✅ Professional blog system
- ✅ Content team can publish without developers
- ✅ Media library with CDN
- ✅ SEO optimization built-in

---

### **Phase 2: Medusa Backend Setup** (Week 3-4)

**Goal**: Set up Medusa as e-commerce backend

#### Step 2.1: Medusa Server Setup
```bash
# Create Medusa backend (separate from Next.js)
npx create-medusa-app@latest

# Or add to existing project
cd /app
mkdir medusa-backend
cd medusa-backend
npx create-medusa-app@latest
```

#### Step 2.2: Configure Medusa
```javascript
// medusa-backend/medusa-config.js
module.exports = {
  projectConfig: {
    database_url: process.env.MEDUSA_DATABASE_URL, // PostgreSQL
    redis_url: process.env.REDIS_URL,
    store_cors: process.env.STORE_CORS, // Next.js URL
    admin_cors: process.env.ADMIN_CORS,
  },
  plugins: [
    {
      resolve: `@medusajs/file-local`,
      options: {
        upload_dir: "uploads",
      },
    },
    // Stripe payment
    {
      resolve: `medusa-payment-stripe`,
      options: {
        api_key: process.env.STRIPE_SECRET_KEY,
      },
    },
    // Econt shipping (custom plugin)
    {
      resolve: `./plugins/medusa-shipping-econt`,
      options: {
        api_key: process.env.ECONT_API_KEY,
      },
    },
  ],
}
```

#### Step 2.3: Run Medusa Services
```bash
# Start PostgreSQL
docker run -d -p 5432:5432 \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=medusa \
  postgres:13

# Start Redis
docker run -d -p 6379:6379 redis:7

# Run migrations
npm run migration:run

# Seed data
npm run seed

# Start Medusa server
npm run dev
# Runs on http://localhost:9000
```

#### Step 2.4: Medusa Admin Access
```bash
# Create admin user
npx medusa user -e admin@storybox.bg -p admin123 --invite

# Access admin panel
# http://localhost:9000/app
```

**Medusa Admin Panel provides:**
- Product management with variants
- Order management
- Customer management
- Discount management
- Analytics dashboard
- Settings (regions, currencies, shipping, payments)

---

### **Phase 3: Migrate Products to Medusa** (Week 5)

**Goal**: Move products from MongoDB to Medusa

#### Step 3.1: Product Migration Script
```javascript
// scripts/migrate-products-to-medusa.js
const { MongoClient } = require('mongodb')
const Medusa = require("@medusajs/medusa-js").default

async function migrateProducts() {
  // Connect to MongoDB
  const mongoClient = new MongoClient(process.env.MONGO_URL)
  await mongoClient.connect()
  const db = mongoClient.db()
  
  // Connect to Medusa
  const medusa = new Medusa({ 
    baseUrl: "http://localhost:9000",
    maxRetries: 3 
  })
  
  // Authenticate with Medusa
  await medusa.admin.auth.getToken({
    email: "admin@storybox.bg",
    password: "admin123"
  })
  
  // Get products from MongoDB
  const products = await db.collection('products').find().toArray()
  
  for (const product of products) {
    // Create product in Medusa
    const medusaProduct = await medusa.admin.products.create({
      title: product.title,
      subtitle: product.subtitle,
      description: product.description,
      handle: product.slug,
      
      // Images
      images: product.images?.map(url => ({ url })),
      thumbnail: product.coverImage || product.images?.[0],
      
      // Single variant (for simple products)
      variants: [{
        title: "Default",
        prices: [{
          amount: product.price,
          currency_code: "bgn"
        }],
        inventory_quantity: product.inventory || 0,
        manage_inventory: true,
        sku: product.sku
      }],
      
      // Metadata (preserve MongoDB fields)
      metadata: {
        mongodb_id: product.id,
        category: product.category,
        featured: product.featured,
        weight: product.weight,
        dimensions: product.dimensions,
        custom_fields: product.customFields
      }
    })
    
    console.log(`Migrated: ${product.title}`)
  }
  
  await mongoClient.close()
  console.log('Migration complete!')
}

migrateProducts()
```

#### Step 3.2: Create Products with Variants
```javascript
// Example: Embroidered logo with color and size variants
await medusa.admin.products.create({
  title: "Custom Embroidered Logo",
  description: "High-quality embroidered logo",
  handle: "custom-embroidered-logo",
  
  // Define variant options
  options: [
    { title: "Color" },
    { title: "Size" }
  ],
  
  // Create all combinations
  variants: [
    {
      title: "Red / Small",
      prices: [{ amount: 4999, currency_code: "bgn" }],
      options: [
        { value: "Red" },
        { value: "Small" }
      ],
      inventory_quantity: 50,
      sku: "EMB-LOGO-RED-S"
    },
    {
      title: "Red / Medium",
      prices: [{ amount: 5499, currency_code: "bgn" }],
      options: [
        { value: "Red" },
        { value: "Medium" }
      ],
      inventory_quantity: 40,
      sku: "EMB-LOGO-RED-M"
    },
    {
      title: "Blue / Small",
      prices: [{ amount: 4999, currency_code: "bgn" }],
      options: [
        { value: "Blue" },
        { value: "Small" }
      ],
      inventory_quantity: 30,
      sku: "EMB-LOGO-BLUE-S"
    }
    // ... more variants
  ]
})
```

---

### **Phase 4: Replace localStorage Cart with Medusa** (Week 6)

**Goal**: Implement proper cart with Medusa

#### Step 4.1: Update Cart Context
```javascript
// contexts/MedusaCartContext.js
'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import Medusa from "@medusajs/medusa-js"

const medusa = new Medusa({ 
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000",
  maxRetries: 3 
})

const CartContext = createContext()

export function MedusaCartProvider({ children }) {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Initialize cart
  useEffect(() => {
    const initCart = async () => {
      // Check for existing cart ID in localStorage
      let cartId = localStorage.getItem('medusa_cart_id')
      
      try {
        if (cartId) {
          // Retrieve existing cart
          const { cart } = await medusa.carts.retrieve(cartId)
          setCart(cart)
        } else {
          // Create new cart
          const { cart } = await medusa.carts.create({
            region_id: "reg_bg" // Bulgarian region
          })
          localStorage.setItem('medusa_cart_id', cart.id)
          setCart(cart)
        }
      } catch (error) {
        // Cart not found or expired, create new one
        const { cart } = await medusa.carts.create({
          region_id: "reg_bg"
        })
        localStorage.setItem('medusa_cart_id', cart.id)
        setCart(cart)
      } finally {
        setLoading(false)
      }
    }
    
    initCart()
  }, [])
  
  // Add item to cart
  const addItem = async (variantId, quantity = 1) => {
    try {
      const { cart: updatedCart } = await medusa.carts.lineItems.create(cart.id, {
        variant_id: variantId,
        quantity
      })
      setCart(updatedCart)
      return updatedCart
    } catch (error) {
      console.error('Error adding item:', error)
      throw error
    }
  }
  
  // Update item quantity
  const updateItem = async (lineId, quantity) => {
    try {
      const { cart: updatedCart } = await medusa.carts.lineItems.update(
        cart.id,
        lineId,
        { quantity }
      )
      setCart(updatedCart)
      return updatedCart
    } catch (error) {
      console.error('Error updating item:', error)
      throw error
    }
  }
  
  // Remove item
  const removeItem = async (lineId) => {
    try {
      const { cart: updatedCart } = await medusa.carts.lineItems.delete(
        cart.id,
        lineId
      )
      setCart(updatedCart)
      return updatedCart
    } catch (error) {
      console.error('Error removing item:', error)
      throw error
    }
  }
  
  // Add discount code
  const addDiscount = async (code) => {
    try {
      const { cart: updatedCart } = await medusa.carts.update(cart.id, {
        discounts: [{ code }]
      })
      setCart(updatedCart)
      return updatedCart
    } catch (error) {
      console.error('Error applying discount:', error)
      throw error
    }
  }
  
  // Set shipping address
  const setShippingAddress = async (address) => {
    try {
      const { cart: updatedCart } = await medusa.carts.update(cart.id, {
        shipping_address: address
      })
      setCart(updatedCart)
      return updatedCart
    } catch (error) {
      console.error('Error setting address:', error)
      throw error
    }
  }
  
  // Complete cart (checkout)
  const completeCart = async () => {
    try {
      const { type, data } = await medusa.carts.complete(cart.id)
      
      if (type === 'order') {
        // Clear cart
        localStorage.removeItem('medusa_cart_id')
        setCart(null)
        
        // Create new cart for next purchase
        const { cart: newCart } = await medusa.carts.create({
          region_id: "reg_bg"
        })
        localStorage.setItem('medusa_cart_id', newCart.id)
        setCart(newCart)
        
        return data // The completed order
      }
      
      throw new Error('Cart completion failed')
    } catch (error) {
      console.error('Error completing cart:', error)
      throw error
    }
  }
  
  const value = {
    cart,
    loading,
    addItem,
    updateItem,
    removeItem,
    addDiscount,
    setShippingAddress,
    completeCart,
    itemCount: cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
    total: cart?.total || 0
  }
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within MedusaCartProvider')
  }
  return context
}
```

#### Step 4.2: Update Product Page
```javascript
// app/shop/[slug]/page.js
'use client'
import { useState } from 'react'
import { useCart } from '@/contexts/MedusaCartContext'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function ProductPage({ product }) {
  const { addItem } = useCart()
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0])
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const handleAddToCart = async () => {
    setLoading(true)
    try {
      await addItem(selectedVariant.id, quantity)
      toast.success('Добавено в количката!')
    } catch (error) {
      toast.error('Грешка при добавяне')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Product images */}
      <div>
        <img src={product.thumbnail} alt={product.title} />
      </div>
      
      {/* Product details */}
      <div>
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="text-2xl mt-4">
          {selectedVariant.prices[0].amount / 100} лв
        </p>
        
        {/* Variant selection */}
        {product.options.map(option => (
          <div key={option.id} className="mt-4">
            <label className="font-semibold">{option.title}</label>
            <div className="flex gap-2 mt-2">
              {product.variants
                .map(v => v.options.find(o => o.option_id === option.id))
                .filter((v, i, arr) => arr.findIndex(x => x.value === v.value) === i)
                .map(opt => (
                  <Button
                    key={opt.value}
                    variant={selectedVariant.options.find(o => o.value === opt.value) ? "default" : "outline"}
                    onClick={() => {
                      // Find variant with this option
                      const variant = product.variants.find(v =>
                        v.options.some(o => o.value === opt.value)
                      )
                      setSelectedVariant(variant)
                    }}
                  >
                    {opt.value}
                  </Button>
                ))}
            </div>
          </div>
        ))}
        
        {/* Quantity */}
        <div className="mt-4">
          <label className="font-semibold">Количество</label>
          <input
            type="number"
            min="1"
            max={selectedVariant.inventory_quantity}
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-20 border rounded px-2 py-1 ml-2"
          />
          <span className="text-sm text-gray-500 ml-2">
            (На склад: {selectedVariant.inventory_quantity})
          </span>
        </div>
        
        {/* Add to cart */}
        <Button
          onClick={handleAddToCart}
          disabled={loading || selectedVariant.inventory_quantity === 0}
          className="mt-6 w-full"
        >
          {loading ? 'Добавяне...' : 'Добави в количката'}
        </Button>
        
        {/* Description */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Описание</h2>
          <p>{product.description}</p>
        </div>
      </div>
    </div>
  )
}
```

#### Step 4.3: Update Cart Page
```javascript
// app/cart/page.js
'use client'
import { useCart } from '@/contexts/MedusaCartContext'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CartPage() {
  const { cart, updateItem, removeItem, loading } = useCart()
  
  if (loading) return <div>Зареждане...</div>
  
  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-2xl mb-4">Количката е празна</h1>
        <Link href="/shop">
          <Button>Продължи пазаруването</Button>
        </Link>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Количка</h1>
      
      <div className="grid grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="col-span-2">
          {cart.items.map(item => (
            <div key={item.id} className="flex gap-4 border-b py-4">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-24 h-24 object-cover rounded"
              />
              
              <div className="flex-1">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.variant.title}</p>
                <p className="text-sm text-gray-600">SKU: {item.variant.sku}</p>
                
                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="number"
                    min="1"
                    max={item.variant.inventory_quantity}
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, parseInt(e.target.value))}
                    className="w-16 border rounded px-2 py-1"
                  />
                  
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                  >
                    Премахни
                  </Button>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-semibold">
                  {item.total / 100} лв
                </p>
                <p className="text-sm text-gray-600">
                  {item.unit_price / 100} лв × {item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Order summary */}
        <div className="border rounded-lg p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Обобщение</h2>
          
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Междинна сума:</span>
              <span>{cart.subtotal / 100} лв</span>
            </div>
            
            {cart.discount_total > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Отстъпка:</span>
                <span>-{cart.discount_total / 100} лв</span>
              </div>
            )}
            
            <div className="flex justify-between">
              <span>Доставка:</span>
              <span>
                {cart.shipping_total > 0 
                  ? `${cart.shipping_total / 100} лв`
                  : 'Изчислява се при плащане'
                }
              </span>
            </div>
            
            {cart.tax_total > 0 && (
              <div className="flex justify-between">
                <span>ДДС:</span>
                <span>{cart.tax_total / 100} лв</span>
              </div>
            )}
            
            <div className="border-t pt-2 flex justify-between font-bold text-lg">
              <span>Общо:</span>
              <span>{cart.total / 100} лв</span>
            </div>
          </div>
          
          <Link href="/checkout">
            <Button className="w-full">Към плащане</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
```

---

### **Phase 5: Checkout Integration** (Week 7)

**Goal**: Complete checkout flow with Medusa

#### Step 5.1: Checkout Page
```javascript
// app/checkout/page.js
'use client'
import { useState } from 'react'
import { useCart } from '@/contexts/MedusaCartContext'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function CheckoutPage() {
  const { cart, setShippingAddress, completeCart } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    address_1: '',
    city: '',
    postal_code: '',
    phone: ''
  })
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Set shipping address
      await setShippingAddress(formData)
      
      // Complete cart and create order
      const order = await completeCart()
      
      // Redirect to success page
      router.push(`/order-confirmation/${order.id}`)
      toast.success('Поръчката е завършена успешно!')
    } catch (error) {
      toast.error('Грешка при завършване на поръчката')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Плащане</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl">
        {/* Customer info */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Данни за доставка</h2>
          
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="w-full border rounded px-4 py-2 mb-4"
            required
          />
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Име"
              value={formData.first_name}
              onChange={(e) => setFormData({...formData, first_name: e.target.value})}
              className="border rounded px-4 py-2"
              required
            />
            <input
              type="text"
              placeholder="Фамилия"
              value={formData.last_name}
              onChange={(e) => setFormData({...formData, last_name: e.target.value})}
              className="border rounded px-4 py-2"
              required
            />
          </div>
          
          <input
            type="text"
            placeholder="Адрес"
            value={formData.address_1}
            onChange={(e) => setFormData({...formData, address_1: e.target.value})}
            className="w-full border rounded px-4 py-2 mb-4"
            required
          />
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Град"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              className="border rounded px-4 py-2"
              required
            />
            <input
              type="text"
              placeholder="Пощенски код"
              value={formData.postal_code}
              onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
              className="border rounded px-4 py-2"
              required
            />
          </div>
          
          <input
            type="tel"
            placeholder="Телефон"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="w-full border rounded px-4 py-2"
            required
          />
        </div>
        
        {/* Order summary */}
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-xl font-bold mb-4">Обобщение</h2>
          {cart.items.map(item => (
            <div key={item.id} className="flex justify-between mb-2">
              <span>{item.title} × {item.quantity}</span>
              <span>{item.total / 100} лв</span>
            </div>
          ))}
          <div className="border-t pt-2 mt-2 flex justify-between font-bold">
            <span>Общо:</span>
            <span>{cart.total / 100} лв</span>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Обработване...' : 'Завърши поръчката'}
        </button>
      </form>
    </div>
  )
}
```

---

## 🎁 Benefits Summary

### **With Sanity CMS:**

1. **Content Independence**
   - Marketing team can update blogs without developers
   - Real-time preview before publishing
   - Schedule posts for future dates
   - Version history and rollback

2. **Better SEO**
   - Structured metadata for every page
   - Automatic sitemap generation
   - Open Graph images
   - Rich snippets support

3. **Media Management**
   - Professional media library
   - Automatic image optimization
   - Focal point selection
   - Alt text management

4. **Multi-language Ready**
   - Easy translation workflow
   - BG/EN content variants
   - Language-specific URLs

### **With Medusa E-commerce:**

1. **Production-Grade Cart**
   - Persistent across devices
   - Real-time inventory checking
   - Handles concurrent updates
   - Guest checkout support

2. **Advanced Product Management**
   - Unlimited variants (color, size, material)
   - Multiple pricing tiers (retail, wholesale)
   - Multi-currency support
   - Collection management

3. **Complete Order Lifecycle**
   - Automated order processing
   - Inventory deduction
   - Order status tracking
   - Return management
   - Refund handling

4. **Business Growth Features**
   - Discount codes and promotions
   - Customer groups (B2B vs B2C)
   - Gift cards
   - Abandoned cart recovery
   - Sales analytics

5. **Integration Ecosystem**
   - Stripe payment (ready)
   - Econt shipping (custom plugin)
   - Email notifications
   - Webhook events
   - Admin API for custom integrations

### **With MongoDB + Sanity + Medusa:**

1. **Best of All Worlds**
   - MongoDB: Custom business logic
   - Sanity: Content management
   - Medusa: E-commerce engine
   - Each tool optimized for its purpose

2. **Scalability**
   - Each system scales independently
   - Clear separation of concerns
   - Easy to maintain and upgrade

3. **Developer Experience**
   - Clean APIs
   - Good documentation
   - Active communities
   - Regular updates

---

## 📅 Timeline Summary

| Phase | Duration | Goal |
|-------|----------|------|
| Phase 1 | Week 1-2 | Sanity CMS setup + Blog |
| Phase 2 | Week 3-4 | Medusa backend setup |
| Phase 3 | Week 5 | Migrate products to Medusa |
| Phase 4 | Week 6 | Replace cart with Medusa |
| Phase 5 | Week 7 | Checkout integration |
| **Total** | **7 weeks** | **Full integration** |

---

## 💡 Quick Wins

**Can implement immediately (no migration needed):**

1. **Sanity for new content**
   - Start blog with Sanity
   - Keep existing MongoDB data
   - No breaking changes

2. **Medusa for new products**
   - Add new products in Medusa
   - Keep old products in MongoDB
   - Gradual migration

**Coexistence strategy:**
```javascript
// Check if product is from Medusa or MongoDB
if (product.source === 'medusa') {
  // Use Medusa cart
  await medusaCart.addItem(product.variantId)
} else {
  // Use MongoDB/localStorage cart
  simpleCart.addItem(product)
}
```

---

## ❓ FAQs

**Q: Do we need to remove MongoDB?**
A: No! MongoDB stays for users, auth, analytics, and custom logic.

**Q: Will this increase costs?**
A: Minimal:
- Sanity: Free tier covers most needs (~$200/mo for heavy use)
- Medusa: Free, self-hosted (just server costs)
- PostgreSQL: Can use same server (~$0-20/mo)

**Q: Is it more complex?**
A: Slightly, but each system is simpler than building everything custom.

**Q: Can we migrate gradually?**
A: Yes! Start with Sanity for blog, then Medusa for products.

**Q: What if we want to remove one later?**
A: All data is accessible via APIs. Can migrate back to MongoDB if needed.

---

## 🚀 Next Steps

**To proceed with integration:**

1. **Decision**: Confirm you want both Sanity and Medusa
2. **Resources**: Allocate 7 weeks for full integration
3. **Infrastructure**: Set up PostgreSQL and Redis for Medusa
4. **Accounts**: Create Sanity project account
5. **Start**: Begin with Phase 1 (Sanity) for quick wins

**Would you like me to start implementing Phase 1 (Sanity CMS)?**

---

**Last Updated**: June 2025
