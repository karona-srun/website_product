<script setup lang="ts">
import { ref } from 'vue'

const email = ref('')
const sent = ref(false)
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
    <form class="w-full max-w-md rounded-3xl border border-white/10 bg-white p-6 text-slate-950 shadow-2xl sm:p-8" @submit.prevent="sent = true">
      <p class="text-sm font-semibold uppercase tracking-wider text-teal-700">Authentication</p>
      <h1 class="mt-2 text-2xl font-bold">Reset password</h1>
      <p class="mt-2 text-sm leading-relaxed text-slate-500">Enter an admin email and the system will show a reset confirmation for this demo.</p>
      <p v-if="sent" class="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
        Reset instructions are ready for {{ email || 'the selected account' }}.
      </p>
      <label class="mt-6 block text-sm font-semibold text-slate-700">
        Admin email
        <input v-model="email" type="email" required class="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
      </label>
      <button type="submit" class="mt-6 h-12 w-full rounded-xl bg-teal-800 text-sm font-bold text-white transition hover:bg-teal-900">Send reset link</button>
      <RouterLink to="/admin/login" class="mt-4 block text-center text-sm font-semibold text-teal-800 hover:underline">Back to login</RouterLink>
    </form>
  </main>
</template>
