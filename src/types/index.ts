export interface Address {
 id: string;
 street: string;
 city: string;
 state: string;
 country: string;
 isDefault: boolean;
 createdAt: string;
 updatedAt: string;
}

export type User = UserProfile;

export interface UserProfile {
 id: string;
 firstName: string;
 lastName: string;
 email: string;
 phone: string;
 role: 'ADMIN' | 'CUSTOMER';
 addresses: Address[];
 createdAt: string;
 updatedAt: string;
}

export interface ProductVariant {
 id: string;
 size: string;
 color: string;
 price: number;
 inventory: number;
}

export interface CartItem {
 id: string;
 product: {
  id: string;
  name: string;
  basePrice: number;
 };
 variant?: ProductVariant;
 quantity: number;
}

export interface Cart {
 id: string;
 items: CartItem[];
 createdAt: string;
 updatedAt: string;
}

export interface AuthResponse {
 accessToken: string;
 user: UserProfile;
}

export interface ApiError {
 message: string;
 statusCode?: number;
 errors?: Record<string, string>;
}

export interface ProductImage {
 id?: string;
 url: string;
 altText: string;
}

export interface ProductSummary {
 id: string;
 name: string;
 slug: string;
 basePrice: number;
 images: ProductImage[];
}

export interface Product extends ProductSummary {
 description: string;
 category: {
  id: string;
  name: string;
 };
 variants: ProductVariant[];
 images: ProductImage[];
}

export interface BlogTag {
 id: string;
 name: string;
 slug?: string;
}

export interface BlogPostSummary {
 id: string;
 title: string;
 slug: string;
 excerpt: string;
 createdAt: string;
 tags: BlogTag[];
 status?: 'PUBLISHED' | 'DRAFT';
}

export interface BlogPost extends BlogPostSummary {
 content: string;
 status: 'PUBLISHED' | 'DRAFT';
 updatedAt: string;
}

export interface SuccessResponse {
 message: string;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
 id: string;
 product: {
  id: string;
  name: string;
 };
 variant?: {
  size: string;
  color: string;
 };
 quantity: number;
 price: number;
}

export interface Order {
 id: string;
 status: OrderStatus;
 totalAmount: number;
 shippingAddress: Address;
 items: OrderItem[];
 createdAt: string;
 updatedAt: string;
}

export interface OrderSummary {
 id: string;
 status: OrderStatus;
 totalAmount: number;
 createdAt: string;
}

export interface PaginatedResponse<T> {
 data: T[];
 meta: {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
 };
}

export interface InitializePaymentResponse {
 status: string;
 reference: string;
 authorizationUrl: string;
}

export interface VerifyPaymentResponse {
 status: string;
 reference: string;
 message: string;
 success: boolean;
 orderId: string;
 // order: {
 //  id: string;
 // };
}

export interface SearchResults {
 products: ProductSummary[];
 blogPosts: BlogPostSummary[];
}
