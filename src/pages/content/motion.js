import { springEase } from '../../lib/spring'

// Framer/motion "duration + bounce" springs -> physical stiffness/damping (port of motion's findSpring),
// then to a CSS linear() easing via the shared springEase helper.
const SAFE_MIN = 0.001
const angular = (f, z) => f * Math.sqrt(1 - z * z)

export function durationSpring({ duration = 0.8, bounce = 0.25, mass = 1 }) {
  const z = Math.min(1, Math.max(0.05, 1 - bounce))
  const d = Math.min(10, Math.max(0.01, duration))
  let envelope, derivative
  if (z < 1) {
    envelope = (f) => {
      const decay = f * z
      return SAFE_MIN - (decay / angular(f, z)) * Math.exp(-decay * d)
    }
    derivative = (f) => {
      const decay = f * z
      const e = z * z * f * f * d
      const g = angular(f * f, z)
      const factor = -envelope(f) + SAFE_MIN > 0 ? -1 : 1
      return (factor * (-e * Math.exp(-decay * d))) / g
    }
  } else {
    envelope = (f) => -SAFE_MIN + Math.exp(-f * d) * (f * d + 1)
    derivative = (f) => Math.exp(-f * d) * (-f * d * d)
  }
  let f = 5 / d
  for (let i = 0; i < 12; i++) f = f - envelope(f) / derivative(f)
  const stiffness = f * f * mass
  return { stiffness, damping: z * 2 * Math.sqrt(mass * stiffness), mass }
}

export function springCss(opts) {
  const s = durationSpring(opts)
  const e = springEase(s)
  return `${e.duration}s ${e.easing}`
}

// appearAnimationsContent (exact): card image h4me46 opacity .001 -> 1, spring bounce .2 / .4s.
export const SPRING_CARD_IMAGE = springCss({ duration: 0.4, bounce: 0.2 })
// blog "Content" block b89lqw: opacity .001 -> 1 and y 50 -> 0, spring bounce 0 / .5s, delay .2s.
export const SPRING_BLOG_CONTENT = springCss({ duration: 0.5, bounce: 0 })
// Card hover (container opacity 1 -> .8). Sampled live: .969@32ms .909@66 .857@99 .822@132 .803@166 .796@198 .794@232 .8@300.
export const SPRING_CARD_HOVER = springCss({ duration: 0.4, bounce: 0.2 })
// Leaving is slower (component default transition). Sampled .82@43 .858@77 .901@110 .936@144 .962@177 .98@210 .992@243.
export const SPRING_CARD_UNHOVER = springCss({ duration: 0.45, bounce: 0 })
