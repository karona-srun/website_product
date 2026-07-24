<script setup lang="ts">
defineProps<{ items: Array<{ label: string; to?: string }> }>()
</script>

<template>
  <nav class="mb-6 text-sm text-slate-500">
    <span v-for="(item, idx) in items" :key="item.label" class="mr-2">
      <RouterLink v-if="item.to" :to="item.to" class="hover:text-primary">{{ item.label }}</RouterLink>
      <span v-else class="font-medium text-slate-800">{{ item.label }}</span>
      <span v-if="idx < items.length - 1" class="ml-2">/</span>
    </span>
  </nav>
</template>
