<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="mt-16 border-t border-teal-100 bg-white">
    <div class="container-shell grid gap-8 py-10 text-sm text-slate-600 md:grid-cols-4">
      <div class="md:col-span-2">
        <h3 class="text-lg font-bold text-slate-900" :class="locale === 'km' ? 'font-khmer' : ''">{{ t('footer.title') }}</h3>
        <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-teal-800">{{ t('footer.tagline') }}</p>
        <p class="mt-3 max-w-md leading-relaxed">
          {{ t('footer.blurb') }}
        </p>
      </div>
      <div>
        <h4 class="font-semibold text-slate-900">{{ t('footer.links') }}</h4>
        <div class="mt-2 flex flex-col gap-1">
          <RouterLink to="/" class="hover:text-teal-800" :class="locale === 'km' ? 'font-khmer' : ''">{{ t('nav.home') }}</RouterLink>
          <RouterLink to="/products" class="hover:text-teal-800" :class="locale === 'km' ? 'font-khmer' : ''">{{ t('nav.shop') }}</RouterLink>
          <RouterLink to="/cart" class="hover:text-teal-800" :class="locale === 'km' ? 'font-khmer' : ''">{{ t('cart.title') }}</RouterLink>
          <RouterLink to="/contact" class="hover:text-teal-800" :class="locale === 'km' ? 'font-khmer' : ''">{{ t('nav.contact') }}</RouterLink>
        </div>
      </div>
      <div>
        <h4 class="font-semibold text-slate-900">{{ t('footer.contact') }}</h4>
        <div class="mt-2 flex flex-col gap-1">
          <a href="mailto:info@kompot.com" class="hover:text-teal-800">info@kompot.com</a>
          <a href="mailto:order@kompot.com" class="hover:text-teal-800">order@kompot.com</a>
          <a href="tel:+85587324192" class="hover:text-teal-800">085 773 007</a>
        </div>
      </div>
    </div>
    <div class="border-t border-slate-100 py-4 text-center text-xs text-slate-500">
      © {{ year }} Kampot Seafood — <span :class="locale === 'km' ? 'font-khmer' : ''">{{ t('footer.copyright') }}</span>
    </div>
  </footer>
</template>
