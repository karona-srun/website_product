import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { i18n } from './i18n'
import './assets/main.css'
import { useCartStore } from './stores/cartStore'
import { useProductStore } from './stores/productStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(i18n)
app.use(router)
app.mount('#app')

/** Load catalog then restore cart lines — matches retail flow (inventory first, basket second). */
router.isReady().then(async () => {
  const productStore = useProductStore()
  const cartStore = useCartStore()
  await productStore.fetchProducts()
  cartStore.hydrateFromCatalog(productStore.products)
})
