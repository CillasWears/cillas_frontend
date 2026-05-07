# Frontend Architecture & Design System – Cilla's Wear

**Framework:** Next.js (App Router)  
**Language:** TypeScript  
**Styling:** Tailwind CSS  
**Design System Approach:** Token-based + Reusable Components  
**Objective:** Premium, minimal, bold, culturally grounded luxury e-commerce experience

---

## 1. Design System Foundation

### 1.1 Design Tokens

All styling must use defined tokens. No arbitrary values unless justified.

#### 1.1.1 Colors

- `primary-black`: #000000
- `primary-white`: #FFFFFF
- `accent-gold`: #B8860B
- `secondary-grey`: #A9A9A9

**Usage Rules:**

- Backgrounds: `primary-black` or `primary-white`
- CTAs: `accent-gold` (primary action only)
- Secondary text: `secondary-grey`
- No additional decorative colors without approval

### 1.2 Typography

**Font Roles:**

- **Primary Font:** Used for headings, CTA text, navigation. Letter spacing slightly increased (`tracking-wide`).
- **Secondary Font:** Used for body text, blog content, descriptions. Optimized for readability.

**Type Scale:**

| Element | Size       | Weight  |
| ------- | ---------- | ------- |
| H1      | 48–64px    | Bold    |
| H2      | 32–40px    | Semi-bold |
| H3      | 24–28px    | Medium  |
| Body    | 16–18px    | Regular |
| Small   | 14px       | Regular |

**Line height must prioritize readability (1.5+ for body text).**

### 1.3 Spacing System

Use consistent spacing scale:

- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 40px
- `2xl`: 64px
- `3xl`: 96px

**Rules:**

- Sections must use minimum `xl` vertical spacing
- Product grids must use consistent gap scale
- No inconsistent spacing

### 1.4 Border Radius

- `sm`: 4px
- `md`: 8px
- `lg`: 16px

**Use sparingly.** This is a structured, minimal design.

---

## 2. Layout System

### 2.1 Container Rules

- Max width: `1280px`
- Horizontal padding: responsive (`md` on mobile, `xl` on desktop)
- Content must remain centered

### 2.2 Grid Rules

**Product Grid:**

- Desktop: 3–4 columns
- Tablet: 2 columns
- Mobile: 1 column
- Consistent gap (`lg`)

**Blog Grid:**

- Desktop: 3 columns
- Tablet: 2 columns
- Mobile: 1 column

### 2.3 White Space Strategy

- Generous spacing between sections
- Avoid visual clutter
- No dense layouts
- Prioritize elegance over compression

---

## 3. Core Components

All UI must be built using reusable components.

### 3.1 Button Component

**Variants:**

- `primary` (`accent-gold` background)
- `secondary` (white border on black background)
- `ghost` (minimal, text-based)

**States:**

- default
- hover
- active
- disabled
- loading

**Rules:**

- Clear uppercase or wide-letter spacing
- No excessive rounded corners
- Smooth transition (150–250ms)

### 3.2 Navbar

**Contains:**

- Logo (left)
- Shop
- Collections
- Stories (Blog)
- Search
- Account
- Cart

**Rules:**

- Sticky top
- Minimal design
- Transparent → solid on scroll (optional enhancement)
- Mobile: hamburger menu

### 3.3 ProductCard

**Must include:**

- Product image
- Product name
- Price
- Hover effect (image swap or slight zoom)
- Quick view (optional phase 2)

### 3.4 BlogCard

**Must include:**

- Featured image
- Title
- Short excerpt
- Publish date
- Tag/category

### 3.5 Product Page

**Must include:**

- Image gallery (3–5 images minimum)
- Zoom functionality
- Product title
- Price
- Variant selector (size/color)
- Add to Cart button
- Product description
- Related products
- Link to related blog post (if exists)

### 3.6 Cart UI

- Slide-in drawer (preferred) or dedicated page
- Item list
- Quantity control
- Remove item
- Subtotal
- Checkout button

### 3.7 Blog Post Page

- Large featured image
- Structured typography
- Clear spacing
- Inline product linking support
- Social sharing (optional)

---

## 4. Interaction Guidelines

### 4.1 Micro-Interactions

**Allowed:**

- Hover transitions
- Subtle fade-in
- Button press animation
- Image zoom on hover

**Not allowed:**

- Excessive animation
- Distracting motion
- Autoplay heavy animations

**Animation duration:** 150–300ms.

### 4.2 Forms

All forms must include:

- Clear labels
- Inline validation
- Helpful error messages
- Accessible focus states

**Forms include:**

- Login
- Register
- Checkout
- Newsletter
- Contact

---

## 5. Rendering Strategy (Next.js App Router)

### 5.1 Static Rendering

Use static rendering with revalidation for:

- Homepage
- Product listing pages
- Product detail pages
- Blog listing
- Blog posts

### 5.2 Dynamic Rendering

Use dynamic rendering for:

- Cart
- Account dashboard
- Checkout
- Admin dashboard

### 5.3 Image Optimization

- All images must use Next.js `Image` component
- Lazy loading enabled
- Modern formats (WebP/AVIF)
- Proper width/height defined
- No unoptimized `<img>` tags

---

## 6. Performance Requirements

**Minimum targets:**

- Lighthouse Performance ≥ 85
- LCP < 2.5s
- CLS < 0.1

**Rules:**

- Avoid blocking scripts
- No large unused JS bundles
- Use automatic code splitting
- Use dynamic imports for heavy components
- Avoid unnecessary client-side state

---

## 7. Accessibility Requirements (WCAG 2.1 AA)

**Must include:**

- Semantic HTML
- Proper heading hierarchy
- Alt text on all images
- Keyboard navigation
- Visible focus states
- Sufficient color contrast
- ARIA labels where necessary

**Accessibility is mandatory, not optional.**

---

## 8. SEO Requirements

- Proper meta titles
- Meta descriptions
- Open Graph tags
- Structured data (Product schema, Blog schema)
- Clean URLs (slug-based routing)

---

## 9. Cross-Linking Rules

- Product pages may link to related blog posts
- Blog posts may embed product references
- Internal linking must strengthen SEO

---

## 10. Non-Goals (MVP Phase)

The following are intentionally excluded:

- Complex animation libraries
- 3D product rendering
- Advanced personalization engine
- Heavy client-side state management
- Micro-frontend architecture

---

## 11. Design Principles Summary

The UI must be:

- **Minimal**
- **Structured**
- **Premium**
- **Bold but restrained**
- **Spacious**
- **Product-focused**

No visual noise.  
No clutter.  
No trend-chasing UI gimmicks.