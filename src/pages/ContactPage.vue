<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import AppLayout from '../components/layout/AppLayout.vue'

const route = useRoute()
const { t, locale } = useI18n()

const exampleEmailPlaceholder = 'you@example.com'
const checkoutSuccess = computed(() => route.query.checkout === 'success')

const name = ref('')
const email = ref('')
const message = ref('')
const submitted = ref(false)

function onSubmit() {
  submitted.value = true
}
</script>

<template>
  <AppLayout>
    <section
      class="relative mb-10 overflow-hidden rounded-3xl border border-teal-800/20 bg-gradient-to-br from-teal-950 via-teal-900 to-cyan-950 px-5 py-10 text-white shadow-soft sm:px-8 sm:py-12 md:mb-12 md:px-12"
    >
      <div class="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl" />
      <div class="pointer-events-none absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-teal-400/10 blur-3xl" />
      <div class="relative">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-200/90">{{ t('contact.hero_kicker') }}</p>
        <h1 class="mt-2 text-3xl font-bold leading-tight sm:text-4xl" :class="locale === 'km' ? 'font-khmer' : ''">{{ t('contact.title') }}</h1>
        <p class="mt-3 max-w-2xl text-sm leading-relaxed text-teal-100/95">
          {{ t('contact.hero_sub') }}
        </p>
      </div>
    </section>

    <div
      v-if="checkoutSuccess"
      class="mb-8 rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900 shadow-soft"
      role="status"
    >
      <p class="font-semibold">{{ t('contact.success_title') }}</p>
      <p class="mt-1 text-teal-800/90">
        {{ t('contact.success_p') }}
      </p>
    </div>

    <div class="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <div class="rounded-3xl border border-teal-100 bg-white p-6 shadow-soft sm:p-8">
        <h2 class="text-lg font-bold text-slate-900" :class="locale === 'km' ? 'font-khmer' : ''">{{ t('contact.info_title') }}</h2>
        <dl class="mt-6 space-y-5 text-sm text-slate-600">
          <div>
            <dt class="font-semibold text-slate-900">{{ t('contact.fish_market') }}</dt>
            <dd class="mt-1">
              <a href="tel:+85587324192" class="text-teal-800 hover:underline">085 773 007</a>
            </dd>
          </div>
          <div>
            <dt class="font-semibold text-slate-900">{{ t('contact.email') }}</dt>
            <dd class="mt-1 space-y-1">
              <a href="mailto:info@kompot.com" class="block hover:text-teal-800">info@kompot.com</a>
              <a href="mailto:order@kompot.com" class="block hover:text-teal-800">order@kompot.com</a>
            </dd>
          </div>
          <div>
            <dt class="font-semibold text-slate-900">{{ t('contact.location') }}</dt>
            <dd class="mt-1 leading-relaxed" :class="locale === 'km' ? 'font-khmer' : ''">
              {{ t('contact.location_kh') }}
            </dd>
            <dd class="mt-1 text-slate-500">{{ t('contact.location_en') }}</dd>
          </div>
        </dl>
        <p class="mt-8 text-xs font-medium uppercase tracking-wide text-slate-500">{{ t('contact.social') }}</p>
        <div class="mt-3 flex flex-wrap gap-3">
          <a href="#" class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-300 hover:text-teal-800">Facebook</a>
          <a href="#" class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-300 hover:text-teal-800">Messenger</a>
          <a href="#" class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-teal-300 hover:text-teal-800">Telegram</a>
        </div>
      </div>

      <div class="rounded-3xl border border-teal-100 bg-gradient-to-br from-teal-50/80 to-white p-6 shadow-soft sm:p-8">
        <h2 class="text-lg font-bold text-slate-900" :class="locale === 'km' ? 'font-khmer' : ''">{{ t('contact.form_title') }}</h2>
        <p class="mt-2 text-sm text-slate-600">{{ t('contact.form_hint') }}</p>

        <div
          v-if="submitted"
          class="mt-6 rounded-2xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-900"
          role="status"
          :class="locale === 'km' ? 'font-khmer' : ''"
        >
          {{ t('contact.form_thanks') }}
        </div>

        <form v-else class="mt-6 space-y-4" @submit.prevent="onSubmit">
          <div>
            <label for="contact-name" class="block text-xs font-semibold uppercase tracking-wide text-slate-600">{{ t('contact.name') }}</label>
            <input
              id="contact-name"
              v-model="name"
              type="text"
              name="name"
              required
              autocomplete="name"
              class="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none ring-teal-500/30 transition focus:border-teal-400 focus:ring-2"
              :placeholder="t('contact.placeholder_name')"
            />
          </div>
          <div>
            <label for="contact-email" class="block text-xs font-semibold uppercase tracking-wide text-slate-600">{{ t('contact.email_label') }}</label>
            <input
              id="contact-email"
              v-model="email"
              type="email"
              name="email"
              required
              autocomplete="email"
              class="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-500/30"
              :placeholder="t('contact.placeholder_email', { exampleEmail: exampleEmailPlaceholder })"
            />
          </div>
          <div>
            <label for="contact-message" class="block text-xs font-semibold uppercase tracking-wide text-slate-600">{{ t('contact.message') }}</label>
            <textarea
              id="contact-message"
              v-model="message"
              name="message"
              required
              rows="4"
              class="mt-1.5 w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-500/30"
              :placeholder="t('contact.placeholder_message')"
            />
          </div>
          <button
            type="submit"
            class="w-full rounded-xl bg-teal-800 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            :class="locale === 'km' ? 'font-khmer' : ''"
          >
            {{ t('contact.send') }}
          </button>
        </form>
      </div>
    </div>
  </AppLayout>
</template>
