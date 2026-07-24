<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppLayout from '../components/layout/AppLayout.vue'
import { useCartStore } from '../stores/cartStore'

const router = useRouter()
const { t, locale } = useI18n()
const cart = useCartStore()

const lineTotals = computed(() =>
  cart.items.map((item) => ({
    ...item,
    lineTotal: item.product.price * item.quantity,
  })),
)

const form = reactive({
  firstName: '',
  lastName: '',
  location: '',
  country: 'KH',
  streetAddress: '',
  city: '',
  state: '',
  postcode: '',
  phone: '',
  email: '',
  createAccount: false,
  shipDifferent: false,
  shipStreet: '',
  shipCity: '',
  shipState: '',
  shipPostcode: '',
  orderNotes: '',
  paymentMethod: 'aba-khqr' as 'aba-khqr' | 'cod',
  agreeTerms: false,
})

const errors = reactive<Record<string, string>>({})

const refundPolicyOpen = ref(false)
const refundPolicyId = 'checkout-refund-policy'
const refundPolicyHeadingId = 'checkout-refund-policy-heading'

const locations = computed(() => [
  { value: '', label: t('checkout.loc_select') },
  { value: 'samaki-market', label: t('checkout.loc_samaki') },
  { value: 'kampot-delivery', label: t('checkout.loc_kampot_delivery') },
  { value: 'kampot-province', label: t('checkout.loc_kampot_province') },
  { value: 'phnom-penh', label: t('checkout.loc_pp') },
])

function formatRiel(value: number) {
  return `${value.toLocaleString('en-US')}៛`
}

function validate(): boolean {
  for (const k of Object.keys(errors)) delete errors[k]

  const req = (field: string, labelKey: string, value: string) => {
    if (!value.trim()) errors[field] = t('validation.required', { field: t(labelKey) })
  }

  req('firstName', 'checkout.first_name', form.firstName)
  req('lastName', 'checkout.last_name', form.lastName)
  req('streetAddress', 'checkout.street', form.streetAddress)
  req('city', 'checkout.city', form.city)
  req('state', 'checkout.state', form.state)
  req('postcode', 'checkout.postcode', form.postcode)

  const em = form.email.trim()
  if (!em) errors.email = t('validation.email_required')
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) errors.email = t('validation.email_invalid')

  if (!form.location) {
    errors.location = t('validation.location_error')
  }

  if (form.shipDifferent) {
    if (!form.shipStreet.trim()) errors.shipStreet = t('validation.ship_street')
    if (!form.shipCity.trim()) errors.shipCity = t('validation.ship_city')
    if (!form.shipState.trim()) errors.shipState = t('validation.ship_state')
    if (!form.shipPostcode.trim()) errors.shipPostcode = t('validation.ship_postcode')
  }

  if (!form.agreeTerms) {
    errors.agreeTerms = t('validation.terms_required')
  }

  return Object.keys(errors).length === 0
}

async function onSubmit() {
  if (!cart.totalItems) return
  if (!validate()) return

  await router.push({ path: '/contact', query: { checkout: 'success' } })
  cart.clearCart()
}

onMounted(() => {
  if (!cart.totalItems) {
    router.replace({ path: '/cart' })
  }
})
</script>

<template>
  <AppLayout>
    <section
      class="relative mb-8 overflow-hidden rounded-3xl border border-teal-800/20 bg-gradient-to-br from-teal-950 via-teal-900 to-cyan-950 px-5 py-8 text-white shadow-soft sm:px-8 sm:py-10"
    >
      <div class="relative">
        <p class="text-xs font-semibold uppercase tracking-wider text-teal-200/90">{{ t('checkout.title_kicker') }}</p>
        <h1 class="mt-2 text-2xl font-bold sm:text-3xl" :class="locale === 'km' ? 'font-khmer' : ''">{{ t('checkout.title') }}</h1>
        <p class="mt-2 max-w-xl text-sm text-teal-100/95">{{ t('checkout.intro') }}</p>
      </div>
    </section>

    <form class="grid gap-10 lg:grid-cols-12 lg:gap-12" @submit.prevent="onSubmit">
      <div class="lg:col-span-7">
        <h2 class="border-b border-teal-100 pb-3 text-xl font-bold text-slate-900" :class="locale === 'km' ? 'font-khmer' : ''">
          {{ t('checkout.billing_title') }}
        </h2>

        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label for="checkout-first" class="block text-sm font-medium text-slate-700"
              >{{ t('checkout.first_name') }} <span class="text-rose-600">*</span></label
            >
            <input
              id="checkout-first"
              v-model="form.firstName"
              type="text"
              autocomplete="given-name"
              class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none ring-teal-500/20 focus:border-teal-500 focus:ring-2"
              :class="errors.firstName ? 'border-rose-400' : ''"
            />
            <p v-if="errors.firstName" class="mt-1 text-xs text-rose-600">{{ errors.firstName }}</p>
          </div>
          <div>
            <label for="checkout-last" class="block text-sm font-medium text-slate-700"
              >{{ t('checkout.last_name') }} <span class="text-rose-600">*</span></label
            >
            <input
              id="checkout-last"
              v-model="form.lastName"
              type="text"
              autocomplete="family-name"
              class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              :class="errors.lastName ? 'border-rose-400' : ''"
            />
            <p v-if="errors.lastName" class="mt-1 text-xs text-rose-600">{{ errors.lastName }}</p>
          </div>
        </div>

        <div class="mt-4">
          <label for="checkout-location" class="block text-sm font-medium text-slate-700"
            >{{ t('checkout.location') }} <span class="text-rose-600">*</span></label
          >
          <select
            id="checkout-location"
            v-model="form.location"
            class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            :class="errors.location ? 'border-rose-400' : ''"
          >
            <option v-for="opt in locations" :key="opt.value || 'empty'" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
          <p v-if="errors.location" class="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{{ errors.location }}</p>
        </div>

        <div class="mt-4">
          <label for="checkout-country" class="block text-sm font-medium text-slate-700"
            >{{ t('checkout.country') }} <span class="text-rose-600">*</span></label
          >
          <select
            id="checkout-country"
            v-model="form.country"
            disabled
            class="mt-1 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700"
          >
            <option value="KH">{{ t('checkout.country_cambodia') }}</option>
          </select>
        </div>

        <div class="mt-4">
          <label for="checkout-street" class="block text-sm font-medium text-slate-700"
            >{{ t('checkout.street') }} <span class="text-rose-600">*</span></label
          >
          <input
            id="checkout-street"
            v-model="form.streetAddress"
            type="text"
            autocomplete="street-address"
            :placeholder="t('checkout.street_ph')"
            class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            :class="errors.streetAddress ? 'border-rose-400' : ''"
          />
          <p v-if="errors.streetAddress" class="mt-1 text-xs text-rose-600">{{ errors.streetAddress }}</p>
        </div>

        <div class="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label for="checkout-city" class="block text-sm font-medium text-slate-700"
              >{{ t('checkout.city') }} <span class="text-rose-600">*</span></label
            >
            <input
              id="checkout-city"
              v-model="form.city"
              type="text"
              autocomplete="address-level2"
              class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              :class="errors.city ? 'border-rose-400' : ''"
            />
            <p v-if="errors.city" class="mt-1 text-xs text-rose-600">{{ errors.city }}</p>
          </div>
          <div>
            <label for="checkout-state" class="block text-sm font-medium text-slate-700"
              >{{ t('checkout.state') }} <span class="text-rose-600">*</span></label
            >
            <input
              id="checkout-state"
              v-model="form.state"
              type="text"
              autocomplete="address-level1"
              class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              :class="errors.state ? 'border-rose-400' : ''"
            />
            <p v-if="errors.state" class="mt-1 text-xs text-rose-600">{{ errors.state }}</p>
          </div>
        </div>

        <div class="mt-4">
          <label for="checkout-postcode" class="block text-sm font-medium text-slate-700"
            >{{ t('checkout.postcode') }} <span class="text-rose-600">*</span></label
          >
          <input
            id="checkout-postcode"
            v-model="form.postcode"
            type="text"
            autocomplete="postal-code"
            class="mt-1 w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            :class="errors.postcode ? 'border-rose-400' : ''"
          />
          <p v-if="errors.postcode" class="mt-1 text-xs text-rose-600">{{ errors.postcode }}</p>
        </div>

        <div class="mt-4">
          <label for="checkout-phone" class="block text-sm font-medium text-slate-700">
            {{ t('checkout.phone') }} <span class="text-slate-400">{{ t('checkout.phone_optional') }}</span>
          </label>
          <input
            id="checkout-phone"
            v-model="form.phone"
            type="tel"
            autocomplete="tel"
            placeholder="+855 …"
            class="mt-1 w-full max-w-md rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <div class="mt-4">
          <label for="checkout-email" class="block text-sm font-medium text-slate-700"
            >{{ t('checkout.email') }} <span class="text-rose-600">*</span></label
          >
          <input
            id="checkout-email"
            v-model="form.email"
            type="email"
            required
            autocomplete="email"
            class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
            :class="errors.email ? 'border-rose-400' : ''"
          />
          <p v-if="errors.email" class="mt-1 text-xs text-rose-600">{{ errors.email }}</p>
        </div>

        <label class="mt-6 flex cursor-pointer items-center gap-3 text-sm text-slate-700">
          <input v-model="form.createAccount" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-teal-800 focus:ring-teal-600" />
          {{ t('checkout.create_account') }}
        </label>

        <label class="mt-4 flex cursor-pointer items-center gap-3 text-sm text-slate-700">
          <input v-model="form.shipDifferent" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-teal-800 focus:ring-teal-600" />
          {{ t('checkout.ship_different') }}
        </label>

        <div v-if="form.shipDifferent" class="mt-6 space-y-4 rounded-2xl border border-teal-100 bg-teal-50/40 p-4">
          <h3 class="text-sm font-semibold text-slate-900">{{ t('checkout.shipping_title') }}</h3>
          <div>
            <label class="block text-sm text-slate-700">{{ t('checkout.street') }} <span class="text-rose-600">*</span></label>
            <input
              v-model="form.shipStreet"
              type="text"
              class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm"
              :class="errors.shipStreet ? 'border-rose-400' : ''"
            />
            <p v-if="errors.shipStreet" class="mt-1 text-xs text-rose-600">{{ errors.shipStreet }}</p>
          </div>
          <div class="grid gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm text-slate-700">{{ t('checkout.city') }} <span class="text-rose-600">*</span></label>
              <input
                v-model="form.shipCity"
                type="text"
                class="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                :class="errors.shipCity ? 'border border-rose-400' : 'border-slate-200'"
              />
              <p v-if="errors.shipCity" class="mt-1 text-xs text-rose-600">{{ errors.shipCity }}</p>
            </div>
            <div>
              <label class="block text-sm text-slate-700">{{ t('checkout.state') }} <span class="text-rose-600">*</span></label>
              <input
                v-model="form.shipState"
                type="text"
                class="mt-1 w-full rounded-lg border px-3 py-2 text-sm"
                :class="errors.shipState ? 'border border-rose-400' : 'border-slate-200'"
              />
              <p v-if="errors.shipState" class="mt-1 text-xs text-rose-600">{{ errors.shipState }}</p>
            </div>
          </div>
          <div>
            <label class="block text-sm text-slate-700">{{ t('checkout.postcode') }} <span class="text-rose-600">*</span></label>
            <input
              v-model="form.shipPostcode"
              type="text"
              class="mt-1 w-full max-w-xs rounded-lg border px-3 py-2 text-sm"
              :class="errors.shipPostcode ? 'border border-rose-400' : 'border-slate-200'"
            />
            <p v-if="errors.shipPostcode" class="mt-1 text-xs text-rose-600">{{ errors.shipPostcode }}</p>
          </div>
        </div>

        <div class="mt-6">
          <label for="checkout-notes" class="block text-sm font-medium text-slate-700">
            {{ t('checkout.order_notes') }} <span class="text-slate-400">{{ t('checkout.phone_optional') }}</span>
          </label>
          <textarea
            id="checkout-notes"
            v-model="form.orderNotes"
            rows="4"
            :placeholder="t('checkout.order_notes_ph')"
            class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
        </div>

        <div class="mt-10 rounded-2xl border border-slate-200 sticky top-24 rounded-3xl border border-teal-100 bg-white p-6 shadow-soft md:p-8">
          <fieldset>
            <legend class="mb-4 text-sm font-semibold text-slate-900">{{ t('checkout.payment_heading') }}</legend>
            <div class="space-y-4">
              <label class="flex cursor-pointer items-start gap-3 text-sm text-slate-800">
                <input
                  v-model="form.paymentMethod"
                  type="radio"
                  name="payment"
                  value="aba-khqr"
                  class="mt-1 h-4 w-4 shrink-0 border-slate-300 text-teal-800 focus:ring-teal-600"
                />
                <span class="flex flex-wrap items-center gap-2 font-medium">
                  {{ t('checkout.pay_aba_khqr') }}
                  <span
                    class="inline-flex items-center rounded bg-red-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                    aria-hidden="true"
                  >
                    {{ t('checkout.pay_khqr_badge') }}
                  </span>
                </span>
              </label>
              <label class="flex cursor-pointer items-start gap-3 text-sm text-slate-800">
                <input
                  v-model="form.paymentMethod"
                  type="radio"
                  name="payment"
                  value="cod"
                  class="mt-1 h-4 w-4 shrink-0 border-slate-300 text-teal-800 focus:ring-teal-600"
                />
                <span class="font-medium uppercase tracking-wide">{{ t('checkout.pay_cod') }}</span>
              </label>
            </div>
          </fieldset>

          <p class="mt-6 text-xs leading-relaxed text-slate-600">
            {{ t('checkout.privacy_notice') }}
          </p>

          <div
            class="mt-4 grid overflow-hidden transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
            :class="[
              refundPolicyOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              !refundPolicyOpen ? 'pointer-events-none' : '',
            ]"
            :aria-hidden="!refundPolicyOpen"
          >
            <div class="min-h-0">
              <div
                :id="refundPolicyId"
                class="rounded-lg border border-slate-200 bg-slate-100/90 p-3 md:p-3 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:translate-y-0 motion-reduce:transition-none"
                :class="refundPolicyOpen ? 'translate-y-0' : '-translate-y-2'"
                role="region"
                :aria-labelledby="refundPolicyHeadingId"
              >
                <h3
                  :id="refundPolicyHeadingId"
                  class="text-base font-bold text-slate-900"
                  :class="locale === 'km' ? 'font-khmer' : ''"
                >
                  {{ t('checkout.refund_title') }}
                </h3>
                <p class="mt-3 text-sm font-semibold text-slate-800" :class="locale === 'km' ? 'font-khmer' : ''">{{ t('checkout.refund_overview') }}</p>
                <p class="mt-2 text-sm leading-relaxed text-slate-700" :class="locale === 'km' ? 'font-khmer' : ''">{{ t('checkout.refund_p1') }}</p>
                <p class="mt-3 text-sm leading-relaxed text-slate-700" :class="locale === 'km' ? 'font-khmer' : ''">{{ t('checkout.refund_p2') }}</p>
              </div>
            </div>
          </div>

          <div class="mt-6">
            <label class="flex cursor-pointer items-start gap-3 text-sm text-slate-800">
              <input
                v-model="form.agreeTerms"
                type="checkbox"
                class="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-teal-800 focus:ring-teal-600"
                :class="errors.agreeTerms ? 'border-rose-400 ring-1 ring-rose-300' : ''"
              />
              <span>
                {{ t('checkout.terms_agree_before') }}
                <button
                  type="button"
                  class="inline font-medium text-teal-800 underline underline-offset-2 hover:text-teal-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                  :aria-expanded="refundPolicyOpen"
                  :aria-controls="refundPolicyId"
                  @click.stop="refundPolicyOpen = !refundPolicyOpen"
                >
                  {{ t('checkout.terms_link') }}
                </button>
                {{ t('checkout.terms_agree_after') }}
                <span class="text-rose-600">*</span>
              </span>
            </label>
            <p v-if="errors.agreeTerms" class="mt-2 text-xs text-rose-600">{{ errors.agreeTerms }}</p>
          </div>

          

          <!-- <div class="mt-8 flex justify-end">
            <button
              type="submit"
              class="rounded-md bg-[#7fa1b8] px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-[#7294ab] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
            >
              {{ t('checkout.place_order') }}
            </button>
          </div> -->
        </div>
      </div>

      <div class="lg:col-span-5">
        <div class="sticky top-24 rounded-3xl border border-teal-100 bg-white p-6 shadow-soft">
          <h2 class="border-b border-teal-100 pb-3 text-lg font-bold text-slate-900" :class="locale === 'km' ? 'font-khmer' : ''">
            {{ t('checkout.your_order') }}
          </h2>

          <ul class="divide-y divide-teal-50">
            <li v-for="row in lineTotals" :key="row.product.id" class="flex gap-3 py-4">
              <img :src="row.product.images[0]" alt="" class="h-14 w-14 shrink-0 rounded-lg object-cover" />
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold leading-snug text-slate-900" :class="locale === 'km' ? 'font-khmer' : ''">{{ row.product.name }}</p>
                <p class="text-xs text-slate-500">× {{ row.quantity }}</p>
              </div>
              <p class="shrink-0 text-sm font-semibold tabular-nums text-[#134e4a]">{{ formatRiel(row.lineTotal) }}</p>
            </li>
          </ul>

          <div class="mt-4 border-t border-teal-100 pt-4">
            <div class="flex justify-between text-sm text-slate-600">
              <span>{{ t('checkout.subtotal') }}</span>
              <span class="font-semibold tabular-nums text-slate-900">{{ formatRiel(cart.totalRiel) }}</span>
            </div>
            <div class="mt-2 flex justify-between text-base font-bold text-slate-900">
              <span>{{ t('checkout.total') }}</span>
              <span class="tabular-nums text-[#134e4a]">{{ formatRiel(cart.totalRiel) }}</span>
            </div>
          </div>

          <button
            type="submit"
            class="mt-6 w-full rounded-md bg-[#7fa1b8] px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-[#7294ab] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
          >
            {{ t('checkout.place_order') }}
          </button>

          <RouterLink to="/cart" class="mt-3 block text-center text-sm font-medium text-teal-800 hover:underline">{{ t('checkout.back_cart') }}</RouterLink>
        </div>
      </div>
    </form>
  </AppLayout>
</template>
