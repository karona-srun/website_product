<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { AdminUser, UserStatus } from '../../stores/adminStore'
import { useAdminStore } from '../../stores/adminStore'

const admin = useAdminStore()
const query = ref('')
const modalOpen = ref(false)
const editingId = ref<number | null>(null)
const page = ref(1)
const pageSize = 8
const statuses: UserStatus[] = ['Active', 'Invited', 'Suspended']

const form = reactive<Omit<AdminUser, 'id'>>({
  name: '',
  email: '',
  phone: '',
  roleId: 1,
  branchId: 1,
  status: 'Active',
})

const filteredUsers = computed(() => {
  const search = query.value.trim().toLowerCase()
  return admin.users.filter((user) =>
    !search ||
    user.name.toLowerCase().includes(search) ||
    user.email.toLowerCase().includes(search) ||
    roleName(user.roleId).toLowerCase().includes(search),
  )
})
const totalPages = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / pageSize)))
const paginatedUsers = computed(() =>
  filteredUsers.value.slice((page.value - 1) * pageSize, page.value * pageSize),
)

watch(query, () => {
  page.value = 1
})

function roleName(id: number) {
  return admin.roles.find((role) => role.id === id)?.name ?? 'No role'
}

function branchName(id: number) {
  return admin.branches.find((branch) => branch.id === id)?.name ?? 'No branch'
}

function resetForm() {
  Object.assign(form, {
    name: '',
    email: '',
    phone: '',
    roleId: admin.roles[0]?.id ?? 1,
    branchId: admin.branches[0]?.id ?? 1,
    status: 'Active',
  })
  editingId.value = null
}

function openCreate() {
  resetForm()
  modalOpen.value = true
}

function openEdit(user: AdminUser) {
  Object.assign(form, user)
  editingId.value = user.id
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  resetForm()
}

function saveUser() {
  if (editingId.value) admin.updateUser(editingId.value, form)
  else admin.addUser(form)
  closeModal()
}

function removeUser(user: AdminUser) {
  if (window.confirm(`Delete ${user.name}?`)) admin.removeUser(user.id)
}
</script>

<template>
  <section class="rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div class="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <div>
        <h2 class="text-lg font-bold">User CRUD</h2>
        <p class="mt-1 text-sm text-slate-500">Manage staff accounts, access roles, and branch assignment.</p>
      </div>
      <div class="flex flex-col gap-2 sm:flex-row">
        <input v-model="query" type="search" class="h-11 rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" placeholder="Search users" />
        <button type="button" class="h-11 rounded-xl bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-900" @click="openCreate">Add user</button>
      </div>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full min-w-[860px] text-left text-sm">
        <thead class="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th class="px-5 py-3">User</th>
            <th class="px-5 py-3">Role</th>
            <th class="px-5 py-3">Branch</th>
            <th class="px-5 py-3">Status</th>
            <th class="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in paginatedUsers" :key="user.id" class="border-t border-slate-100">
            <td class="px-5 py-4">
              <p class="font-semibold text-slate-950">{{ user.name }}</p>
              <p class="text-xs text-slate-500">{{ user.email }} · {{ user.phone }}</p>
            </td>
            <td class="px-5 py-4">{{ roleName(user.roleId) }}</td>
            <td class="px-5 py-4 text-slate-600">{{ branchName(user.branchId) }}</td>
            <td class="px-5 py-4"><span class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{{ user.status }}</span></td>
            <td class="px-5 py-4">
              <div class="flex justify-end gap-2">
                <button type="button" class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:border-teal-300 hover:bg-teal-50" @click="openEdit(user)">Edit</button>
                <button type="button" class="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700" @click="removeUser(user)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="filteredUsers.length" class="flex flex-col gap-3 border-t border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p class="text-sm text-slate-500">
        Showing {{ (page - 1) * pageSize + 1 }}-{{ Math.min(page * pageSize, filteredUsers.length) }} of {{ filteredUsers.length }}
      </p>
      <div class="flex gap-2">
        <button type="button" class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50" :disabled="page === 1" @click="page--">Previous</button>
        <span class="rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold">{{ page }} / {{ totalPages }}</span>
        <button type="button" class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50" :disabled="page === totalPages" @click="page++">Next</button>
      </div>
    </div>

    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-end bg-slate-950/50 sm:items-center sm:p-6">
      <form class="mx-auto w-full max-w-2xl rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6" @submit.prevent="saveUser">
        <div class="flex justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 class="text-xl font-bold">{{ editingId ? 'Edit user' : 'Add user' }}</h3>
            <p class="mt-1 text-sm text-slate-500">Assign a branch and role to control operational access.</p>
          </div>
          <button type="button" class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100" @click="closeModal">Close</button>
        </div>
        <div class="mt-5 grid gap-4 md:grid-cols-2">
          <label class="text-sm font-semibold text-slate-700">Name<input v-model="form.name" required class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" /></label>
          <label class="text-sm font-semibold text-slate-700">Email<input v-model="form.email" required type="email" class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" /></label>
          <label class="text-sm font-semibold text-slate-700">Phone<input v-model="form.phone" required class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" /></label>
          <label class="text-sm font-semibold text-slate-700">Status<select v-model="form.status" class="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"><option v-for="status in statuses" :key="status">{{ status }}</option></select></label>
          <label class="text-sm font-semibold text-slate-700">Role<select v-model.number="form.roleId" class="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"><option v-for="role in admin.roles" :key="role.id" :value="role.id">{{ role.name }}</option></select></label>
          <label class="text-sm font-semibold text-slate-700">Branch<select v-model.number="form.branchId" class="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"><option v-for="branch in admin.branches" :key="branch.id" :value="branch.id">{{ branch.name }}</option></select></label>
        </div>
        <div class="mt-6 flex justify-end gap-2">
          <button type="button" class="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50" @click="closeModal">Cancel</button>
          <button type="submit" class="rounded-xl bg-teal-800 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-900">Save user</button>
        </div>
      </form>
    </div>
  </section>
</template>
