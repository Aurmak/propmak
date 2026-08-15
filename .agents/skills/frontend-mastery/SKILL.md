---
name: frontend-mastery
description: >-
  Advanced Frontend Engineering skill for React 19, Next.js 15 App Router, TypeScript,
  Core Web Vitals performance optimization, state management architecture, and resilient UI patterns.
---

# Frontend Mastery Engineering Skill

This skill guides high-performance, maintainable, and type-safe frontend application development using modern React 19, Next.js 15, and TypeScript.

---

## 1. Core Architectural Guidelines

### 1. TypeScript Strict Discipline
* **Zero `any` Policy:** Always define explicit interfaces, type aliases, or generic parameters.
* **Discriminated Unions:** Use discriminated unions for polymorphic entities and API responses:
  ```typescript
  type AsyncState<T> = 
    | { status: 'idle' }
    | { status: 'loading' }
    | { status: 'success'; data: T }
    | { status: 'error'; error: Error };
  ```
* **Schema Validation:** Use Zod/Valibot at system boundaries (forms, route handlers, webhooks).

### 2. Next.js 15 & React 19 Best Practices
* **Server Components by Default:** Keep data fetching and static markup on the server. Add `'use client'` only when utilizing state (`useState`, `useReducer`), effects (`useEffect`), browser APIs, or interactive event handlers.
* **Granular Suspense Boundaries:** Wrap dynamic sections in `<Suspense fallback={<Skeleton />}>` to avoid blocking the initial page render.
* **Optimistic UI Updates:** Provide instant user feedback on mutations before network round-trips complete.

---

## 2. Web Performance & Core Web Vitals Checklist

| Metric | Target | Optimization Strategy |
| :--- | :--- | :--- |
| **LCP** (Largest Contentful Paint) | $< 2.5\text{s}$ | Priority image loading (`priority` flag), inline critical CSS, self-hosted fonts. |
| **INP** (Interaction to Next Paint) | $< 200\text{ms}$ | Debounce expensive computations, defer non-critical state with `useTransition`. |
| **CLS** (Cumulative Layout Shift) | $< 0.1$ | Explicit image/container aspect ratios, reserve space for dynamic data and modals. |

---

## 3. Resilient Component Architecture Pattern

```typescript
// 1. Separation of Concerns: Custom Hook for Logic
export function usePropertyFilter(units: Unit[]) {
  const [filter, setFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const filteredUnits = useMemo(() => {
    return units.filter(unit => {
      const matchSearch = !search || unit.unitNumber.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'ALL' || unit.status === filter;
      return matchSearch && matchFilter;
    });
  }, [units, filter, search]);

  return { filter, setFilter, search, setSearch, filteredUnits };
}

// 2. Pure Presentational Component
export const PropertyCard: React.FC<{ unit: Unit; onSelect: (id: string) => void }> = ({ unit, onSelect }) => (
  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
    <h3 className="text-base font-bold text-slate-900">{unit.unitNumber}</h3>
    <p className="text-sm text-slate-500">{unit.propertyName}</p>
    <button 
      onClick={() => onSelect(unit.id)}
      className="mt-4 w-full py-2 bg-slate-900 text-white rounded-xl text-sm font-bold"
    >
      View Details
    </button>
  </div>
);
```

---

## 4. Frontend Security & Resiliency Rules
* [ ] Never inject unescaped raw HTML (`dangerouslySetInnerHTML`) without DOMPurify sanitization.
* [ ] Always attach `ErrorBoundary` components around critical widgets to prevent full-page crashes.
* [ ] Use `AbortController` in async fetch hooks to cancel in-flight requests on component unmount.
