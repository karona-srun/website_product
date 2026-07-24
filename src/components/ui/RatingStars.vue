<script setup lang="ts">
const props = defineProps<{ rating: number }>()
</script>

<template>
  <div class="flex items-center gap-1 text-[#facc15] drop-shadow-sm">
    <span v-for="i in 5" :key="i">{{ i <= Math.round(props.rating) ? '★' : '☆' }}</span>
  </div>
</template>
