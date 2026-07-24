<script setup lang="ts">
import Navbar from './Navbar.vue'
import Footer from './Footer.vue'
</script>

<template>
  <Navbar />
  <main class="container-shell py-6 md:py-8">
    <slot />
  </main>
  <Footer />
</template>
