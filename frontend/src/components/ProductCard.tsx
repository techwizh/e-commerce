import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import type { Product } from '../types'
import { formatPrice } from '../utils/currency'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-surface-100 hover:shadow-lg hover:shadow-surface-900/5 transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-surface-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 bg-brand-500 text-white text-xs font-bold rounded-lg">
            {product.badge}
          </span>
        )}
        {product.originalPrice && (
          <span className="absolute top-3 right-3 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
            Sale
          </span>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs font-medium text-surface-800/50 uppercase tracking-wide mb-1">
          {product.category.replace('-', ' ')}
        </p>
        <h3 className="text-sm font-semibold text-surface-900 group-hover:text-brand-500 transition-colors line-clamp-1">
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mt-1.5">
          <Star className="w-3.5 h-3.5 fill-brand-400 text-brand-400" />
          <span className="text-xs font-medium text-surface-800">{product.rating}</span>
          <span className="text-xs text-surface-800/40">({product.reviewCount})</span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <span className="text-base font-bold text-surface-900">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-surface-800/40 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
