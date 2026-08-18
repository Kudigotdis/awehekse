# Aweh Ekse! — Design System Reference

This document describes the current styling architecture, design tokens, component patterns, and conventions used throughout the app. Use this as a reference when redesigning the UI.

---

## 1. Color Palette

### Brand Colors (defined in `src/index.css` via Tailwind v4 `@theme`)

| Token | Hex | Usage |
|-------|-----|-------|
| `tov-green` | `#0F8A5F` | Primary brand, buttons, active states, profile avatars |
| `tov-green-light` | `#16A97A` | Secondary green, lighter accents |
| `tov-green-pale` | `#D9F2E8` | Very light green backgrounds |
| `tov-cream` | `#F5F5FA` | Page background, profile pages |
| `tov-orange` | `#f2811c` | Safety/campaigns, warning states |
| `tov-orange-light` | `#f9a74e` | Bright orange accents |
| `tov-red` | `#B71C1C` | Emergency/danger, crisis hotlines |
| `tov-blue` | `#782919` | Primary brand (deep red-brown), buttons, headers, navigation |
| `tov-purple` | `#4A148C` | Mood tracking, research |
| `tov-gold` | `#F9A825` | Achievements, games |

### Neutral Colors (Tailwind defaults)

| Token | Usage |
|-------|-------|
| `stone-50` | Page background (`bg-stone-50`) |
| `stone-100` | Card hover states, secondary backgrounds |
| `stone-200` | Borders, dividers |
| `stone-300` | Disabled states, inactive elements |
| `stone-400` | Placeholder text, secondary text |
| `stone-500` | Body text (secondary) |
| `stone-600` | Body text (primary) |
| `stone-700` | Headings |
| `stone-800` | Primary text, bold headings |
| `stone-900` | Darkest text |
| `white` | Card backgrounds, button text |

### Color Usage Patterns

```
Primary actions:    bg-tov-green       text-white
Secondary actions:  bg-stone-100       text-stone-700
Danger actions:     bg-tov-red         text-white
Ghost actions:      bg-transparent     text-stone-600
Outline actions:    border-stone-300   text-stone-600

Success/positive:   text-tov-green
Warning:            text-tov-orange
Error/danger:       text-tov-red
Information:        text-tov-blue
Achievement:        text-tov-gold
Research:           text-tov-purple

Subtle backgrounds: bg-tov-green/5, bg-tov-green/10, bg-tov-blue/10, etc.
```

### Dark Mode

Dark mode is toggled via `ThemeContext` (adds `dark` class to `<html>`). Currently **no `dark:` variant classes are applied to components** — the toggle exists but the UI does not adapt. This needs to be implemented in the redesign.

---

## 2. Typography

### Font Family

```css
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
```

Used via Tailwind: `font-sans` (default for all text).

### Type Scale

| Class | Size | Usage |
|-------|------|-------|
| `text-[10px]` | 10px | Badge text, category labels, uppercase tracking headers |
| `text-xs` | 12px | Descriptions, labels, footnotes, error messages |
| `text-sm` | 14px | Body text, paragraph content, nav items |
| `text-base` | 16px | Larger buttons (lg/xl sizes) |
| `text-lg` | 18px | Modal titles, header brand name |
| `text-xl` | 20px | Section headings, error page titles |
| `text-2xl` | 24px | Page titles (h1), card titles |
| `text-3xl` to `text-7xl` | 30-72px | Emoji display, large stat numbers |

### Font Weights

| Class | Usage |
|-------|-------|
| `font-medium` | Default for buttons, labels, list items |
| `font-semibold` | Headings, primary buttons, active nav items |
| `font-bold` | Page titles, brand name, important numbers |

### Special Typography

| Pattern | Usage |
|---------|-------|
| `font-mono` | Error messages, sync codes |
| `tracking-wider` | "Featured Campaign" label, sync codes |
| `tracking-widest` | Sync code digits |
| `uppercase` | Section headers ("Active Campaigns", "Tools") |
| `antialiased` | Global body text smoothing |

---

## 3. Layout System

### App Shell Structure (`AppShell.jsx`)

```
┌─────────────────────────────────┐
│  OfflineBanner (z-50, conditional) │
├─────────────────────────────────┤
│  Header (fixed top, z-40)       │
│  Height: ~64px (pt-16 offset)   │
├─────────────────────────────────┤
│                                 │
│  Main Content Area              │
│  flex-1 overflow-y-auto         │
│  max-w-2xl mx-auto px-4 py-4   │
│  (672px max width, centered)    │
│                                 │
├─────────────────────────────────┤
│  BottomNav (fixed bottom, z-40) │
│  Height: ~80px (pb-20 offset)   │
└─────────────────────────────────┘
```

### Key Layout Values

| Property | Value | Notes |
|----------|-------|-------|
| Max content width | `max-w-2xl` (672px) | Mobile-first, centered |
| Page background | `bg-stone-50` | Light cream |
| Header height | ~64px | `pt-16` offset on main |
| Bottom nav height | ~80px | `pb-20` offset on main |
| Content padding | `px-4 py-4` | 16px horizontal, 16px vertical |
| Section spacing | `space-y-6` | 24px between major sections |
| Safe area top | `env(safe-area-inset-top)` | For notch devices |
| Safe area bottom | `env(safe-area-inset-bottom)` | For notch devices |

### Full-Height Viewport

The app uses `h-dvh` (dynamic viewport height) on the root container to account for mobile browser chrome.

---

## 4. Component Patterns

### 4.1 Card Component (`Card.jsx`)

```jsx
// Base card
<div className="rounded-2xl bg-white p-4 shadow-sm">

// Interactive card (tappable)
<div className="rounded-2xl bg-white p-4 shadow-sm hover:shadow-md active:scale-[0.98] transition-all">

// Hero/featured card
<div className="rounded-2xl bg-gradient-to-br from-tov-green to-green-700 p-6 text-white shadow-md">
```

**Card sub-components:**
- `Card` — outer wrapper (`rounded-2xl bg-white p-4 shadow-sm`)
- `CardHeader` — top section with flex layout
- `CardTitle` — `text-lg font-semibold text-stone-800`
- `CardDescription` — `text-sm text-stone-500`

### 4.2 Button Component (`Button.jsx`)

**Variants:**
| Variant | Classes |
|---------|---------|
| `primary` | `bg-tov-green text-white hover:bg-tov-green/80 active:bg-tov-green/90` |
| `secondary` | `bg-stone-100 text-stone-700 hover:bg-stone-200 active:bg-stone-300` |
| `danger` | `bg-tov-red text-white hover:bg-tov-red/80 active:bg-tov-red/90` |
| `ghost` | `bg-transparent text-stone-600 hover:bg-stone-100 active:bg-stone-200` |
| `outline` | `border border-stone-300 text-stone-600 hover:bg-stone-50 active:bg-stone-100` |

**Sizes:**
| Size | Classes |
|------|---------|
| `sm` | `px-3 py-1.5 text-xs rounded-lg` |
| `md` | `px-4 py-2.5 text-sm rounded-xl` |
| `lg` | `px-5 py-3 text-base rounded-xl` |
| `xl` | `px-6 py-3.5 text-lg rounded-2xl` |

**All buttons include:**
- `font-medium` weight
- `transition-all` animation
- `disabled:opacity-50 disabled:cursor-not-allowed`
- Loading spinner state (SVG `animate-spin`)

### 4.3 Badge Component (`Badge.jsx`)

**Variants:**
| Variant | Classes |
|---------|---------|
| `default` | `bg-stone-100 text-stone-600` |
| `green` | `bg-tov-green/10 text-tov-green` |
| `blue` | `bg-tov-blue/10 text-tov-blue` |
| `purple` | `bg-tov-purple/10 text-tov-purple` |
| `orange` | `bg-tov-orange/10 text-tov-orange` |
| `red` | `bg-tov-red/10 text-tov-red` |

**Base classes:** `inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium`

### 4.4 Modal Component (`Modal.jsx`)

- Full-screen overlay with backdrop blur
- `bg-black/50 backdrop-blur-sm` overlay
- White content panel with `rounded-2xl shadow-xl`
- Title bar with close (X) button
- Body scroll lock when open

### 4.5 Toast Component (`Toast.jsx`)

- Fixed bottom-center position
- Auto-dismiss after 4 seconds
- Types: `success` (green), `error` (red), `warning` (amber), `info` (stone)
- `shadow-lg` elevation
- Slide-up animation

### 4.6 SearchBar Component (`SearchBar.jsx`)

- `rounded-2xl bg-white shadow-sm` container
- Search icon (magnifying glass SVG) on left
- Input with `text-sm` placeholder
- Clear (X) button appears when text is present

### 4.7 Skeleton Component (`Skeleton.jsx`)

- `animate-pulse rounded bg-stone-200` pattern
- `Skeleton` — single bar
- `SkeletonCard` — card-shaped placeholder
- `SkeletonList` — list of skeleton cards

### 4.8 EmptyState Component (`EmptyState.jsx`)

- Centered layout with large emoji icon
- Title (`text-lg font-semibold`)
- Description (`text-sm text-stone-500`)
- Optional CTA button

---

## 5. Icon System

### Primary: Emoji Icons

The app uses **emoji as its primary icon system** — no icon library (Heroicons, Lucide, etc.) is installed. Emojis are used for:

- Navigation items
- Feature cards on home page
- Substance/category indicators
- Achievement badges
- Game symbols
- Status indicators
- Empty states

### Secondary: Inline SVGs

A small number of inline SVGs (Heroicons-style) are used for:
- Bottom navigation tabs (5 icons: Home, Book, Mood, Phone, Menu)
- Search icon (magnifying glass)
- Clear icon (X)
- Close icon (X) for modals
- Chevron right/down arrows
- Bookmark icon (filled/unfilled)
- Loading spinner
- Progress ring (circular SVG)

### Public Assets

| File | Purpose |
|------|---------|
| `public/favicon.svg` | Lightning bolt logo (purple #863bff) |
| `public/icon-192.svg` | PWA icon (green #1B5E20 with "AWEH EKSE!") |
| `public/icon-512.svg` | Same as above, larger |

---

## 6. Spacing & Layout Patterns

### Border Radius

| Class | Usage |
|-------|-------|
| `rounded-full` | Badges, avatars, profile initials, category pills |
| `rounded-2xl` | **Primary radius** — cards, buttons, modals, search bars |
| `rounded-xl` | Input fields, secondary containers |
| `rounded-lg` | Calendar day cells, small buttons |

### Shadows

| Class | Usage |
|-------|-------|
| `shadow-sm` | Default card elevation |
| `shadow-md` | Featured cards on hover |
| `shadow-lg` | Toast notifications |
| `shadow-xl` | Modal containers |

### Common Spacing

| Pattern | Usage |
|---------|-------|
| `space-y-6` | Default vertical spacing between sections |
| `space-y-4` | Tighter vertical spacing |
| `space-y-2` | Very tight spacing (list items) |
| `gap-2`, `gap-3`, `gap-4` | Flex/grid gaps |
| `p-4`, `p-5`, `p-6` | Card/container padding |
| `px-3`, `px-4`, `px-5` | Horizontal padding |
| `py-1.5`, `py-2.5`, `py-3`, `py-4` | Vertical padding |

### Grid Patterns

| Pattern | Usage |
|---------|-------|
| `grid grid-cols-2 gap-3` | 2-column card grids (home page) |
| `grid grid-cols-3 gap-2` | 3-column grids (badges, moods) |
| `grid grid-cols-5 gap-1` | 5-column grids (calendar, mood selector) |

---

## 7. Interactive Patterns

### Tappable Cards

```jsx
className="rounded-2xl bg-white p-4 shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
```

### Filter Chips

```jsx
// Inactive
className="rounded-full px-3 py-1.5 text-xs font-medium bg-stone-100 text-stone-600"

// Active
className="rounded-full px-3 py-1.5 text-xs font-medium bg-tov-green text-white"
```

### Progress Bars

```jsx
// Container
<div className="h-2 rounded-full bg-stone-200">

// Fill (dynamic width via inline style)
<div className="h-full rounded-full bg-tov-green" style={{ width: `${percent}%` }}>
```

### Toggle Switches

```jsx
// Container
<button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? 'bg-tov-green' : 'bg-stone-300'}`}>
  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${value ? 'translate-x-6' : 'translate-x-1'}`} />
</button>
```

### Accordion/Collapsible

```jsx
// Header with chevron rotation
<button onClick={() => setOpen(!open)}>
  <svg className={`h-5 w-5 text-stone-400 transition-transform ${open ? 'rotate-180' : ''}`}>
```

---

## 8. Animation Patterns

| Animation | Implementation |
|-----------|---------------|
| Loading spinner | `animate-spin` on SVG circle |
| Skeleton pulse | `animate-pulse` on placeholder elements |
| Toast slide-up | `animate-slide-up` (custom, referenced in Toast) |
| Button press | `active:scale-[0.98]` transform |
| Card hover | `hover:shadow-md` shadow transition |
| Color transitions | `transition-colors` or `transition-all` |
| Accordion open | `transition-transform rotate-180` on chevron |

---

## 9. What Needs Redesigning

### Current Pain Points

1. **No dark mode CSS** — Toggle exists but components have no `dark:` variant classes
2. **Emoji-only icons** — Inconsistent rendering across platforms, no visual hierarchy
3. **No design token file** — Colors exist only in `index.css`, not exportable
4. **No animation library** — No Framer Motion, no spring physics, no page transitions
5. **Basic layout** — Simple vertical stacking, no sophisticated grid layouts
6. **No illustration system** — Large empty spaces, no onboarding illustrations
7. **Minimal visual hierarchy** — Cards all look the same (white rounded-2xl shadow-sm)
8. **No glassmorphism/transparency** — All solid backgrounds
9. **No responsive breakpoints** — Mobile-only, no tablet/desktop adaptation
10. **No custom font loading** — Inter is referenced but not loaded (falls back to system UI)
11. **App.css is dead code** — Contains Vite template styles not used by the app
12. **No micro-interactions** — No haptic feedback, no swipe gestures, no pull-to-refresh

### Files to Modify for Redesign

| File | Changes Needed |
|------|---------------|
| `src/index.css` | Add dark mode tokens, custom animations, font import |
| `src/components/layout/AppShell.jsx` | Layout structure |
| `src/components/layout/Header.jsx` | Header design |
| `src/components/layout/BottomNav.jsx` | Tab bar design + icons |
| `src/components/ui/Button.jsx` | Button styles |
| `src/components/ui/Card.jsx` | Card styles |
| `src/components/ui/Badge.jsx` | Badge styles + ProgressRing |
| `src/components/ui/Modal.jsx` | Modal design |
| `src/components/ui/Toast.jsx` | Toast design + animation |
| `src/components/ui/SearchBar.jsx` | Search input design |
| `src/components/ui/Skeleton.jsx` | Loading states |
| `src/components/ui/EmptyState.jsx` | Empty state design |
| `src/components/ErrorBoundary.jsx` | Error page design |
| `src/pages/Home.jsx` | Dashboard redesign (highest impact) |
| `src/pages/More.jsx` | Settings page redesign |
| All 60+ page files | Individual page styling |

---

## 10. Quick Reference — CSS Classes Used Most

```
# Layout
flex h-dvh flex-col bg-stone-50
flex-1 overflow-y-auto pb-20 pt-16
mx-auto max-w-2xl px-4 py-4
fixed top-0 inset-x-0 z-40
fixed bottom-0 inset-x-0 z-40

# Cards
rounded-2xl bg-white p-4 shadow-sm
rounded-2xl bg-white p-4 shadow-sm hover:shadow-md active:scale-[0.98] transition-all

# Buttons
rounded-xl px-4 py-2.5 text-sm font-medium transition-all
bg-tov-green text-white hover:bg-tov-green/80

# Text
text-stone-800 (primary)
text-stone-500 (secondary)
text-stone-400 (tertiary/muted)
text-xs text-stone-500 uppercase tracking-wider (section headers)

# Spacing
space-y-6 (major sections)
space-y-4 (minor sections)
space-y-2 (list items)
gap-3 (grid/flex gaps)

# Interactive
active:scale-[0.98] (tappable feedback)
transition-all (smooth state changes)
animate-pulse (loading)
animate-spin (spinner)
```
