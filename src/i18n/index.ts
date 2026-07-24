import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import km from '../locales/km.json'
import zh from '../locales/zh.json'

export type AppLocale = 'km' | 'en' | 'zh'

export const LOCALE_STORAGE_KEY = 'kampot-locale'

function readSavedLocale(): AppLocale {
  try {
    const v = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (v === 'en' || v === 'km' || v === 'zh') return v
  } catch {
    /* private mode / SSR */
  }
  return 'km'
}

export const i18n = createI18n({
  legacy: false,
  locale: readSavedLocale(),
  fallbackLocale: 'en',
  messages: { en, km, zh },
})

export function setAppLocale(loc: AppLocale) {
  i18n.global.locale.value = loc
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, loc)
  } catch {
    /* ignore */
  }
}
