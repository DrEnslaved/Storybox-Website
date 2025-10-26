# Unused and Underutilized Dependencies

This document identifies packages that are installed but not actively used in the Storybox e-commerce platform. These packages were either part of the initial setup, planned for future features, or replaced by alternative solutions.

---

## 🔴 Completely Unused Dependencies

These packages are installed but **not imported or used anywhere** in the codebase:

### 1. **axios** (1.10.0)
- **Type**: HTTP client library
- **Status**: ❌ Not used
- **Why Installed**: Likely planned for API calls
- **Current Alternative**: Native `fetch` API
- **Recommendation**: 
  - ✅ **Keep** if planning external API integrations
  - ❌ **Remove** to reduce bundle size if only using fetch

### 2. **@tanstack/react-table** (8.21.3)
- **Type**: Powerful table/data grid library
- **Status**: ❌ Not used
- **Why Installed**: Planned for admin data tables
- **Current Alternative**: Custom table components
- **Recommendation**:
  - ✅ **Keep** if admin needs advanced sorting/filtering/pagination
  - ❌ **Remove** if current tables are sufficient (saves ~100KB)

### 3. **next-seo** (7.0.1)
- **Type**: SEO helper for Next.js
- **Status**: ❌ Not used
- **Why Installed**: Planned for SEO optimization
- **Current Alternative**: Manual meta tags in layout/pages
- **Recommendation**:
  - ✅ **Keep and implement** for better SEO management
  - Provides structured approach to meta tags, Open Graph, Twitter cards

### 4. **cmdk** (1.1.1)
- **Type**: Command palette component (Cmd+K menu)
- **Status**: ❌ Not used
- **Why Installed**: Part of shadcn/ui components suite
- **Potential Use**: Admin panel quick navigation
- **Recommendation**:
  - ✅ **Keep** - Great UX feature for power users
  - Could add Cmd+K menu for quick admin navigation

### 5. **vaul** (1.1.2)
- **Type**: Mobile drawer component
- **Status**: ❌ Not used
- **Why Installed**: Part of shadcn/ui suite
- **Potential Use**: Mobile navigation menus
- **Recommendation**:
  - ⚠️ **Review** - Check if drawer component from Radix UI is used instead
  - ❌ **Remove** if using alternative drawer

### 6. **embla-carousel-react** (8.6.0)
- **Type**: Carousel/slider component
- **Status**: ❌ Not used
- **Why Installed**: Planned for product image galleries
- **Potential Use**: Product detail page image carousel
- **Recommendation**:
  - ✅ **Keep and implement** for better product image UX
  - ❌ **Remove** if not planning carousels

### 7. **react-resizable-panels** (3.0.3)
- **Type**: Resizable panel layouts
- **Status**: ❌ Not used
- **Why Installed**: Part of shadcn/ui suite
- **Potential Use**: Admin dashboard layouts
- **Recommendation**:
  - ❌ **Remove** - Not typical for e-commerce sites
  - Unless planning advanced admin layouts

### 8. **input-otp** (1.4.2)
- **Type**: One-Time Password input component
- **Status**: ❌ Not used
- **Why Installed**: Planned for 2FA
- **Potential Use**: Two-factor authentication
- **Recommendation**:
  - ✅ **Keep** if planning to implement 2FA
  - ❌ **Remove** if not a priority (saves ~20KB)

### 9. **@next/third-parties** (16.0.0)
- **Type**: Next.js third-party script optimization
- **Status**: ❌ Not used
- **Why Installed**: For optimized loading of analytics scripts
- **Current Alternative**: Manual script loading
- **Recommendation**:
  - ✅ **Keep and implement** for better performance
  - Should be used for Google Analytics, Mixpanel scripts

---

## 🟡 Partially Used / Inactive Dependencies

These packages are installed but their main functionality is **not active or fully utilized**:

### 1. **@medusajs/js-sdk** (2.11.1)
- **Status**: 🟡 Installed but inactive
- **Why**: 
  - Original plan was to use Medusa as e-commerce backend
  - Medusa backend is disabled (PostgreSQL and Redis not running)
  - Using MongoDB with custom cart implementation instead
- **Current Impact**: 
  - Old code references exist in `/app/api/[[...path]]/route-old.js`
  - Not affecting active application
- **Recommendation**:
  - ⚠️ **Decision needed**: 
    - Option A: Remove if MongoDB approach is permanent
    - Option B: Keep if planning to migrate to Medusa later
  - Saves ~500KB if removed

### 2. **sanity** (3.68.0) + **next-sanity** (9.0.0) + **@sanity/image-url** (1.0.2) + **@portabletext/react** (3.0.11)
- **Status**: 🟡 Installed but not actively used
- **Why**: 
  - Original plan was to use Sanity as headless CMS
  - Currently using MongoDB for all content
  - Some references in admin dashboard UI (links to Sanity)
- **Current Impact**:
  - Large bundle size (~2MB combined)
  - Not affecting functionality
- **Recommendation**:
  - ⚠️ **Decision needed**:
    - Option A: **Remove** if MongoDB is permanent solution (saves ~2MB)
    - Option B: **Keep and implement** if wanting professional CMS for blogs/projects
  - Benefits of Sanity: Real-time collaboration, content preview, media library
  - Benefits of current MongoDB: Simpler stack, one database

### 3. **react-quill** (2.0.0)
- **Status**: 🟡 Unknown usage
- **Why**: Rich text editor for product descriptions
- **Need to verify**: Search for usage in admin product forms
- **Recommendation**: Check if actively used for product descriptions

---

## 🟢 Correctly Installed But May Be Underutilized

These packages are installed and may be used, but could offer more value:

### 1. **next-themes** (0.4.6)
- **Status**: ✅ Installed for dark mode
- **Current Use**: May be basic implementation
- **Recommendation**: Ensure full dark mode support across all pages

### 2. **sharp** (0.34.4)
- **Status**: ✅ Used by Next.js for image optimization
- **Current Use**: Automatic image optimization
- **Recommendation**: Ensure all images use Next.js Image component

### 3. **multer** (2.0.2)
- **Status**: ✅ Installed for file uploads
- **Current Use**: Product image upload API endpoint exists
- **Recommendation**: Ensure fully functional and documented

---

## 📊 Bundle Size Impact

Removing unused dependencies could save:

| Package(s) | Size Savings | Priority |
|------------|--------------|----------|
| Sanity ecosystem | ~2.0 MB | High |
| Medusa JS SDK | ~500 KB | High |
| @tanstack/react-table | ~100 KB | Medium |
| embla-carousel-react | ~50 KB | Low |
| Other unused UI libs | ~100 KB | Low |
| **Total Potential** | **~2.75 MB** | |

---

## 🎯 Recommendations

### Immediate Actions

1. **Decision Required**: Choose between Medusa or MongoDB
   - If MongoDB: Remove Medusa and related code
   - If Medusa: Implement properly with PostgreSQL/Redis

2. **Decision Required**: Choose between Sanity or MongoDB
   - If MongoDB: Remove Sanity packages (biggest size saving)
   - If Sanity: Implement for blogs and project management

### Short-term (1-2 weeks)

3. **Implement or Remove**:
   - ✅ **Implement** `next-seo` for better SEO
   - ✅ **Implement** `@next/third-parties` for analytics optimization
   - ✅ **Implement** `embla-carousel` for product galleries
   - ❌ **Remove** `react-resizable-panels` (likely not needed)
   - ❌ **Remove** `vaul` if not using mobile drawer

### Long-term (Future)

4. **Feature Implementation**:
   - `input-otp` - If implementing 2FA
   - `cmdk` - For admin command palette
   - `@tanstack/react-table` - For advanced admin tables

---

## 🛠️ How to Remove Unused Dependencies

```bash
# Example: Remove Sanity packages if decided
yarn remove sanity next-sanity @sanity/image-url @portabletext/react

# Remove Medusa if decided
yarn remove @medusajs/js-sdk

# Remove unused UI components
yarn remove vaul react-resizable-panels input-otp
```

**⚠️ Warning**: Always test thoroughly after removing packages!

---

## 📝 Audit Script

Create a script to check for unused imports:

```bash
# Using depcheck (install globally)
npm install -g depcheck
cd /app
depcheck
```

This will identify:
- Unused dependencies
- Missing dependencies
- Unused devDependencies

---

## 🔄 Regular Maintenance

**Recommended**: Audit dependencies quarterly

1. Run `depcheck` to identify unused packages
2. Check bundle size with `yarn build`
3. Review and decide: keep, implement, or remove
4. Update this document

---

## Summary

**Definitely Unused** (Safe to remove):
- axios (if only using fetch)
- react-resizable-panels
- vaul (if drawer not used)

**Major Decisions Needed**:
- Medusa JS SDK (~500KB) - Keep or remove?
- Sanity ecosystem (~2MB) - Keep or remove?

**Should Implement**:
- next-seo (SEO improvement)
- @next/third-parties (Performance)
- embla-carousel (Product UX)

**Keep for Future**:
- input-otp (2FA planned?)
- cmdk (Admin UX)
- @tanstack/react-table (Data-heavy admin?)

---

**Last Updated**: June 2025
**Next Review**: September 2025
