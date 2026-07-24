<script setup lang="ts">
import { animate, stagger } from 'animejs'
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { usePrefersReducedMotion } from '../../composables/usePrefersReducedMotion'
import { duration, ease } from '../../motion/tokens'
import { useCartStore } from '../../stores/cartStore'
import LocaleSwitcher from './LocaleSwitcher.vue'

const route = useRoute()
const { t, locale } = useI18n()
const cartStore = useCartStore()
const menuOpen = ref(false)
const headerRef = ref<HTMLElement | null>(null)
const prefersReducedMotion = usePrefersReducedMotion()

const links = computed(() => [
  { to: '/', label: t('nav.home') },
  { to: '/products', label: t('nav.shop') },
  { to: '/contact', label: t('nav.contact') },
  { to: '/admin', label: t('nav.admin') },
])

const isActive = (to: string) => (to === '/' ? route.path === '/' : route.path.startsWith(to))

function formatRiel(value: number) {
  return `${value.toLocaleString('en-US')}៛`
}

const cartTotalLabel = computed(() => formatRiel(cartStore.totalRiel))
const cartBadge = computed(() => t('nav.cart_badge', { count: cartStore.totalItems }))

const navHoverCleanups: Array<() => void> = []

onMounted(() => {
  if (prefersReducedMotion.value) return

  nextTick(() => {
    const root = headerRef.value
    if (!root) return

    const items = root.querySelectorAll<HTMLElement>('[data-nav-item]')
    items.forEach((el) => {
      el.style.opacity = '0'
      el.style.transform = 'translate3d(0, -10px, 0)'
    })

    requestAnimationFrame(() => {
      animate(items, {
        opacity: [0, 1],
        y: [-10, 0],
        duration: duration.navItem,
        delay: stagger(44, { start: 40 }),
        ease: ease.intro,
        complete: () => {
          items.forEach((el) => el.style.removeProperty('will-change'))
        },
      })
    })

    items.forEach((el) => {
      const enter = () => {
        animate(el, { y: -2, duration: duration.linkHover, ease: ease.hover })
      }
      const leave = () => {
        animate(el, { y: 0, duration: duration.linkHover + 40, ease: ease.intro })
      }
      el.addEventListener('mouseenter', enter)
      el.addEventListener('mouseleave', leave)
      navHoverCleanups.push(() => {
        el.removeEventListener('mouseenter', enter)
        el.removeEventListener('mouseleave', leave)
      })
    })
  })
})

onUnmounted(() => {
  navHoverCleanups.forEach((fn) => fn())
  navHoverCleanups.length = 0
})
</script>

<template>
  <header ref="headerRef" class="sticky top-0 z-40 border-b border-teal-100/80 bg-white/95 backdrop-blur">
    <div class="border-b border-slate-100 bg-teal-950 text-teal-50">
      <div class="container-shell flex h-[45px] flex-wrap items-center justify-between gap-x-4 gap-y-1 py-1 text-[11px] sm:h-[45px] sm:justify-between sm:text-xs">
        <a href="tel:+85587324192" class="font-medium hover:text-white">+855 85 773 007</a>
        <span class="text-center sm:inline sm:-ml-4" :class="locale === 'km' ? 'font-khmer' : ''">{{ t('nav.top_bar_location') }}</span>
      </div>
    </div>
    <div class="container-shell flex h-16 items-center justify-between gap-3">
      <RouterLink to="/" data-nav-item class="inline-flex min-w-0 flex-1 items-center gap-2 text-base font-semibold text-teal-900 md:flex-none">
        <span class="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-800 text-xs font-bold text-white">KS</span>
        <span class="min-w-0 leading-tight">
          <span class="block text-sm font-bold" :class="locale === 'km' ? 'font-khmer' : ''">{{ t('nav.brand_line') }}</span>
          <span class="block text-[10px] font-semibold uppercase tracking-wider text-teal-700">{{ t('nav.brand_sub') }}</span>
        </span>
      </RouterLink>
      <button
        type="button"
        class="shrink-0 rounded-lg px-2 py-1 text-lg text-slate-700 md:hidden"
        :aria-label="menuOpen ? t('nav.close_menu') : t('nav.open_menu')"
        @click="menuOpen = !menuOpen"
      >
        {{ menuOpen ? '✕' : '☰' }}
      </button>
      <nav class="hidden items-center gap-1 md:flex">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          data-nav-item
          :to="link.to"
          class="rounded-lg px-3 py-2 text-sm font-medium transition"
          :class="isActive(link.to) ? 'bg-teal-100 text-teal-950' : 'text-slate-600 hover:bg-teal-50 hover:text-slate-900'"
        >
          <span :class="locale === 'km' ? 'font-khmer' : ''">{{ link.label }}</span>
        </RouterLink>
        <a href="#" data-nav-item class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-teal-50 hover:text-slate-900">
          <span :class="locale === 'km' ? 'font-khmer' : ''">{{ t('nav.account') }}</span>
        </a>
        <div data-nav-item class="ml-1 flex items-center">
          <LocaleSwitcher />
        </div>
        <RouterLink
          to="/cart"
          data-nav-item
          class="ml-2 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition"
          :class="
            isActive('/cart')
              ? 'bg-teal-950 text-white ring-2 ring-teal-400/40'
              : 'bg-teal-800 text-white hover:bg-teal-900'
          "
        >
          <span class="tabular-nums">{{ cartTotalLabel }}</span>
          <span class="max-w-[8rem] truncate sm:max-w-none" :class="locale === 'km' ? 'font-khmer' : ''">{{ cartBadge }}</span>
        </RouterLink>
      </nav>
    </div>
    <nav v-if="menuOpen" class="container-shell mb-3 flex flex-col gap-2 rounded-xl border border-teal-100 bg-white p-3 shadow-soft md:hidden">
      <RouterLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-teal-50"
        @click="menuOpen = false"
      >
        <span :class="locale === 'km' ? 'font-khmer' : ''">{{ link.label }}</span>
      </RouterLink>
      <a href="#" class="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-800 hover:bg-teal-50">
        <span :class="locale === 'km' ? 'font-khmer' : ''">{{ t('nav.account') }}</span>
      </a>
      <div class="flex justify-center py-2">
        <LocaleSwitcher />
      </div>
      <RouterLink
        to="/cart"
        class="mt-1 flex flex-col rounded-lg bg-teal-800 px-3 py-2.5 text-center text-sm font-semibold text-white"
        @click="menuOpen = false"
      >
        <span class="tabular-nums">{{ cartTotalLabel }}</span>
        <span :class="locale === 'km' ? 'font-khmer' : ''">{{ cartBadge }}</span>
      </RouterLink>
    </nav>
  </header>
</template>
