# Creating Publishable API Key in Medusa

## Issue
The Medusa store API requires a publishable API key to fetch products. Without it, you'll get a 400 error.

## Solution: Create via Admin UI

1. **Open Medusa Admin Panel**:
   - URL: http://localhost:9000/app
   - Email: admin@storybox.bg
   - Password: admin123456

2. **Navigate to Settings → Publishable API Keys**:
   - Click on "Settings" in the left sidebar
   - Look for "Publishable API Keys" or "API Keys"
   - Click "Create API Key" or "Add Key"

3. **Create New Key**:
   - Title: "Storybox Store Frontend"
   - Select the default sales channel
   - Click "Save" or "Create"

4. **Copy the Key**:
   - Copy the generated key (starts with `pk_`)
   
5. **Update Environment Variables**:
   Add to `/app/.env`:
   ```
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_your_key_here
   ```

6. **Restart Next.js**:
   ```bash
   sudo supervisorctl restart nextjs
   ```

## Alternative: Create Product First, Then Key

If you can't find the API Keys section in settings:

1. First create a product:
   - Go to **Products** → **Add Product**
   - Fill in basic details
   - Set status to "Published"
   - Save the product

2. Then the API Keys section should appear in Settings

3. Follow steps 2-6 above

## Temporary Workaround

Until the publishable key is set up, the shop page will show "0 products from medusa" which is expected behavior.
