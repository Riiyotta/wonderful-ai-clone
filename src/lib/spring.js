// Turns a Framer-style spring (stiffness, damping, mass) into a CSS linear() easing
// plus its settle duration, so springs can run as plain CSS transitions.
export function springEase({ stiffness = 100, damping = 10, mass = 1 } = {}) {
  const dt = 1 / 600
  let x = 0, v = 0, t = 0
  const samples = [0]
  let settled = 0
  while (t < 4) {
    const a = (-stiffness * (x - 1) - damping * v) / mass
    v += a * dt
    x += v * dt
    t += dt
    if (Math.round(t * 600) % 10 === 0) samples.push(x)
    if (Math.abs(x - 1) > 0.001 || Math.abs(v) > 0.01) settled = t
  }
  const n = Math.max(2, Math.ceil(settled * 60))
  const pts = samples.slice(0, n + 1)
  pts[pts.length - 1] = 1
  return { duration: n / 60, easing: `linear(${pts.map((p) => +p.toFixed(4)).join(', ')})` }
}

export const SPRING_HEADING = springEase({ stiffness: 175, damping: 22 })
export const SPRING_PARAGRAPH = springEase({ stiffness: 340, damping: 56 })
export const TWEEN_FADE = 'cubic-bezier(.44,0,.56,1)'
