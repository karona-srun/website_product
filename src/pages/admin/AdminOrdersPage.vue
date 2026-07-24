<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { AdminOrder, OrderStatus } from '../../stores/adminStore'
import { useAdminStore } from '../../stores/adminStore'

const admin = useAdminStore()
const query = ref('')
const statusFilter = ref<'All' | OrderStatus>('All')
const page = ref(1)
const pageSize = 8
const modalOpen = ref(false)
const editingId = ref<number | null>(null)
const statuses: OrderStatus[] = ['Pending', 'Confirmed', 'Preparing', 'Delivered', 'Cancelled']

const form = reactive<Omit<AdminOrder, 'id' | 'code'>>({
  customer: '',
  branchId: 1,
  channel: 'Pickup',
  status: 'Pending',
  total: 0,
  payment: 'Cash',
  createdAt: '',
})

const filteredOrders = computed(() => {
  const search = query.value.trim().toLowerCase()
  return admin.orders.filter((order) => {
    const matchesSearch =
      !search ||
      order.code.toLowerCase().includes(search) ||
      order.customer.toLowerCase().includes(search) ||
      branchName(order.branchId).toLowerCase().includes(search)
    const matchesStatus = statusFilter.value === 'All' || order.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})
const totalPages = computed(() => Math.max(1, Math.ceil(filteredOrders.value.length / pageSize)))
const paginatedOrders = computed(() =>
  filteredOrders.value.slice((page.value - 1) * pageSize, page.value * pageSize),
)

watch([query, statusFilter], () => {
  page.value = 1
})

function formatRiel(value: number) {
  return `${value.toLocaleString('en-US')}៛`
}

function branchName(id: number) {
  return admin.branches.find((branch) => branch.id === id)?.name ?? 'No branch'
}

function resetForm() {
  Object.assign(form, {
    customer: '',
    branchId: admin.branches[0]?.id ?? 1,
    channel: 'Pickup',
    status: 'Pending',
    total: 0,
    payment: 'Cash',
    createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
  })
  editingId.value = null
}

function openCreate() {
  resetForm()
  modalOpen.value = true
}

function openEdit(order: AdminOrder) {
  Object.assign(form, {
    customer: order.customer,
    branchId: order.branchId,
    channel: order.channel,
    status: order.status,
    total: order.total,
    payment: order.payment,
    createdAt: order.createdAt,
  })
  editingId.value = order.id
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  resetForm()
}

function saveOrder() {
  if (editingId.value) admin.updateOrder(editingId.value, form)
  else admin.addOrder(form)
  closeModal()
}

function removeOrder(order: AdminOrder) {
  if (window.confirm(`Delete ${order.code}?`)) admin.removeOrder(order.id)
}
</script>

<template>
  <div class="space-y-5">
    <section class="grid gap-4 md:grid-cols-4">
      <div v-for="status in statuses.slice(0, 4)" :key="status" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p class="text-sm font-medium text-slate-500">{{ status }}</p>
        <p class="mt-2 text-3xl font-bold tabular-nums">{{ admin.orders.filter((order) => order.status === status).length }}</p>
      </div>
    </section>

    <section class="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div class="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <h2 class="text-lg font-bold">Order CRUD and process</h2>
          <p class="mt-1 text-sm text-slate-500">Create orders, assign branches, and move fulfillment status.</p>
        </div>
        <div class="flex flex-col gap-2 sm:flex-row">
          <input v-model="query" type="search" class="h-11 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" placeholder="Search orders" />
          <select v-model="statusFilter" class="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100">
            <option>All</option>
            <option v-for="status in statuses" :key="status">{{ status }}</option>
          </select>
          <button type="button" class="h-11 rounded-xl bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-900" @click="openCreate">Add order</button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[940px] text-left text-sm">
          <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th class="px-5 py-3">Order</th>
              <th class="px-5 py-3">Customer</th>
              <th class="px-5 py-3">Branch</th>
              <th class="px-5 py-3">Channel</th>
              <th class="px-5 py-3">Status</th>
              <th class="px-5 py-3">Total</th>
              <th class="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in paginatedOrders" :key="order.id" class="border-t border-slate-100">
              <td class="px-5 py-4 font-semibold">{{ order.code }}<p class="text-xs font-normal text-slate-500">{{ order.createdAt }}</p></td>
              <td class="px-5 py-4">{{ order.customer }}</td>
              <td class="px-5 py-4 text-slate-600">{{ branchName(order.branchId) }}</td>
              <td class="px-5 py-4">{{ order.channel }}</td>
              <td class="px-5 py-4">
                <select :value="order.status" class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold outline-none focus:border-teal-500" @change="admin.updateOrder(order.id, { status: ($event.target as HTMLSelectElement).value as OrderStatus })">
                  <option v-for="status in statuses" :key="status">{{ status }}</option>
                </select>
              </td>
              <td class="px-5 py-4 font-bold tabular-nums text-[#134e4a]">{{ formatRiel(order.total) }}</td>
              <td class="px-5 py-4">
                <div class="flex justify-end gap-2">
                  <button type="button" class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:border-teal-300 hover:bg-teal-50" @click="openEdit(order)">Edit</button>
                  <button type="button" class="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700" @click="removeOrder(order)">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="filteredOrders.length" class="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p class="text-sm text-slate-500">
          Showing {{ (page - 1) * pageSize + 1 }}-{{ Math.min(page * pageSize, filteredOrders.length) }} of {{ filteredOrders.length }}
        </p>
        <div class="flex gap-2">
          <button type="button" class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50" :disabled="page === 1" @click="page--">Previous</button>
          <span class="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold">{{ page }} / {{ totalPages }}</span>
          <button type="button" class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50" :disabled="page === totalPages" @click="page++">Next</button>
        </div>
      </div>
    </section>

    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-end bg-slate-950/50 sm:items-center sm:p-6">
      <form class="mx-auto w-full max-w-2xl rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6" @submit.prevent="saveOrder">
        <div class="flex justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 class="text-xl font-bold">{{ editingId ? 'Edit order' : 'Add order' }}</h3>
            <p class="mt-1 text-sm text-slate-500">Order records drive fulfillment and reports.</p>
          </div>
          <button type="button" class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100" @click="closeModal">Close</button>
        </div>
        <div class="mt-5 grid gap-4 md:grid-cols-2">
          <label class="text-sm font-semibold text-slate-700">Customer<input v-model="form.customer" required class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" /></label>
          <label class="text-sm font-semibold text-slate-700">Branch<select v-model.number="form.branchId" class="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"><option v-for="branch in admin.branches" :key="branch.id" :value="branch.id">{{ branch.name }}</option></select></label>
          <label class="text-sm font-semibold text-slate-700">Channel<select v-model="form.channel" class="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"><option>Pickup</option><option>Delivery</option><option>Wholesale</option></select></label>
          <label class="text-sm font-semibold text-slate-700">Status<select v-model="form.status" class="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"><option v-for="status in statuses" :key="status">{{ status }}</option></select></label>
          <label class="text-sm font-semibold text-slate-700">Payment<select v-model="form.payment" class="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"><option>Cash</option><option>ABA KHQR</option><option>Bank transfer</option></select></label>
          <label class="text-sm font-semibold text-slate-700">Total<input v-model.number="form.total" min="0" type="number" required class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" /></label>
          <label class="md:col-span-2 text-sm font-semibold text-slate-700">Created at<input v-model="form.createdAt" required class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" /></label>
        </div>
        <div class="mt-6 flex justify-end gap-2">
          <button type="button" class="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50" @click="closeModal">Cancel</button>
          <button type="submit" class="rounded-xl bg-teal-800 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-900">Save order</button>
        </div>
      </form>
    </div>
  </div>
</template>
