---
name: wcag-accessibility
description: >-
  Web Accessibility (a11y) & WCAG 2.1/2.2 compliance skill. Enforces semantic HTML,
  ARIA patterns, keyboard navigation traps, focus management, screen reader compatibility, and automated a11y auditing.
---

# Web Accessibility (a11y) & WCAG 2.2 Compliance Skill

This skill provides step-by-step guidelines for building accessible web applications that meet WCAG 2.1 and 2.2 Level AA / AAA standards.

---

## 1. Semantic HTML & Landmark Foundations

Always use native HTML semantic elements before reaching for generic `<div>` tags:

| Semantic Tag | Usage & Accessibility Benefit |
| :--- | :--- |
| `<header>` | Page or section banner landmark (`role="banner"`). |
| `<nav>` | Main and secondary navigation menus (`role="navigation"`). |
| `<main>` | Core page content (`role="main"`). Only one `<main>` per document. |
| `<aside>` | Complementary sidebars or contextual drawers (`role="complementary"`). |
| `<button>` | Interactive click actions. Never use `<div onClick="...">` without keyboard event listeners and `role="button"`. |
| `<a>` | Hyperlinks with valid `href` destinations. |

---

## 2. Keyboard Navigation & Focus Management Rules

### 1. Visible Focus Rings
* **Never use `outline: none`** without supplying a high-contrast replacement:
  ```css
  button:focus-visible, a:focus-visible, input:focus-visible {
    outline: 2px solid #0F172A;
    outline-offset: 2px;
  }
  ```

### 2. Modal Focus Trap & Restoration
* When a modal opens:
  1. Trap keyboard focus inside the modal dialog (`tab` cycles through modal elements only).
  2. Pressing `Escape` must close the modal.
  3. When the modal closes, restore focus to the button that triggered it.

### 3. Skip to Main Content Link
* Provide a hidden skip link as the very first focusable item on the page:
  ```html
  <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-white focus:z-50">
    Skip to main content
  </a>
  ```

---

## 3. ARIA Roles & Dynamic State Patterns

* **Expandable Dropdowns / Accordions:**
  ```html
  <button 
    aria-expanded={isOpen} 
    aria-controls="menu-dropdown" 
    id="menu-trigger"
  >
    Options
  </button>
  <div id="menu-dropdown" role="region" aria-labelledby="menu-trigger" hidden={!isOpen}>
    ...
  </div>
  ```

* **Live Status Announcements (Toasts & Notifications):**
  ```html
  <div aria-live="polite" aria-atomic="true" className="sr-only">
    {successMessage}
  </div>
  ```

* **Form Error Association:**
  ```html
  <input 
    id="email-input" 
    aria-invalid={hasError} 
    aria-describedby={hasError ? "email-error-msg" : undefined} 
  />
  {hasError && <p id="email-error-msg" role="alert" className="text-rose-600">Please enter a valid email.</p>}
  ```

---

## 4. Visual Accessibility & Screen Reader Audit Checklist

* [ ] **Color Contrast:** All text achieves at least **4.5:1** contrast ratio against its background.
* [ ] **Color Independence:** Information is never conveyed by color alone (e.g. use an icon and text badge alongside status colors).
* [ ] **Alt Text on Images:** All informative images have descriptive `alt` text; decorative images use `alt=""` or `aria-hidden="true"`.
* [ ] **Screen Reader Verification:** Tested with Apple VoiceOver (`Cmd + F5`) or NVDA (`Insert + Down Arrow`).
* [ ] **Automated axe Audit:** Passes `@axe-core/react` / Lighthouse a11y audit with **0 critical violations**.
