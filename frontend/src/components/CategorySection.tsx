import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { fetchCategories } from '../api/client'
import type { CategoryInfo } from '../types'

export default function CategorySection() {
  const [categories, setCategories] = useState<CategoryInfo[]>([])

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {})
  }, [])

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-surface-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="mt-2 text-surface-800/60">Find exactly what you need for your sport.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[4/5] sm:aspect-[3/4]"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-900/80 via-surface-900/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-bold text-white">{cat.name}</h3>
                <p className="text-sm text-white/70 mt-1 line-clamp-2">{cat.description}</p>
                <span className="inline-flex items-center gap-1 mt-3 text-sm font-semibold text-brand-400 group-hover:gap-2 transition-all">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
