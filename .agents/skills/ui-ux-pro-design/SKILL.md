---
name: ui-ux-pro-design
description: >-
  Expert UI/UX Product Design skill for enterprise B2B SaaS, data-dense interfaces,
  design systems, typography hierarchies (14px+ minimums), spacing rhythms, and micro-interactions.
---

# UI/UX Product Design & Design Systems Skill

This skill enforces enterprise UI/UX design excellence, typographic hierarchy, ergonomics for data-dense dashboards, and modern visual design principles.

---

## 1. Typography & Hierarchy Rules

* **Base Minimum Sizing:** **14px minimum** for all readable UI elements (labels, values, inputs, table cells, buttons). Smaller sizes ($\le 12\text{px}$) are strictly reserved for minor secondary timestamps or legal fine-print.
* **Scale & Weight Hierarchy:**
  * **H1 / Hero:** 32px – 40px (`text-3xl` / `text-4xl`), Extrabold (`font-extrabold`), $-0.02\text{em}$ letter spacing.
  * **H2 / Section Title:** 20px – 24px (`text-xl` / `text-2xl`), Bold (`font-bold`).
  * **H3 / Card Header:** 16px – 18px (`text-base` / `text-lg`), Bold (`font-bold`).
  * **Body / Primary Text:** 14px – 16px (`text-sm` / `text-base`), Medium (`font-medium`) or Regular.
  * **Micro Labels / Pills:** 12px – 13px (`text-xs`), Bold (`font-bold`), uppercase with tracking.

---

## 2. Spacing Rhythm System

Avoid arbitrary margins. Use a calculated 3-tier spacing rhythm:

1. **Tight (8px / `gap-2` / `p-2`):**
   * Inside related form groups, between icon and label, between metric tag and badge.
2. **Medium (16px – 24px / `gap-4` – `gap-6` / `p-5` – `p-6`):**
   * Padding inside cards, gap between grid columns, spacing between form sections.
3. **Generous (40px – 48px / `mb-10` – `mb-12` / `py-8`):**
   * Macro spacing around hero headers, major milestone blocks, conversion CTA banners.

---

## 3. Data-Dense SaaS Ergonomics

### Tables & Ledgers
* Always use subtle row dividers (`divide-y divide-slate-200`) and hover states (`hover:bg-slate-50`).
* Numeric and financial values must be aligned with high contrast and clear currency prefixes.
* Sticky table headers for long scrolls.

### Form Design
* Inline validation with clear error messages below inputs.
* Group related fields into logical cards with clear titles.
* Disable primary CTA while pending async submission and show a spinner.

### Visual Polish & Micro-Interactions
* Subtle, tactile active states (`active:scale-95 transition-all`).
* Natural multi-stop elevation shadows (`shadow-sm`, `shadow-md`, avoid harsh black drop shadows).
* Avoid cliché glowing borders, violet-on-dark neon tropes, and textureless surfaces.

---

## 4. Design Review Checklist
* [ ] Is all primary text $\ge 14\text{px}$?
* [ ] Does the color contrast meet WCAG AA (4.5:1 text-to-background ratio)?
* [ ] Are empty, loading (skeleton), and error states designed for every dynamic component?
* [ ] Is the interface fully responsive across 375px mobile, 768px tablet, and 1440px desktop?
