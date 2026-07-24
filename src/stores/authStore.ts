import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

const AUTH_KEY = 'kampot-admin-auth-v1'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(AUTH_KEY))
  const user = ref({
    name: 'Admin Manager',
    email: 'admin@kompot.com',
    role: 'Administrator',
  })

  const isAuthenticated = computed(() => Boolean(token.value))

  function login(email: string, password: string) {
    if (!email.trim() || !password.trim()) return false
    token.value = `demo-${Date.now()}`
    user.value = {
      name: email.includes('@') ? email.split('@')[0].replace(/[._-]/g, ' ') : 'Admin Manager',
      email,
      role: 'Administrator',
    }
    localStorage.setItem(AUTH_KEY, token.value)
    return true
  }

  function logout() {
    token.value = null
    localStorage.removeItem(AUTH_KEY)
  }

  return { token, user, isAuthenticated, login, logout }
})
