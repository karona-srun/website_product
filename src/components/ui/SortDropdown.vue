<script setup lang="ts">
import type { SortOption } from '../../stores/productStore'

defineProps<{ modelValue: SortOption }>()
const emit = defineEmits<{ 'update:modelValue': [SortOption] }>()
</script>

<template>
  <select
    :value="modelValue"
    class="rounded-lg border border-amber-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring focus:ring-amber-200"
    @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value as SortOption)"
  >
    <option value="featured">Featured</option>
    <option value="price-asc">Price: Low to High</option>
    <option value="price-desc">Price: High to Low</option>
    <option value="rating">Top Rated</option>
    <option value="newest">Newest</option>
  </select>
</template>
