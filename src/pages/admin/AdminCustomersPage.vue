<script setup lang="ts">
const customers = [
  { name: 'Sokha Dara', type: 'Retail', phone: '+855 12 345 678', orders: 8 },
  { name: 'Lina Market', type: 'Wholesale', phone: '+855 77 221 109', orders: 24 },
  { name: 'Kampot Kitchen', type: 'Restaurant', phone: '+855 96 554 3210', orders: 41 },
]
</script>

<template>
  <section class="space-y-5">
    <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-lg font-bold">Customer management</h2>
          <p class="mt-1 text-sm text-slate-500">Manage retail, wholesale, and restaurant customer records.</p>
        </div>
        <button type="button" class="w-fit rounded-xl bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white">Add customer</button>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <article v-for="customer in customers" :key="customer.name" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div class="flex items-start justify-between gap-3">
          <div>
            <h3 class="font-bold text-slate-950">{{ customer.name }}</h3>
            <p class="mt-1 text-sm text-slate-500">{{ customer.phone }}</p>
          </div>
          <span class="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-900">{{ customer.type }}</span>
        </div>
        <p class="mt-5 text-2xl font-bold tabular-nums">{{ customer.orders }}</p>
        <p class="text-xs text-slate-500">Total orders</p>
      </article>
    </div>
  </section>
</template>
