<script setup lang="ts">
import type { Category } from '../../types/product'

defineProps<{ categories: Category[]; activeCategory: string | null; minRating: number }>()
const emit = defineEmits<{
  'update:category': [string | null]
  'update:minRating': [number]
}>()
</script>

<template>
  <aside class="space-y-5 rounded-xl border border-amber-200 bg-white p-4">
    <div>
      <h3 class="mb-2 font-semibold">Categories</h3>
      <button class="mb-2 block text-sm" :class="!activeCategory ? 'text-amber-700' : ''" @click="emit('update:category', null)">All</button>
      <button
        v-for="category in categories"
        :key="category.id"
        class="mb-2 block text-sm"
        :class="activeCategory === category.slug ? 'text-amber-700' : 'text-slate-600'"
        @click="emit('update:category', category.slug)"
      >
        {{ category.name }}
      </button>
    </div>
    <div>
      <h3 class="mb-2 font-semibold">Minimum Rating</h3>
      <input
        type="range"
        min="0"
        max="5"
        step="1"
        :value="minRating"
        class="w-full accent-amber-500"
        @input="emit('update:minRating', Number(($event.target as HTMLInputElement).value))"
      />
      <p class="text-sm text-slate-600">{{ minRating }} stars & up</p>
    </div>
  </aside>
</template>
