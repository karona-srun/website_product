<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAdminStore } from '../../stores/adminStore'
import { useProductStore } from '../../stores/productStore'

const admin = useAdminStore()
const productStore = useProductStore()
const reportType = ref('sales')

const fulfilledOrders = computed(() => admin.orders.filter((order) => order.status !== 'Cancelled'))
const revenue = computed(() => fulfilledOrders.value.reduce((sum, order) => sum + order.total, 0))
const averageOrder = computed(() =>
  fulfilledOrders.value.length ? Math.round(revenue.value / fulfilledOrders.value.length) : 0,
)
const inventoryValue = computed(() =>
  productStore.products.reduce((sum, product) => sum + product.price * product.stock, 0),
)
const lowStock = computed(() => productStore.products.filter((product) => product.stock <= 10))
const topCategories = computed(() =>
  productStore.categories.map((category) => ({
    name: category.name,
    count: productStore.products.filter((product) => product.category.slug === category.slug).length,
  })).sort((a, b) => b.count - a.count).slice(0, 5),
)
const branchReports = computed(() =>
  admin.branches.map((branch) => ({
    name: branch.name,
    products: productStore.products.filter((product) => (product.branchId ?? product.category.branchId ?? 1) === branch.id).length,
    categories: productStore.categories.filter((category) => (category.branchId ?? 1) === branch.id).length,
    revenue: admin.orders
      .filter((order) => order.branchId === branch.id && order.status !== 'Cancelled')
      .reduce((sum, order) => sum + order.total, 0),
  })),
)

function formatRiel(value: number) {
  return `${value.toLocaleString('en-US')}៛`
}
</script>

<template>
  <div class="space-y-5">
    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-lg font-bold">Reports center</h2>
          <p class="mt-1 text-sm text-slate-500">Live operational reports for sales, inventory, orders, and permissions.</p>
        </div>
        <select v-model="reportType" class="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100">
          <option value="sales">Sales report</option>
          <option value="inventory">Inventory report</option>
          <option value="orders">Order report</option>
          <option value="access">Access report</option>
        </select>
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-4">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Revenue</p>
        <p class="mt-2 text-2xl font-bold tabular-nums">{{ formatRiel(revenue) }}</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Average order</p>
        <p class="mt-2 text-2xl font-bold tabular-nums text-[#134e4a]">{{ formatRiel(averageOrder) }}</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Inventory value</p>
        <p class="mt-2 text-2xl font-bold tabular-nums">{{ formatRiel(inventoryValue) }}</p>
      </div>
      <div class="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Low stock SKUs</p>
        <p class="mt-2 text-3xl font-bold tabular-nums text-rose-700">{{ lowStock.length }}</p>
      </div>
    </section>

    <section class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 class="font-bold text-slate-950">{{ reportType === 'sales' ? 'Sales performance' : reportType === 'inventory' ? 'Inventory health' : reportType === 'orders' ? 'Order fulfillment' : 'Access coverage' }}</h3>
        <div class="mt-6 space-y-5">
          <div v-for="category in topCategories" :key="category.name">
            <div class="flex justify-between text-sm font-semibold">
              <span>{{ category.name }}</span>
              <span>{{ category.count }} SKUs</span>
            </div>
            <div class="mt-2 h-3 overflow-hidden rounded-full bg-slate-100">
              <div class="h-full rounded-full bg-teal-600" :style="{ width: `${Math.min(100, category.count * 12)}%` }" />
            </div>
          </div>
        </div>
      </div>

      <aside class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 class="font-bold text-slate-950">Report actions</h3>
        <div class="mt-4 space-y-2">
          <button type="button" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold hover:border-teal-300 hover:bg-teal-50">Export {{ reportType }} CSV</button>
          <button type="button" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold hover:border-teal-300 hover:bg-teal-50">Print dashboard</button>
          <button type="button" class="w-full rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold hover:border-teal-300 hover:bg-teal-50">Schedule email report</button>
        </div>
        <div class="mt-5 rounded-xl bg-slate-50 p-4">
          <p class="text-sm font-semibold text-slate-700">Included data</p>
          <p class="mt-1 text-sm text-slate-500">{{ admin.orders.length }} orders, {{ productStore.products.length }} products, {{ admin.users.length }} users.</p>
        </div>
      </aside>
    </section>

    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 class="font-bold text-slate-950">Branch classification</h3>
      <p class="mt-1 text-sm text-slate-500">Products and categories are grouped by branch for local operations.</p>
      <div class="mt-5 grid gap-3 md:grid-cols-3">
        <article v-for="branch in branchReports" :key="branch.name" class="rounded-xl border border-slate-200 p-4">
          <p class="font-semibold text-slate-950">{{ branch.name }}</p>
          <div class="mt-4 space-y-2 text-sm">
            <div class="flex justify-between gap-3"><span class="text-slate-500">Products</span><span class="font-bold">{{ branch.products }}</span></div>
            <div class="flex justify-between gap-3"><span class="text-slate-500">Categories</span><span class="font-bold">{{ branch.categories }}</span></div>
            <div class="flex justify-between gap-3"><span class="text-slate-500">Revenue</span><span class="font-bold tabular-nums">{{ formatRiel(branch.revenue) }}</span></div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
