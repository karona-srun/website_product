<script setup lang="ts">
import type { Category } from '../../types/product'

defineProps<{ category: Category; count: number }>()
</script>

<template>
  <RouterLink
    :to="`/category/${category.slug}`"
    class="group block rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
  >
    <div class="mb-4 flex items-center justify-between">
      <div class="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-xl text-white">
        {{ category.icon }}
      </div>
      <span class="text-xs font-medium uppercase tracking-wide text-slate-400">Category</span>
    </div>
    <h3 class="font-semibold text-slate-900 transition group-hover:text-slate-700">{{ category.name }}</h3>
    <p class="mt-1 text-sm text-slate-600">{{ count }} products</p>
  </RouterLink>
</template>
