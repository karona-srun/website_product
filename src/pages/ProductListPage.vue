<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import AppLayout from '../components/layout/AppLayout.vue'
import RatingStars from '../components/ui/RatingStars.vue'
import type { Product } from '../types/product'
import { useCartStore } from '../stores/cartStore'
import { useProductStore } from '../stores/productStore'

const route = useRoute()
const { t, locale } = useI18n()
const cartStore = useCartStore()
const store = useProductStore()
const loadedImages = ref<Set<number>>(new Set())

/** Aligns with Kampot shop nav; maps each tab to category slug / tags / name hints */
type FilterId = 'all' | 'crab' | 'shrimp' | 'squid' | 'fish' | 'lobster' | 'oyster' | 'condiment'

const filterTabs = computed(() => {
  const ids: FilterId[] = ['all', 'crab', 'shrimp', 'squid', 'fish', 'lobster', 'oyster', 'condiment']
  return ids.map((id) => ({ id, label: t(`filter.${id}`) }))
})

const activeFilter = ref<FilterId>('all')

const slugToFilter = (slug: string): FilterId => {
  const map: Record<string, FilterId> = {
    ក្ដាម: 'crab',
    បង្គារ: 'shrimp',
    បង្កង: 'lobster',
  }
  return map[slug] ?? 'all'
}

function normalizeKhmer(s: string) {
  return s.replace(/\s+/g, ' ').trim()
}

function matchesFilter(product: Product, id: FilterId): boolean {
  const name = normalizeKhmer(product.name)
  switch (id) {
    case 'all':
      return true
    case 'crab':
      return product.category.slug === 'ក្ដាម'
    case 'shrimp':
      return product.category.slug === 'បង្គារ'
    case 'squid':
      return product.tags.some((t) => t.includes('squid')) || name.includes('មឹក')
    case 'fish':
      return product.tags.includes('fish') || name.includes('ត្រី')
    case 'lobster':
      return product.category.slug === 'បង្កង'
    case 'oyster':
      return (
        product.tags.includes('oyster') ||
        name.includes('អយស្ទ័រ') ||
        name.includes('អយស្ទ')
      )
    case 'condiment':
      return (
        product.tags.includes('condiment') ||
        name.includes('ប្រហុក') ||
        name.includes('ទឹកត្រី') ||
        name.includes('ម្រេច')
      )
    default:
      return true
  }
}

/**
 * Business rule: category URLs narrow the catalog; shop filters further within that slice.
 * `/products` uses full catalog + tabs only (category cleared in store).
 */
const products = computed(() =>
  store.filteredProducts.filter((p) => matchesFilter(p, activeFilter.value)),
)

function formatRiel(value: number) {
  return `${value.toLocaleString('en-US')}៛`
}

function markImageLoaded(productId: number) {
  loadedImages.value = new Set(loadedImages.value).add(productId)
}

function setFilter(id: FilterId) {
  activeFilter.value = id
  if (route.name === 'category') return

  if (id === 'all') {
    store.setCategory(null)
    return
  }
  const slugMap: Partial<Record<FilterId, string>> = {
    crab: 'ក្ដាម',
    shrimp: 'បង្គារ',
    lobster: 'បង្កង',
  }
  store.setCategory(slugMap[id] ?? null)
}

function syncShopFiltersFromRoute() {
  if (route.name === 'products') {
    store.setCategory(null)
    activeFilter.value = 'all'
    return
  }
  if (route.name === 'category') {
    const slug = String(route.params.slug)
    activeFilter.value = slugToFilter(slug)
  }
}

onMounted(() => {
  syncShopFiltersFromRoute()
})

watch(
  () => [route.name, route.params.slug] as const,
  () => {
    syncShopFiltersFromRoute()
  },
)
</script>

<template>
  <AppLayout>
    <section class="mx-auto w-full max-w-[1220px] pb-10 pt-0 md:pt-4">
      <nav
        class="mb-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-3 text-sm font-semibold md:mb-10 md:gap-x-5 md:text-base"
        :aria-label="t('shop.filter_aria')"
      >
        <button
          v-for="tab in filterTabs"
          :key="tab.id"
          type="button"
          class="min-h-11 rounded-full border px-4 py-2.5 tracking-wide shadow-sm transition md:px-4 md:py-2"
          :class="[
            locale === 'km' ? 'font-khmer' : '',
            activeFilter === tab.id
              ? 'border-teal-500 bg-teal-800 text-white shadow-md shadow-teal-900/15'
              : 'border-teal-100 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-900',
          ]"
          :aria-pressed="activeFilter === tab.id"
          @click="setFilter(tab.id)"
        >
          {{ tab.label }}
        </button>
      </nav>

      <p v-if="products.length === 0" class="py-16 text-center text-sm text-slate-500">
        {{ t('shop.no_products') }}
      </p>

      <div v-else class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="product in products"
          :key="product.id"
          class="group flex flex-col overflow-hidden rounded-3xl border border-teal-200/90 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition duration-300 hover:scale-[1.02] hover:border-teal-300 hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          <RouterLink
            :to="`/products/${product.id}`"
            class="relative aspect-[4/3] overflow-hidden rounded-t-3xl bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-700"
          >
            <div
              v-if="!loadedImages.has(product.id)"
              class="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-100 via-teal-50 to-slate-200"
              aria-hidden="true"
            />
            <img
              :src="product.images[0]"
              :alt="product.name"
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              :class="loadedImages.has(product.id) ? 'opacity-100' : 'opacity-0'"
              @load="markImageLoaded(product.id)"
            />
          </RouterLink>

          <div class="flex flex-1 flex-col gap-3 px-4 pb-5 pt-4">
            <RouterLink
              :to="`/products/${product.id}`"
              class="rounded-md text-left text-xl leading-snug text-slate-900 transition hover:text-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 md:text-[1.35rem]"
              :class="locale === 'km' ? 'font-khmer' : ''"
            >
              {{ product.name }}
            </RouterLink>
            <div class="flex items-center justify-between gap-3">
              <span class="text-xl font-bold tabular-nums text-[#134e4a] md:text-2xl">
                {{ formatRiel(product.price) }}
              </span>
              <RatingStars class="shrink-0" :rating="product.rating" />
            </div>
            <div class="mt-auto flex items-center gap-2">
              <RouterLink
                :to="`/products/${product.id}`"
                class="inline-flex min-w-0 flex-1 items-center justify-center rounded-full bg-[#134e4a] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#0f3d3a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                :class="locale === 'km' ? 'font-khmer' : ''"
              >
                {{ t('shop.view_details') }}
              </RouterLink>
              <button
                type="button"
                class="ml-auto inline-flex shrink-0 items-center justify-center rounded-full border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-900 transition hover:border-teal-400 hover:bg-teal-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                :class="locale === 'km' ? 'font-khmer' : ''"
                :disabled="product.stock <= 0"
                @click="cartStore.addToCart(product)"
              >
                {{ t('product.add_cart') }}
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>
  </AppLayout>
</template>
