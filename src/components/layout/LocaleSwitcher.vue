<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { AppLocale } from '../../i18n'
import { setAppLocale } from '../../i18n'

const { locale, t } = useI18n()

const options: { code: AppLocale; flag: string; label: string }[] = [
  { code: 'km', flag: '🇰🇭', label: 'ភាសាខ្មែរ' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'zh', flag: '🇨🇳', label: '中文' },
]

function pick(code: AppLocale) {
  setAppLocale(code)
}
</script>

<template>
  <div
    class="flex items-center gap-0.5 rounded-full border border-slate-200/90 bg-slate-50/90 p-0.5 shadow-sm"
    role="group"
    :aria-label="t('nav.language')"
  >
    <button
      v-for="opt in options"
      :key="opt.code"
      type="button"
      class="flex h-8 w-8 items-center justify-center rounded-full text-base leading-none transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 md:h-9 md:w-9 md:text-lg"
      :class="
        locale === opt.code
          ? 'bg-white shadow-sm ring-2 ring-teal-600/35'
          : 'opacity-70 hover:bg-white/80 hover:opacity-100'
      "
      :aria-label="opt.label"
      :aria-pressed="locale === opt.code"
      @click="pick(opt.code)"
    >
      <span aria-hidden="true">{{ opt.flag }}</span>
    </button>
  </div>
</template>
