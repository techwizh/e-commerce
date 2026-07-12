import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface-900">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1600&q=80"
          alt="Athletic shoes"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-900/90 via-surface-900/70 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
        <div className="max-w-2xl">
          <span className="inline-block px-3 py-1 rounded-full bg-brand-500/20 text-brand-400 text-xs font-semibold tracking-wide uppercase mb-6">
            New Collection 2026
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
            Gear Up.<br />
            <span className="text-brand-400">Go Further.</span>
          </h1>
          <p className="mt-6 text-lg text-surface-100/70 leading-relaxed max-w-lg">
            Premium sports shoes, sneakers, and athletic shirts engineered for performance. Find your edge.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors"
            >
              Shop Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/shop/sneakers"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              Explore Sneakers
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
