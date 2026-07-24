<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const email = ref('admin@kompot.com')
const password = ref('admin123')
const error = ref('')

function submit() {
  if (!auth.login(email.value, password.value)) {
    error.value = 'Please enter email and password.'
    return
  }
  router.push(String(route.query.redirect || '/admin'))
}
</script>

<template>
  <main class="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6">
    <div class="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_440px]">
      <section>
        <p class="text-sm font-semibold uppercase tracking-[0.25em] text-teal-300">Kampot Seafood</p>
        <h1 class="mt-4 max-w-2xl text-4xl font-bold leading-tight md:text-6xl">Modern admin management system</h1>
        <p class="mt-5 max-w-xl text-base leading-relaxed text-slate-300">
          Manage products, orders, branches, users, roles, permissions, reports, notifications, and system settings.
        </p>
        <div class="mt-8 grid gap-3 sm:grid-cols-3">
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p class="text-2xl font-bold">CRUD</p>
            <p class="mt-1 text-sm text-slate-400">Full local workflow</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p class="text-2xl font-bold">Dark</p>
            <p class="mt-1 text-sm text-slate-400">Theme support</p>
          </div>
          <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p class="text-2xl font-bold">Mobile</p>
            <p class="mt-1 text-sm text-slate-400">Responsive UI</p>
          </div>
        </div>
      </section>

      <form class="rounded-3xl border border-white/10 bg-white p-6 text-slate-950 shadow-2xl sm:p-8" @submit.prevent="submit">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wider text-teal-700">Admin login</p>
          <h2 class="mt-2 text-2xl font-bold">Sign in</h2>
          <p class="mt-2 text-sm text-slate-500">Use the demo credentials already filled in.</p>
        </div>
        <p v-if="error" class="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{{ error }}</p>
        <label class="mt-6 block text-sm font-semibold text-slate-700">
          Email
          <input v-model="email" type="email" class="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
        </label>
        <label class="mt-4 block text-sm font-semibold text-slate-700">
          Password
          <input v-model="password" type="password" class="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
        </label>
        <button type="submit" class="mt-6 h-12 w-full rounded-xl bg-teal-800 text-sm font-bold text-white transition hover:bg-teal-900">Login</button>
        <div class="mt-4 flex items-center justify-between text-sm">
          <RouterLink to="/admin/forgot-password" class="font-semibold text-teal-800 hover:underline">Forgot password?</RouterLink>
          <RouterLink to="/" class="font-semibold text-slate-500 hover:text-slate-900">Back to store</RouterLink>
        </div>
      </form>
    </div>
  </main>
</template>
