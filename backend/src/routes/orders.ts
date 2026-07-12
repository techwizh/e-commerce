import { Router } from 'express'
import { z } from 'zod'
import { v4 as uuidv4 } from 'uuid'
import { readStore, writeStore } from '../db.js'
import { storeConfig } from '../config.js'
import type { Order, OrderItem } from '../types.js'

const router = Router()

const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1),
  size: z.string().min(1),
  color: z.string().min(1),
})

const createOrderSchema = z.object({
  customer: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    address: z.string().min(1),
    city: z.string().min(1),
    zip: z.string().min(1),
  }),
  items: z.array(orderItemSchema).min(1),
})

router.post('/', (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid order data', details: parsed.error.flatten() })
    return
  }

  const store = readStore()
  const { customer, items } = parsed.data
  const orderItems: OrderItem[] = []
  let subtotal = 0

  for (const item of items) {
    const product = store.products.find((p) => p.id === item.productId)

    if (!product) {
      res.status(400).json({ error: `Product not found: ${item.productId}` })
      return
    }

    if (!product.inStock) {
      res.status(400).json({ error: `Product out of stock: ${product.name}` })
      return
    }

    if (!product.sizes.includes(item.size)) {
      res.status(400).json({ error: `Invalid size for ${product.name}` })
      return
    }

    const lineTotal = product.price * item.quantity
    subtotal += lineTotal

    orderItems.push({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
    })
  }

  const shipping =
    subtotal >= storeConfig.freeShippingThreshold ? 0 : storeConfig.shippingCost

  const order: Order = {
    id: uuidv4(),
    status: 'confirmed',
    customer,
    items: orderItems,
    subtotal,
    shipping,
    total: subtotal + shipping,
    createdAt: new Date().toISOString(),
  }

  store.orders.unshift(order)
  writeStore(store)

  res.status(201).json({
    orderId: order.id,
    status: order.status,
    subtotal: order.subtotal,
    shipping: order.shipping,
    total: order.total,
    createdAt: order.createdAt,
  })
})

router.get('/:id', (req, res) => {
  const store = readStore()
  const order = store.orders.find((o) => o.id === req.params.id)

  if (!order) {
    res.status(404).json({ error: 'Order not found' })
    return
  }

  res.json(order)
})

export default router
