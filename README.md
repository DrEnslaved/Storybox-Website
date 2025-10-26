# Storybox E-commerce Platform

🇧🇬 A modern, performant, and professional e-commerce platform for **Storybox** - offering embroidery and print design services in Bulgaria.

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=flat-square&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## ✨ Features

### 🛍️ E-commerce Core
- **Product Management**: Comprehensive product catalog with variants, SKUs, and inventory tracking
- **Shopping Cart**: localStorage-based cart with persistent sessions
- **Order Management**: Complete order lifecycle from creation to fulfillment
- **Backorder System**: Handle out-of-stock items with backorder requests
- **Category & Price Filtering**: Dynamic shop filtering for better UX

### 🔐 Authentication & Authorization
- **JWT Authentication**: Secure token-based auth
- **Google OAuth**: Social login integration
- **Role-Based Access**: Admin and customer roles
- **Secure Admin Panel**: Protected routes and API endpoints

### 📊 Admin Dashboard
- **User Management**: View and manage customer accounts
- **Product Management**: Create, edit, delete products with rich fields
  - Cover images & galleries (2-5 images)
  - Rich text descriptions
  - SKUs, pricing, inventory
  - Min/max quantities, backorder status
  - Weight, dimensions (for shipping)
  - SEO fields (title, description, slug)
  - Categories, tags, visibility
  - Related products, product badges
- **Order Management**: View orders, update status, annul orders
- **Dashboard Analytics**: Revenue, orders, users statistics (excludes annulled/cancelled orders)
- **B2B Features**: MOQ, bulk pricing tiers, lead time, custom fields

### 🔌 Integrations
- **Sentry**: Real-time error tracking and monitoring
- **Google Analytics**: Web analytics and user behavior tracking
- **Mixpanel**: Product analytics and user engagement
- **Stripe**: Payment processing (ready for integration)
- **Econt**: Bulgarian shipping provider (ready for integration)

### 🎨 UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **shadcn/ui Components**: Beautiful, accessible UI components
- **Dark Mode Ready**: Theme support built-in
- **Cookie Consent**: GDPR-compliant cookie banner
- **Accessibility**: WCAG 2.1 compliant

### 🧪 Quality & Performance
- **Testing Suite**: Jest (unit) + Playwright (E2E)
- **CI/CD Pipeline**: Automated testing and deployment via GitHub Actions
- **Performance Optimized**: Image optimization, code splitting, lazy loading
- **Security**: OWASP best practices, rate limiting, input validation
- **SEO Optimized**: Meta tags, structured data, sitemap

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.x
- Yarn package manager
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/storybox.git
cd storybox

# Run quick start script
./quick-start.sh     # Linux/Mac
quick-start.bat      # Windows

# Start development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Admin Panel**: [http://localhost:3000/admin](http://localhost:3000/admin)  
**Default Credentials**: `admin@storybox.bg` / `admin123`

---

## 📖 Setup Scripts

We provide automated setup scripts for different scenarios:

| Script | Purpose | Documentation |
|--------|---------|---------------|
| `quick-start.sh/bat` | Fast setup for developers | [Quick Start](#quick-start) |
| `setup-local-dev.sh/bat` | Full local development setup | [Setup Guide](./SETUP_GUIDE.md#local-development-setup) |
| `setup-production.sh/bat` | Production deployment | [Setup Guide](./SETUP_GUIDE.md#production-deployment) |

📚 **Detailed instructions**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 14.2 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **Forms**: React Hook Form + Zod validation

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT + bcrypt
- **Validation**: Zod schemas

### DevOps & Tools
- **Package Manager**: Yarn
- **Testing**: Jest, Playwright
- **CI/CD**: GitHub Actions
- **Error Tracking**: Sentry
- **Analytics**: Google Analytics, Mixpanel
- **Code Quality**: ESLint, Prettier

---

## 📁 Project Structure

```
/app
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── admin/            # Admin API endpoints
│   │   ├── auth/             # Authentication endpoints
│   │   └── products/         # Product endpoints
│   ├── admin/                # Admin panel pages
│   ├── shop/                 # Shop pages
│   ├── cart/                 # Cart page
│   ├── checkout/             # Checkout page
│   └── layout.js             # Root layout
├── components/               # React components
│   ├── ui/                   # shadcn/ui components
│   ├── AnalyticsProvider.js  # Analytics wrapper
│   └── CookieConsent.js      # Cookie banner
├── contexts/                 # React contexts
│   └── SimpleCartContext.js  # Cart state management
├── lib/                      # Utilities
│   ├── db.js                 # MongoDB connection
│   ├── admin-auth.js         # Admin authentication
│   └── analytics.js          # Analytics setup
├── docs/                     # Documentation
├── .github/workflows/        # CI/CD workflows
└── package.json              # Dependencies
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGO_URL=mongodb://localhost:27017/storybox

# Application
NEXT_PUBLIC_BASE_URL=http://localhost:3000
JWT_SECRET=your-secret-key
NODE_ENV=development

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_MIXPANEL_TOKEN=your-token

# Error Tracking (optional)
NEXT_PUBLIC_SENTRY_DSN=your-dsn
SENTRY_AUTH_TOKEN=your-token

# Payment Integration
STRIPE_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Shipping Integration
ECONT_API_KEY=your-key
ECONT_API_URL=https://ee.econt.com/services
```

📚 **Full reference**: [SETUP_GUIDE.md - Environment Variables](./SETUP_GUIDE.md#environment-variables-reference)

---

## 🧪 Testing

### Run Tests

```bash
# Unit tests
yarn test

# E2E tests
yarn test:e2e

# Test coverage
yarn test:coverage
```

### Test Structure
- **Unit Tests**: `__tests__/` directories
- **E2E Tests**: `tests/e2e/` directory
- **Test Results**: `test_result.md`

---

## 📦 Available Scripts

```bash
yarn dev          # Start development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
yarn test         # Run tests
yarn test:e2e     # Run E2E tests
```

---

## 🚢 Deployment

### Production Setup

1. Run the production setup script:
   ```bash
   ./setup-production.sh
   ```

2. Configure reverse proxy (Nginx/Apache)

3. Set up SSL certificates

4. Configure domain DNS

5. Set up monitoring and backups

📚 **Detailed guide**: [SETUP_GUIDE.md - Production Deployment](./SETUP_GUIDE.md#production-deployment)

### Deployment Platforms
- ✅ **Emergent** (Native deployment ready)
- ✅ **Vercel** (Recommended for Next.js)
- ✅ **AWS / DigitalOcean** (VPS deployment)
- ✅ **Docker** (Containerized deployment)

---

## 📚 Documentation

- [Setup Guide](./SETUP_GUIDE.md) - Complete setup instructions
- [Tools & Technologies](./docs/TOOLS_AND_TECHNOLOGIES.md) - Explanation of all tools used
- [Product Management](./docs/PRODUCT_MANAGEMENT.md) - Product system documentation
- [Backorder System](./docs/BACKORDER_SYSTEM.md) - Backorder functionality
- [Admin Statistics](./docs/ADMIN_STATISTICS.md) - Dashboard calculations
- [Analytics](./docs/ANALYTICS.md) - Analytics integration
- [CI/CD](./docs/CI-CD.md) - Continuous integration
- [Performance](./docs/PERFORMANCE.md) - Performance optimizations
- [Accessibility](./docs/ACCESSIBILITY.md) - Accessibility features
- [Pre-Release Checklist](./docs/PRE_RELEASE_CHECKLIST.md) - Launch checklist

---

## 🛣️ Roadmap

### ✅ Completed
- [x] Core e-commerce functionality
- [x] Admin panel with full management
- [x] Analytics integration (GA, Mixpanel)
- [x] Error tracking (Sentry)
- [x] Testing suite (Jest, Playwright)
- [x] CI/CD pipeline
- [x] Backorder system
- [x] Shop filtering
- [x] Comprehensive product fields
- [x] B2B features

### 🚧 In Progress
- [ ] Stripe payment integration
- [ ] Econt shipping integration
- [ ] Image upload functionality
- [ ] Product variants UI/logic
- [ ] Returns management system

### 📋 Planned
- [ ] Bulk product upload (CSV)
- [ ] Email notifications
- [ ] Customer reviews
- [ ] Wishlist functionality
- [ ] Advanced search
- [ ] Multi-language support (BG/EN)
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)

---

## 💬 Support

For support, email support@storybox.bg or open an issue in the repository.

---

**Made with ❤️ for Bulgarian businesses**