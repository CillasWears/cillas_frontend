
---

## 4. Domain Modules

Each module must contain:

- Controller
- Service
- Repository (via Prisma)
- DTOs
- Validation
- Domain logic

**Modules must not directly access other module repositories.**  
Inter-module communication must happen via service interfaces.

---

### 4.1 Auth Module

**Responsibilities:**

- User registration
- Login
- JWT issuance
- Password hashing (bcrypt)
- Token validation

**Endpoints:**

- `POST   /auth/register`
- `POST   /auth/login`
- `GET    /auth/me`

**Authentication Strategy:**

- JWT (access token)
- Optional refresh tokens (phase 2)
- Role-based access (admin, customer)

---

### 4.2 Users Module

**Responsibilities:**

- User profile management
- Address management
- Preferences

**Endpoints:**

- `GET    /users/profile`
- `PUT    /users/profile`
- `POST   /users/address`

---

### 4.3 Products Module

**Responsibilities:**

- Product CRUD (admin)
- Public product listing
- Variants (size, color)
- Pricing
- Inventory tracking

**Endpoints:**

- `GET    /products`
- `GET    /products/:id`
- `POST   /products` (admin)
- `PUT    /products/:id` (admin)
- `DELETE /products/:id` (admin)

**Search & Filtering:**

- Category filter
- Price range
- Text search (PostgreSQL full-text search)
- Sorting (newest, price, popularity)

---

### 4.4 Categories Module

**Responsibilities:**

- Create categories
- Nested categories (optional)
- Product grouping

**Endpoints:**

- `GET    /categories`
- `POST   /categories` (admin)

---

### 4.5 Cart Module

**Responsibilities:**

- Add to cart
- Remove from cart
- Update quantity
- Persist cart per authenticated user

**Endpoints:**

- `GET    /cart`
- `POST   /cart`
- `PUT    /cart/:itemId`
- `DELETE /cart/:itemId`

**Cart Data Rules:**

- Linked to user
- Stored in database
- Cleared on successful order creation

---

### 4.6 Orders Module

**Responsibilities:**

- Create order from cart
- Store order items
- Update order status
- Maintain order history

**Order Status Flow:**

- `PENDING`
- `PAID`
- `PROCESSING`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`

**Endpoints:**

- `POST   /orders`
- `GET    /orders`
- `GET    /orders/:id`
- `PATCH  /orders/:id/status` (admin)

**Order creation must:**

- Validate inventory
- Lock stock
- Create transactional record

All order creation must be wrapped in a database transaction.

---

### 4.7 Payments Module

**Responsibilities:**

- Initialize Paystack transaction
- Verify payment server-side
- Update order status to `PAID`

**Endpoints:**

- `POST   /payments/initialize`
- `POST   /payments/verify`

**Rules:**

- Never trust frontend payment confirmation
- Always verify transaction using Paystack secret key
- Payment verification must update order within DB transaction

---

### 4.8 Blog Module

**Responsibilities:**

- Create blog posts
- Update posts
- Publish/unpublish
- Manage tags
- Public blog listing

**Endpoints:**

- `GET    /blog`
- `GET    /blog/:slug`
- `POST   /blog` (admin)
- `PUT    /blog/:id` (admin)
- `DELETE /blog/:id` (admin)

**Features:**

- Slug-based routing
- Draft vs Published status
- Rich text content
- Tag filtering

---

### 4.9 Search Module

**Initial Implementation:**

- PostgreSQL Full-Text Search
- Indexed search columns
- Trigram search for fuzzy matching

**Search Scope:**

- Products
- Blog posts

**Endpoint:**

- `GET /search?q=`

**Note:** Elasticsearch/OpenSearch is not included in MVP.

---

### 4.10 Notifications Module

**Responsibilities:**

- Order confirmation emails
- Payment confirmation
- Password reset emails

**Implementation:**

- Triggered via internal domain events
- No external message queue
- No Kafka or RabbitMQ
- Use NestJS event emitter pattern

---

## 5. Database Design Principles

### 5.1 Single Database Strategy

- One PostgreSQL instance
- Logical separation via tables
- Strong indexing strategy
- Enforced foreign key constraints

### 5.2 Required Core Tables

- `users`
- `addresses`
- `products`
- `product_variants`
- `categories`
- `carts`
- `cart_items`
- `orders`
- `order_items`
- `payments`
- `blog_posts`
- `blog_tags`

**All write-heavy flows (orders, payments) must use transactions.**

---

## 6. Security

### 6.1 Authentication

- JWT-based
- bcrypt password hashing
- Access token expiration

### 6.2 Authorization

Role-based access:

- `CUSTOMER`
- `ADMIN`

Guards must enforce role restrictions on admin endpoints.

### 6.3 API Protection

- Input validation using `class-validator`
- Global validation pipe
- Basic rate limiting
- HTTPS enforced via hosting provider

---

## 7. Deployment & Infrastructure

### 7.1 Hosting

- **Railway**
- Managed PostgreSQL
- Environment variables for secrets

### 7.2 Containerization

**Optional:**

- Single Dockerfile
- No Kubernetes
- No container orchestration

### 7.3 CI/CD

- GitHub → Railway automatic deployment
- Main branch = production
- Dev branch = staging

---

## 8. Internal Event Handling

Use internal domain events for:

- `OrderCreated`
- `PaymentVerified`
- `UserRegistered`

**Example Flow:**

`OrderCreatedEvent`:

- Send confirmation email
- Reduce inventory
- Clear cart

**No distributed messaging system required.**

---

## 9. Scalability Roadmap

**Phase 1 (MVP):**  
Single modular monolith

**Phase 2 (Growth):**  
- Add Redis caching  
- Add background job queue (BullMQ)

**Phase 3 (High Scale):**  
- Extract Search into standalone service  
- Extract Notifications into worker  
- Possibly isolate Payments

**Microservices will only be introduced when scaling demands it.**

---

## 10. Explicit Non-Goals (For Startup Phase)

The following are intentionally excluded:

- Kubernetes
- API Gateway
- Multiple databases
- Kafka / RabbitMQ
- Elasticsearch cluster
- Distributed microservices

These will only be considered when operational scale requires them.