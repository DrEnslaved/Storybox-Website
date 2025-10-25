# Testing Guide

This document describes the testing setup and how to run tests for the Storybox application.

## Testing Stack

- **Unit/Integration Tests**: Jest + React Testing Library
- **E2E Tests**: Playwright
- **Coverage**: Jest Coverage Reports
- **CI/CD**: GitHub Actions

## Running Tests

### Unit and Integration Tests

```bash
# Run tests in watch mode (development)
yarn test

# Run tests once with coverage (CI)
yarn test:ci
```

### E2E Tests

```bash
# Run E2E tests (headless)
yarn test:e2e

# Run E2E tests with UI
yarn test:e2e:ui

# Run E2E tests in headed mode (see browser)
yarn test:e2e:headed
```

## Test Structure

### Unit Tests
Unit tests are located next to the components/functions they test:
```
components/
  MyComponent.js
  MyComponent.test.js
```

### E2E Tests
E2E tests are located in the `e2e/` directory:
```
e2e/
  homepage.spec.js
  auth.spec.js
  shopping.spec.js
```

## Test Coverage

### Critical Flows Tested

1. **Authentication Flow**
   - User registration
   - User login
   - Session management
   - Logout functionality

2. **Shopping Flow**
   - Browse products
   - View product details
   - Add to cart
   - Cart management

3. **Checkout Flow**
   - Cart review
   - Shipping information
   - Order placement
   - Order confirmation

4. **Account Management**
   - View profile
   - View order history
   - Order annulment
   - Pricing tier access

5. **Navigation & UI**
   - Mobile responsive menu
   - Desktop navigation
   - Footer links
   - Contact information

## Writing Tests

### Example Unit Test

```javascript
import { render, screen } from '@testing-library/react'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Example E2E Test

```javascript
import { test, expect } from '@playwright/test'

test('should navigate to shop', async ({ page }) => {
  await page.goto('/')
  await page.click('text=МАГАЗИН')
  await expect(page).toHaveURL('/shop')
})
```

## CI/CD Pipeline

### GitHub Actions Workflow

The CI/CD pipeline runs automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

### Pipeline Stages

1. **Lint**: Code quality checks
2. **Test**: Run unit and integration tests
3. **E2E**: Run end-to-end tests
4. **Build**: Build production bundle
5. **Deploy**: Deploy to production (main branch only)
6. **Notify**: Send deployment notifications

### Required Secrets

Configure these secrets in GitHub repository settings:

- `SENTRY_DSN`: Sentry error tracking DSN
- `SENTRY_AUTH_TOKEN`: Sentry authentication token
- `NEXT_PUBLIC_BASE_URL`: Production URL

## Troubleshooting

### Tests Failing Locally

1. Ensure all dependencies are installed: `yarn install`
2. Clear Next.js cache: `rm -rf .next`
3. Restart the dev server

### E2E Tests Timing Out

1. Increase timeout in `playwright.config.js`
2. Check if dev server is running
3. Verify network connectivity

### Coverage Not Generated

1. Run with coverage flag: `yarn test:ci`
2. Check `coverage/` directory
3. View HTML report: `open coverage/lcov-report/index.html`

## Best Practices

1. **Write tests first** (TDD approach)
2. **Test user behavior**, not implementation
3. **Use descriptive test names**
4. **Mock external dependencies**
5. **Keep tests isolated and independent**
6. **Run tests before committing**
7. **Maintain >80% code coverage**

## Performance

- Unit tests should run in <10 seconds
- E2E tests should run in <5 minutes
- Full CI/CD pipeline should complete in <15 minutes

## Continuous Improvement

- Review test failures regularly
- Update tests when features change
- Add tests for new features
- Refactor flaky tests
- Monitor test execution time
