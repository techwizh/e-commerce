import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/currency'
import { useStoreConfig } from '../hooks/useStoreConfig'

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart()
  const config = useStoreConfig()
  const shipping = subtotal >= config.freeShippingThreshold ? 0 : config.shippingCost
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-surface-100 flex items-center justify-center mb-6">
          <ShoppingBag className="w-8 h-8 text-surface-800/40" />
        </div>
        <h1 className="text-2xl font-bold text-surface-900">Your cart is empty</h1>
        <p className="mt-2 text-surface-800/60">Looks like you haven't added anything yet.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors"
        >
          Start Shopping <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <h1 className="text-3xl font-black text-surface-900 tracking-tight mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.size}-${item.color}`}
              className="flex gap-4 p-4 bg-white rounded-2xl border border-surface-100"
            >
              <Link to={`/product/${item.product.id}`} className="shrink-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-24 h-24 rounded-xl object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${item.product.id}`}
                  className="text-sm font-semibold text-surface-900 hover:text-brand-500 transition-colors line-clamp-1"
                >
                  {item.product.name}
                </Link>
                <p className="text-xs text-surface-800/50 mt-0.5">
                  Size: {item.size} &middot; Color: {item.color}
                </p>
                <p className="text-sm font-bold text-surface-900 mt-2">
                  {formatPrice(item.product.price)}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="inline-flex items-center border border-surface-100 rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)
                      }
                      className="p-1.5 hover:bg-surface-50 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)
                      }
                      className="p-1.5 hover:bg-surface-50 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id, item.size, item.color)}
                    className="p-2 text-surface-800/40 hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-surface-100 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-surface-900 mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-surface-800/60">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-800/60">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? 'Free' : formatPrice(shipping)}
                </span>
              </div>
              {subtotal < config.freeShippingThreshold && (
                <p className="text-xs text-brand-500">
                  Add {formatPrice(config.freeShippingThreshold - subtotal)} more for free shipping
                </p>
              )}
              <div className="border-t border-surface-100 pt-3 flex justify-between">
                <span className="font-semibold text-surface-900">Total</span>
                <span className="font-bold text-lg">{formatPrice(total)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
