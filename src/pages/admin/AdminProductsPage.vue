<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { Product } from '../../types/product'
import { useAdminStore } from '../../stores/adminStore'
import { useProductStore } from '../../stores/productStore'

interface ProductForm {
  name: string
  slug: string
  description: string
  price: number
  stock: number
  categorySlug: string
  branchId: number
  image: string
  tags: string
  rating: number
  reviewCount: number
}

const store = useProductStore()
const admin = useAdminStore()
const query = ref('')
const selectedCategory = ref('all')
const selectedBranch = ref('all')
const stockFilter = ref('all')
const page = ref(1)
const pageSize = 8
const modalOpen = ref(false)
const editingId = ref<number | null>(null)
const formError = ref('')

const emptyForm = (): ProductForm => ({
  name: '',
  slug: '',
  description: '',
  price: 0,
  stock: 0,
  categorySlug: store.categories[0]?.slug ?? '',
  branchId: admin.branches[0]?.id ?? 1,
  image: '',
  tags: '',
  rating: 4.5,
  reviewCount: 0,
})

const form = reactive<ProductForm>(emptyForm())

const filteredProducts = computed(() => {
  const search = query.value.trim().toLowerCase()
  return store.products.filter((product) => {
    const matchesSearch =
      !search ||
      product.name.toLowerCase().includes(search) ||
      product.slug.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search)
    const matchesCategory =
      selectedCategory.value === 'all' || product.category.slug === selectedCategory.value
    const productBranchId = product.branchId ?? product.category.branchId ?? admin.branches[0]?.id
    const matchesBranch =
      selectedBranch.value === 'all' || productBranchId === Number(selectedBranch.value)
    const matchesStock =
      stockFilter.value === 'all' ||
      (stockFilter.value === 'active' && product.stock > 10) ||
      (stockFilter.value === 'low' && product.stock > 0 && product.stock <= 10) ||
      (stockFilter.value === 'out' && product.stock === 0)

    return matchesSearch && matchesCategory && matchesBranch && matchesStock
  })
})

const averagePrice = computed(() =>
  store.products.length
    ? Math.round(store.products.reduce((sum, product) => sum + product.price, 0) / store.products.length)
    : 0,
)
const lowStockCount = computed(() => store.products.filter((product) => product.stock > 0 && product.stock <= 10).length)
const outOfStockCount = computed(() => store.products.filter((product) => product.stock === 0).length)
const totalPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / pageSize)))
const paginatedProducts = computed(() =>
  filteredProducts.value.slice((page.value - 1) * pageSize, page.value * pageSize),
)

watch([query, selectedCategory, selectedBranch, stockFilter], () => {
  page.value = 1
})

function formatRiel(value: number) {
  return `${value.toLocaleString('en-US')}៛`
}

function branchName(branchId?: number) {
  return admin.branches.find((branch) => branch.id === branchId)?.name ?? 'Default branch'
}

function resetForm() {
  Object.assign(form, emptyForm())
  editingId.value = null
  formError.value = ''
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function openCreate() {
  resetForm()
  modalOpen.value = true
}

function openEdit(product: Product) {
  Object.assign(form, {
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: product.price,
    stock: product.stock,
    categorySlug: product.category.slug,
    branchId: product.branchId ?? product.category.branchId ?? admin.branches[0]?.id ?? 1,
    image: product.images[0] ?? '',
    tags: product.tags.join(', '),
    rating: product.rating,
    reviewCount: product.reviewCount,
  })
  editingId.value = product.id
  formError.value = ''
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  resetForm()
}

function productPayload() {
  const category = store.categories.find((entry) => entry.slug === form.categorySlug)
  if (!category) {
    formError.value = 'Please select a category.'
    return null
  }

  const name = form.name.trim()
  const slug = form.slug.trim() || slugify(name)
  const image = form.image.trim()
  if (!name || !slug || !image) {
    formError.value = 'Name, slug, and image URL are required.'
    return null
  }

  return {
    name,
    slug,
    description: form.description.trim(),
    price: Math.max(0, Number(form.price) || 0),
    stock: Math.max(0, Math.floor(Number(form.stock) || 0)),
    branchId: form.branchId,
    images: [image],
    category,
    tags: form.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    rating: Math.min(5, Math.max(0, Number(form.rating) || 0)),
    reviewCount: Math.max(0, Math.floor(Number(form.reviewCount) || 0)),
  }
}

function saveProduct() {
  const payload = productPayload()
  if (!payload) return

  if (editingId.value) {
    store.updateProduct(editingId.value, payload)
    admin.logActivity('Products', 'Updated product', payload.name)
  } else {
    const created = store.addProduct(payload)
    admin.logActivity('Products', 'Created product', created.name)
  }

  closeModal()
}

function duplicateProduct(product: Product) {
  store.addProduct({
    ...product,
    slug: `${product.slug}-copy`,
    name: `${product.name} Copy`,
    stock: 0,
  })
  admin.logActivity('Products', 'Duplicated product', product.name)
}

function removeProduct(product: Product) {
  if (window.confirm(`Remove ${product.name}?`)) {
    store.removeProduct(product.id)
    admin.logActivity('Products', 'Deleted product', product.name)
  }
}
</script>

<template>
  <div class="space-y-5">
    <section class="grid gap-4 md:grid-cols-3">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Total products</p>
        <p class="mt-2 text-3xl font-bold tabular-nums text-slate-950">{{ store.products.length }}</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Average price</p>
        <p class="mt-2 text-2xl font-bold tabular-nums text-[#134e4a]">{{ formatRiel(averagePrice) }}</p>
      </div>
      <div class="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Needs attention</p>
        <p class="mt-2 text-3xl font-bold tabular-nums text-rose-700">{{ lowStockCount + outOfStockCount }}</p>
      </div>
    </section>

    <section class="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="border-b border-slate-100 p-4 sm:p-5">
        <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-950">Product CRUD</h2>
            <p class="mt-1 text-sm text-slate-500">Create, read, update, duplicate, and remove catalog products.</p>
          </div>
          <div class="flex flex-col gap-2 sm:flex-row">
            <input
              v-model="query"
              type="search"
              class="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 sm:w-72"
              placeholder="Search products"
            />
            <select
              v-model="selectedCategory"
              class="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              <option value="all">All categories</option>
              <option v-for="category in store.categories" :key="category.id" :value="category.slug">
                {{ category.name }}
              </option>
            </select>
            <select
              v-model="selectedBranch"
              class="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              <option value="all">All branches</option>
              <option v-for="branch in admin.branches" :key="branch.id" :value="String(branch.id)">
                {{ branch.name }}
              </option>
            </select>
            <select
              v-model="stockFilter"
              class="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            >
              <option value="all">All stock</option>
              <option value="active">Active</option>
              <option value="low">Low stock</option>
              <option value="out">Out of stock</option>
            </select>
            <button
              type="button"
              class="h-11 rounded-xl bg-teal-800 px-5 text-sm font-semibold text-white transition hover:bg-teal-900"
              @click="openCreate"
            >
              Add product
            </button>
          </div>
        </div>
      </div>

      <div class="hidden overflow-x-auto lg:block">
        <table class="w-full min-w-[980px] border-collapse text-left text-sm">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <th class="px-5 py-3 font-semibold">Product</th>
              <th class="px-4 py-3 font-semibold">Category</th>
              <th class="px-4 py-3 font-semibold">Branch</th>
              <th class="px-4 py-3 font-semibold">Price</th>
              <th class="px-4 py-3 font-semibold">Stock</th>
              <th class="px-4 py-3 font-semibold">Status</th>
              <th class="px-5 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in paginatedProducts" :key="product.id" class="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/70">
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <img :src="product.images[0]" :alt="product.name" class="h-14 w-16 rounded-lg object-cover" loading="lazy" decoding="async" />
                  <div class="min-w-0">
                    <RouterLink :to="`/products/${product.id}`" class="font-semibold text-slate-950 hover:text-teal-800">
                      {{ product.name }}
                    </RouterLink>
                    <p class="mt-1 truncate text-xs text-slate-500">{{ product.slug }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-4 text-slate-600">{{ product.category.name }}</td>
              <td class="px-4 py-4 text-slate-600">{{ branchName(product.branchId ?? product.category.branchId) }}</td>
              <td class="px-4 py-4 font-bold tabular-nums text-[#134e4a]">{{ formatRiel(product.price) }}</td>
              <td class="px-4 py-4 font-semibold tabular-nums text-slate-800">{{ product.stock }}</td>
              <td class="px-4 py-4">
                <span
                  class="inline-flex rounded-full px-3 py-1 text-xs font-semibold"
                  :class="
                    product.stock === 0
                      ? 'bg-rose-100 text-rose-800'
                      : product.stock <= 10
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                  "
                >
                  {{ product.stock === 0 ? 'Out' : product.stock <= 10 ? 'Low' : 'Active' }}
                </span>
              </td>
              <td class="px-5 py-4">
                <div class="flex justify-end gap-2">
                  <button type="button" class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50" @click="openEdit(product)">
                    Edit
                  </button>
                  <button type="button" class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50" @click="duplicateProduct(product)">
                    Duplicate
                  </button>
                  <button type="button" class="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700" @click="removeProduct(product)">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="grid gap-3 p-4 lg:hidden">
        <article v-for="product in paginatedProducts" :key="product.id" class="rounded-xl border border-slate-200 bg-white p-3">
          <div class="flex gap-3">
            <img :src="product.images[0]" :alt="product.name" class="h-20 w-24 shrink-0 rounded-lg object-cover" loading="lazy" decoding="async" />
            <div class="min-w-0 flex-1">
              <RouterLink :to="`/products/${product.id}`" class="font-semibold text-slate-950">{{ product.name }}</RouterLink>
              <p class="mt-1 text-xs text-slate-500">{{ product.category.name }}</p>
              <p class="mt-1 text-xs text-slate-500">{{ branchName(product.branchId ?? product.category.branchId) }}</p>
              <p class="mt-2 text-sm font-bold text-[#134e4a]">{{ formatRiel(product.price) }}</p>
            </div>
          </div>
          <div class="mt-3 flex flex-wrap gap-2">
            <button type="button" class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold" @click="openEdit(product)">
              Edit
            </button>
            <button type="button" class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold" @click="duplicateProduct(product)">
              Duplicate
            </button>
            <button type="button" class="ml-auto rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white" @click="removeProduct(product)">
              Delete
            </button>
          </div>
        </article>
      </div>

      <p v-if="filteredProducts.length === 0" class="py-10 text-center text-sm text-slate-500">
        No products match this filter.
      </p>

      <div v-else class="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p class="text-sm text-slate-500">
          Showing {{ (page - 1) * pageSize + 1 }}-{{ Math.min(page * pageSize, filteredProducts.length) }} of {{ filteredProducts.length }}
        </p>
        <div class="flex gap-2">
          <button type="button" class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50" :disabled="page === 1" @click="page--">Previous</button>
          <span class="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold">{{ page }} / {{ totalPages }}</span>
          <button type="button" class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50" :disabled="page === totalPages" @click="page++">Next</button>
        </div>
      </div>
    </section>

    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-end bg-slate-950/50 p-0 sm:items-center sm:p-6">
      <form
        class="mx-auto max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6"
        @submit.prevent="saveProduct"
      >
        <div class="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 class="text-xl font-bold text-slate-950">{{ editingId ? 'Edit product' : 'Add product' }}</h3>
            <p class="mt-1 text-sm text-slate-500">Complete the catalog details and save the product.</p>
          </div>
          <button type="button" class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100" @click="closeModal">
            Close
          </button>
        </div>

        <p v-if="formError" class="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{{ formError }}</p>

        <div class="mt-5 grid gap-4 md:grid-cols-2">
          <label class="text-sm font-semibold text-slate-700">
            Name
            <input v-model="form.name" class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
          </label>
          <label class="text-sm font-semibold text-slate-700">
            Slug
            <input v-model="form.slug" class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" placeholder="auto-created if empty" />
          </label>
          <label class="text-sm font-semibold text-slate-700">
            Category
            <select v-model="form.categorySlug" class="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100">
              <option v-for="category in store.categories" :key="category.id" :value="category.slug">
                {{ category.name }}
              </option>
            </select>
          </label>
          <label class="text-sm font-semibold text-slate-700">
            Branch
            <select v-model.number="form.branchId" class="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100">
              <option v-for="branch in admin.branches" :key="branch.id" :value="branch.id">
                {{ branch.name }}
              </option>
            </select>
          </label>
          <label class="text-sm font-semibold text-slate-700">
            Image URL
            <input v-model="form.image" class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
          </label>
          <label class="text-sm font-semibold text-slate-700">
            Price
            <input v-model.number="form.price" type="number" min="0" class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
          </label>
          <label class="text-sm font-semibold text-slate-700">
            Stock
            <input v-model.number="form.stock" type="number" min="0" class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
          </label>
          <label class="text-sm font-semibold text-slate-700">
            Rating
            <input v-model.number="form.rating" type="number" min="0" max="5" step="0.1" class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
          </label>
          <label class="text-sm font-semibold text-slate-700">
            Reviews
            <input v-model.number="form.reviewCount" type="number" min="0" class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
          </label>
          <label class="md:col-span-2 text-sm font-semibold text-slate-700">
            Tags
            <input v-model="form.tags" class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" placeholder="crab, fresh, kampot" />
          </label>
          <label class="md:col-span-2 text-sm font-semibold text-slate-700">
            Description
            <textarea v-model="form.description" rows="4" class="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
          </label>
        </div>

        <div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" class="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50" @click="closeModal">
            Cancel
          </button>
          <button type="submit" class="rounded-xl bg-teal-800 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-900">
            {{ editingId ? 'Save changes' : 'Create product' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
