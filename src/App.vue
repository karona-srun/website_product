<script setup lang="ts">
import { watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'
import MotionCursor from './components/motion/MotionCursor.vue'

const { locale } = useI18n()

const htmlLang: Record<string, string> = {
  km: 'km',
  en: 'en',
  zh: 'zh-CN',
}

watchEffect(() => {
  document.documentElement.lang = htmlLang[locale.value] ?? 'en'
})
</script>

<template>
  <MotionCursor />
  <RouterView />
</template>
