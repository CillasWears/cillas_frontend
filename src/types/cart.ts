export interface CartItem {
 id: string
 product: {
  id: string
  name: string
  basePrice: number
 }
 variant?: {
  id: string
  size?: string
  color?: string
  price: number
 }
 quantity: number
}

export interface Cart {
 items: CartItem[]
}