import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Product } from '../types/product'

const STORAGE_KEY = 'kampot-seafood-cart-v1'

interface CartItem {
  product: Product
  quantity: number
}

interface StoredLine {
  id: number
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  let hydrated = false

  const totalItems = computed(() => items.value.reduce((sum, item) => sum + item.quantity, 0))

  const totalRiel = computed(() =>
    items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  )

  function persist() {
    try {
      const payload: StoredLine[] = items.value.map((item) => ({
        id: item.product.id,
        quantity: item.quantity,
      }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      /* ignore quota / private mode */
    }
  }

  /** Call once catalog is loaded so product rows can be restored */
  function hydrateFromCatalog(products: Product[]) {
    if (hydrated) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) {
        hydrated = true
        return
      }
      const parsed = JSON.parse(raw) as StoredLine[]
      const map = new Map(products.map((p) => [p.id, p]))
      items.value = parsed
        .filter((line) => map.has(line.id) && line.quantity > 0)
        .map((line) => ({
          product: map.get(line.id)!,
          quantity: line.quantity,
        }))
    } catch {
      items.value = []
    }
    hydrated = true
  }

  watch(items, () => persist(), { deep: true })

  const addToCart = (product: Product) => {
    const existing = items.value.find((item) => item.product.id === product.id)
    if (existing) existing.quantity += 1
    else items.value.push({ product, quantity: 1 })
  }

  const updateQuantity = (productId: number, quantity: number) => {
    const existing = items.value.find((item) => item.product.id === productId)
    if (!existing) return
    if (quantity <= 0) {
      items.value = items.value.filter((item) => item.product.id !== productId)
    } else {
      existing.quantity = quantity
    }
  }

  const removeFromCart = (productId: number) => {
    items.value = items.value.filter((item) => item.product.id !== productId)
  }

  const clearCart = () => {
    items.value = []
  }

  return {
    items,
    totalItems,
    totalRiel,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    hydrateFromCatalog,
  }
})
