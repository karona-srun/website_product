import { onMounted, onUnmounted, ref } from 'vue'

function readReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** True when the user prefers minimal motion (respect for accessibility). */
export function usePrefersReducedMotion() {
  const prefersReducedMotion = ref(readReducedMotion())
  let mq: MediaQueryList | null = null

  function sync() {
    prefersReducedMotion.value = readReducedMotion()
  }

  onMounted(() => {
    mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    sync()
    mq.addEventListener('change', sync)
  })

  onUnmounted(() => {
    mq?.removeEventListener('change', sync)
  })

  return prefersReducedMotion
}
