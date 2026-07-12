import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, LogOut, Package, Lock } from 'lucide-react'
import type { Product, Category } from '../types'
import { formatPrice } from '../utils/currency'
import {
  adminLogin,
  fetchAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminPassword,
  clearAdminPassword,
  type ProductInput,
} from '../api/admin'

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'sports-shoes', label: 'Sports Shoes' },
  { value: 'sneakers', label: 'Sneakers' },
  { value: 'sports-shirts', label: 'Sports Shirts' },
]

const emptyForm: ProductInput = {
  name: '',
  category: 'sports-shoes',
  price: 0,
  image: '',
  images: [],
  description: '',
  features: [],
  sizes: [],
  colors: [],
  rating: 4.5,
  reviewCount: 0,
  inStock: true,
}

function parseList(value: string): string[] {
  return value.split(',').map((s) => s.trim()).filter(Boolean)
}

function parseColors(value: string): { name: string; hex: string }[] {
  return parseList(value).map((pair) => {
    const [name, hex] = pair.split(':').map((s) => s.trim())
    return { name: name || 'Default', hex: hex || '#000000' }
  })
}

function productToForm(product: Product): ProductInput & { featuresText: string; sizesText: string; colorsText: string } {
  return {
    ...product,
    featuresText: product.features.join(', '),
    sizesText: product.sizes.join(', '),
    colorsText: product.colors.map((c) => `${c.name}:${c.hex}`).join(', '),
  }
}

type FormState = ProductInput & {
  featuresText: string
  sizesText: string
  colorsText: string
  originalPriceText: string
  badgeText: string
}

function emptyFormState(): FormState {
  return {
    ...emptyForm,
    featuresText: '',
    sizesText: '',
    colorsText: '',
    originalPriceText: '',
    badgeText: '',
  }
}

function formToProduct(form: FormState): ProductInput {
  const images = form.image ? [form.image, ...form.images.filter((i) => i !== form.image)] : form.images
  return {
    id: form.id,
    name: form.name,
    category: form.category,
    price: Number(form.price),
    originalPrice: form.originalPriceText ? Number(form.originalPriceText) : undefined,
    image: form.image,
    images: images.length ? images : form.image ? [form.image] : [],
    description: form.description,
    features: parseList(form.featuresText),
    sizes: parseList(form.sizesText),
    colors: parseColors(form.colorsText),
    rating: Number(form.rating),
    reviewCount: Number(form.reviewCount),
    badge: form.badgeText || undefined,
    inStock: form.inStock,
  }
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(!!getAdminPassword())
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyFormState())
  const [saving, setSaving] = useState(false)

  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setProducts(await fetchAdminProducts())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
      if (err instanceof Error && err.message === 'Unauthorized') {
        clearAdminPassword()
        setAuthed(false)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authed) loadProducts()
  }, [authed, loadProducts])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    try {
      await adminLogin(password)
      setAuthed(true)
    } catch (err) {
      setLoginError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  const handleLogout = () => {
    clearAdminPassword()
    setAuthed(false)
    setPassword('')
  }

  const openAdd = () => {
    setEditingId(null)
    setForm(emptyFormState())
    setShowForm(true)
  }

  const openEdit = (product: Product) => {
    const f = productToForm(product)
    setEditingId(product.id)
    setForm({
      ...f,
      originalPriceText: product.originalPrice?.toString() ?? '',
      badgeText: product.badge ?? '',
    })
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const data = formToProduct(form)
      if (editingId) {
        await updateProduct(editingId, data)
      } else {
        await createProduct(data)
      }
      setShowForm(false)
      await loadProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    try {
      await deleteProduct(id)
      await loadProducts()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-white rounded-2xl border border-surface-100 p-8 shadow-sm">
          <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center mb-6">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-surface-900">Admin Login</h1>
          <p className="text-sm text-surface-800/60 mt-2">Techwiz Kicks product management</p>

          {loginError && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{loginError}</p>
          )}

          <label className="block mt-6 text-sm font-medium text-surface-800">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full px-4 py-2.5 rounded-xl border border-surface-100 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            required
            autoFocus
          />

          <button
            type="submit"
            className="mt-6 w-full py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-colors"
          >
            Sign In
          </button>

          <Link to="/" className="block text-center text-sm text-surface-800/60 hover:text-brand-500 mt-4">
            Back to store
          </Link>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <header className="bg-white border-b border-surface-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-surface-900">Admin Panel</h1>
              <p className="text-xs text-surface-800/50">Manage products</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-surface-800/60 hover:text-brand-500">View store</Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-sm text-surface-800/60 hover:text-red-500"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 text-sm">{error}</div>
        )}

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-surface-800/60">{products.length} products</p>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-500 text-white text-sm font-semibold rounded-xl hover:bg-brand-600 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {loading ? (
          <p className="text-center text-surface-800/60 py-20">Loading products...</p>
        ) : (
          <div className="bg-white rounded-2xl border border-surface-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface-50 border-b border-surface-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-surface-800">Product</th>
                  <th className="text-left px-4 py-3 font-semibold text-surface-800 hidden sm:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-semibold text-surface-800">Price</th>
                  <th className="text-left px-4 py-3 font-semibold text-surface-800 hidden md:table-cell">Stock</th>
                  <th className="text-right px-4 py-3 font-semibold text-surface-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-surface-100 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        <div>
                          <p className="font-medium text-surface-900 line-clamp-1">{p.name}</p>
                          <p className="text-xs text-surface-800/40">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-surface-800/60 hidden sm:table-cell capitalize">
                      {p.category.replace('-', ' ')}
                    </td>
                    <td className="px-4 py-3 font-medium">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`text-xs font-medium px-2 py-1 rounded-lg ${p.inStock ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {p.inStock ? 'In stock' : 'Out of stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 rounded-lg hover:bg-surface-50 text-surface-800/60 hover:text-brand-500"
                          aria-label="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.name)}
                          className="p-2 rounded-lg hover:bg-red-50 text-surface-800/60 hover:text-red-500"
                          aria-label="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {showForm && (
        <div className="fixed inset-0 bg-surface-900/50 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <form onSubmit={handleSave} className="w-full max-w-lg bg-white rounded-2xl p-6 my-8 shadow-xl">
            <h2 className="text-xl font-black text-surface-900">
              {editingId ? 'Edit Product' : 'Add Product'}
            </h2>

            <div className="mt-6 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
              <div>
                <label className="block text-sm font-medium text-surface-800 mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                  className="w-full px-4 py-2.5 rounded-xl border border-surface-100 text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Price (KES)" value={String(form.price || '')} onChange={(v) => setForm({ ...form, price: Number(v) })} type="number" required />
                <Field label="Original Price (optional)" value={form.originalPriceText} onChange={(v) => setForm({ ...form, originalPriceText: v })} type="number" />
              </div>
              <Field label="Image URL" value={form.image} onChange={(v) => setForm({ ...form, image: v })} required />
              <Field label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} multiline required />
              <Field label="Features (comma-separated)" value={form.featuresText} onChange={(v) => setForm({ ...form, featuresText: v })} placeholder="Lightweight, Breathable mesh" required />
              <Field label="Sizes (comma-separated)" value={form.sizesText} onChange={(v) => setForm({ ...form, sizesText: v })} placeholder="7, 8, 9, 10, 11, 12" required />
              <Field label="Colors (name:hex, comma-separated)" value={form.colorsText} onChange={(v) => setForm({ ...form, colorsText: v })} placeholder="Black:#000000, Red:#dc2626" required />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Rating" value={String(form.rating)} onChange={(v) => setForm({ ...form, rating: Number(v) })} type="number" />
                <Field label="Review Count" value={String(form.reviewCount)} onChange={(v) => setForm({ ...form, reviewCount: Number(v) })} type="number" />
              </div>
              <Field label="Badge (optional)" value={form.badgeText} onChange={(v) => setForm({ ...form, badgeText: v })} placeholder="New, Best Seller, Hot" />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.inStock}
                  onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                  className="rounded"
                />
                In stock
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 border border-surface-100 rounded-xl text-sm font-medium hover:bg-surface-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-3 bg-brand-500 text-white rounded-xl text-sm font-semibold hover:bg-brand-600 disabled:opacity-60"
              >
                {saving ? 'Saving...' : editingId ? 'Update' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  multiline,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
  multiline?: boolean
  placeholder?: string
}) {
  const className = 'w-full px-4 py-2.5 rounded-xl border border-surface-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500'

  return (
    <div>
      <label className="block text-sm font-medium text-surface-800 mb-1.5">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          rows={3}
          className={className}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={placeholder}
          className={className}
        />
      )}
    </div>
  )
}
