---
name: qa-engineering
description: >-
  Comprehensive Quality Assurance & Automated Testing skill. Enforces industry-standard E2E,
  integration, unit, and API test strategies, edge-case test matrices, visual regression,
  performance load testing, and CI/CD quality gates.
---

# QA Engineering & Automated Testing Skill

This skill provides full-lifecycle quality assurance standards, test design techniques, automated testing patterns, and edge-case verification matrices.

---

## 1. Test Pyramid & Coverage Hierarchy

```
         /\
        /  \     E2E Tests (10-20%): Critical user journeys, multi-step flows
       /----\    
      /      \   Integration Tests (30-40%): Component interactions, API contracts, DB mocks
     /--------\  
    /          \ Unit Tests (50-60%): Pure functions, math formulas, data parsers, utilities
   /------------\
```

### Coverage Principles
* **Unit Tests:** Verify business logic, financial calculators (e.g. Net Payout formulas, rent escalation math, OCR parsing).
* **Integration Tests:** Verify component lifecycle, form submissions, state providers, and mock API network calls.
* **E2E Tests (Playwright / Cypress):** Verify critical path flows from the user perspective (e.g., login $\rightarrow$ upload slip $\rightarrow$ verify ledger $\rightarrow$ generate statement).

---

## 2. Test Design Matrices & Edge-Case Checklist

Always test the following 7 dimensions for any new feature:

### 1. Happy Path Flow
* Standard inputs, typical payload, successful server response, optimistic UI update.

### 2. Boundary Values & Numeric Limits
* `0`, negative numbers, maximum safe integer (`Number.MAX_SAFE_INTEGER`), currency rounding issues, decimal overflows.

### 3. Nullable, Empty & Missing States
* Empty string `""`, `null`, `undefined`, empty arrays `[]`, missing optional fields, zero search results.

### 4. Network & Latency Failures
* Slow 3G simulated throttling, 500 internal server errors, 401 unauthorized token expirations, abrupt offline disconnection.

### 5. Concurrency & Race Conditions
* Rapid multi-clicks on submit buttons (prevent duplicate payment or ticket submissions via debounce / disabling button while `isSubmitting`).
* Out-of-order async response resolution.

### 6. Security & Input Sanitization
* Script injection (`<script>alert(1)</script>`), SQL characters, oversized payloads (> 10MB images/PDFs), malformed JSON.

### 7. Cross-Browser & Viewport Resiliency
* Desktop (1920x1080), Tablet (768x1024), Mobile (375x667), dark mode contrast, zoomed viewports (200%).

---

## 3. Playwright E2E Best-Practice Template

```typescript
import { test, expect } from '@playwright/test';

test.describe('Rent Roll & Slip Verification Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should display rent roll and allow 1-click verification of bank slip', async ({ page }) => {
    // Navigate to Rent Roll
    await page.click('button:has-text("Rent Roll")');
    await expect(page.locator('h1')).toContainText('Rent Roll');

    // Find pending slip and open verification modal
    const verifyButton = page.locator('button:has-text("Verify Slip")').first();
    await expect(verifyButton).toBeVisible();
    await verifyButton.click();

    // Verify modal elements
    await expect(page.locator('text=Verify Bank Transfer Screenshot')).toBeVisible();
    
    // Click confirm verification
    const confirmButton = page.locator('button:has-text("Confirm & Credit Ledger")');
    await confirmButton.click();

    // Assert status updated to Verified
    await expect(page.locator('span:has-text("Verified")').first()).toBeVisible();
  });
});
```

---

## 4. API & Integration Testing Checklist
* [ ] Status code verification (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`).
* [ ] Response schema validation using Zod or JSON Schema.
* [ ] Rate limiting enforcement headers (`X-RateLimit-Remaining`).
* [ ] Idempotency keys on financial mutation endpoints.
