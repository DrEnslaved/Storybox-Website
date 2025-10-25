import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/')
    
    // Click login link
    await page.getByRole('link', { name: /Вход|Login/ }).first().click()
    
    await expect(page).toHaveURL('/login')
    await expect(page.locator('h1, h2')).toContainText(/Вход|Login/)
  })

  test('should show register link on login page', async ({ page }) => {
    await page.goto('/login')
    
    // Should have a link to register
    const registerLink = page.locator('a[href="/register"]')
    await expect(registerLink).toBeVisible()
  })

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/login')
    
    await page.locator('a[href="/register"]').click()
    
    await expect(page).toHaveURL('/register')
    await expect(page.locator('h1, h2')).toContainText(/Регистрация|Register/)
  })

  test('should show login form fields', async ({ page }) => {
    await page.goto('/login')
    
    // Check for email/username field
    const emailField = page.locator('input[type="email"], input[name="email"]')
    await expect(emailField).toBeVisible()
    
    // Check for password field
    const passwordField = page.locator('input[type="password"]')
    await expect(passwordField).toBeVisible()
    
    // Check for submit button
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
  })
})
