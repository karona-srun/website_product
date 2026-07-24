<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Product } from '../../types/product'
import { useCartStore } from '../../stores/cartStore'
import RatingStars from './RatingStars.vue'

defineProps<{ product: Product }>()

const { t, locale } = useI18n()
const cartStore = useCartStore()

function formatRiel(value: number) {
  return `${value.toLocaleString('en-US')}៛`
}
</script>

<template>
  <article
    data-product-card
    class="group flex flex-col overflow-hidden rounded-3xl border border-teal-100 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-[0_12px_40px_rgba(15,118,110,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
  >
    <RouterLink
      :to="`/products/${product.id}`"
      class="aspect-[4/3] overflow-hidden bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-600"
    >
      <img
        :src="product.images[0]"
        :alt="product.name"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
      />
    </RouterLink>
    <div class="flex flex-1 flex-col gap-3 p-5">
      <RouterLink
        :to="`/products/${product.id}`"
        class="font-khmer rounded-md text-lg font-bold leading-snug text-slate-900 line-clamp-2 hover:text-teal-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
      >
        {{ product.name }}
      </RouterLink>
      <div class="flex items-center justify-between gap-2">
        <span class="text-lg font-bold text-teal-800">{{ formatRiel(product.price) }}</span>
        <RatingStars :rating="product.rating" />
      </div>
      <div class="mt-auto flex items-center gap-2">
        <RouterLink
          :to="`/products/${product.id}`"
          class="inline-flex min-w-0 flex-1 items-center justify-center rounded-xl bg-teal-800 px-3 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-teal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          :class="locale === 'km' ? 'font-khmer' : ''"
        >
          {{ t('shop.view_details') }}
        </RouterLink>
        <button
          type="button"
          class="ml-auto inline-flex shrink-0 items-center justify-center rounded-xl border border-teal-200 bg-teal-50 px-3 py-2.5 text-sm font-semibold text-teal-900 transition hover:border-teal-400 hover:bg-teal-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
          :class="locale === 'km' ? 'font-khmer' : ''"
          :disabled="product.stock <= 0"
          @click="cartStore.addToCart(product)"
        >
          {{ t('product.add_cart') }}
        </button>
      </div>
    </div>
  </article>
</template>
