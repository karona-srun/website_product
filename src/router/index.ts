import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../pages/HomePage.vue') },
    { path: '/products', name: 'products', component: () => import('../pages/ProductListPage.vue') },
    { path: '/products/:id', name: 'product-detail', component: () => import('../pages/ProductDetailPage.vue') },
    { path: '/category/:slug', name: 'category', component: () => import('../pages/CategoryPage.vue') },
    { path: '/contact', name: 'contact', component: () => import('../pages/ContactPage.vue') },
    { path: '/cart', name: 'cart', component: () => import('../pages/CartPage.vue') },
    { path: '/checkout', name: 'checkout', component: () => import('../pages/CheckoutPage.vue') },
    { path: '/admin/login', name: 'admin-login', component: () => import('../pages/admin/AdminLoginPage.vue') },
    { path: '/admin/forgot-password', name: 'admin-forgot-password', component: () => import('../pages/admin/AdminForgotPasswordPage.vue') },
    {
      path: '/admin',
      component: () => import('../pages/admin/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'admin-dashboard', component: () => import('../pages/admin/AdminOverviewPage.vue') },
        { path: 'products', name: 'admin-products', component: () => import('../pages/admin/AdminProductsPage.vue') },
        { path: 'categories', name: 'admin-categories', component: () => import('../pages/admin/AdminCategoriesPage.vue') },
        { path: 'branches', name: 'admin-branches', component: () => import('../pages/admin/AdminBranchesPage.vue') },
        { path: 'users', name: 'admin-users', component: () => import('../pages/admin/AdminUsersPage.vue') },
        { path: 'customers', redirect: '/admin/users' },
        { path: 'roles', name: 'admin-roles', component: () => import('../pages/admin/AdminRolesPage.vue') },
        { path: 'orders', name: 'admin-orders', component: () => import('../pages/admin/AdminOrdersPage.vue') },
        { path: 'reports', name: 'admin-reports', component: () => import('../pages/admin/AdminReportsPage.vue') },
        { path: 'settings', name: 'admin-settings', component: () => import('../pages/admin/AdminSettingsPage.vue') },
      ],
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  if (!to.matched.some((record) => record.meta.requiresAuth)) return true
  const auth = useAuthStore()
  if (auth.isAuthenticated) return true
  return { path: '/admin/login', query: { redirect: to.fullPath } }
})

export default router
