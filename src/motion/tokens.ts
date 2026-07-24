/** Shared timing — tuned for calm, premium motion */
export const ease = {
  intro: 'outCubic',
  hover: 'outQuart',
  draw: 'inOutSine',
  settle: 'outExpo',
} as const

export const duration = {
  heroLine: 820,
  heroDraw: 2000,
  reveal: 980,
  cardStagger: 52,
  cursor: 520,
  navItem: 620,
  linkHover: 220,
} as const
