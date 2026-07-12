import type { CategoryInfo, Product } from '../types'

const API_ROOT = import.meta.env.VITE_API_URL || ''
const API_BASE = API_ROOT ? `${API_ROOT.replace(/\/$/, '')}/api` : '/api'

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(error.error || 'Request failed')
  }
  return res.json()
}

export interface StoreConfig {
  freeShippingThreshold: number
  shippingCost: number
  currency: string
}

export interface CreateOrderPayload {
  customer: {
    firstName: string
    lastName: string
    email: string
    address: string
    city: string
    zip: string
  }
  items: {
    productId: string
    quantity: number
    size: string
    color: string
  }[]
}

export interface CreateOrderResponse {
  orderId: string
  status: string
  subtotal: number
  shipping: number
  total: number
  createdAt: string
}

export type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating'

export function fetchConfig(): Promise<StoreConfig> {
  return request<StoreConfig>('/config')
}

export function fetchCategories(): Promise<CategoryInfo[]> {
  return request<CategoryInfo[]>('/categories')
}

export function fetchCategory(slug: string): Promise<CategoryInfo> {
  return request<CategoryInfo>(`/categories/${slug}`)
}

export function fetchProducts(options?: {
  category?: string
  sort?: SortOption
  badge?: boolean
}): Promise<Product[]> {
  const params = new URLSearchParams()
  if (options?.category) params.set('category', options.category)
  if (options?.sort) params.set('sort', options.sort)
  if (options?.badge) params.set('badge', 'true')
  const query = params.toString()
  return request<Product[]>(`/products${query ? `?${query}` : ''}`)
}

export function fetchProduct(id: string): Promise<Product> {
  return request<Product>(`/products/${id}`)
}

export async function createOrder(payload: CreateOrderPayload): Promise<CreateOrderResponse> {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(error.error || 'Failed to place order')
  }

  return res.json()
}
