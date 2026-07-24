<script setup lang="ts">
import { animate } from 'animejs'
import { onMounted, onUnmounted, ref } from 'vue'
import { duration, ease } from '../../motion/tokens'

const dot = ref<HTMLElement | null>(null)
const ring = ref<HTMLElement | null>(null)

let active = false

function onMove(e: MouseEvent) {
  if (!active) return
  const x = e.clientX
  const y = e.clientY
  if (dot.value) {
    animate(dot.value, {
      left: x - 5,
      top: y - 5,
      duration: duration.cursor,
      ease: ease.settle,
    })
  }
  if (ring.value) {
    animate(ring.value, {
      left: x - 18,
      top: y - 18,
      duration: duration.cursor + 200,
      ease: ease.intro,
    })
  }
}

onMounted(() => {
  const fine = window.matchMedia('(pointer: fine)').matches
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!fine || reduce) return
  active = true
  window.addEventListener('mousemove', onMove, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMove)
})
</script>

<template>
  <div
    class="motion-cursor-layer pointer-events-none fixed inset-0 z-[90] hidden md:block"
    aria-hidden="true"
  >
    <div
      ref="dot"
      class="motion-cursor-dot fixed h-2.5 w-2.5 rounded-full bg-teal-400 shadow-[0_0_18px_rgba(45,212,191,0.65)]"
      style="left: -100px; top: -100px"
    />
    <div
      ref="ring"
      class="motion-cursor-ring fixed h-9 w-9 rounded-full border border-teal-500/35"
      style="left: -100px; top: -100px"
    />
  </div>
</template>
