<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductListPage from './ProductListPage.vue'
import { useProductStore } from '../stores/productStore'

const route = useRoute()
const store = useProductStore()

const slug = computed(() => String(route.params.slug))

watch(
  slug,
  (value) => {
    store.setCategory(value)
  },
  { immediate: true },
)
</script>

<template>
  <ProductListPage />
</template>
