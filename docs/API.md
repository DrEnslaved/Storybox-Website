# API Documentation - Storybox Platform

Complete REST API reference for the Storybox e-commerce platform.

## Base URLs

- **Local:** `http://localhost:3000/api`
- **Production:** `https://storybox.bg/api`

## Authentication

Most endpoints require JWT authentication via cookies or Authorization header.

### Headers

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## Authentication Endpoints

### Register User

```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "Ivan Petrov",
  "email": "ivan@example.com",
  "password": "SecurePassword123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Регистрацията е успешна",
  "user": {
    "id": "uuid",
    "name": "Ivan Petrov",
    "email": "ivan@example.com",
    "role": "customer",
    "priceTier": "standard"
  }
}
```

### Login

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "ivan@example.com",
  "password": "SecurePassword123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Успешен вход",
  "user": {
    "id": "uuid",
    "name": "Ivan Petrov",
    "email": "ivan@example.com",
    "role": "customer",
    "priceTier": "premium"
  }
}
```

### Logout

```http
POST /api/auth/logout
```

**Response:** `200 OK`
```json
{
  "message": "Успешен изход"
}
```

---

## Medusa Product Endpoints

### Get All Products

```http
GET /api/medusa/products
```

**Response:** `200 OK`
```json
{
  "products": [
    {
      "id": "prod_123",
      "name": "Брандирани тениски с бродерия",
      "slug": "brandirani-teniski-s-broderia",
      "description": "Висококачествени памучни тениски...",
      "image": "https://...",
      "images": ["https://..."],
      "variants": [
        {
          "id": "variant_123",
          "title": "Standard",
          "sku": "EMBR-TSHIRT-STD",
          "price": 25.00,
          "currency": "bgn"
        }
      ],
      "medusaProduct": true
    }
  ],
  "source": "medusa"
}
```

### Get Product by Handle

```http
GET /api/medusa/products/:handle
```

**Example:** `/api/medusa/products/brandirani-teniski-s-broderia`

**Response:** `200 OK`
```json
{
  "product": {
    "id": "prod_123",
    "name": "Брандирани тениски с бродерия",
    "slug": "brandirani-teniski-s-broderia",
    "description": "...",
    "image": "https://...",
    "images": ["https://..."],
    "variants": [...],
    "minQuantity": 10,
    "maxQuantity": 5000
  }
}
```

---

## Cart Endpoints (Medusa)

### Create Cart

```http
POST /api/medusa/cart
```

**Response:** `200 OK`
```json
{
  "cart": {
    "id": "cart_abc123",
    "items": [],
    "total": 0,
    "subtotal": 0
  }
}
```

### Get Cart

```http
GET /api/medusa/cart/:cartId
```

**Response:** `200 OK`
```json
{
  "cart": {
    "id": "cart_abc123",
    "items": [
      {
        "id": "item_123",
        "title": "Брандирани тениски с бродерия",
        "variant": {
          "id": "variant_123",
          "title": "Standard"
        },
        "quantity": 10,
        "unit_price": 2500,
        "subtotal": 25000
      }
    ],
    "subtotal": 25000,
    "total": 25000
  }
}
```

### Add Item to Cart

```http
POST /api/medusa/cart/:cartId/line-items
```

**Request Body:**
```json
{
  "variant_id": "variant_123",
  "quantity": 10
}
```

**Response:** `200 OK`
```json
{
  "cart": {
    "id": "cart_abc123",
    "items": [...],
    "total": 25000
  }
}
```

### Update Line Item

```http
PUT /api/medusa/cart/:cartId/line-items/:itemId
```

**Request Body:**
```json
{
  "quantity": 15
}
```

### Remove Line Item

```http
DELETE /api/medusa/cart/:cartId/line-items/:itemId
```

---

## Order Endpoints

### Create Order

```http
POST /api/orders/create
```

**Authentication:** Required

**Request Body:**
```json
{
  "items": [
    {
      "name": "Product Name",
      "quantity": 10,
      "price": 25.00
    }
  ],
  "total": 250.00,
  "shippingAddress": {
    "fullName": "Ivan Petrov",
    "phone": "+359899123456",
    "address": "ул. Примерна 1",
    "city": "София",
    "postalCode": "1000"
  },
  "notes": "Please call before delivery"
}
```

**Response:** `201 Created`
```json
{
  "message": "Поръчката е създадена успешно!",
  "orderId": "order_uuid"
}
```

### Get User Orders

```http
GET /api/orders
```

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "orders": [
    {
      "id": "order_123",
      "status": "pending_payment",
      "total": 250.00,
      "items": [...],
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ]
}
```

### Get Single Order

```http
GET /api/orders/:orderId
```

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "order": {
    "id": "order_123",
    "userId": "user_123",
    "userEmail": "ivan@example.com",
    "status": "pending_payment",
    "items": [...],
    "total": 250.00,
    "shippingAddress": {...},
    "createdAt": "2025-01-15T10:00:00Z"
  }
}
```

### Cancel Order

```http
PUT /api/orders/:orderId/cancel
```

**Authentication:** Required

**Conditions:**
- Order status must be `pending_payment` or `processing`
- User must be order owner

**Response:** `200 OK`
```json
{
  "message": "Поръчката е анулирана успешно",
  "orderId": "order_123"
}
```

**Error Response:** `400 Bad Request`
```json
{
  "error": "Тази поръчка не може да бъде анулирана"
}
```

---

## Contact & Forms

### Contact Form

```http
POST /api/contact
```

**Request Body:**
```json
{
  "name": "Ivan Petrov",
  "email": "ivan@example.com",
  "phone": "+359899123456",
  "message": "Здравейте, имам въпрос..."
}
```

**Response:** `201 Created`
```json
{
  "message": "Съобщението е изпратено успешно!"
}
```

### Quote Request

```http
POST /api/quote
```

**Request Body:**
```json
{
  "name": "Ivan Petrov",
  "email": "ivan@example.com",
  "phone": "+359899123456",
  "company": "Example Corp",
  "service": "machine_embroidery",
  "quantity": 100,
  "description": "Искам бродирани риза с лого...",
  "deadline": "2025-02-01"
}
```

**Response:** `201 Created`
```json
{
  "message": "Заявката за оферта е получена успешно!",
  "quoteId": "quote_uuid"
}
```

---

## Legacy MongoDB Products

### Get MongoDB Products

```http
GET /api/products
```

**Response:** `200 OK`
```json
{
  "products": [
    {
      "_id": "mongo_id",
      "id": "uuid",
      "name": "Product Name",
      "slug": "product-slug",
      "image": "https://...",
      "priceTiers": [
        {
          "tierName": "standard",
          "price": 25.00
        }
      ],
      "inStock": true
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Неоторизиран достъп"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error message"
}
```

---

## Rate Limiting

**Limits:**
- Authentication: 5 requests/minute
- General API: 100 requests/minute
- Cart operations: 60 requests/minute

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642339200
```

---

## Webhooks (Future)

### Order Status Change

```http
POST /webhooks/order-status
```

**Payload:**
```json
{
  "event": "order.status_changed",
  "order_id": "order_123",
  "old_status": "pending_payment",
  "new_status": "processing"
}
```

---

## Testing

### cURL Examples

**Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123"}'
```

**Get Products:**
```bash
curl http://localhost:3000/api/medusa/products
```

**Create Cart:**
```bash
curl -X POST http://localhost:3000/api/medusa/cart
```

---

## SDK (Future Enhancement)

JavaScript SDK for easier integration:

```javascript
import { StoryboxClient } from '@storybox/sdk'

const client = new StoryboxClient({
  baseUrl: 'https://storybox.bg/api'
})

// Get products
const products = await client.products.list()

// Create cart
const cart = await client.cart.create()

// Add to cart
await client.cart.addItem(cart.id, {
  variant_id: 'variant_123',
  quantity: 10
})
```

---

**Last Updated:** January 2025
**API Version:** 1.0
