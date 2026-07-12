import { Router } from 'express'
import { readStore } from '../db.js'

const router = Router()

router.get('/', (_req, res) => {
  const store = readStore()
  res.json(store.categories)
})

router.get('/:slug', (req, res) => {
  const store = readStore()
  const category = store.categories.find((c) => c.slug === req.params.slug)

  if (!category) {
    res.status(404).json({ error: 'Category not found' })
    return
  }

  res.json(category)
})

export default router
