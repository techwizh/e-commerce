import { Router } from 'express'
import { z } from 'zod'
import { readStore, writeStore } from '../db.js'
import { requireAdmin } from '../middleware/adminAuth.js'
import { ADMIN_PASSWORD } from '../config.js'
import type { Product } from '../types.js'

const router = Router()

const colorSchema = z.object({
  name: z.string().min(1),
  hex: z.string().min(1),
})

const imageSchema = z.string().refine(
  (value) => value.startsWith('http') || value.startsWith('/'),
  { message: 'Image must be a URL or path' },
)

const productSchema = z.object({
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  category: z.enum(['sports-shoes', 'sneakers', 'sports-shirts']),
  price: z.number().positive(),
  originalPrice: z.number().positive().optional(),
  image: imageSchema,
  images: z.array(imageSchema).min(1),
  description: z.string().min(1),
  features: z.array(z.string()).min(1),
  sizes: z.array(z.string()).min(1),
  colors: z.array(colorSchema).min(1),
  rating: z.number().min(0).max(5).default(4.5),
  reviewCount: z.number().int().min(0).default(0),
  badge: z.string().optional(),
  inStock: z.boolean().default(true),
})

function generateId(category: string, products: Product[]): string {
  const prefixes: Record<string, string> = {
    'sports-shoes': 'ss',
    sneakers: 'sn',
    'sports-shirts': 'st',
  }
  const prefix = prefixes[category] || 'pd'
  const existing = products.filter((p) => p.id.startsWith(`${prefix}-`)).length
  return `${prefix}-${String(existing + 1).padStart(3, '0')}`
}

router.post('/login', (req, res) => {
  const password = String(req.body?.password ?? '').trim()

  if (!password || !ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Invalid password' })
    return
  }

  res.json({ ok: true })
})

router.use(requireAdmin)

router.get('/products', (_req, res) => {
  const store = readStore()
  res.json(store.products)
})

router.post('/products', (req, res) => {
  const parsed = productSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid product data', details: parsed.error.flatten() })
    return
  }

  const store = readStore()
  const data = parsed.data
  const id = data.id ?? generateId(data.category, store.products)

  if (store.products.some((p) => p.id === id)) {
    res.status(409).json({ error: `Product ID already exists: ${id}` })
    return
  }

  const product: Product = { ...data, id }
  store.products.push(product)
  writeStore(store)

  res.status(201).json(product)
})

router.put('/products/:id', (req, res) => {
  const parsed = productSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid product data', details: parsed.error.flatten() })
    return
  }

  const store = readStore()
  const index = store.products.findIndex((p) => p.id === req.params.id)

  if (index === -1) {
    res.status(404).json({ error: 'Product not found' })
    return
  }

  const product: Product = { ...parsed.data, id: req.params.id }
  store.products[index] = product
  writeStore(store)

  res.json(product)
})

router.delete('/products/:id', (req, res) => {
  const store = readStore()
  const index = store.products.findIndex((p) => p.id === req.params.id)

  if (index === -1) {
    res.status(404).json({ error: 'Product not found' })
    return
  }

  const [removed] = store.products.splice(index, 1)
  writeStore(store)

  res.json(removed)
})

export default router
