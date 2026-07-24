<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [string] }>()

const local = ref(props.modelValue)
let timer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.modelValue,
  (value) => {
    local.value = value
  },
)

watch(local, (value) => {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => emit('update:modelValue', value), 250)
})
</script>

<template>
  <div class="relative">
    <span class="pointer-events-none absolute left-3 top-2.5 text-slate-400">🔍</span>
    <input
      v-model="local"
      type="text"
      placeholder="Search products..."
      class="w-full rounded-lg border border-amber-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-amber-500 focus:ring focus:ring-amber-200"
    />
  </div>
</template>
