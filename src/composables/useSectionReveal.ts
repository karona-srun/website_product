import type { Ref } from 'vue'
import { animate, stagger } from 'animejs'
import { onMounted, onUnmounted, unref } from 'vue'

/**
 * When `sectionRef` enters the viewport, animate children matching `childSelector`
 * with an intentional stagger (scroll-triggered, runs once).
 */
export function useSectionChildStagger(
  sectionRef: Ref<HTMLElement | null | undefined>,
  childSelector: string,
  opts: {
    disabled?: Ref<boolean>
    y?: number
    duration?: number
    staggerMs?: number
    threshold?: number
    ease?: string
  } = {},
) {
  const y = opts.y ?? 26
  const duration = opts.duration ?? 900
  const staggerMs = opts.staggerMs ?? 48
  const threshold = opts.threshold ?? 0.08
  const ease = opts.ease ?? 'outCubic'

  let io: IntersectionObserver | null = null

  onMounted(() => {
    if (opts.disabled?.value) return

    const mount = () => {
      const root = unref(sectionRef)
      if (!root) return

      const children = Array.from(root.querySelectorAll<HTMLElement>(childSelector))
      if (!children.length) return

      children.forEach((el) => {
        el.style.opacity = '0'
        el.style.willChange = 'opacity, transform'
        el.style.transform = `translate3d(0, ${y}px, 0)`
      })

      const run = () => {
        animate(children, {
          opacity: [0, 1],
          y: [y, 0],
          duration,
          delay: stagger(staggerMs, { from: 'first' }),
          ease,
          complete: () => {
            children.forEach((el) => {
              el.style.removeProperty('will-change')
            })
          },
        })
      }

      const rect = root.getBoundingClientRect()
      const alreadyVisible = rect.top < window.innerHeight * 0.92 && rect.bottom > 48
      if (alreadyVisible) {
        requestAnimationFrame(run)
        return
      }

      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue
            run()
            io?.disconnect()
            io = null
            break
          }
        },
        { threshold, rootMargin: '0px 0px -6% 0px' },
      )

      io.observe(root)
    }

    requestAnimationFrame(mount)
  })

  onUnmounted(() => {
    io?.disconnect()
  })
}

/**
 * Fade/slide single blocks when they cross into view (one observer per matching node inside root).
 */
export function useScrollReveal(
  rootRef: Ref<HTMLElement | null | undefined>,
  selector = '[data-reveal]',
  opts: {
    disabled?: Ref<boolean>
    y?: number
    duration?: number
    threshold?: number
    ease?: string
  } = {},
) {
  const y = opts.y ?? 22
  const duration = opts.duration ?? 950
  const threshold = opts.threshold ?? 0.12
  const ease = opts.ease ?? 'outCubic'

  let io: IntersectionObserver | null = null

  onMounted(() => {
    if (opts.disabled?.value) return

    const setup = () => {
      const root = unref(rootRef)
      if (!root) return

      const nodes = Array.from(root.querySelectorAll<HTMLElement>(selector))
      if (!nodes.length) return

      nodes.forEach((node) => {
        node.style.opacity = '0'
        node.style.willChange = 'opacity, transform'
        node.style.transform = `translate3d(0, ${y}px, 0)`
      })

      const revealOne = (el: HTMLElement) => {
        animate(el, {
          opacity: [0, 1],
          y: [y, 0],
          duration,
          ease,
          complete: () => {
            el.style.removeProperty('will-change')
          },
        })
      }

      nodes.forEach((node) => {
        const r = node.getBoundingClientRect()
        if (r.top < window.innerHeight * 0.94 && r.bottom > 32) {
          requestAnimationFrame(() => revealOne(node))
          return
        }
        io = io ?? new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) continue
              revealOne(entry.target as HTMLElement)
              io?.unobserve(entry.target)
            }
          },
          { threshold, rootMargin: '0px 0px -5% 0px' },
        )
        io.observe(node)
      })
    }

    requestAnimationFrame(setup)
  })

  onUnmounted(() => io?.disconnect())
}
