# STORVBOX Product Management Guide

## Adding Products Through Sanity CMS

This guide explains how to add and manage products in your STORVBOX e-commerce catalog using Sanity CMS.

## Prerequisites

- Access to Sanity Studio at: `https://storvbox.sanity.studio` or locally at `/studio`
- Admin credentials for Sanity project (ID: yhhlq588, Dataset: sbxdataset)

## Product Schema Overview

### Required Fields:

1. **Product Name** (Text)
   - The display name of your product
   - Example: "Брандирани тениски с бродерия"

2. **Slug** (Auto-generated URL)
   - Click "Generate" to create from product name
   - Example: `brandіrani-teniski-s-broderia`

3. **Description** (Text Area)
   - Detailed product description
   - Include materials, customization options, delivery time

4. **Category** (Dropdown)
   - Select from:
     - **Машинна бродерия** (embroidery)
     - **Сублимация** (sublimation)
     - **Трансферен печат** (transfer)
     - **Лазерно рязане** (laser)

5. **Product Images** (Image Upload)
   - Upload at least 1 image (multiple recommended)
   - Recommended size: 1200x1200px
   - Format: JPG or PNG
   - First image becomes the main product image

6. **Price Tiers** (Price Array)
   - **IMPORTANT**: Must add at least one price tier
   - Available tiers:
     - **Standard** - Default customer pricing
     - **Premium** - Loyal customer pricing
     - **VIP** - High-volume/corporate pricing
   
   **How to Add Price Tiers:**
   1. Click "Add Item" under Price Tiers
   2. Select Tier Name (standard/premium/vip)
   3. Enter Price in BGN
   4. Add additional tiers as needed
   
   **Example:**
   ```
   Standard: 25.00 BGN
   Premium: 22.00 BGN
   VIP: 20.00 BGN
   ```

### Optional Fields:

7. **SKU** (Text)
   - Stock Keeping Unit for inventory
   - Example: "EMBR-TSHIRT-001"

8. **In Stock** (Boolean)
   - Toggle ON if product is available
   - Toggle OFF to mark as out of stock
   - Default: ON

9. **Minimum Order Quantity** (Number)
   - Default: 1
   - For B2B: Set higher minimum (e.g., 10, 50)

10. **Maximum Order Quantity** (Number)
    - Default: 5000
    - Maximum units per order

11. **Product Features** (String Array)
    - List key features/benefits
    - Click "Add Item" to add each feature
    
    **Example Features:**
    - "Висока устойчивост на изпиране"
    - "100% памучна тъкан"
    - "Персонализация с лого"
    - "Доставка за 5-7 работни дни"

12. **SEO Meta Description** (Text)
    - Search engine description (max 160 characters)
    - Include keywords: Sofia, Bulgaria, embroidery, etc.
    
    **Example:**
    ```
    Брандирани тениски с машинна бродерия в София, България. 
    Качествена персонализация за корпоративни клиенти и събития.
    ```

13. **SEO Keywords** (String Array)
    - Relevant search terms
    
    **Example Keywords:**
    - "бродирани тениски софия"
    - "корпоративни облекла българия"
    - "персонализация текстил"
    - "machine embroidery sofia"

## Step-by-Step: Adding Your First Product

### 1. Access Sanity Studio

Option A: **Local Development**
```bash
cd /app
npx sanity dev
```
Then visit: `http://localhost:3333`

Option B: **Online Studio**
Visit: `https://storvbox.sanity.studio`

### 2. Create New Product

1. Click **"Create new document"** or the **"+"** button
2. Select **"Product"** from document types
3. Fill in all required fields (marked with *)

### 3. Add Product Images

1. Under **"Product Images"**, click **"Add Item"**
2. Either:
   - Drag & drop image file
   - Click to browse and select
3. Crop/adjust image using hotspot tool
4. Add multiple images for product gallery

### 4. Configure Price Tiers

1. Under **"Price Tiers"**, click **"Add Item"**
2. Select **Tier Name**: "standard"
3. Enter **Price**: Your standard price (e.g., 25.00)
4. **Optional**: Add premium and VIP tiers with discounted prices
5. Click **"Add Item"** again for each additional tier

### 5. Set Inventory Limits

- **Min Quantity**: Set to 1 for retail, higher for B2B
- **Max Quantity**: Default 5000 (adjust if needed)
- **In Stock**: Toggle ON to make product available

### 6. Add SEO Information

1. Fill **Meta Description** with compelling copy
2. Add relevant **Keywords** for Sofia, Bulgaria market
3. Include location-based terms (София, България)

### 7. Publish Product

1. Click **"Publish"** button (top right)
2. Product is now live on your website
3. Visit `/shop` to see it in the catalog

## Sample Product Template

Here's a complete example you can follow:

```yaml
Product Name: Брандирани тениски с бродерия
Slug: brandіrani-teniski-s-broderia

Description:
Висококачествени памучни тениски с машинна бродерия на лого или текст. 
Идеални за корпоративни събития, екипни облекла и промоционални кампании. 
Минимална поръчка: 10 броя. Срок на изработка: 5-7 работни дни.

Category: Машинна бродерия (embroidery)

Images: 
- Upload main product image
- Upload detail shot of embroidery
- Upload color/style variants

Price Tiers:
- Standard: 25.00 BGN
- Premium: 22.00 BGN  
- VIP: 20.00 BGN

SKU: EMBR-TSHIRT-001
In Stock: ✓ Yes
Min Quantity: 10
Max Quantity: 5000

Features:
- Висока устойчивост на изпиране (40°C)
- 100% памучна тъкан, 180g/m²
- Персонализация с лого до 10x10 см
- Доставка за 5-7 работни дни
- Безплатна визуализация

Meta Description:
Брандирани тениски с машинна бродерия в София, България. Качествена 
персонализация за корпоративни клиенти. Минимум 10 бр. от 25 лв.

Keywords:
- бродирани тениски софия
- корпоративни тениски българия
- брандиране облекла софия
- машинна бродерия българия
- promotional t-shirts sofia
```

## Managing Products

### Edit Existing Product
1. Navigate to "Product" in Sanity Studio
2. Click on product to edit
3. Make changes
4. Click "Publish" to save

### Unpublish/Archive Product
1. Open product document
2. Click "Unpublish" to remove from website
3. Or toggle "In Stock" to OFF to mark unavailable

### Duplicate Product
1. Open existing product
2. Click three-dot menu (⋮)
3. Select "Duplicate"
4. Edit duplicated product
5. Change slug and product name
6. Publish

## Price Tier Strategy

### Recommended Pricing Structure:

**Standard Tier (default customers):**
- Base price for occasional buyers
- 1-50 units

**Premium Tier (repeat customers):**
- 10-15% discount
- 51-200 units or loyal customers
- Assigned manually by admin

**VIP Tier (corporate/bulk):**
- 20-25% discount
- 201+ units or corporate accounts
- Requires account verification

### Assigning Price Tiers to Customers

Price tiers are assigned in the user database:
1. Access MongoDB or user admin panel
2. Find customer by email
3. Update `priceTier` field:
   - `"standard"` (default)
   - `"premium"`
   - `"vip"`
4. Customer sees their tier pricing on next login

## SEO Best Practices

### Location-Based Keywords:
- Always include "София" and "България"
- Use both Cyrillic and Latin script
- Example: "embroidery sofia bulgaria бродерия софия"

### Product Titles:
- Front-load important keywords
- Include product type + service
- Example: "Брандирани риза с бродерия | Корпоративни облекла София"

### Meta Descriptions:
- 150-160 characters
- Include call-to-action
- Mention location and key benefit
- Example: "Професионална бродерия на текстил в София. Бързо изпълнение, конкурентни цени. Поръчай онлайн!"

## Troubleshooting

### Product Not Showing on Website?

**Check:**
1. Product is published (not draft)
2. "In Stock" is toggled ON
3. At least one image is uploaded
4. At least one price tier is configured
5. Category is selected
6. Slug is generated

### Images Not Loading?

**Solution:**
1. Ensure images are under 10MB
2. Use JPG or PNG format
3. Check image permissions in Sanity
4. Clear browser cache
5. Verify `cdn.sanity.io` domain in Next.js config

### Price Tier Not Displaying Correctly?

**Check:**
1. User is logged in to see tier pricing
2. User `priceTier` field matches tier name exactly
3. Tier name is: "standard", "premium", or "vip" (lowercase)
4. Price is a number, not string

## Support

For technical issues:
- Check Sanity documentation: https://www.sanity.io/docs
- Project ID: yhhlq588
- Dataset: sbxdataset

## Quick Reference

### Minimum Required Fields:
- ✅ Product Name
- ✅ Slug (auto-generated)
- ✅ Description  
- ✅ Category
- ✅ At least 1 image
- ✅ At least 1 price tier

### Recommended Fields:
- SEO Meta Description
- SEO Keywords (5-10 terms)
- Product Features (3-5 items)
- Multiple images (3-5 for best UX)
- SKU for inventory tracking

### Testing Your Product:
1. Publish in Sanity
2. Visit `/shop` on your website
3. Verify product appears in catalog
4. Click product to test detail page
5. Test "Add to Cart" functionality
6. Check price displays correctly for your tier

---

**Last Updated:** January 2025  
**Version:** 1.0
