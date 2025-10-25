import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')
    
    // Check page title
    await expect(page).toHaveTitle(/Storybox/)
    
    // Check hero section
    await expect(page.locator('h1')).toContainText('Машинна бродерия')
    
    // Check main navigation
    await expect(page.locator('nav')).toBeVisible()
    await expect(page.getByRole('link', { name: 'НАЧАЛО' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'УСЛУГИ' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'МАГАЗИН' })).toBeVisible()
  })

  test('should have responsive mobile menu', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Mobile menu should be hidden initially
    const mobileNav = page.locator('div.md\\:hidden').filter({ hasText: 'НАЧАЛО' })
    await expect(mobileNav).not.toBeVisible()
    
    // Click hamburger menu
    await page.getByLabel('Toggle menu').click()
    
    // Mobile menu should be visible
    await expect(mobileNav).toBeVisible()
    await expect(page.getByRole('link', { name: 'НАЧАЛО' })).toBeVisible()
  })

  test('should navigate to services page', async ({ page }) => {
    await page.goto('/')
    
    await page.getByRole('link', { name: 'УСЛУГИ' }).first().click()
    
    await expect(page).toHaveURL(/\/services/)
  })

  test('should display contact information', async ({ page }) => {
    await page.goto('/')
    
    // Check phone number
    await expect(page.getByText('+359899973002')).toBeVisible()
    
    // Check location
    await expect(page.getByText('гр. София')).toBeVisible()
  })
})
