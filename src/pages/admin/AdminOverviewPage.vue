<script setup lang="ts">
import { computed } from 'vue'
import { useAdminStore } from '../../stores/adminStore'
import { useProductStore } from '../../stores/productStore'

const store = useProductStore()
const admin = useAdminStore()

const totalInventory = computed(() => store.products.reduce((sum, product) => sum + product.stock, 0))
const lowStockCount = computed(() => store.products.filter((product) => product.stock > 0 && product.stock <= 10).length)
const outOfStockCount = computed(() => store.products.filter((product) => product.stock === 0).length)
const healthyPercent = computed(() => {
  if (!store.products.length) return 0
  return Math.round((store.products.filter((product) => product.stock > 10).length / store.products.length) * 100)
})
const recentOrders = computed(() => admin.orders.slice(0, 3))
const orderStatusCounts = computed(() =>
  ['Pending', 'Confirmed', 'Preparing', 'Delivered'].map((status) => ({
    status,
    count: admin.orders.filter((order) => order.status === status).length,
  })),
)
const maxOrderStatus = computed(() =>
  Math.max(1, ...orderStatusCounts.value.map((entry) => entry.count)),
)
const branchCoverage = computed(() =>
  admin.branches.map((branch) => ({
    id: branch.id,
    name: branch.name,
    products: store.products.filter((product) => (product.branchId ?? product.category.branchId ?? 1) === branch.id).length,
    categories: store.categories.filter((category) => (category.branchId ?? 1) === branch.id).length,
    orders: admin.orders.filter((order) => order.branchId === branch.id).length,
  })),
)

function formatRiel(value: number) {
  return `${value.toLocaleString('en-US')}៛`
}
</script>

<template>
  <div class="space-y-5">
    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Products</p>
        <p class="mt-3 text-3xl font-bold tabular-nums">{{ store.products.length }}</p>
        <p class="mt-1 text-xs text-slate-500">{{ store.categories.length }} categories</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Inventory units</p>
        <p class="mt-3 text-3xl font-bold tabular-nums text-[#134e4a]">{{ totalInventory }}</p>
        <p class="mt-1 text-xs text-slate-500">Available for sale</p>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Order revenue</p>
        <p class="mt-3 text-2xl font-bold tabular-nums">{{ formatRiel(admin.todayRevenue) }}</p>
        <p class="mt-1 text-xs text-slate-500">{{ admin.orders.length }} orders in process</p>
      </div>
      <div class="rounded-2xl border border-rose-100 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">Stock alerts</p>
        <p class="mt-3 text-3xl font-bold tabular-nums text-rose-700">{{ lowStockCount + outOfStockCount }}</p>
        <p class="mt-1 text-xs text-slate-500">{{ outOfStockCount }} out of stock</p>
      </div>
    </section>

    <section class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-lg font-bold">Operations overview</h2>
            <p class="mt-1 text-sm text-slate-500">Inventory health and daily order flow.</p>
          </div>
          <RouterLink to="/admin/products" class="w-fit rounded-xl bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white">
            Update inventory
          </RouterLink>
        </div>

        <div class="mt-6 rounded-2xl bg-slate-50 p-4">
          <div class="flex items-center justify-between text-sm">
            <span class="font-semibold text-slate-700">Healthy stock coverage</span>
            <span class="font-bold tabular-nums text-slate-950">{{ healthyPercent }}%</span>
          </div>
          <div class="mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
            <div class="h-full rounded-full bg-teal-600" :style="{ width: `${healthyPercent}%` }" />
          </div>
        </div>

        <div class="mt-5 grid gap-3 md:grid-cols-3">
          <RouterLink to="/admin/orders" class="rounded-xl border border-slate-200 p-4 transition hover:border-teal-300 hover:bg-teal-50">
            <p class="text-sm font-semibold">Orders</p>
            <p class="mt-1 text-xs text-slate-500">Track fulfillment queue</p>
          </RouterLink>
          <RouterLink to="/admin/users" class="rounded-xl border border-slate-200 p-4 transition hover:border-teal-300 hover:bg-teal-50">
            <p class="text-sm font-semibold">Users</p>
            <p class="mt-1 text-xs text-slate-500">Manage staff and roles</p>
          </RouterLink>
          <RouterLink to="/admin/reports" class="rounded-xl border border-slate-200 p-4 transition hover:border-teal-300 hover:bg-teal-50">
            <p class="text-sm font-semibold">Reports</p>
            <p class="mt-1 text-xs text-slate-500">Monitor sales signals</p>
          </RouterLink>
        </div>

        <div class="mt-5 grid gap-3 md:grid-cols-3">
          <div v-for="branch in branchCoverage" :key="branch.id" class="rounded-xl border border-slate-200 bg-white p-4">
            <p class="font-semibold text-slate-950">{{ branch.name }}</p>
            <p class="mt-2 text-xs text-slate-500">{{ branch.products }} products</p>
            <p class="mt-1 text-xs text-slate-500">{{ branch.categories }} categories</p>
            <p class="mt-1 text-xs text-slate-500">{{ branch.orders }} orders</p>
          </div>
        </div>
      </div>

      <aside class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-lg font-bold">Recent orders</h2>
        <div class="mt-4 space-y-3">
          <RouterLink
            v-for="order in recentOrders"
            :key="order.id"
            to="/admin/orders"
            class="block rounded-xl border border-slate-100 p-3 transition hover:border-teal-300 hover:bg-teal-50"
          >
            <div class="flex items-center justify-between gap-3">
              <p class="font-semibold text-slate-950">{{ order.code }}</p>
              <span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{{ order.status }}</span>
            </div>
            <p class="mt-1 text-sm text-slate-500">{{ order.customer }}</p>
            <p class="mt-2 text-sm font-bold tabular-nums text-[#134e4a]">{{ formatRiel(order.total) }}</p>
          </RouterLink>
        </div>
      </aside>
    </section>

    <section class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-lg font-bold">Order analytics</h2>
        <p class="mt-1 text-sm text-slate-500">Status distribution for the current fulfillment queue.</p>
        <div class="mt-6 grid h-64 grid-cols-4 items-end gap-4">
          <div v-for="entry in orderStatusCounts" :key="entry.status" class="flex h-full flex-col justify-end">
            <div class="rounded-t-xl bg-teal-600 transition-all" :style="{ height: `${Math.max(12, (entry.count / maxOrderStatus) * 100)}%` }" />
            <p class="mt-3 text-center text-xs font-semibold text-slate-600">{{ entry.status }}</p>
            <p class="text-center text-sm font-bold tabular-nums">{{ entry.count }}</p>
          </div>
        </div>
      </div>

      <aside class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 class="text-lg font-bold">Activity logs</h2>
        <div class="mt-4 space-y-3">
          <article v-for="log in admin.activityLogs.slice(0, 5)" :key="log.id" class="rounded-xl border border-slate-100 p-3">
            <div class="flex items-start justify-between gap-3">
              <p class="text-sm font-semibold text-slate-950">{{ log.action }}</p>
              <span class="text-[11px] text-slate-400">{{ log.createdAt }}</span>
            </div>
            <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-teal-700">{{ log.module }}</p>
            <p class="mt-1 text-sm text-slate-500">{{ log.detail }}</p>
          </article>
        </div>
      </aside>
    </section>
  </div>
</template>
