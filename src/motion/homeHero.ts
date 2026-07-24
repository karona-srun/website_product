import { createDrawable, createTimeline, stagger } from 'animejs'
import { duration, ease } from './tokens'

/** Hero lines stagger + optional SVG stroke draw (minimal premium entrance). */
export function playHomeHero(heroRoot: HTMLElement | null, reducedMotion: boolean) {
  if (!heroRoot || reducedMotion) return

  const lines = heroRoot.querySelectorAll<HTMLElement>('[data-hero-line]')
  lines.forEach((el) => {
    el.style.opacity = '0'
    el.style.willChange = 'opacity, transform'
    el.style.transform = 'translate3d(0, 28px, 0)'
  })

  const tl = createTimeline({ autoplay: true })
  if (lines.length) {
    tl.add(lines, {
      opacity: [0, 1],
      y: [28, 0],
      duration: duration.heroLine,
      ease: ease.intro,
      delay: stagger(68, { start: 100 }),
      complete: () => {
        lines.forEach((el) => el.style.removeProperty('will-change'))
      },
    })
  }

  const path = heroRoot.querySelector<SVGGeometryElement>('#hero-motion-path')
  if (path) {
    const drawables = createDrawable(path, 0, 1)
    const drawable = drawables[0]
    if (drawable) {
      tl.add(
        drawable,
        {
          draw: ['0 0', '0 1'],
          duration: duration.heroDraw,
          ease: ease.draw,
        },
        lines.length ? '-=1150' : '+=200',
      )
    }
  }
}
