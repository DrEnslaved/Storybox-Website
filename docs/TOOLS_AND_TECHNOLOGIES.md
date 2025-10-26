# Tools and Technologies Documentation

This document explains the purpose and role of each tool, library, and technology used in the Storybox e-commerce platform.

---

## 📑 Table of Contents

- [Frontend Framework & Core](#frontend-framework--core)
- [UI & Styling](#ui--styling)
- [Backend & Database](#backend--database)
- [Authentication & Security](#authentication--security)
- [State Management](#state-management)
- [Forms & Validation](#forms--validation)
- [Testing](#testing)
- [DevOps & Deployment](#devops--deployment)
- [Monitoring & Analytics](#monitoring--analytics)
- [Development Tools](#development-tools)
- [Payment & Shipping](#payment--shipping)
- [Utilities](#utilities)

---

## Frontend Framework & Core

### **Next.js 14.2**
- **Purpose**: Full-stack React framework with server-side rendering (SSR) and static site generation (SSG)
- **Why**: 
  - Built-in API routes (no separate backend needed)
  - Excellent SEO with SSR
  - Image optimization out of the box
  - File-based routing (pages and API)
  - Best performance for e-commerce sites
- **Used for**: Application framework, routing, API endpoints

### **React 18**
- **Purpose**: JavaScript library for building user interfaces
- **Why**: 
  - Component-based architecture
  - Virtual DOM for performance
  - Huge ecosystem and community
  - Server components support
- **Used for**: Building all UI components and pages

### **TypeScript** (implied, though project uses JavaScript)
- **Purpose**: Type-safe JavaScript
- **Why**: 
  - Catch errors at compile time
  - Better IDE support and autocomplete
  - Improved code maintainability
- **Note**: Project is currently in JavaScript but has TypeScript checking enabled via `type-check` script

---

## UI & Styling

### **Tailwind CSS**
- **Purpose**: Utility-first CSS framework
- **Why**: 
  - Rapid UI development
  - No CSS naming conflicts
  - Small production bundle (unused styles purged)
  - Consistent design system
- **Used for**: All styling across the application

### **shadcn/ui**
- **Purpose**: Re-usable component library built on Radix UI
- **Why**: 
  - Beautiful, accessible components
  - Copy-paste components (you own the code)
  - Customizable with Tailwind
  - No package bloat
- **Used for**: Buttons, dialogs, forms, dropdowns, cards, etc.

### **Radix UI** (via shadcn/ui)
- **Components used**:
  - `@radix-ui/react-dialog` - Modal dialogs
  - `@radix-ui/react-dropdown-menu` - Dropdown menus
  - `@radix-ui/react-select` - Select inputs
  - `@radix-ui/react-tabs` - Tab navigation
  - `@radix-ui/react-toast` - Notifications
  - And 20+ more components
- **Purpose**: Unstyled, accessible UI primitives
- **Why**: 
  - WAI-ARIA compliant (accessibility)
  - Keyboard navigation support
  - Focus management
  - Highly customizable

### **Lucide React**
- **Purpose**: Icon library
- **Why**: 
  - 1000+ beautiful, consistent icons
  - Tree-shakeable (only import what you use)
  - SVG-based (scalable)
  - Open source
- **Used for**: All icons throughout the app

### **next-themes**
- **Purpose**: Dark mode support
- **Why**: 
  - System preference detection
  - No flash on page load
  - Persistent theme selection
- **Used for**: Theme switching (light/dark mode)

### **tailwind-merge** & **class-variance-authority**
- **Purpose**: Utility for merging Tailwind classes and creating component variants
- **Why**: 
  - Avoid class conflicts
  - Create reusable component variants
  - Better component API design
- **Used for**: Component styling utilities

---

## Backend & Database

### **MongoDB**
- **Purpose**: NoSQL document database
- **Why**: 
  - Flexible schema (perfect for e-commerce with varying product types)
  - Easy to scale
  - JSON-like documents (natural for JavaScript)
  - No complex joins needed for our use case
- **Used for**: Storing users, products, orders, projects, blogs

### **MongoDB Node Driver** (`mongodb` package)
- **Purpose**: Official MongoDB driver for Node.js
- **Why**: 
  - Direct MongoDB access
  - Modern async/await API
  - Connection pooling
  - Better performance than ODMs
- **Used for**: All database operations

### **Next.js API Routes**
- **Purpose**: Serverless backend API
- **Why**: 
  - No separate backend server needed
  - Deploy as serverless functions
  - Same codebase for frontend and backend
  - Built-in request handling
- **Used for**: All backend endpoints (`/app/api/...`)

---

## Authentication & Security

### **jsonwebtoken (JWT)**
- **Purpose**: Create and verify JSON Web Tokens
- **Why**: 
  - Stateless authentication
  - No session storage needed
  - Scalable across multiple servers
  - Industry standard
- **Used for**: User authentication tokens

### **jose**
- **Purpose**: Modern JWT library with better Next.js Edge support
- **Why**: 
  - Works in Edge Runtime
  - Better security defaults
  - TypeScript-first
- **Used for**: Alternative JWT handling

### **bcryptjs**
- **Purpose**: Password hashing
- **Why**: 
  - Industry standard for password security
  - Salting built-in
  - Adjustable complexity
  - Protect against rainbow table attacks
- **Used for**: Hashing admin and user passwords

### **next-rate-limit**
- **Purpose**: API rate limiting
- **Why**: 
  - Prevent brute force attacks
  - Protect against DDoS
  - API abuse prevention
- **Used for**: Limiting login attempts and API calls

### **Zod**
- **Purpose**: Schema validation library
- **Why**: 
  - TypeScript-first validation
  - Runtime type checking
  - Clear error messages
  - Works with React Hook Form
- **Used for**: Input validation on forms and API endpoints

---

## State Management

### **React Context API**
- **Purpose**: Global state management
- **Why**: 
  - Built into React (no extra dependency)
  - Simple for small to medium apps
  - Avoid prop drilling
- **Used for**: 
  - `SimpleCartContext` - Shopping cart state
  - `AuthProvider` - User authentication state
  - `AnalyticsProvider` - Analytics tracking

### **localStorage** (browser API)
- **Purpose**: Persistent client-side storage
- **Why**: 
  - Persist cart across page refreshes
  - No database needed for cart
  - Fast and simple
- **Used for**: Shopping cart persistence (fallback from Medusa)

---

## Forms & Validation

### **React Hook Form**
- **Purpose**: Form state management and validation
- **Why**: 
  - Performance (minimal re-renders)
  - Easy validation integration
  - Great developer experience
  - Less boilerplate
- **Used for**: All forms (login, product creation, checkout, etc.)

### **@hookform/resolvers**
- **Purpose**: Integrates validation libraries with React Hook Form
- **Why**: Connects Zod schemas to React Hook Form
- **Used for**: Form validation resolver

### **input-otp**
- **Purpose**: One-Time Password input component
- **Why**: 
  - Better UX for OTP entry
  - Accessible
  - Auto-focus between inputs
- **Used for**: Two-factor authentication (if implemented)

### **react-day-picker**
- **Purpose**: Date picker component
- **Why**: 
  - Accessible date selection
  - Customizable
  - Works with React Hook Form
- **Used for**: Date inputs in admin panel

---

## Testing

### **Jest**
- **Purpose**: JavaScript testing framework
- **Why**: 
  - Fast and parallel test execution
  - Snapshot testing
  - Great mocking capabilities
  - Industry standard
- **Used for**: Unit and integration tests

### **@testing-library/react**
- **Purpose**: React component testing utilities
- **Why**: 
  - Test components like users interact with them
  - Encourages accessible code
  - Works great with Jest
- **Used for**: Testing React components

### **@testing-library/jest-dom**
- **Purpose**: Custom Jest matchers for DOM elements
- **Why**: More readable assertions (`toBeVisible`, `toHaveTextContent`)
- **Used for**: Better test assertions

### **Playwright**
- **Purpose**: End-to-end testing framework
- **Why**: 
  - Tests across all browsers (Chrome, Firefox, Safari)
  - Fast and reliable
  - Great debugging tools
  - Auto-wait for elements
- **Used for**: E2E testing of user flows

---

## DevOps & Deployment

### **cross-env**
- **Purpose**: Set environment variables cross-platform
- **Why**: 
  - Works on Windows, Mac, Linux
  - Solves `NODE_OPTIONS` syntax issues
  - Essential for cross-platform development
- **Used for**: Setting `NODE_OPTIONS` in package.json scripts

### **PM2** (production)
- **Purpose**: Production process manager
- **Why**: 
  - Keep app running 24/7
  - Auto-restart on crashes
  - Cluster mode for performance
  - Monitoring and logging
- **Used for**: Running app in production (Linux/Mac)

### **Supervisor** (production)
- **Purpose**: Alternative process manager (used in Emergent environment)
- **Why**: 
  - System-level process control
  - Auto-start on boot
  - Log rotation
- **Used for**: Running app in production (Emergent/Docker)

### **GitHub Actions**
- **Purpose**: CI/CD automation
- **Why**: 
  - Free for public repos
  - Integrated with GitHub
  - Runs tests on every commit
  - Automate deployments
- **Used for**: Continuous integration and deployment pipeline

---

## Monitoring & Analytics

### **Sentry** (`@sentry/nextjs`)
- **Purpose**: Error tracking and monitoring
- **Why**: 
  - Real-time error alerts
  - Stack traces with source maps
  - Performance monitoring
  - User feedback collection
  - See errors before users report them
- **Used for**: Production error tracking and debugging

### **Google Analytics 4** (`react-ga4`)
- **Purpose**: Web analytics
- **Why**: 
  - Track user behavior
  - Understand traffic sources
  - Measure conversion rates
  - Free and industry standard
- **Used for**: Website traffic analytics

### **Mixpanel** (`mixpanel-browser`)
- **Purpose**: Product analytics
- **Why**: 
  - Track specific user actions
  - User funnel analysis
  - Cohort analysis
  - A/B testing support
  - More detailed than GA4
- **Used for**: Product usage analytics and user behavior tracking

---

## Payment & Shipping

### **Stripe** (ready for integration)
- **Purpose**: Payment processing
- **Why**: 
  - Industry leader in online payments
  - Developer-friendly API
  - Secure PCI compliance
  - Supports cards, wallets, bank transfers
  - Great documentation
- **Status**: Environment variables configured, ready to integrate

### **Econt** (ready for integration)
- **Purpose**: Shipping provider (Bulgarian logistics company)
- **Why**: 
  - Leading courier in Bulgaria
  - API for label generation
  - Tracking integration
  - Local market leader
- **Status**: Environment variables configured, ready to integrate

---

## Development Tools

### **Yarn**
- **Purpose**: Package manager
- **Why**: 
  - Faster than npm
  - Deterministic installs (yarn.lock)
  - Better monorepo support
  - Offline cache
- **Used for**: Installing and managing dependencies

### **ESLint**
- **Purpose**: JavaScript linter
- **Why**: 
  - Catch bugs before runtime
  - Enforce code style
  - Best practices enforcement
  - Next.js optimized rules
- **Used for**: Code quality checks

### **Autoprefixer**
- **Purpose**: Add vendor prefixes to CSS
- **Why**: 
  - Cross-browser compatibility
  - No manual prefixing needed
  - Works with Tailwind
- **Used for**: CSS post-processing

### **PostCSS**
- **Purpose**: CSS transformation tool
- **Why**: 
  - Required by Tailwind
  - Plugin ecosystem
  - Modern CSS features
- **Used for**: CSS processing pipeline

---

## Utilities

### **Axios**
- **Purpose**: HTTP client
- **Why**: 
  - Better than fetch API
  - Request/response interceptors
  - Automatic JSON transformation
  - Better error handling
- **Used for**: API calls (if needed on frontend)

### **date-fns**
- **Purpose**: Date manipulation library
- **Why**: 
  - Lightweight (vs Moment.js)
  - Tree-shakeable
  - Modern API
  - Immutable
- **Used for**: Date formatting and manipulation

### **clsx** & **cmdk**
- **Purpose**: 
  - `clsx` - Conditional className utility
  - `cmdk` - Command palette component
- **Why**: 
  - `clsx` - Cleaner conditional classes
  - `cmdk` - Keyboard-first navigation
- **Used for**: Utility functions and command menu

### **uuid**
- **Purpose**: Generate unique IDs
- **Why**: 
  - Better than MongoDB ObjectIDs for JSON serialization
  - Standards-compliant UUIDs
  - No timestamp leakage
- **Used for**: Generating unique IDs for users, products, orders

### **Sharp**
- **Purpose**: Image processing
- **Why**: 
  - Fast image optimization
  - Resize, compress, convert images
  - Required by Next.js Image optimization
- **Used for**: Automatic image optimization

### **multer**
- **Purpose**: File upload middleware
- **Why**: 
  - Easy multipart/form-data handling
  - File filtering and validation
  - Disk/memory storage options
- **Used for**: Handling image uploads in admin panel

### **React Quill**
- **Purpose**: Rich text editor
- **Why**: 
  - WYSIWYG editing
  - Easy to integrate
  - Customizable toolbar
- **Used for**: Product descriptions and blog content

### **Recharts**
- **Purpose**: Charting library
- **Why**: 
  - React-native charts
  - Responsive and animated
  - Easy to customize
- **Used for**: Dashboard charts and analytics visualization

### **Sonner**
- **Purpose**: Toast notification library
- **Why**: 
  - Beautiful out-of-the-box
  - Stacking notifications
  - Promise-based API
  - Accessible
- **Used for**: User notifications (success, error, info messages)

### **Embla Carousel**
- **Purpose**: Carousel/slider component
- **Why**: 
  - Lightweight
  - Touch/swipe support
  - Accessible
  - Framework agnostic
- **Used for**: Image galleries and product carousels

### **Vaul**
- **Purpose**: Drawer component for mobile
- **Why**: 
  - Native drawer feel
  - Drag to close
  - Accessible
- **Used for**: Mobile navigation and modals

---

## Content Management

### **Sanity** (`sanity`, `next-sanity`, `@sanity/image-url`)
- **Purpose**: Headless CMS
- **Why**: 
  - Real-time collaboration
  - Customizable studio
  - Great image handling
  - GraphQL and REST APIs
- **Status**: Installed but not actively used (MongoDB used instead)

### **@portabletext/react**
- **Purpose**: Render Sanity's Portable Text
- **Why**: Converts rich text to React components
- **Status**: Installed for potential Sanity integration

---

## Medusa Integration (Currently Inactive)

### **@medusajs/js-sdk**
- **Purpose**: E-commerce backend framework
- **Why**: 
  - Complete e-commerce solution
  - Products, cart, checkout
  - Multi-region support
  - Open source
- **Status**: Installed but **not active** - using custom cart implementation instead

---

## Summary by Use Case

### **For Developers Starting Out:**
**Must understand**: Next.js, React, Tailwind CSS, MongoDB
**Nice to know**: shadcn/ui, React Hook Form, Jest

### **For DevOps/Deployment:**
**Must understand**: cross-env, PM2/Supervisor, environment variables
**Nice to know**: GitHub Actions, Sentry

### **For Feature Development:**
**Authentication**: JWT, bcryptjs, next-rate-limit
**Forms**: React Hook Form, Zod
**UI**: shadcn/ui, Radix UI, Lucide icons
**Data**: MongoDB, Next.js API routes

### **For Production:**
**Monitoring**: Sentry, Google Analytics, Mixpanel
**Performance**: Sharp, Next.js optimization
**Security**: Zod validation, rate limiting, bcrypt

---

## Why These Choices?

### **Performance First**
- Next.js for SSR and optimization
- Sharp for image processing
- Tailwind for small CSS bundles
- MongoDB for fast reads

### **Developer Experience**
- TypeScript support for safety
- React Hook Form for easy forms
- shadcn/ui for copy-paste components
- Jest and Playwright for testing

### **Production Ready**
- Sentry for error tracking
- PM2 for process management
- Rate limiting for security
- Analytics for insights

### **Scalability**
- MongoDB for flexible schema
- JWT for stateless auth
- Next.js serverless functions
- Component-based architecture

---

## Next Steps

To learn more about any tool:

1. **Official docs**: Visit each tool's documentation
2. **Hands-on**: Try modifying existing code
3. **Examples**: Check `/app` directory for real usage
4. **Testing**: Run tests to see how they work

**Key files to explore**:
- `/app/package.json` - See all dependencies
- `/app/app/api/` - Backend API examples
- `/app/components/` - UI component examples
- `/app/lib/` - Utility functions

---

**Questions?** Check individual tool documentation or ask in the project chat!
