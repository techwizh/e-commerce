import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchCategories } from '../api/client'
import type { CategoryInfo } from '../types'

export default function Footer() {
  const [categories, setCategories] = useState<CategoryInfo[]>([])

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {})
  }, [])

  return (
    <footer className="bg-surface-900 text-surface-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-xs">TK</span>
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Techwiz<span className="text-brand-400"> Kicks</span>
              </span>
            </div>
            <p className="text-sm text-surface-100/60 leading-relaxed">
              Premium sports footwear and athletic wear for athletes who demand the best.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop" className="text-sm text-surface-100/60 hover:text-brand-400 transition-colors">
                  All Products
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    to={`/shop/${cat.slug}`}
                    className="text-sm text-surface-100/60 hover:text-brand-400 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-surface-100/60">Shipping Info</span></li>
              <li><span className="text-sm text-surface-100/60">Returns & Exchanges</span></li>
              <li><span className="text-sm text-surface-100/60">Size Guide</span></li>
              <li><span className="text-sm text-surface-100/60">Contact Us</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Newsletter</h4>
            <p className="text-sm text-surface-100/60 mb-3">Get 10% off your first order.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 rounded-lg bg-surface-800 border border-surface-800 text-sm text-white placeholder:text-surface-100/40 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <button className="px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-lg hover:bg-brand-600 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-surface-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-surface-100/40">&copy; 2026 Techwiz Kicks. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="text-xs text-surface-100/40">Privacy Policy</span>
            <span className="text-xs text-surface-100/40">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
