import type { StoreConfig } from './types.js'

export const PORT = Number(process.env.PORT) || 3001

export const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || '').trim()

export const storeConfig: StoreConfig = {
  freeShippingThreshold: 10000,
  shippingCost: 500,
  currency: 'KES',
}
