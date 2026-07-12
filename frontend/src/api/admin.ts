import type { Product } from '../types'

const API_ROOT = import.meta.env.VITE_API_URL || ''
const API_BASE = API_ROOT ? `${API_ROOT.replace(/\/$/, '')}/api` : '/api'

const ADMIN_KEY = 'techwiz-admin-password'

export function getAdminPassword(): string | null {
  return sessionStorage.getItem(ADMIN_KEY)
}

export function setAdminPassword(password: string) {
  sessionStorage.setItem(ADMIN_KEY, password)
}

export function clearAdminPassword() {
  sessionStorage.removeItem(ADMIN_KEY)
}

async function adminRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const password = getAdminPassword()
  if (!password) throw new Error('Not authenticated')

  const res = await fetch(`${API_BASE}/admin${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Password': password,
      ...options.headers,
    },
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(error.error || 'Request failed')
  }

  return res.json()
}

export async function adminLogin(password: string): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Invalid password' }))
    throw new Error(error.error || 'Invalid password')
  }

  setAdminPassword(password)
}

export type ProductInput = Omit<Product, 'id'> & { id?: string }

export function fetchAdminProducts(): Promise<Product[]> {
  return adminRequest<Product[]>('/products')
}

export function createProduct(product: ProductInput): Promise<Product> {
  return adminRequest<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(product),
  })
}

export function updateProduct(id: string, product: ProductInput): Promise<Product> {
  return adminRequest<Product>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  })
}

export function deleteProduct(id: string): Promise<Product> {
  return adminRequest<Product>(`/products/${id}`, { method: 'DELETE' })
}
