import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { products as productSeed } from '../data/products'
import { categories as categorySeed } from '../data/categories'
import type { Category, Product } from '../types/product'
import { productService } from '../services/productService'

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'

export const useProductStore = defineStore('product', () => {
  const products = ref(productSeed)
  const categories = ref(categorySeed)
  const selectedCategory = ref<string | null>(null)
  const searchQuery = ref('')
  const sortOption = ref<SortOption>('featured')
  const minimumRating = ref(0)

  const filteredProducts = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()
    const filtered = products.value.filter((product) => {
      const matchesCategory = !selectedCategory.value || product.category.slug === selectedCategory.value
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      const matchesRating = product.rating >= minimumRating.value
      return matchesCategory && matchesSearch && matchesRating
    })

    return [...filtered].sort((a, b) => {
      switch (sortOption.value) {
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'rating':
          return b.rating - a.rating
        case 'newest':
          return b.id - a.id
        default:
          return 0
      }
    })
  })

  const productById = (id: number) => products.value.find((product) => product.id === id)
  const productsByCategory = (slug: string) =>
    products.value.filter((product) => product.category.slug === slug)

  const fetchProducts = async () => {
    const catalog = await productService.fetchCatalog()
    products.value = catalog.products
    categories.value = catalog.categories
    return products.value
  }
  const setCategory = (slug: string | null) => (selectedCategory.value = slug)
  const setSearch = (value: string) => (searchQuery.value = value)
  const setSort = (value: SortOption) => (sortOption.value = value)
  const setMinimumRating = (value: number) => (minimumRating.value = value)
  const addProduct = (product: Omit<Product, 'id'>) => {
    const nextId = products.value.reduce((max, entry) => Math.max(max, entry.id), 0) + 1
    const created = { ...product, id: nextId }
    products.value = [created, ...products.value]
    return created
  }
  const updateProduct = (productId: number, changes: Partial<Product>) => {
    products.value = products.value.map((product) =>
      product.id === productId ? { ...product, ...changes } : product,
    )
  }
  const removeProduct = (productId: number) => {
    products.value = products.value.filter((product) => product.id !== productId)
  }
  const addCategory = (category: Omit<Category, 'id'>) => {
    const nextId = categories.value.reduce((max, entry) => Math.max(max, entry.id), 0) + 1
    const created = { ...category, id: nextId }
    categories.value = [created, ...categories.value]
    return created
  }
  const updateCategory = (categoryId: number, changes: Partial<Category>) => {
    categories.value = categories.value.map((category) =>
      category.id === categoryId ? { ...category, ...changes } : category,
    )
    products.value = products.value.map((product) =>
      product.category.id === categoryId ? { ...product, category: { ...product.category, ...changes } } : product,
    )
  }
  const removeCategory = (categoryId: number) => {
    categories.value = categories.value.filter((category) => category.id !== categoryId)
  }

  return {
    products,
    categories,
    selectedCategory,
    searchQuery,
    sortOption,
    minimumRating,
    filteredProducts,
    productById,
    productsByCategory,
    fetchProducts,
    setCategory,
    setSearch,
    setSort,
    setMinimumRating,
    addProduct,
    updateProduct,
    removeProduct,
    addCategory,
    updateCategory,
    removeCategory,
  }
})
