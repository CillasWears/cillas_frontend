# Cilla's Wears

A premium urban-African fashion e-commerce platform with integrated blog functionality, built with Next.js.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind CSS-3-38bdf8)

## Overview

Cilla's Wears is a modern e-commerce platform that combines premium fashion retail with storytelling through an integrated blog. The platform authentically reflects the brand's urban-African aesthetic, balancing robust e-commerce capabilities with engaging content and storytelling.

## Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Icons:** Lucide React

### Backend (API)
- **Runtime:** Node.js
- **Framework:** NestJS
- **Database:** PostgreSQL (via Prisma ORM)
- **Authentication:** JWT with bcrypt
- **Payment:** Paystack

## Features

### E-commerce
- Product catalog with categories and collections
- Product search with filtering (category, price, size, color)
- Shopping cart with persistent storage
- Secure checkout process
- User accounts with order history
- Order tracking

### Blog
- Rich content management system
- Categorization and tagging
- Product-to-blog cross-linking
- Social sharing

### Design System
- Premium, minimal, bold aesthetic
- Urban-African cultural grounding
- Fully responsive (mobile, tablet, desktop)
- WCAG 2.1 AA accessible

## Project Structure

```
cillas-wear/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── account/           # User account pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── auth/              # Authentication pages
│   │   ├── blog/              # Blog pages
│   │   ├── checkout/          # Checkout flow
│   │   ├── search/            # Search page
│   │   ├── shop/              # Shop pages
│   │   └── layout.tsx         # Root layout
│   ├── components/             # React components
│   │   ├── admin/             # Admin components
│   │   ├── blog/              # Blog components
│   │   ├── cart/              # Cart components
│   │   ├── checkout/          # Checkout components
│   │   ├── layout/            # Layout components
│   │   ├── product/           # Product components
│   │   ├── search/            # Search components
│   │   ├── shop/              # Shop components
│   │   └── ui/                # UI components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions & API
│   ├── store/                 # Zustand stores
│   └── types/                 # TypeScript types
├── public/                    # Static assets
├── next.config.ts             # Next.js configuration
├── tailwind.config.ts         # Tailwind configuration
└── tsconfig.json              # TypeScript configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/CillasWears/cillas_frontend.git
cd cillas-wear
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
NEXT_PUBLIC_API_URL=your_api_url
# Add other required variables
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |

## Design System

### Colors
- `primary-black`: #000000
- `primary-white`: #FFFFFF
- `accent-gold`: #B8860B
- `secondary-grey`: #A9A9A9

### Typography
- Primary Font: Headings, CTAs, navigation
- Secondary Font: Body text, blog content

### Spacing Scale
- `xs`: 4px | `sm`: 8px | `md`: 16px | `lg`: 24px | `xl`: 40px | `2xl`: 64px | `3xl`: 96px

## API Documentation

The backend API includes the following modules:

- **Auth Module** - User registration, login, JWT issuance
- **Users Module** - Profile and address management
- **Products Module** - Product CRUD, variants, inventory
- **Categories Module** - Category management
- **Cart Module** - Shopping cart operations
- **Orders Module** - Order processing and tracking
- **Payments Module** - Paystack integration
- **Blog Module** - Blog post management
- **Search Module** - Full-text search
- **Notifications Module** - Email notifications

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Links

- [Frontend Documentation](./frontend.md)
- [Product Requirements](./PRD.md)
- [Backend Architecture](./Backend-tech-stack-and-dB.md)

---

Built with ❤️ by Cilla's Wears