<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AppLayout from '../components/layout/AppLayout.vue'
import { useCartStore } from '../stores/cartStore'

const { t, locale } = useI18n()
const cart = useCartStore()

const orderEmail = 'order@kompot.com'

function formatRiel(value: number) {
  return `${value.toLocaleString('en-US')}៛`
}

const lineTotals = computed(() =>
  cart.items.map((item) => ({
    ...item,
    lineTotal: item.product.price * item.quantity,
  })),
)
</script>

<template>
  <AppLayout>
    <section
      class="relative mb-8 overflow-hidden rounded-3xl border border-teal-800/20 bg-gradient-to-br from-teal-950 via-teal-900 to-cyan-950 px-5 py-8 text-white shadow-soft sm:px-8 sm:py-10"
    >
      <div class="relative">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-200/90">{{ t('cart.kicker') }}</p>
        <h1 class="mt-2 text-2xl font-bold sm:text-3xl" :class="locale === 'km' ? 'font-khmer' : ''">{{ t('cart.title') }}</h1>
        <p class="mt-2 max-w-xl text-sm text-teal-100/95">
          {{ t('cart.intro') }}
        </p>
      </div>
    </section>

    <div v-if="cart.items.length === 0" class="rounded-3xl border border-dashed border-teal-200 bg-white py-16 text-center shadow-soft">
      <p class="text-lg font-semibold text-slate-800" :class="locale === 'km' ? 'font-khmer' : ''">{{ t('cart.empty_title') }}</p>
      <p class="mt-2 text-sm text-slate-500">{{ t('cart.empty_hint') }}</p>
      <RouterLink
        to="/products"
        class="mt-6 inline-flex rounded-xl bg-teal-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-900"
        :class="locale === 'km' ? 'font-khmer' : ''"
      >
        {{ t('cart.cta_shop') }}
      </RouterLink>
    </div>

    <div v-else class="grid gap-8 lg:grid-cols-3">
      <div class="space-y-4 lg:col-span-2">
        <article
          v-for="row in lineTotals"
          :key="row.product.id"
          class="flex gap-4 rounded-2xl border border-teal-100 bg-white p-4 shadow-soft"
        >
          <RouterLink :to="`/products/${row.product.id}`" class="shrink-0 overflow-hidden rounded-xl bg-slate-100">
            <img :src="row.product.images[0]" :alt="row.product.name" class="h-24 w-28 object-cover sm:h-28 sm:w-32" />
          </RouterLink>
          <div class="flex min-w-0 flex-1 flex-col">
            <RouterLink :to="`/products/${row.product.id}`" class="font-khmer font-bold text-slate-900 hover:text-teal-800">
              {{ row.product.name }}
            </RouterLink>
            <p class="mt-1 text-sm font-semibold text-[#134e4a]">
              {{ formatRiel(row.product.price) }} <span class="font-normal text-slate-500">/ {{ t('cart.per_unit') }}</span>
            </p>
            <div class="mt-auto flex flex-wrap items-center gap-3 pt-3">
              <div class="flex items-center rounded-lg border border-slate-200">
                <button
                  type="button"
                  class="px-3 py-1.5 text-lg leading-none text-slate-600 hover:bg-teal-50"
                  :aria-label="t('cart.decrease_qty')"
                  @click="cart.updateQuantity(row.product.id, row.quantity - 1)"
                >
                  −
                </button>
                <span class="min-w-[2rem] text-center text-sm font-semibold tabular-nums">{{ row.quantity }}</span>
                <button
                  type="button"
                  class="px-3 py-1.5 text-lg leading-none text-slate-600 hover:bg-teal-50"
                  :aria-label="t('cart.increase_qty')"
                  @click="cart.updateQuantity(row.product.id, row.quantity + 1)"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                class="flex items-center justify-center gap-1.5 rounded-lg bg-rose-600 px-2 py-1.5 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500"
                :class="locale === 'km' ? 'font-khmer' : ''"
                @click="cart.removeFromCart(row.product.id)"
              >
                <svg
                  class="h-4 w-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  aria-hidden="true"
                >
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v5" />
                  <path d="M14 11v5" />
                </svg>
                {{ t('cart.remove') }}
              </button>
            </div>
          </div>
          <div class="hidden shrink-0 text-right sm:block">
            <p class="text-sm text-slate-500">{{ t('cart.line_total') }}</p>
            <p class="font-bold tabular-nums text-[#134e4a]">{{ formatRiel(row.lineTotal) }}</p>
          </div>
        </article>
      </div>

      <aside class="h-fit rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
        <h2 class="text-lg font-bold text-slate-900" :class="locale === 'km' ? 'font-khmer' : ''">{{ t('cart.summary_title') }}</h2>
        <div class="mt-4 flex justify-between text-sm text-slate-600">
          <span>{{ t('cart.item_count_label') }}</span>
          <span class="font-semibold text-slate-900">{{ cart.totalItems }}</span>
        </div>
        <div class="mt-3 flex justify-between border-t border-teal-50 pt-3">
          <span class="font-semibold text-slate-900">{{ t('cart.total_label') }}</span>
          <span class="text-xl font-bold tabular-nums text-[#134e4a]">{{ formatRiel(cart.totalRiel) }}</span>
        </div>
        <RouterLink
          to="/checkout"
          class="mt-6 flex w-full items-center justify-center rounded-xl bg-teal-800 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-teal-900"
        >
          {{ t('cart.checkout') }}
        </RouterLink>
        <RouterLink
          to="/contact"
          class="mt-3 block text-center text-sm font-medium text-slate-600 hover:text-teal-800 hover:underline"
          :class="locale === 'km' ? 'font-khmer' : ''"
        >
          {{ t('cart.contact_only') }}
        </RouterLink>
        <p class="mt-3 text-center text-xs text-slate-500">
          {{ t('cart.after_checkout_note', { orderEmail }) }}
        </p>
        <RouterLink
          to="/products"
          class="mt-4 block text-center text-sm font-medium text-teal-800 hover:underline"
          :class="locale === 'km' ? 'font-khmer' : ''"
        >
          {{ t('cart.continue_shopping') }}
        </RouterLink>
      </aside>
    </div>
  </AppLayout>
</template>
