import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, Search, Menu, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { fetchCategories } from '../api/client'
import type { CategoryInfo } from '../types'

export default function Header() {
  const { itemCount } = useCart()
  const [categories, setCategories] = useState<CategoryInfo[]>([])
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {})
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-surface-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center group-hover:bg-brand-600 transition-colors">
              <span className="text-white font-black text-xs">TK</span>
            </div>
            <span className="text-xl font-black tracking-tight text-surface-900">
              Techwiz<span className="text-brand-500"> Kicks</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/shop" className="text-sm font-medium text-surface-800 hover:text-brand-500 transition-colors">
              Shop All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/shop/${cat.slug}`}
                className="text-sm font-medium text-surface-800 hover:text-brand-500 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-surface-800" />
            </button>
            <Link
              to="/cart"
              className="relative p-2 rounded-lg hover:bg-surface-100 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 text-surface-800" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-brand-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-surface-100 transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="pb-4">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2.5 rounded-xl border border-surface-100 bg-surface-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent text-sm"
              autoFocus
            />
          </div>
        )}
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-surface-100 bg-white">
          <nav className="flex flex-col px-4 py-3 gap-1">
            <Link
              to="/shop"
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-surface-50"
            >
              Shop All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                to={`/shop/${cat.slug}`}
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-surface-50"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
