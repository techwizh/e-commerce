import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { fetchProducts, fetchCategories, fetchCategory, type SortOption } from '../api/client'
import type { CategoryInfo, Product } from '../types'

export default function ShopPage() {
  const { category } = useParams<{ category?: string }>()
  const [sort, setSort] = useState<SortOption>('featured')
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<CategoryInfo[]>([])
  const [categoryInfo, setCategoryInfo] = useState<CategoryInfo | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)

    const requests: Promise<void>[] = [
      fetchProducts({ category, sort }).then(setProducts),
    ]

    if (category) {
      requests.push(
        fetchCategory(category)
          .then(setCategoryInfo)
          .catch(() => setCategoryInfo(undefined))
      )
    } else {
      setCategoryInfo(undefined)
    }

    Promise.all(requests).finally(() => setLoading(false))
  }, [category, sort])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-surface-900 tracking-tight">
          {categoryInfo ? categoryInfo.name : 'All Products'}
        </h1>
        <p className="mt-2 text-surface-800/60">
          {categoryInfo
            ? categoryInfo.description
            : 'Browse our full collection of sports shoes, sneakers, and athletic shirts.'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-2">
          <Link
            to="/shop"
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              !category
                ? 'bg-surface-900 text-white'
                : 'bg-white border border-surface-100 text-surface-800 hover:border-surface-800/20'
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop/${cat.slug}`}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                category === cat.slug
                  ? 'bg-surface-900 text-white'
                  : 'bg-white border border-surface-100 text-surface-800 hover:border-surface-800/20'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="px-4 py-2 rounded-xl border border-surface-100 bg-white text-sm font-medium text-surface-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      <p className="text-sm text-surface-800/50 mb-6">{products.length} products</p>

      {loading ? (
        <LoadingSpinner />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-lg font-medium text-surface-800/60">No products found in this category.</p>
        </div>
      )}
    </div>
  )
}
