export type Category = 'sports-shoes' | 'sneakers' | 'sports-shirts'

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
  colors: { name: string; hex: string }[]
  rating: number
  reviewCount: number
  badge?: string
  inStock: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  size: string
  color: string
}

export interface CategoryInfo {
  slug: Category
  name: string
  description: string
  image: string
}
