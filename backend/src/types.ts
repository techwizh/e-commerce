export type Category = 'sports-shoes' | 'sneakers' | 'sports-shirts'

export interface ProductColor {
  name: string
  hex: string
}

export interface Product {
  id: string
  name: string
  category: Category
  price: number
  originalPrice?: number
  image: string
  images: string[]
  description: string
  features: string[]
  sizes: string[]
  colors: ProductColor[]
  rating: number
  reviewCount: number
  badge?: string
  inStock: boolean
}

export interface CategoryInfo {
  slug: Category
  name: string
  description: string
  image: string
}

export interface OrderItem {
  productId: string
  productName: string
  price: number
  quantity: number
  size: string
  color: string
}

export interface Order {
  id: string
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered'
  customer: {
    firstName: string
    lastName: string
    email: string
    address: string
    city: string
    zip: string
  }
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  createdAt: string
}

export interface Store {
  categories: CategoryInfo[]
  products: Product[]
  orders: Order[]
}

export interface StoreConfig {
  freeShippingThreshold: number
  shippingCost: number
  currency: string
}
