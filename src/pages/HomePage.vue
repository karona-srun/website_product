<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AppLayout from '../components/layout/AppLayout.vue'
import ProductCard from '../components/ui/ProductCard.vue'
import { usePrefersReducedMotion } from '../composables/usePrefersReducedMotion'
import { useScrollReveal, useSectionChildStagger } from '../composables/useSectionReveal'
import { playHomeHero } from '../motion/homeHero'
import { useProductStore } from '../stores/productStore'

const { t, locale } = useI18n()
const store = useProductStore()
const prefersReducedMotion = usePrefersReducedMotion()

const freshProducts = computed(() => store.products.slice(0, 100))

const heroRef = ref<HTMLElement | null>(null)
const pageWrapRef = ref<HTMLElement | null>(null)
const productsSectionRef = ref<HTMLElement | null>(null)

useSectionChildStagger(productsSectionRef, '[data-product-card]', {
  disabled: prefersReducedMotion,
})
useScrollReveal(pageWrapRef, '[data-reveal]', { disabled: prefersReducedMotion })

onMounted(() => {
  nextTick(() => {
    playHomeHero(heroRef.value, prefersReducedMotion.value)
  })
})
</script>

<template>
  <AppLayout>
    <div ref="pageWrapRef">
      <!-- Hero -->
      <section
        ref="heroRef"
        class="relative mb-10 overflow-hidden rounded-3xl border border-teal-800/20 bg-gradient-to-br from-teal-950 via-teal-900 to-cyan-950 px-5 py-10 text-white shadow-soft sm:px-8 sm:py-12 md:mb-14 md:px-12 md:py-16"
      >
        <div class="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
        <div class="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />

        <svg
          class="pointer-events-none absolute bottom-0 left-0 right-0 h-24 w-full text-white/30 sm:h-28"
          viewBox="0 0 1200 96"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            id="hero-motion-path"
            d="M0,56 Q320,12 600,52 T1200,48"
            fill="none"
            stroke="currentColor"
            stroke-width="1.25"
            vector-effect="non-scaling-stroke"
          />
        </svg>

        <div class="relative">
          <div data-hero-line class="mb-4 flex flex-wrap items-center gap-2">
            <span class="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-100 backdrop-blur">
              {{ t('home.hero_natural') }}
            </span>
            <span class="rounded-full bg-emerald-500/25 px-3 py-1 text-xs font-semibold text-emerald-100">{{ t('home.hero_fresh') }}</span>
          </div>
          <p
            data-hero-line
            class="mb-2 text-sm font-medium text-teal-200 md:text-base"
            :class="locale === 'km' ? 'font-khmer' : ''"
          >
            {{ t('home.hero_kicker') }}
          </p>
          <h1
            data-hero-line
            class="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl"
            :class="locale === 'km' ? 'font-khmer' : ''"
          >
            {{ t('home.hero_title') }}
          </h1>
          <p data-hero-line class="mt-4 max-w-2xl text-sm leading-relaxed text-teal-100/95 sm:text-base">
            {{ t('home.hero_p1') }}
          </p>
          <p data-hero-line class="mt-3 max-w-2xl text-sm text-teal-200/90">
            {{ t('home.hero_p2') }}
          </p>
          <div data-hero-line class="mt-8 flex flex-wrap gap-3">
            <RouterLink
              to="/products"
              class="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-teal-950 shadow-lg transition hover:bg-teal-50"
              :class="locale === 'km' ? 'font-khmer' : ''"
            >
              {{ t('home.cta_shop') }}
            </RouterLink>
            <RouterLink
              to="/products"
              class="inline-flex items-center justify-center rounded-xl border border-white/35 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              :class="locale === 'km' ? 'font-khmer' : ''"
            >
              {{ t('home.cta_all') }}
            </RouterLink>
          </div>
        </div>
      </section>

      <!-- Fresh prices / products -->
      <section ref="productsSectionRef" class="mb-10 md:mb-14">
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 class="section-title text-slate-950" :class="locale === 'km' ? 'font-khmer' : ''">{{ t('home.section_fresh_title') }}</h2>
            <p class="mt-1 text-sm text-slate-600">{{ t('home.section_fresh_sub') }}</p>
          </div>
          <RouterLink
            to="/products"
            class="inline-flex w-fit items-center rounded-xl bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-900"
            :class="locale === 'km' ? 'font-khmer' : ''"
          >
            {{ t('home.view_all') }}
          </RouterLink>
        </div>
        <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <ProductCard v-for="product in freshProducts" :key="product.id" :product="product" />
        </div>
      </section>

      <!-- B2B -->
      <section data-reveal class="mb-10 rounded-3xl border border-slate-200 bg-slate-900 px-6 py-10 text-white shadow-soft md:mb-14 md:px-10">
        <div class="md:flex md:items-center md:justify-between md:gap-10">
          <div class="max-w-2xl">
            <h2 class="text-xl font-bold sm:text-2xl" :class="locale === 'km' ? 'font-khmer' : ''">{{ t('home.b2b_title') }}</h2>
            <p class="mt-3 text-sm leading-relaxed text-slate-300">
              {{ t('home.b2b_p') }}
            </p>
          </div>
          <RouterLink
            to="/products"
            class="mt-6 inline-flex shrink-0 rounded-xl border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold backdrop-blur transition hover:bg-white/20 md:mt-0"
          >
            {{ t('home.b2b_cta') }}
          </RouterLink>
        </div>
      </section>

      <!-- Contact & location -->
      <section class="grid gap-8 md:grid-cols-2 md:gap-10">
        <div data-reveal class="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft sm:p-8">
          <h3 class="text-lg font-bold text-slate-900" :class="locale === 'km' ? 'font-khmer' : ''">{{ t('home.contact_block_title') }}</h3>
          <dl class="mt-5 space-y-4 text-sm">
            <div>
              <dt class="font-semibold text-slate-900">{{ t('home.fish_market') }}</dt>
              <dd>
                <a href="tel:+85587324192" class="text-teal-800 hover:underline">085 773 007</a>
              </dd>
            </div>
            <div>
              <dt class="font-semibold text-slate-900">{{ t('home.information') }}</dt>
              <dd class="space-y-1 text-slate-600">
                <a href="mailto:info@kompot.com" class="block hover:text-teal-800">info@kompot.com</a>
                <a href="mailto:order@kompot.com" class="block hover:text-teal-800">order@kompot.com</a>
              </dd>
            </div>
          </dl>
          <p class="mt-6 text-xs font-medium uppercase tracking-wide text-slate-500">{{ t('home.social') }}</p>
          <div class="mt-2 flex flex-wrap gap-3 text-sm">
            <a href="#" class="rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-700 transition hover:border-teal-300 hover:text-teal-800">Facebook</a>
            <a href="#" class="rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-700 transition hover:border-teal-300 hover:text-teal-800">Messenger</a>
            <a href="#" class="rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-700 transition hover:border-teal-300 hover:text-teal-800">Telegram</a>
          </div>
        </div>
        <div data-reveal class="rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50 to-white p-6 shadow-soft sm:p-8">
          <h3 class="text-lg font-bold text-slate-900" :class="locale === 'km' ? 'font-khmer' : ''">{{ t('home.location_title') }}</h3>
          <p class="mt-3 text-sm leading-relaxed text-slate-700" :class="locale === 'km' ? 'font-khmer' : ''">
            {{ t('home.location_kh') }}
          </p>
          <p class="mt-2 text-sm text-slate-600">{{ t('home.location_en') }}</p>
          <a href="tel:+85587324192" class="mt-4 inline-flex text-sm font-semibold text-teal-800 hover:underline">085 773 007</a>
          <p class="mt-8 text-xs font-semibold uppercase tracking-wide text-slate-500">{{ t('home.payments_title') }}</p>
          <p class="mt-1 text-sm text-slate-700" :class="locale === 'km' ? 'font-khmer' : ''">{{ t('home.payments_p') }}</p>
        </div>
      </section>
    </div>
  </AppLayout>
</template>
