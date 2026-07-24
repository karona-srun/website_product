export interface Category {
  id: number
  name: string
  slug: string
  icon: string
  image: string
  branchId?: number
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  images: string[]
  category: Category
  tags: string[]
  rating: number
  reviewCount: number
  stock: number
  branchId?: number
  specs?: Record<string, string>
}
