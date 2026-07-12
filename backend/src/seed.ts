import { readStore, writeStore } from './db.js'
import type { CategoryInfo, Product } from './types.js'

const categories: CategoryInfo[] = [
  {
    slug: 'sports-shoes',
    name: 'Sports Shoes',
    description: 'High-performance footwear built for training, running, and competition.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  },
  {
    slug: 'sneakers',
    name: 'Sneakers',
    description: 'Street-ready kicks that blend comfort, style, and everyday versatility.',
    image: 'https://images.unsplash.com/photo-1606107557195-0a29c4cd3b2b?w=800&q=80',
  },
  {
    slug: 'sports-shirts',
    name: 'Sports Shirts',
    description: 'Breathable athletic tops engineered for peak performance.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
  },
]

const imagePath = (file: string) => `/images/sneakers/${file}`

function sneakerFromImage(
  id: string,
  name: string,
  file: string,
  price: number,
  extra: Partial<Product> = {},
): Product {
  const image = imagePath(file)
  return {
    id,
    name,
    category: 'sneakers',
    price,
    image,
    images: [image],
    description: `${name} from Techwiz Kicks. Street-ready style with cushioned comfort for everyday wear.`,
    features: ['Premium build', 'Cushioned insole', 'Durable rubber outsole', 'Street-ready design'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: [{ name: 'Classic', hex: '#1e293b' }],
    rating: 4.6,
    reviewCount: 24,
    inStock: true,
    ...extra,
  }
}

const pinterestSneakers: Product[] = [
  sneakerFromImage('sn-005', 'Street Classic Low', 'sneaker-01.jfif', 8999),
  sneakerFromImage('sn-006', 'Urban Pulse Runner', 'sneaker-02.jfif', 10999),
  sneakerFromImage('sn-007', 'City Flex Sneaker', 'sneaker-03.jfif', 9999),
  sneakerFromImage('sn-008', 'Daily Drop Low', 'sneaker-04.jfif', 8499),
  sneakerFromImage('sn-009', 'Metro Glide', 'sneaker-05.jfif', 11999, { badge: 'New' }),
  sneakerFromImage('sn-010', 'Weekend Walk', 'sneaker-06.jfif', 9499),
  sneakerFromImage('sn-011', 'Corner Court', 'sneaker-07.jfif', 10499),
  sneakerFromImage('sn-012', 'Nike Street Classic', 'nike-classic.jfif', 13999, { badge: 'Best Seller' }),
  sneakerFromImage('sn-013', 'Jordan Retro 4', 'jordan-retro-4.jfif', 18999, { badge: 'Hot' }),
  sneakerFromImage('sn-014', 'Air Jordan 6 Retro', 'jordan-6-retro.jfif', 19999, { badge: 'New' }),
  sneakerFromImage('sn-015', 'Premium 3D Runner', 'premium-3d-sneaker.jfif', 15999),
]

const products: Product[] = [
  {
    id: 'ss-001',
    name: 'Velocity Pro Runner',
    category: 'sports-shoes',
    price: 16999,
    originalPrice: 20999,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
    ],
    description: 'Engineered for speed. The Velocity Pro features a lightweight mesh upper, responsive foam midsole, and carbon-fiber plate for explosive energy return on every stride.',
    features: ['Carbon-fiber plate', 'Breathable mesh upper', 'Responsive foam cushioning', 'Anti-slip rubber outsole'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: [
      { name: 'Fire Red', hex: '#dc2626' },
      { name: 'Midnight', hex: '#1e293b' },
    ],
    rating: 4.8,
    reviewCount: 342,
    badge: 'Best Seller',
    inStock: true,
  },
  {
    id: 'ss-002',
    name: 'TrailBlaze XT',
    category: 'sports-shoes',
    price: 19499,
    image: 'https://images.unsplash.com/photo-1606107557195-0a29c4cd3b2b?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1606107557195-0a29c4cd3b2b?w=600&q=80',
      'https://images.unsplash.com/photo-1605348532760-675e11be3a32?w=600&q=80',
    ],
    description: 'Conquer any terrain with the TrailBlaze XT. Rugged outsole lugs, waterproof membrane, and reinforced toe cap make this the ultimate off-road companion.',
    features: ['Waterproof membrane', 'Aggressive trail outsole', 'Rock plate protection', 'Gusseted tongue'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: [
      { name: 'Forest', hex: '#166534' },
      { name: 'Earth', hex: '#92400e' },
    ],
    rating: 4.6,
    reviewCount: 198,
    inStock: true,
  },
  {
    id: 'ss-003',
    name: 'CourtMaster Elite',
    category: 'sports-shoes',
    price: 15599,
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80'],
    description: 'Dominate the court with lateral support and a herringbone traction pattern. The CourtMaster Elite delivers stability for quick cuts and explosive jumps.',
    features: ['Lateral support cage', 'Herringbone traction', 'Zoom Air cushioning', 'Durable leather overlay'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: [
      { name: 'White/Blue', hex: '#3b82f6' },
      { name: 'Black/Gold', hex: '#ca8a04' },
    ],
    rating: 4.7,
    reviewCount: 156,
    badge: 'New',
    inStock: true,
  },
  {
    id: 'sn-001',
    name: 'Urban Flow 90',
    category: 'sneakers',
    price: 12999,
    originalPrice: 15600,
    image: 'https://images.unsplash.com/photo-1600185365926-3a8ce9ead475?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1600185365926-3a8ce9ead475?w=600&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
    ],
    description: 'A timeless silhouette reimagined for modern streets. Premium suede upper, padded collar, and a vulcanized sole deliver all-day comfort with effortless style.',
    features: ['Premium suede upper', 'Padded collar', 'Vulcanized rubber sole', 'Embroidered logo'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: [
      { name: 'Cream', hex: '#fef3c7' },
      { name: 'Navy', hex: '#1e3a5f' },
      { name: 'Olive', hex: '#4d7c0f' },
    ],
    rating: 4.9,
    reviewCount: 521,
    badge: 'Best Seller',
    inStock: true,
  },
  {
    id: 'sn-002',
    name: 'CloudStep Lite',
    category: 'sneakers',
    price: 11699,
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80'],
    description: 'Walk on air with our lightest sneaker yet. Knit upper adapts to your foot while the cloud-foam midsole absorbs impact for mile-after-mile comfort.',
    features: ['Adaptive knit upper', 'Cloud-foam midsole', 'Ultra-lightweight', 'Slip-on design'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: [
      { name: 'White', hex: '#f8fafc' },
      { name: 'Grey', hex: '#94a3b8' },
    ],
    rating: 4.5,
    reviewCount: 287,
    inStock: true,
  },
  {
    id: 'sn-003',
    name: 'Retro Dunk High',
    category: 'sneakers',
    price: 14300,
    image: 'https://images.unsplash.com/photo-1605348532760-675e11be3a32?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1605348532760-675e11be3a32?w=600&q=80'],
    description: 'Throwback basketball heritage meets contemporary flair. Full-grain leather, classic color blocking, and a padded high-top collar for iconic street style.',
    features: ['Full-grain leather', 'High-top collar', 'Classic color blocking', 'Perforated toe box'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: [
      { name: 'Bred', hex: '#dc2626' },
      { name: 'Royal', hex: '#2563eb' },
    ],
    rating: 4.8,
    reviewCount: 412,
    badge: 'Hot',
    inStock: true,
  },
  {
    id: 'sn-004',
    name: 'Slide Comfort',
    category: 'sneakers',
    price: 5999,
    image: 'https://images.unsplash.com/photo-1603487748691-775a6782f2f7?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1603487748691-775a6782f2f7?w=600&q=80'],
    description: 'Post-workout recovery starts here. Ergonomic footbed, soft EVA foam, and a textured strap deliver spa-level comfort for your off days.',
    features: ['Ergonomic footbed', 'EVA foam construction', 'Adjustable strap', 'Non-slip sole'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: [
      { name: 'Black', hex: '#0f172a' },
      { name: 'Sand', hex: '#d6d3d1' },
    ],
    rating: 4.4,
    reviewCount: 673,
    inStock: true,
  },
  {
    id: 'st-001',
    name: 'AeroFit Performance Tee',
    category: 'sports-shirts',
    price: 4499,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80',
    ],
    description: 'Stay cool under pressure. Moisture-wicking fabric, four-way stretch, and flatlock seams eliminate chafing so you can focus on your performance.',
    features: ['Moisture-wicking', 'Four-way stretch', 'Flatlock seams', 'Anti-odor treatment'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'White', hex: '#f8fafc' },
      { name: 'Black', hex: '#0f172a' },
      { name: 'Electric Blue', hex: '#0ea5e9' },
    ],
    rating: 4.7,
    reviewCount: 445,
    badge: 'Best Seller',
    inStock: true,
  },
  {
    id: 'st-002',
    name: 'Pro Compression Jersey',
    category: 'sports-shirts',
    price: 6499,
    originalPrice: 7799,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80'],
    description: 'Second-skin compression that boosts circulation and reduces muscle fatigue. Seamless construction and targeted ventilation zones keep you locked in.',
    features: ['Compression fit', 'Seamless construction', 'Targeted ventilation', 'UV protection UPF 50+'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Red', hex: '#dc2626' },
      { name: 'Navy', hex: '#1e3a5f' },
    ],
    rating: 4.6,
    reviewCount: 234,
    inStock: true,
  },
  {
    id: 'st-003',
    name: 'Trail Runner Tank',
    category: 'sports-shirts',
    price: 3899,
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&q=80'],
    description: 'Lightweight and breathable for long trail runs. Mesh side panels, reflective details, and a relaxed athletic cut keep you visible and comfortable.',
    features: ['Mesh side panels', 'Reflective details', 'Relaxed athletic cut', 'Quick-dry fabric'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Lime', hex: '#84cc16' },
      { name: 'Charcoal', hex: '#475569' },
    ],
    rating: 4.5,
    reviewCount: 178,
    badge: 'New',
    inStock: true,
  },
  {
    id: 'st-004',
    name: 'Elite Polo Sport',
    category: 'sports-shirts',
    price: 7149,
    image: 'https://images.unsplash.com/photo-1625917830212-27a2fbf85403?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1625917830212-27a2fbf85403?w=600&q=80'],
    description: 'Elevate your game-day look. Premium pique fabric, three-button placket, and a structured collar deliver polished athletic style on and off the field.',
    features: ['Premium pique fabric', 'Structured collar', 'Three-button placket', 'Side vents'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'White', hex: '#f8fafc' },
      { name: 'Forest Green', hex: '#166534' },
      { name: 'Burgundy', hex: '#881337' },
    ],
    rating: 4.8,
    reviewCount: 312,
    inStock: true,
  },
  {
    id: 'ss-004',
    name: 'PowerLift Trainer',
    category: 'sports-shoes',
    price: 18199,
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80',
    images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80'],
    description: 'Built for the gym floor. A wide stable base, elevated heel, and reinforced upper provide the support you need for squats, deadlifts, and Olympic lifts.',
    features: ['Wide stable base', 'Elevated heel (18mm)', 'Reinforced upper', 'Non-compressible sole'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    colors: [
      { name: 'Black/Red', hex: '#0f172a' },
      { name: 'Grey', hex: '#64748b' },
    ],
    rating: 4.7,
    reviewCount: 89,
    inStock: true,
  },
  ...pinterestSneakers,
]

export function seedDatabase(force = false): number {
  const store = readStore()
  const allProducts = products

  if (!force && store.products.length > 0) {
    const existingIds = new Set(store.products.map((p) => p.id))
    const newProducts = allProducts.filter((p) => !existingIds.has(p.id))

    if (newProducts.length > 0) {
      store.products.push(...newProducts)
      writeStore(store)
      console.log(`Added ${newProducts.length} new products to the store.`)
      return newProducts.length
    }

    console.log('Database already seeded. Use --force to reseed.')
    return 0
  }

  writeStore({
    categories,
    products: allProducts,
    orders: store.orders,
  })

  console.log(`Seeded ${categories.length} categories and ${allProducts.length} products.`)
  return allProducts.length
}

if (process.argv[1]?.includes('seed')) {
  const force = process.argv.includes('--force')
  seedDatabase(force)
}
