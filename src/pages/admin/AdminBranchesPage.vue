<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import type { Branch, BranchStatus } from '../../stores/adminStore'
import { useAdminStore } from '../../stores/adminStore'

const admin = useAdminStore()
const query = ref('')
const modalOpen = ref(false)
const editingId = ref<number | null>(null)
const statuses: BranchStatus[] = ['Active', 'Maintenance', 'Closed']

const form = reactive<Omit<Branch, 'id'>>({
  name: '',
  code: '',
  manager: '',
  phone: '',
  address: '',
  status: 'Active',
})

const filteredBranches = computed(() => {
  const search = query.value.trim().toLowerCase()
  return admin.branches.filter((branch) =>
    !search ||
    branch.name.toLowerCase().includes(search) ||
    branch.code.toLowerCase().includes(search) ||
    branch.manager.toLowerCase().includes(search),
  )
})

function resetForm() {
  Object.assign(form, { name: '', code: '', manager: '', phone: '', address: '', status: 'Active' })
  editingId.value = null
}

function openCreate() {
  resetForm()
  modalOpen.value = true
}

function openEdit(branch: Branch) {
  Object.assign(form, branch)
  editingId.value = branch.id
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  resetForm()
}

function saveBranch() {
  if (editingId.value) admin.updateBranch(editingId.value, form)
  else admin.addBranch(form)
  closeModal()
}

function removeBranch(branch: Branch) {
  if (window.confirm(`Delete ${branch.name}?`)) admin.removeBranch(branch.id)
}
</script>

<template>
  <section class="rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div class="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div>
        <h2 class="text-lg font-bold">Branch CRUD</h2>
        <p class="mt-1 text-sm text-slate-500">Manage storefronts, delivery hubs, and wholesale counters.</p>
      </div>
      <div class="flex flex-col gap-2 sm:flex-row">
        <input v-model="query" type="search" class="h-11 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" placeholder="Search branches" />
        <button type="button" class="h-11 rounded-xl bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-900" @click="openCreate">Add branch</button>
      </div>
    </div>

    <div class="grid gap-4 p-4 lg:grid-cols-3">
      <article v-for="branch in filteredBranches" :key="branch.id" class="rounded-xl border border-slate-200 p-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="font-bold text-slate-950">{{ branch.name }}</h3>
            <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{{ branch.code }}</p>
          </div>
          <span class="rounded-full px-3 py-1 text-xs font-semibold" :class="branch.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : branch.status === 'Maintenance' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'">{{ branch.status }}</span>
        </div>
        <dl class="mt-4 space-y-2 text-sm">
          <div><dt class="text-slate-500">Manager</dt><dd class="font-semibold">{{ branch.manager }}</dd></div>
          <div><dt class="text-slate-500">Phone</dt><dd>{{ branch.phone }}</dd></div>
          <div><dt class="text-slate-500">Address</dt><dd>{{ branch.address }}</dd></div>
        </dl>
        <div class="mt-4 flex gap-2">
          <button type="button" class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:border-teal-300 hover:bg-teal-50" @click="openEdit(branch)">Edit</button>
          <button type="button" class="ml-auto rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700" @click="removeBranch(branch)">Delete</button>
        </div>
      </article>
    </div>

    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-end bg-slate-950/50 sm:items-center sm:p-6">
      <form class="mx-auto w-full max-w-2xl rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6" @submit.prevent="saveBranch">
        <div class="flex justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 class="text-xl font-bold">{{ editingId ? 'Edit branch' : 'Add branch' }}</h3>
            <p class="mt-1 text-sm text-slate-500">Branch records power order assignment and user location access.</p>
          </div>
          <button type="button" class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100" @click="closeModal">Close</button>
        </div>
        <div class="mt-5 grid gap-4 md:grid-cols-2">
          <label class="text-sm font-semibold text-slate-700">Name<input v-model="form.name" required class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" /></label>
          <label class="text-sm font-semibold text-slate-700">Code<input v-model="form.code" required class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" /></label>
          <label class="text-sm font-semibold text-slate-700">Manager<input v-model="form.manager" required class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" /></label>
          <label class="text-sm font-semibold text-slate-700">Phone<input v-model="form.phone" required class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" /></label>
          <label class="text-sm font-semibold text-slate-700">Status<select v-model="form.status" class="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"><option v-for="status in statuses" :key="status">{{ status }}</option></select></label>
          <label class="md:col-span-2 text-sm font-semibold text-slate-700">Address<input v-model="form.address" required class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" /></label>
        </div>
        <div class="mt-6 flex justify-end gap-2">
          <button type="button" class="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50" @click="closeModal">Cancel</button>
          <button type="submit" class="rounded-xl bg-teal-800 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-900">Save branch</button>
        </div>
      </form>
    </div>
  </section>
</template>
