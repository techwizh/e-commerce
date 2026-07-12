import { Router } from 'express'
import { readStore } from '../db.js'
import { storeConfig } from '../config.js'

const router = Router()

router.get('/config', (_req, res) => {
  res.json(storeConfig)
})

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default router
