<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { Category } from '../../types/product'
import { useAdminStore } from '../../stores/adminStore'
import { useProductStore } from '../../stores/productStore'

const store = useProductStore()
const admin = useAdminStore()
const query = ref('')
const selectedBranch = ref('all')
const modalOpen = ref(false)
const editingId = ref<number | null>(null)
const formError = ref('')

const form = reactive({
  name: '',
  slug: '',
  branchId: admin.branches[0]?.id ?? 1,
  icon: '',
  image: '',
})

const filteredCategories = computed(() => {
  const search = query.value.trim().toLowerCase()
  return store.categories.filter((category) => {
    const matchesSearch =
      !search ||
      category.name.toLowerCase().includes(search) ||
      category.slug.toLowerCase().includes(search)
    const matchesBranch =
      selectedBranch.value === 'all' ||
      (category.branchId ?? admin.branches[0]?.id) === Number(selectedBranch.value)

    return matchesSearch && matchesBranch
  })
})

function productCount(slug: string) {
  return store.products.filter((product) => product.category.slug === slug).length
}

function branchName(branchId?: number) {
  return admin.branches.find((branch) => branch.id === branchId)?.name ?? 'Default branch'
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function resetForm() {
  Object.assign(form, { name: '', slug: '', branchId: admin.branches[0]?.id ?? 1, icon: '', image: '' })
  editingId.value = null
  formError.value = ''
}

function openCreate() {
  resetForm()
  modalOpen.value = true
}

function openEdit(category: Category) {
  Object.assign(form, category)
  editingId.value = category.id
  formError.value = ''
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  resetForm()
}

function saveCategory() {
  const name = form.name.trim()
  const slug = form.slug.trim() || slugify(name)
  if (!name || !slug) {
    formError.value = 'Name and slug are required.'
    return
  }

  const payload = {
    name,
    slug,
    branchId: form.branchId,
    icon: form.icon.trim() || '•',
    image: form.image.trim() || 'https://images.unsplash.com/photo-1565680018434-b513d483e446?w=800',
  }

  if (editingId.value) {
    store.updateCategory(editingId.value, payload)
    admin.logActivity('Categories', 'Updated category', payload.name)
  } else {
    const created = store.addCategory(payload)
    admin.logActivity('Categories', 'Created category', created.name)
  }
  closeModal()
}

function removeCategory(category: Category) {
  if (productCount(category.slug) > 0) {
    formError.value = 'Move products out of this category before deleting it.'
    return
  }
  if (window.confirm(`Delete ${category.name}?`)) {
    store.removeCategory(category.id)
    admin.logActivity('Categories', 'Deleted category', category.name)
  }
}
</script>

<template>
  <div class="space-y-5">
    <section class="grid gap-4 sm:grid-cols-3">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Categories</p>
        <p class="mt-2 text-3xl font-bold tabular-nums">{{ store.categories.length }}</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Assigned products</p>
        <p class="mt-2 text-3xl font-bold tabular-nums text-[#134e4a]">{{ store.products.length }}</p>
      </div>
      <div class="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Empty categories</p>
        <p class="mt-2 text-3xl font-bold tabular-nums text-amber-700">
          {{ store.categories.filter((category) => productCount(category.slug) === 0).length }}
        </p>
      </div>
    </section>

    <section class="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <h2 class="text-lg font-bold text-slate-950">Product category CRUD</h2>
          <p class="mt-1 text-sm text-slate-500">Create and maintain catalog grouping.</p>
        </div>
        <div class="flex flex-col gap-2 sm:flex-row">
          <input v-model="query" type="search" class="h-11 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" placeholder="Search categories" />
          <select v-model="selectedBranch" class="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100">
            <option value="all">All branches</option>
            <option v-for="branch in admin.branches" :key="branch.id" :value="String(branch.id)">
              {{ branch.name }}
            </option>
          </select>
          <button type="button" class="h-11 rounded-xl bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-900" @click="openCreate">Add category</button>
        </div>
      </div>

      <div class="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
        <article v-for="category in filteredCategories" :key="category.id" class="rounded-xl border border-slate-200 bg-white p-4">
          <div class="flex items-start gap-3">
            <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-xl">{{ category.icon }}</span>
            <div class="min-w-0 flex-1">
              <h3 class="font-bold text-slate-950">{{ category.name }}</h3>
              <p class="mt-1 truncate text-xs text-slate-500">{{ category.slug }}</p>
              <p class="mt-2 text-xs font-semibold text-slate-500">{{ branchName(category.branchId) }}</p>
              <p class="mt-3 text-sm font-semibold text-[#134e4a]">{{ productCount(category.slug) }} products</p>
            </div>
          </div>
          <div class="mt-4 flex gap-2">
            <button type="button" class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:border-teal-300 hover:bg-teal-50" @click="openEdit(category)">Edit</button>
            <button type="button" class="ml-auto rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700" @click="removeCategory(category)">Delete</button>
          </div>
        </article>
      </div>

      <p v-if="formError && !modalOpen" class="px-5 pb-5 text-sm font-semibold text-rose-700">{{ formError }}</p>
    </section>

    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-end bg-slate-950/50 sm:items-center sm:p-6">
      <form class="mx-auto w-full max-w-xl rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6" @submit.prevent="saveCategory">
        <div class="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 class="text-xl font-bold">{{ editingId ? 'Edit category' : 'Add category' }}</h3>
            <p class="mt-1 text-sm text-slate-500">Category details are used by product filters and admin reporting.</p>
          </div>
          <button type="button" class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100" @click="closeModal">Close</button>
        </div>
        <p v-if="formError" class="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{{ formError }}</p>
        <div class="mt-5 grid gap-4">
          <label class="text-sm font-semibold text-slate-700">Name<input v-model="form.name" class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" /></label>
          <label class="text-sm font-semibold text-slate-700">Slug<input v-model="form.slug" class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" placeholder="auto-created if empty" /></label>
          <label class="text-sm font-semibold text-slate-700">
            Branch
            <select v-model.number="form.branchId" class="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100">
              <option v-for="branch in admin.branches" :key="branch.id" :value="branch.id">
                {{ branch.name }}
              </option>
            </select>
          </label>
          <label class="text-sm font-semibold text-slate-700">Icon<input v-model="form.icon" class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" /></label>
          <label class="text-sm font-semibold text-slate-700">Image URL<input v-model="form.image" class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" /></label>
        </div>
        <div class="mt-6 flex justify-end gap-2">
          <button type="button" class="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50" @click="closeModal">Cancel</button>
          <button type="submit" class="rounded-xl bg-teal-800 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-900">{{ editingId ? 'Save changes' : 'Create category' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>
