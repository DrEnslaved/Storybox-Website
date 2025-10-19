# STORVBOX - Bulgarian Embroidery Business Website

A modern, professional business website for STORVBOX, a Bulgarian company specializing in machine embroidery, sublimation printing, transfer printing, and laser cutting services.

## 🌟 Features

### Phase 1 (Current - MVP Complete)
- ✅ Beautiful, responsive showcase website
- ✅ Service pages with detailed descriptions
- ✅ Portfolio/Projects gallery
- ✅ Blog structure
- ✅ About page with company history
- ✅ Contact page with quote request form
- ✅ MongoDB integration for storing inquiries
- ✅ Sanity CMS integration ready
- ✅ B2B features (bulk orders up to 5000 units)

### Phase 2 (Planned)
- 🔄 Medusa commerce backend integration
- 🔄 Product catalog with CMS
- 🔄 Customer accounts with custom pricing
- 🔄 Advanced B2B features
- 🔄 Email notifications
- 🔄 Production deployment setup

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** JavaScript (TypeScript-ready)
- **Styling:** Tailwind CSS + shadcn/ui components
- **UI Components:** Radix UI primitives
- **Icons:** Lucide React

### Backend
- **API:** Next.js API Routes
- **Database:** MongoDB
- **CMS:** Sanity (configured, ready to use)

### Infrastructure (Planned)
- **Frontend Hosting:** Vercel
- **Backend/DB:** Hetzner / DigitalOcean
- **CDN:** Cloudflare
- **Commerce:** Medusa (headless)

## 📁 Project Structure

```
/app
├── app/
│   ├── page.js                 # Home page
│   ├── layout.js               # Root layout with navigation
│   ├── globals.css             # Global styles
│   ├── services/
│   │   └── page.js             # Services listing
│   ├── projects/
│   │   └── page.js             # Projects portfolio
│   ├── blog/
│   │   └── page.js             # Blog listing
│   ├── about/
│   │   └── page.js             # About page
│   ├── contact/
│   │   └── page.js             # Contact & quote form
│   └── api/
│       └── [[...path]]/
│           └── route.js        # API endpoints
├── lib/
│   ├── sanity.ts               # Sanity client config
│   └── queries.ts              # GROQ queries
├── components/                 # Reusable components
├── .env                        # MongoDB config
├── .env.local                  # Sanity config
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind configuration
└── package.json                # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB running locally or connection string
- Sanity account (for CMS)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DrEnslaved/Storybox-Website.git
   cd Storybox-Website
   ```

2. **Install dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Set up environment variables**
   
   Create `.env` file:
   ```env
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=storvbox_db
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   CORS_ORIGINS=*
   ```

   Create `.env.local` file:
   ```env
   NEXT_PUBLIC_SANITY_PROJECT_ID=yhhlq588
   NEXT_PUBLIC_SANITY_DATASET=sbxdataset
   NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

5. **Run the development server**
   ```bash
   yarn dev
   # or
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📝 API Endpoints

### Quote Request
**POST** `/api/quote-request`

Submit a quote request for services.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+359898973000",
  "company": "Company Name",
  "serviceType": "Машинна бродерия",
  "quantity": 100,
  "description": "Project description",
  "timeline": "2 weeks"
}
```

**Response:**
```json
{
  "message": "Заявката беше изпратена успешно!",
  "requestId": "uuid"
}
```

### Contact Form
**POST** `/api/contact`

Send a general contact message.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+359898973000",
  "subject": "Question",
  "message": "Your message here"
}
```

## 🎨 Design System

### Colors
- **Primary:** Green-700 (#15803d)
- **Secondary:** Green-800 (#166534)
- **Background:** White, Gray-50
- **Text:** Gray-900, Gray-700, Gray-600

### Typography
- System fonts with fallbacks
- Bulgarian language support

### Components
- Buttons: Primary (green), Secondary (outline)
- Cards: Shadow-lg with hover effects
- Forms: Full validation and error handling
- Navigation: Sticky header with smooth scrolling

## 🌐 Sanity CMS Setup

The project is configured to work with Sanity CMS for content management.

### Sanity Project Details
- **Project ID:** yhhlq588
- **Dataset:** sbxdataset

### Content Types
1. **Services** - Service descriptions with localized content (BG/EN)
2. **Projects** - Portfolio items with images and details
3. **Blog Posts** - News and articles
4. **Company Info** - Contact details, logo, social media

### To Start Using Sanity

1. **Install Sanity CLI**
   ```bash
   npm install -g @sanity/cli
   ```

2. **Create schemas** (already prepared in `/schemas` folder)

3. **Access Sanity Studio**
   ```
   https://storvbox.sanity.studio
   ```

## 📦 Dependencies

### Main Dependencies
- next: 14.2.3
- react: ^18
- mongodb: ^6.6.0
- next-sanity: ^9.0.0
- @sanity/image-url: ^1.0.2
- tailwindcss: ^3.4.1
- lucide-react: ^0.516.0

### UI Components
- @radix-ui/* (various components)
- shadcn/ui components

## 🔧 Configuration Files

### next.config.js
Configured for:
- External images (Unsplash, Pexels, Sanity CDN)
- Optimized builds

### tailwind.config.js
- Custom color scheme
- Component-ready configuration
- Responsive breakpoints

## 📊 Database Collections

### quote_requests
```javascript
{
  id: String (UUID),
  name: String,
  email: String,
  phone: String,
  company: String,
  serviceType: String,
  quantity: Number,
  description: String,
  timeline: String,
  status: String (pending/contacted/completed),
  createdAt: ISO Date,
  updatedAt: ISO Date
}
```

### contact_messages
```javascript
{
  id: String (UUID),
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  status: String (unread/read/replied),
  createdAt: ISO Date
}
```

## 🌍 Deployment

### Vercel (Frontend)
```bash
vercel --prod
```

### Environment Variables (Production)
Set these in your deployment platform:
- `MONGO_URL`
- `DB_NAME`
- `NEXT_PUBLIC_BASE_URL`
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`

## 🤝 Contributing

This is a private business project. For questions or support, contact the STORVBOX team.

## 📞 Contact

- **Website:** https://headless-bizsite.preview.emergentagent.com (preview)
- **Email:** office@storvbox.bg
- **Phone:** +359 898 973 000
- **Address:** гр. Стралджа 27, ж.к. Горубляне, 1138 София

## 📄 License

© 2025 STORVBOX. All rights reserved.

---

**Built with ❤️ for STORVBOX - Professional Embroidery Services in Bulgaria**
