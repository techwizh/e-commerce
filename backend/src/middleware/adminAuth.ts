import type { Request, Response, NextFunction } from 'express'
import { ADMIN_PASSWORD } from '../config.js'

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const password = req.headers['x-admin-password']

  if (!password || password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  next()
}
