<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { Role } from '../../stores/adminStore'
import { useAdminStore } from '../../stores/adminStore'

const admin = useAdminStore()
const modalOpen = ref(false)
const editingId = ref<number | null>(null)
const form = reactive({
  name: '',
  description: '',
  permissions: [] as string[],
})

function resetForm() {
  Object.assign(form, { name: '', description: '', permissions: [] })
  editingId.value = null
}

function openCreate() {
  resetForm()
  modalOpen.value = true
}

function openEdit(role: Role) {
  Object.assign(form, { name: role.name, description: role.description, permissions: [...role.permissions] })
  editingId.value = role.id
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  resetForm()
}

function saveRole() {
  if (editingId.value) admin.updateRole(editingId.value, form)
  else admin.addRole(form)
  closeModal()
}

function removeRole(role: Role) {
  if (window.confirm(`Delete ${role.name}?`)) admin.removeRole(role.id)
}
</script>

<template>
  <div class="space-y-5">
    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-lg font-bold">Role permissions CRUD</h2>
          <p class="mt-1 text-sm text-slate-500">Create roles and assign permission scopes for system access.</p>
        </div>
        <button type="button" class="h-11 rounded-xl bg-teal-800 px-5 text-sm font-semibold text-white hover:bg-teal-900" @click="openCreate">Add role</button>
      </div>
    </section>

    <section class="grid gap-4 lg:grid-cols-3">
      <article v-for="role in admin.roles" :key="role.id" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 class="font-bold text-slate-950">{{ role.name }}</h3>
        <p class="mt-2 min-h-10 text-sm text-slate-500">{{ role.description }}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <span v-for="permission in role.permissions" :key="permission" class="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-900">{{ permission }}</span>
        </div>
        <div class="mt-5 flex gap-2">
          <button type="button" class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold hover:border-teal-300 hover:bg-teal-50" @click="openEdit(role)">Edit</button>
          <button type="button" class="ml-auto rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700" @click="removeRole(role)">Delete</button>
        </div>
      </article>
    </section>

    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-end bg-slate-950/50 sm:items-center sm:p-6">
      <form class="mx-auto w-full max-w-2xl rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl sm:p-6" @submit.prevent="saveRole">
        <div class="flex justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 class="text-xl font-bold">{{ editingId ? 'Edit role' : 'Add role' }}</h3>
            <p class="mt-1 text-sm text-slate-500">Select the permissions this role can use.</p>
          </div>
          <button type="button" class="rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-100" @click="closeModal">Close</button>
        </div>
        <div class="mt-5 grid gap-4">
          <label class="text-sm font-semibold text-slate-700">Role name<input v-model="form.name" required class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" /></label>
          <label class="text-sm font-semibold text-slate-700">Description<textarea v-model="form.description" rows="3" class="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" /></label>
          <fieldset>
            <legend class="text-sm font-semibold text-slate-700">Permissions</legend>
            <div class="mt-2 grid gap-2 sm:grid-cols-2">
              <label v-for="permission in admin.permissions" :key="permission" class="flex items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm font-semibold">
                <input v-model="form.permissions" type="checkbox" :value="permission" class="h-4 w-4 rounded border-slate-300 text-teal-800 focus:ring-teal-600" />
                {{ permission }}
              </label>
            </div>
          </fieldset>
        </div>
        <div class="mt-6 flex justify-end gap-2">
          <button type="button" class="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold hover:bg-slate-50" @click="closeModal">Cancel</button>
          <button type="submit" class="rounded-xl bg-teal-800 px-5 py-3 text-sm font-semibold text-white hover:bg-teal-900">Save role</button>
        </div>
      </form>
    </div>
  </div>
</template>
