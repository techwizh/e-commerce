import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Star, Minus, Plus, ShoppingBag, Check, ChevronLeft } from 'lucide-react'
import { fetchProduct } from '../api/client'
import { formatPrice } from '../utils/currency'
import { useCart } from '../context/CartContext'
import LoadingSpinner from '../components/LoadingSpinner'
import type { Product } from '../types'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(false)
    fetchProduct(id)
      .then((p) => {
        setProduct(p)
        setSelectedColor(p.colors[0]?.name ?? '')
        setSelectedSize('')
        setActiveImage(0)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner />

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-surface-900">Product not found</h1>
        <Link to="/shop" className="mt-4 inline-block text-brand-500 font-medium hover:text-brand-600">
          Back to shop
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!selectedSize) return
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize, selectedColor)
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link
        to="/shop"
        className="inline-flex items-center gap-1 text-sm font-medium text-surface-800/60 hover:text-brand-500 transition-colors mb-8"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-surface-50 border border-surface-100">
            <img
              src={product.images[activeImage] ?? product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                    activeImage === i ? 'border-brand-500' : 'border-surface-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.badge && (
            <span className="inline-block px-2.5 py-1 bg-brand-500 text-white text-xs font-bold rounded-lg mb-3">
              {product.badge}
            </span>
          )}
          <p className="text-sm font-medium text-surface-800/50 uppercase tracking-wide">
            {product.category.replace('-', ' ')}
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-surface-900 tracking-tight mt-1">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'fill-brand-400 text-brand-400'
                      : 'text-surface-100'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-sm text-surface-800/40">({product.reviewCount} reviews)</span>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <span className="text-2xl font-bold text-surface-900">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="text-lg text-surface-800/40 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="mt-6 text-surface-800/70 leading-relaxed">{product.description}</p>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-surface-900 mb-3">Color</h3>
            <div className="flex gap-2">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    selectedColor === c.name
                      ? 'border-brand-500 ring-2 ring-brand-500/30'
                      : 'border-surface-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
            <p className="text-xs text-surface-800/50 mt-1">{selectedColor}</p>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-surface-900 mb-3">Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[3rem] px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${
                    selectedSize === size
                      ? 'bg-surface-900 text-white border-surface-900'
                      : 'bg-white text-surface-800 border-surface-100 hover:border-surface-800/30'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-surface-900 mb-3">Quantity</h3>
            <div className="inline-flex items-center border border-surface-100 rounded-xl">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2.5 hover:bg-surface-50 transition-colors rounded-l-xl"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2.5 hover:bg-surface-50 transition-colors rounded-r-xl"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className={`mt-8 w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all ${
              added
                ? 'bg-green-500 text-white'
                : selectedSize
                  ? 'bg-brand-500 text-white hover:bg-brand-600'
                  : 'bg-surface-100 text-surface-800/40 cursor-not-allowed'
            }`}
          >
            {added ? (
              <>
                <Check className="w-5 h-5" /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" /> Add to Cart
              </>
            )}
          </button>
          {!selectedSize && (
            <p className="text-xs text-red-500 mt-2 text-center">Please select a size</p>
          )}

          <div className="mt-8 border-t border-surface-100 pt-6">
            <h3 className="text-sm font-semibold text-surface-900 mb-3">Features</h3>
            <ul className="space-y-2">
              {product.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-surface-800/70">
                  <Check className="w-4 h-4 text-brand-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
