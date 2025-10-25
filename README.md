# Storybox E-commerce Platform

Professional Bulgarian embroidery and textile printing business website with full e-commerce capabilities powered by Medusa.js.

## 🌟 Features

### E-commerce
- ✅ **Medusa.js Integration** - Complete commerce backend
- ✅ **Multi-tier Pricing** - Standard, Premium, VIP customer tiers
- ✅ **Shopping Cart** - Medusa-powered cart with persistence
- ✅ **Order Management** - Full order lifecycle with cancellation
- ✅ **Product Variants** - Multiple pricing tiers per product
- ✅ **Checkout Flow** - Complete purchase journey
- ✅ **Bank Transfer** - Order confirmation with payment details

### User System
- ✅ **JWT Authentication** - Secure user sessions
- ✅ **Google OAuth** - Social login integration
- ✅ **User Dashboard** - Account management
- ✅ **Order History** - View and manage orders
- ✅ **Price Tiers** - Customer-specific pricing

### Content Management
- ✅ **Sanity CMS** - Headless content management
- ✅ **Services Showcase** - Embroidery, sublimation, printing, laser cutting
- ✅ **Project Gallery** - Portfolio of completed work
- ✅ **Blog System** - News and updates
- ✅ **Contact Forms** - Quote requests and inquiries

### Quality & Performance ⭐ NEW
- ✅ **Mobile Responsive** - Optimized for all devices with hamburger menu
- ✅ **Performance Optimized** - AVIF/WebP images, SWC minification, compression
- ✅ **WCAG 2.1 Compliant** - Skip navigation, enhanced focus, reduced motion
- ✅ **Security Hardened** - 7 security headers, input validation, rate limiting
- ✅ **Analytics Tracking** - Google Analytics 4 + Mixpanel integration

### Monitoring & Testing ⭐ NEW
- ✅ **Sentry Error Tracking** - Real-time error monitoring with session replay
- ✅ **Testing Suite** - Jest unit tests + Playwright E2E tests
- ✅ **CI/CD Pipeline** - Automated testing and deployment with GitHub Actions

## 🚀 Tech Stack

**Frontend:** Next.js 14, React 18, Tailwind CSS, shadcn/ui
**Backend:** Medusa.js v2, MongoDB, PostgreSQL, Redis
**CMS:** Sanity Studio
**Auth:** JWT, Google OAuth
**Testing:** Jest, React Testing Library, Playwright
**CI/CD:** GitHub Actions
**Monitoring:** Sentry Error Tracking
**Analytics:** Google Analytics 4, Mixpanel
**Security:** Zod validation, Rate limiting, XSS protection

## 📋 Prerequisites

- Node.js 18+ and yarn
- PostgreSQL 15+
- MongoDB 6+
- Redis 7+

## 🛠️ Quick Start

```bash
# Install dependencies
yarn install

# Copy environment file
cp .env.example .env

# Setup databases and run migrations
# See INSTALLATION.md for details

# Start development
yarn dev

# Run tests
yarn test              # Unit tests (watch mode)
yarn test:ci           # Unit tests with coverage
yarn test:e2e          # E2E tests

# Build for production
yarn build
yarn start
```

## 📖 Documentation

### Setup & Deployment
- [Installation Guide](./docs/INSTALLATION.md)
- [Medusa Integration](./docs/MEDUSA_INTEGRATION.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [API Documentation](./docs/API.md)

### Development & Testing
- [Testing Guide](./docs/TESTING.md)
- [CI/CD Pipeline](./docs/CI-CD.md)

### Quality & Compliance
- [Performance Optimization](./docs/PERFORMANCE.md) ⭐ NEW
- [Accessibility (WCAG 2.1)](./docs/ACCESSIBILITY.md) ⭐ NEW
- [Security (OWASP Top 10)](./docs/SECURITY.md) ⭐ NEW
- [Analytics Integration](./docs/ANALYTICS.md) ⭐ NEW

## 🧪 Testing

### Test Coverage

The application has comprehensive test coverage for critical flows:
- ✅ Authentication (login, register, logout)
- ✅ Shopping (browse, cart, checkout)
- ✅ Order Management (view, annul)
- ✅ Mobile Responsiveness
- ✅ Navigation & UI

See [Testing Guide](./docs/TESTING.md) for details.

### Running Tests

```bash
# Unit/Integration Tests
yarn test              # Watch mode
yarn test:ci           # CI mode with coverage

# E2E Tests
yarn test:e2e          # Run all E2E tests
yarn test:e2e:ui       # Run with Playwright UI
yarn test:e2e:headed   # Run in headed mode
```

## 🚢 CI/CD

Automated pipeline with GitHub Actions:
- ✅ Linting and code quality checks
- ✅ Unit and integration testing
- ✅ E2E testing with Playwright
- ✅ Production build validation
- ✅ Automatic deployment (main branch)
- ✅ Sentry release tracking

See [CI/CD Guide](./docs/CI-CD.md) for configuration.

## 📊 Monitoring

**Sentry Error Tracking**
- Real-time error monitoring
- Session replay on errors
- Performance tracking
- Release tracking

Dashboard: https://sentry.io

## 📞 Contact

**Storybox EOOD**
- Phone: +359899973002
- Email: office@storybox.bg
- Location: гр. София, България

## 📄 License

Proprietary - All rights reserved