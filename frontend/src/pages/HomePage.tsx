import { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import CategorySection from '../components/CategorySection'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { Link } from 'react-router-dom'
import { ArrowRight, Truck, Shield, RefreshCw } from 'lucide-react'
import { fetchProducts } from '../api/client'
import { formatPrice } from '../utils/currency'
import { useStoreConfig } from '../hooks/useStoreConfig'
import type { Product } from '../types'

export default function HomePage() {
  const config = useStoreConfig()
  const [featured, setFeatured] = useState<Product[]>([])
  const [bestSellers, setBestSellers] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchProducts({ badge: true }),
      fetchProducts({ sort: 'rating' }),
    ])
      .then(([featuredProducts, ratedProducts]) => {
        setFeatured(featuredProducts.slice(0, 4))
        setBestSellers(
          [...ratedProducts].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 4)
        )
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Hero />

      <section className="py-12 bg-white border-b border-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: Truck,
                title: 'Free Shipping',
                desc: `On orders over ${formatPrice(config.freeShippingThreshold)}`,
              },
              { icon: Shield, title: 'Secure Payment', desc: '100% protected checkout' },
              { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-brand-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-surface-900">{title}</h3>
                  <p className="text-sm text-surface-800/60">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CategorySection />

      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-surface-900 tracking-tight">
                Featured Products
              </h2>
              <p className="mt-2 text-surface-800/60">Hand-picked favorites from our latest drops.</p>
            </div>
            <Link
              to="/shop"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-brand-500 hover:text-brand-600 transition-colors"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-surface-900 tracking-tight">
                Best Sellers
              </h2>
              <p className="mt-2 text-surface-800/60">Loved by athletes worldwide.</p>
            </div>
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {bestSellers.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 sm:py-20 bg-surface-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Ready to Level Up?
          </h2>
          <p className="mt-3 text-surface-100/60 max-w-md mx-auto">
            Join thousands of athletes who trust Techwiz Kicks for their performance gear.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 mt-8 px-8 py-3.5 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors"
          >
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
