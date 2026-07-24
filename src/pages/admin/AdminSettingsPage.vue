<template>
  <section class="grid gap-5 xl:grid-cols-2">
    <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 class="text-lg font-bold">Store settings</h2>
      <div class="mt-5 space-y-4">
        <label class="block text-sm font-semibold text-slate-700">
          Store name
          <input value="Kampot Seafood" class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
        </label>
        <label class="block text-sm font-semibold text-slate-700">
          Contact phone
          <input value="++855 85 773 007" class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
        </label>
        <label class="block text-sm font-semibold text-slate-700">
          Pickup location
          <input value="Samaki Market, Kampot town" class="mt-1 h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
        </label>
      </div>
      <button type="button" class="mt-5 rounded-xl bg-teal-800 px-4 py-2.5 text-sm font-semibold text-white">Save settings</button>
    </div>

    <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 class="text-lg font-bold">System process</h2>
      <div class="mt-5 space-y-3">
        <label class="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
          <span>
            <span class="block text-sm font-semibold">Accept online orders</span>
            <span class="block text-xs text-slate-500">Allow customers to submit checkout requests.</span>
          </span>
          <input type="checkbox" checked class="h-5 w-5 accent-teal-700" />
        </label>
        <label class="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
          <span>
            <span class="block text-sm font-semibold">Low stock alerts</span>
            <span class="block text-xs text-slate-500">Notify admin when stock reaches 10 units.</span>
          </span>
          <input type="checkbox" checked class="h-5 w-5 accent-teal-700" />
        </label>
        <label class="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
          <span>
            <span class="block text-sm font-semibold">Wholesale mode</span>
            <span class="block text-xs text-slate-500">Show B2B workflow controls.</span>
          </span>
          <input type="checkbox" class="h-5 w-5 accent-teal-700" />
        </label>
      </div>
    </div>
  </section>
</template>
