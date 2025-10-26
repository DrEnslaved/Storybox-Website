# Sanity CMS Setup Guide

This guide will help you complete the Sanity CMS integration for your Storybox e-commerce platform.

---

## ✅ What's Already Done

I've created the following for you:

### 📁 Sanity Configuration
- ✅ `/sanity/sanity.config.js` - Sanity Studio configuration
- ✅ `/sanity/env.js` - Environment validation
- ✅ `/lib/sanity.js` - Sanity client and helper functions

### 📋 Content Schemas (6 types)
- ✅ `/sanity/schemas/post.js` - Blog posts
- ✅ `/sanity/schemas/author.js` - Blog authors
- ✅ `/sanity/schemas/category.js` - Blog categories
- ✅ `/sanity/schemas/project.js` - Portfolio projects
- ✅ `/sanity/schemas/service.js` - Services
- ✅ `/sanity/schemas/blockContent.js` - Rich text content

### 🎨 Frontend Components
- ✅ `/app/blog/page.js` - Blog listing page
- ✅ `/app/blog/[slug]/page.js` - Individual blog post page
- ✅ `/components/BlogCard.js` - Blog post card component
- ✅ `/components/PortableTextRenderer.js` - Rich text renderer

---

## 🚀 Step-by-Step Setup

### Step 1: Create Sanity Account & Project

1. **Go to Sanity.io**
   - Visit: https://www.sanity.io/
   - Click "Get Started" or "Sign Up"

2. **Sign up with Google**
   - Use your Google account for quick signup
   - Or use email/password

3. **Create a New Project**
   - Click "Create Project"
   - **Project Name**: `Storybox CMS`
   - **Dataset**: `production` (default)
   - Note down your **Project ID** (e.g., `abc123xyz`)

### Step 2: Add Environment Variables

Add these to your `/app/.env` file:

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

**Replace `your-project-id-here`** with your actual Project ID from Step 1.

### Step 3: Install Sanity CLI (Optional)

If you want to use Sanity Studio locally:

```bash
cd /app
npm install -g @sanity/cli

# Login to Sanity
sanity login

# Initialize (skip if files already exist)
# sanity init
```

### Step 4: Deploy Sanity Studio

You have two options:

#### **Option A: Deploy to Sanity Cloud** (Recommended)

```bash
cd /app/sanity
npx sanity deploy

# Follow prompts:
# - Studio hostname: storybox (or your choice)
# - Your studio will be at: https://storybox.sanity.studio
```

#### **Option B: Run Locally**

```bash
cd /app
npx sanity dev --project-id YOUR_PROJECT_ID --dataset production --path /sanity

# Access at: http://localhost:3333
```

### Step 5: Configure CORS

1. Go to https://www.sanity.io/manage
2. Select your project
3. Go to **Settings** → **API**
4. Under **CORS Origins**, add:
   - `http://localhost:3000` (for development)
   - Your production domain (e.g., `https://storybox.bg`)
5. Click **Save**

### Step 6: Restart Your Next.js App

```bash
# Stop current server (Ctrl+C)
# Then restart
yarn dev
```

### Step 7: Access Sanity Studio

**If deployed to Sanity Cloud:**
- Go to: `https://your-studio-name.sanity.studio`

**If running locally:**
- Go to: `http://localhost:3333`

---

## 📝 Creating Your First Blog Post

### 1. Create an Author

1. In Sanity Studio, click **Author** in the sidebar
2. Click **Create new document**
3. Fill in:
   - **Name**: Your name
   - **Slug**: Click "Generate" (auto-generates from name)
   - **Image**: Upload your photo
   - **Bio**: Write a short bio
4. Click **Publish**

### 2. Create a Category

1. Click **Category** in the sidebar
2. Click **Create new document**
3. Fill in:
   - **Title**: "Бродерия" (Embroidery)
   - **Slug**: Click "Generate"
   - **Description**: "Статии за бродерия"
   - **Color**: `#10b981` (green)
4. Click **Publish**

### 3. Create a Blog Post

1. Click **Blog Post** in the sidebar
2. Click **Create new document**
3. Fill in:
   - **Title**: "Добре дошли в нашия блог!"
   - **Slug**: Click "Generate"
   - **Author**: Select the author you created
   - **Main Image**: Upload an image
   - **Categories**: Select category
   - **Published at**: Select current date
   - **Excerpt**: "Кратко описание на статията..."
   - **Body**: Write your content (use formatting toolbar)
   - **Featured Post**: Toggle on to feature it
4. Click **Publish**

---

## 🎉 Testing the Blog

1. **Go to your blog page**: http://localhost:3000/blog
2. You should see your published post
3. Click on the post to view the full article
4. Test categories, author info, etc.

---

## 📚 Content Types Reference

### Blog Post Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Title | String | Yes | Post title |
| Slug | Slug | Yes | URL-friendly version |
| Author | Reference | Yes | Link to author |
| Main Image | Image | No | Featured image |
| Categories | Array | No | Multiple categories |
| Published At | DateTime | Yes | Publication date |
| Excerpt | Text | No | Short preview (max 200 chars) |
| Body | Rich Text | No | Full article content |
| Featured | Boolean | No | Show prominently |
| SEO | Object | No | Meta title, description, keywords, OG image |

### Author Fields

| Field | Type | Description |
|-------|------|-------------|
| Name | String | Author's full name |
| Slug | Slug | URL slug |
| Image | Image | Profile photo |
| Bio | Rich Text | Author biography |

### Category Fields

| Field | Type | Description |
|-------|------|-------------|
| Title | String | Category name |
| Slug | Slug | URL slug |
| Description | Text | Category description |
| Color | String | Hex color for badges |

### Project Fields

| Field | Type | Description |
|-------|------|-------------|
| Title | String | Project title |
| Client | String | Client name |
| Main Image | Image | Hero image |
| Gallery | Array | Multiple images |
| Services | Array | Services provided |
| Completed At | Date | Completion date |
| Description | Rich Text | Full description |
| Challenge | Text | The challenge faced |
| Solution | Text | How you solved it |
| Results | Text | Outcomes achieved |
| Testimonial | Object | Client quote, name, position |

### Service Fields

| Field | Type | Description |
|-------|------|-------------|
| Title | String | Service name |
| Icon | String | Lucide icon name |
| Image | Image | Service image |
| Short Description | Text | Brief description |
| Full Description | Rich Text | Detailed content |
| Features | Array | Key features list |
| Pricing | Object | Starting price and note |
| Display Order | Number | Sort order |

---

## 🎨 Customizing Content

### Adding Custom Fields

Edit schema files in `/sanity/schemas/`:

```javascript
// Example: Add "read time" to blog posts
// In /sanity/schemas/post.js

export default {
  name: 'post',
  // ... existing fields
  fields: [
    // ... existing fields
    {
      name: 'readTime',
      title: 'Read Time',
      type: 'number',
      description: 'Estimated read time in minutes',
    },
  ],
}
```

Then update your blog components to display it.

### Changing Colors/Styles

Edit components in `/app/components/`:

- `BlogCard.js` - Blog post cards
- `PortableTextRenderer.js` - Article content styling

---

## 🔧 Advanced Configuration

### Enable Preview Mode

For live preview of unpublished content:

1. Create `/app/api/preview/route.js`
2. Add preview mode logic
3. Install `next-sanity` preview components

### Add More Content Types

1. Create new schema file in `/sanity/schemas/`
2. Add to `/sanity/schemas/index.js`
3. Create corresponding Next.js pages

### Multi-language Support

```javascript
// In schema files
{
  name: 'title',
  title: 'Title',
  type: 'object',
  fields: [
    { name: 'bg', type: 'string', title: 'Bulgarian' },
    { name: 'en', type: 'string', title: 'English' },
  ],
}
```

---

## 🐛 Troubleshooting

### "Missing environment variable" error

**Solution**: Make sure you added `NEXT_PUBLIC_SANITY_PROJECT_ID` to `.env` and restarted the server.

### CORS error when fetching content

**Solution**: 
1. Go to https://www.sanity.io/manage
2. Add your domain to CORS origins
3. Include `http://localhost:3000` for development

### Images not loading

**Solution**: 
1. Check that images are uploaded in Sanity Studio
2. Verify `urlFor()` function is working
3. Check browser console for errors

### Blog page shows "no posts"

**Solution**:
1. Verify posts are **published** (not draft)
2. Check `publishedAt` date is not in the future
3. Check Sanity client configuration

### Studio won't load

**Solution**:
1. Verify Project ID is correct
2. Run `sanity deploy` again
3. Check console for errors
4. Try clearing browser cache

---

## 📖 Useful Resources

- **Sanity Documentation**: https://www.sanity.io/docs
- **Sanity Schema Types**: https://www.sanity.io/docs/schema-types
- **Portable Text**: https://www.sanity.io/docs/presenting-block-text
- **Image URLs**: https://www.sanity.io/docs/image-url
- **GROQ Query Language**: https://www.sanity.io/docs/groq

---

## 🎯 Next Steps

After setting up the blog:

1. ✅ **Create Portfolio Section**
   - Use the `project` schema
   - Create `/app/portfolio/page.js`
   - Display your best work

2. ✅ **Create Services Page**
   - Use the `service` schema
   - Create `/app/services/page.js`
   - Showcase your offerings

3. ✅ **Add Navigation Links**
   - Update main navigation
   - Add blog link to header
   - Add footer links

4. ✅ **SEO Optimization**
   - Fill in SEO fields for all posts
   - Generate sitemap
   - Add structured data

---

## 💡 Tips for Content Creation

### Writing Great Blog Posts

1. **Catchy Titles**: Use questions or numbers ("5 Tips for...")
2. **Strong Intros**: Hook readers in first paragraph
3. **Visual Content**: Add images every 2-3 paragraphs
4. **Clear Structure**: Use headings (H2, H3) to organize
5. **Call to Action**: End with next steps or questions

### SEO Best Practices

1. **Meta Title**: 50-60 characters, include main keyword
2. **Meta Description**: 150-160 characters, compelling summary
3. **Keywords**: 3-5 relevant keywords
4. **Images**: Always add alt text
5. **Internal Links**: Link to other posts/products

### Content Calendar

Plan posts in advance:
- **Monday**: Industry news
- **Wednesday**: How-to guides
- **Friday**: Case studies/projects

---

## ✨ You're All Set!

Your Sanity CMS is now integrated! Start creating amazing content for your Storybox blog.

Need help? Check the troubleshooting section or the official Sanity docs.

**Happy blogging! 📝**
