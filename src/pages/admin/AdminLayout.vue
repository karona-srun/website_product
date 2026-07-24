<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAdminStore } from '../../stores/adminStore'
import { useAuthStore } from '../../stores/authStore'

const route = useRoute()
const router = useRouter()
const admin = useAdminStore()
const auth = useAuthStore()
const sidebarOpen = ref(false)
const notificationOpen = ref(false)
const darkMode = ref(localStorage.getItem('kampot-admin-theme') === 'dark')

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: 'M4 13h6V4H4v9Zm10 7h6V4h-6v16ZM4 20h6v-5H4v5Z' },
  { to: '/admin/products', label: 'Products', icon: 'M4 7h16M4 12h16M4 17h16' },
  { to: '/admin/categories', label: 'Categories', icon: 'M4 6h7v7H4V6Zm9 0h7v7h-7V6ZM4 15h7v3H4v-3Zm9 0h7v3h-7v-3Z' },
  { to: '/admin/branches', label: 'Branches', icon: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6' },
  { to: '/admin/users', label: 'Users', icon: 'M16 21v-2a4 4 0 0 0-8 0v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87' },
  { to: '/admin/roles', label: 'Roles', icon: 'M12 3 4 7v6c0 5 3.5 7.5 8 8 4.5-.5 8-3 8-8V7l-8-4Zm-2 10 1.5 1.5L15 11' },
  { to: '/admin/orders', label: 'Orders', icon: 'M6 2h12v20l-3-2-3 2-3-2-3 2V2Z' },
  { to: '/admin/reports', label: 'Reports', icon: 'M4 19V5M8 19v-8M12 19V9M16 19v-5M20 19V7' },
  { to: '/admin/settings', label: 'Settings', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 15a1.7 1.7 0 0 0 .34 1.87' },
]

const currentTitle = computed(
  () => navItems.find((item) => item.to === route.path)?.label ?? 'Management',
)
const unreadCount = computed(() => admin.notifications.filter((item) => !item.read).length)

watchEffect(() => {
  localStorage.setItem('kampot-admin-theme', darkMode.value ? 'dark' : 'light')
})

function isActive(to: string) {
  return to === '/admin' ? route.path === '/admin' : route.path.startsWith(to)
}

function logout() {
  auth.logout()
  router.push('/admin/login')
}
</script>

<template>
  <div :class="['admin-shell min-h-screen bg-slate-100 text-slate-950 transition-colors', darkMode ? 'admin-dark' : '']">
    <div class="grid min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside
        class="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-slate-200 bg-slate-950 p-5 text-white transition-transform duration-300 lg:static lg:translate-x-0"
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <RouterLink to="/" class="flex items-center gap-3 border-b border-white/10 pb-5" @click="sidebarOpen = false">
          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-400 text-sm font-black text-slate-950">KS</span>
          <span>
            <span class="block text-sm font-bold">Kampot Seafood</span>
            <span class="block text-xs text-slate-400">Admin management</span>
          </span>
        </RouterLink>

        <nav class="mt-5 space-y-1">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition"
            :class="isActive(item.to) ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-300 hover:bg-white/10 hover:text-white'"
            @click="sidebarOpen = false"
          >
            <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path :d="item.icon" />
            </svg>
            {{ item.label }}
          </RouterLink>
        </nav>
      </aside>

      <button v-if="sidebarOpen" type="button" class="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" aria-label="Close sidebar" @click="sidebarOpen = false" />

      <main class="min-w-0">
        <header class="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div class="flex min-h-16 flex-col gap-3 px-4 py-3 sm:px-6 xl:flex-row xl:items-center xl:justify-between xl:px-8">
            <div class="flex items-center gap-3">
              <button type="button" class="rounded-xl border border-slate-200 p-2 lg:hidden" aria-label="Open sidebar" @click="sidebarOpen = true">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
              </button>
              <div>
                <p class="text-xs font-semibold uppercase tracking-wider text-teal-700">Management System</p>
                <h1 class="text-xl font-bold text-slate-950 sm:text-2xl">{{ currentTitle }}</h1>
              </div>
            </div>

            <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
              <label class="relative">
                <span class="sr-only">Search admin</span>
                <svg class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21 21-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" /></svg>
                <input class="h-11 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 text-sm outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100 sm:w-72" placeholder="Search management..." />
              </label>

              <button type="button" class="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold transition hover:bg-slate-50" @click="darkMode = !darkMode">
                {{ darkMode ? 'Light' : 'Dark' }}
              </button>

              <div class="relative">
                <button type="button" class="relative rounded-xl border border-slate-200 bg-white p-2.5 transition hover:bg-slate-50" aria-label="Notifications" @click="notificationOpen = !notificationOpen; admin.markNotificationsRead()">
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM13.7 21a2 2 0 0 1-3.4 0" /></svg>
                  <span v-if="unreadCount" class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">{{ unreadCount }}</span>
                </button>
                <div v-if="notificationOpen" class="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl">
                  <p class="px-2 pb-2 text-sm font-bold text-slate-950">Notifications</p>
                  <div class="space-y-2">
                    <article v-for="item in admin.notifications" :key="item.id" class="rounded-xl bg-slate-50 p-3">
                      <p class="text-sm font-semibold text-slate-950">{{ item.title }}</p>
                      <p class="mt-1 text-xs text-slate-500">{{ item.body }}</p>
                    </article>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <span class="flex h-9 w-9 items-center justify-center rounded-full bg-teal-800 text-xs font-bold text-white">AM</span>
                <span class="hidden sm:block">
                  <span class="block text-sm font-semibold text-slate-950">{{ auth.user.name }}</span>
                  <span class="block text-xs text-slate-500">{{ auth.user.role }}</span>
                </span>
                <button type="button" class="rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100" @click="logout">Logout</button>
              </div>
            </div>
          </div>
        </header>

        <div class="px-4 py-5 sm:px-6 lg:px-8">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>
