export const queryKeys = {
 categories: {
  all: ['categories'] as const,
 },

 // Auth
 auth: {
  me: ['auth', 'me'] as const,
 },

 // Products
 products: {
  all: ['products'] as const,
  list: (query: Record<string, unknown>) =>
   ['products', 'list', query] as const,
  detail: (id: string) => ['products', 'detail', id] as const,
 },

 // Blog
 blog: {
  all: ['blog'] as const,
  list: (query: Record<string, unknown>) =>
   ['blog', 'list', query] as const,
  detail: (slug: string) => ['blog', 'detail', slug] as const,
 },

 // Cart
 cart: {
  all: ['cart'] as const,
 },

 // Orders
 orders: {
  all: ['orders'] as const,
  detail: (id: string) => ['orders', 'detail', id] as const,
 },

 // Search
 search: {
  results: (query: string) => ['search', query] as const,
 },
} as const