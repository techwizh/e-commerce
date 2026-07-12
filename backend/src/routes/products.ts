import { Router } from 'express'
import { readStore } from '../db.js'
import type { Product } from '../types.js'

const router = Router()

type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating'

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const result = [...products]

  switch (sort) {
    case 'price-low':
      return result.sort((a, b) => a.price - b.price)
    case 'price-high':
      return result.sort((a, b) => b.price - a.price)
    case 'rating':
      return result.sort((a, b) => b.rating - a.rating)
    default:
      return result.sort((a, b) => (b.badge ? 1 : 0) - (a.badge ? 1 : 0))
  }
}

router.get('/', (req, res) => {
  const store = readStore()
  const category = req.query.category as string | undefined
  const sort = (req.query.sort as SortOption) || 'featured'
  const badge = req.query.badge as string | undefined

  let products = store.products

  if (category) {
    products = products.filter((p) => p.category === category)
  }

  if (badge === 'true') {
    products = products.filter((p) => p.badge)
  }

  res.json(sortProducts(products, sort))
})

router.get('/:id', (req, res) => {
  const store = readStore()
  const product = store.products.find((p) => p.id === req.params.id)

  if (!product) {
    res.status(404).json({ error: 'Product not found' })
    return
  }

  res.json(product)
})

export default router
