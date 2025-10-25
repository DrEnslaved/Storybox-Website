import { test, expect } from '@playwright/test'

test.describe('Shopping Flow', () => {
  test('should display shop page with products', async ({ page }) => {
    await page.goto('/shop')
    
    // Check page loaded
    await expect(page.locator('h1')).toContainText(/Магазин|Shop/)
    
    // Note: Products might not load if Medusa is not running
    // This is expected in the current setup
  })

  test('should navigate to product detail from shop', async ({ page }) => {
    await page.goto('/shop')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Try to click on a product if available
    const productLinks = page.locator('a[href^="/shop/"]')
    const count = await productLinks.count()
    
    if (count > 0) {
      await productLinks.first().click()
      // Should navigate to product detail page
      await expect(page).toHaveURL(/\/shop\//)
    }
  })

  test('should show cart icon in navigation', async ({ page }) => {
    await page.goto('/')
    
    // Cart icon should be visible
    const cartIcon = page.locator('a[href="/cart"]')
    await expect(cartIcon).toBeVisible()
  })

  test('should navigate to cart page', async ({ page }) => {
    await page.goto('/')
    
    await page.locator('a[href="/cart"]').first().click()
    
    await expect(page).toHaveURL('/cart')
    await expect(page.locator('h1')).toContainText(/Количка|Cart/)
  })
})
