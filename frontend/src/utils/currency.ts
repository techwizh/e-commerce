export const FREE_SHIPPING_THRESHOLD = 10000
export const SHIPPING_COST = 500

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(price)
}
