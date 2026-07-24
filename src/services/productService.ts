import { categories as categorySeed } from '../data/categories'
import { products as productSeed } from '../data/products'
import type { Category, Product } from '../types/product'

interface ProductResponse {
  products: Product[]
  categories: Category[]
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const fetchFromApi = async (): Promise<ProductResponse> => {
  const response = await fetch(`${API_BASE_URL}/products`)
  if (!response.ok) throw new Error('Failed to fetch products from API')
  return (await response.json()) as ProductResponse
}

const fetchFromMock = async (): Promise<ProductResponse> => ({
  products: productSeed,
  categories: categorySeed,
})

export const productService = {
  async fetchCatalog(): Promise<ProductResponse> {
    if (!API_BASE_URL) return fetchFromMock()
    try {
      return await fetchFromApi()
    } catch {
      return fetchFromMock()
    }
  },
}
