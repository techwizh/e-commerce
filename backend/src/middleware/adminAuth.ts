import type { Request, Response, NextFunction } from 'express'
import { ADMIN_PASSWORD } from '../config.js'

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const password = String(req.headers['x-admin-password'] ?? '').trim()

  if (!password || !ADMIN_PASSWORD || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  next()
}
