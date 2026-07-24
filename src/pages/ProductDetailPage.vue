<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import AppLayout from '../components/layout/AppLayout.vue'
import Breadcrumb from '../components/ui/Breadcrumb.vue'
import ProductCard from '../components/ui/ProductCard.vue'
import RatingStars from '../components/ui/RatingStars.vue'
import { useCartStore } from '../stores/cartStore'
import { useProductStore } from '../stores/productStore'

const route = useRoute()
const { t, locale } = useI18n()
const productStore = useProductStore()
const cartStore = useCartStore()

const product = computed(() => productStore.productById(Number(route.params.id)))

const breadcrumbItems = computed(() => {
  const p = product.value
  if (!p) return []
  return [
    { label: t('product.breadcrumb_home'), to: '/' },
    { label: t('product.breadcrumb_shop'), to: '/products' },
    { label: p.name },
  ]
})

const selectedImage = ref(0)

const mainImageSrc = computed(() => {
  const p = product.value
  if (!p?.images?.length) return ''
  const i = Math.min(Math.max(0, selectedImage.value), p.images.length - 1)
  return p.images[i]
})

watch(
  () => route.params.id,
  () => {
    selectedImage.value = 0
  },
)

watch(product, (p) => {
  if (p && p.images.length > 0 && selectedImage.value >= p.images.length) {
    selectedImage.value = 0
  }
})

const relatedProducts = computed(() => {
  if (!product.value) return []
  return productStore
    .productsByCategory(product.value.category.slug)
    .filter((entry) => entry.id !== product.value?.id)
    .slice(0, 4)
})

function formatRiel(value: number) {
  return `${value.toLocaleString('en-US')}៛`
}

</script>

<template>
  <AppLayout>
    <template v-if="product">
      <Breadcrumb :items="breadcrumbItems" />

      <!-- Hero — same language as HomePage -->
      <section
        class="relative mb-10 overflow-hidden rounded-3xl border border-teal-800/20 bg-gradient-to-br from-teal-950 via-teal-900 to-cyan-950 px-5 py-8 text-white shadow-soft sm:px-8 sm:py-10 md:mb-12"
      >
        <div class="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div class="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />
        <div class="relative">
          <div class="mb-3 flex flex-wrap items-center gap-2">
            <span
              class="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-100 backdrop-blur"
              :class="locale === 'km' ? 'font-khmer' : ''"
            >
              {{ t('product.badge_seafood') }}
            </span>
            <span class="rounded-full bg-emerald-500/25 px-3 py-1 text-xs font-semibold text-emerald-100">{{ t('product.badge_fresh') }}</span>
          </div>
          <h1 class="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl" :class="locale === 'km' ? 'font-khmer' : ''">
            {{ product.name }}
          </h1>
          <p class="mt-3 max-w-2xl text-sm leading-relaxed text-teal-100/95">
            {{ t('product.hero_sub') }}
          </p>
        </div>
      </section>

      <!-- Detail grid — contact-card style from HomePage -->
      <section
        class="grid gap-8 overflow-hidden rounded-3xl border border-teal-100 bg-white p-5 shadow-soft sm:p-6 lg:grid-cols-2 lg:gap-10 lg:p-8"
      >
        <div class="min-w-0">
          <div class="overflow-hidden rounded-2xl border border-teal-100/80 bg-slate-100">
            <img v-if="mainImageSrc" :src="mainImageSrc" :alt="product.name" class="aspect-[4/3] w-full object-cover" />
          </div>
          <div v-if="product.images.length > 1" class="mt-3 flex flex-wrap gap-2">
            <button
              v-for="(image, index) in product.images"
              :key="image"
              type="button"
              class="h-14 w-14 overflow-hidden rounded-lg border-2 transition sm:h-16 sm:w-16"
              :class="index === selectedImage ? 'border-teal-600 ring-2 ring-teal-500/25' : 'border-slate-200 hover:border-teal-300'"
              :aria-label="t('product.preview_num', { n: index + 1 })"
              @click="selectedImage = index"
            >
              <img :src="image" :alt="`${product.name} preview ${index + 1}`" class="h-full w-full object-cover" />
            </button>
          </div>
        </div>

        <div class="flex min-w-0 flex-col lg:pt-1">
          <p class="mb-2 inline-flex w-fit rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-900">
            {{ product.category.name }}
          </p>
          <h2 class="text-2xl font-bold leading-tight text-slate-950 md:text-3xl" :class="locale === 'km' ? 'font-khmer' : ''">
            {{ product.name }}
          </h2>
          <div class="mt-3 flex flex-wrap items-center gap-3">
            <RatingStars :rating="product.rating" />
            <span class="text-sm text-slate-500">{{ t('product.reviews', { n: product.reviewCount }) }}</span>
          </div>
          <p class="mt-4 text-3xl font-bold tracking-tight text-teal-800 md:text-4xl">
            {{ formatRiel(product.price) }}
          </p>
          <p class="mt-5 leading-relaxed text-slate-600">{{ product.description }}</p>
          <p class="mt-4 text-sm font-medium" :class="product.stock > 0 ? 'text-emerald-700' : 'text-rose-600'">
            {{ product.stock > 0 ? t('product.in_stock', { n: product.stock }) : t('product.out_of_stock') }}
          </p>
          <div v-if="product.tags.length" class="mt-4 flex flex-wrap gap-2">
            <span
              v-for="tag in product.tags"
              :key="tag"
              class="inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold capitalize text-teal-900"
            >
              {{ tag }}
            </span>
          </div>
          <div class="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl bg-teal-800 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-teal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="product.stock <= 0"
              @click="cartStore.addToCart(product)"
            >
              {{ t('product.add_cart') }}
            </button>
            <RouterLink
              to="/products"
              class="inline-flex items-center justify-center rounded-xl border border-teal-200 bg-white px-6 py-3 text-sm font-semibold text-teal-900 transition hover:border-teal-400 hover:bg-teal-50"
              :class="locale === 'km' ? 'font-khmer' : ''"
            >
              {{ t('product.view_all_seafood') }}
            </RouterLink>
          </div>

          <table v-if="product.specs" class="mt-10 w-full border-collapse overflow-hidden rounded-xl border border-teal-100 text-sm shadow-sm">
            <tbody>
              <tr v-for="(value, key) in product.specs" :key="key" class="border-b border-teal-50 last:border-b-0">
                <td class="w-[40%] bg-teal-50/80 px-4 py-3 font-medium text-slate-800">{{ key }}</td>
                <td class="px-4 py-3 text-slate-600">{{ value }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Related — same section rhythm as HomePage product block -->
      <section v-if="relatedProducts.length" class="mb-10 mt-12 md:mb-14">
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 class="section-title text-slate-950" :class="locale === 'km' ? 'font-khmer' : ''">{{ t('product.related_title') }}</h2>
            <p class="mt-1 text-sm text-slate-600">{{ t('product.related_sub') }}</p>
          </div>
          <RouterLink
            to="/products"
            class="inline-flex w-fit items-center rounded-xl bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-900"
            :class="locale === 'km' ? 'font-khmer' : ''"
          >
            {{ t('product.view_all') }}
          </RouterLink>
        </div>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <ProductCard v-for="item in relatedProducts" :key="item.id" :product="item" />
        </div>
      </section>
    </template>
    <p
      v-else
      class="rounded-3xl border border-dashed border-teal-200 bg-white p-10 text-center text-slate-600 shadow-soft"
    >
      {{ t('product.not_found') }}
    </p>
  </AppLayout>
</template>
