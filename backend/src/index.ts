import express from 'express'
import cors from 'cors'
import { PORT } from './config.js'
import { seedDatabase } from './seed.js'
import configRoutes from './routes/config.js'
import categoryRoutes from './routes/categories.js'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'

seedDatabase()

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', configRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' })
})

app.listen(PORT, () => {
  console.log(`Techwiz Kicks API running at http://localhost:${PORT}`)
})
