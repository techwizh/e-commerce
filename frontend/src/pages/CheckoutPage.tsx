import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ArrowLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { createOrder } from '../api/client'
import { formatPrice } from '../utils/currency'
import { useStoreConfig } from '../hooks/useStoreConfig'

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const config = useStoreConfig()
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderId, setOrderId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })

  const shipping = subtotal >= config.freeShippingThreshold ? 0 : config.shippingCost
  const total = subtotal + shipping

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const result = await createOrder({
        customer: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          address: form.address,
          city: form.city,
          zip: form.zip,
        },
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
      })

      setOrderId(result.orderId)
      setOrderPlaced(true)
      clearCart()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order')
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Nothing to checkout</h1>
        <Link to="/shop" className="mt-4 inline-block text-brand-500 font-medium">
          Go shopping
        </Link>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-black text-surface-900">Order Placed!</h1>
        <p className="mt-3 text-surface-800/60">
          Thank you for your order. A confirmation email will be sent to {form.email}.
        </p>
        {orderId && (
          <p className="mt-2 text-sm text-surface-800/50">
            Order ID: <span className="font-mono">{orderId.slice(0, 8)}</span>
          </p>
        )}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link
        to="/cart"
        className="inline-flex items-center gap-1 text-sm font-medium text-surface-800/60 hover:text-brand-500 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <h1 className="text-3xl font-black text-surface-900 tracking-tight mb-8">Checkout</h1>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-2xl border border-surface-100 p-6">
            <h2 className="text-lg font-bold text-surface-900 mb-4">Shipping Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'firstName', label: 'First Name', placeholder: 'John' },
                { name: 'lastName', label: 'Last Name', placeholder: 'Doe' },
                { name: 'email', label: 'Email', placeholder: 'john@example.com', type: 'email', colSpan: true },
                { name: 'address', label: 'Address', placeholder: '123 Main St', colSpan: true },
                { name: 'city', label: 'City', placeholder: 'Nairobi' },
                { name: 'zip', label: 'Postal Code', placeholder: '00100' },
              ].map((field) => (
                <div key={field.name} className={field.colSpan ? 'sm:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-surface-800 mb-1.5">
                    {field.label}
                  </label>
                  <input
                    type={field.type ?? 'text'}
                    name={field.name}
                    value={form[field.name as keyof typeof form]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-surface-100 p-6">
            <h2 className="text-lg font-bold text-surface-900 mb-4">Payment</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-surface-800 mb-1.5">Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={form.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-800 mb-1.5">Expiry</label>
                <input
                  type="text"
                  name="expiry"
                  value={form.expiry}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-800 mb-1.5">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={form.cvv}
                  onChange={handleChange}
                  placeholder="123"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                />
              </div>
            </div>
            <p className="text-xs text-surface-800/40 mt-3">
              This is a demo checkout. No real payment will be processed.
            </p>
          </section>
        </div>

        <div>
          <div className="bg-white rounded-2xl border border-surface-100 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-surface-900 mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-3">
                  <img
                    src={item.product.image}
                    alt=""
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                    <p className="text-xs text-surface-800/50">
                      {item.size} / {item.color} x{item.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-medium shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-surface-100 mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-surface-800/60">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-surface-800/60">Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full px-6 py-3.5 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors disabled:opacity-60"
            >
              {submitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
