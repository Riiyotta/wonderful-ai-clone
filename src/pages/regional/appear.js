import { useEffect, useState } from 'react'
import { springEase, SPRING_PARAGRAPH } from '../../lib/spring'

// Framer "appear" effects on the regional pages run once on load (not on scroll).
// Measured live (CLONE_SPEC_REGIONAL.md §Motion):
// - headings: opacity .001→1, blur(10px)→0, translateY(10px)→0 on a near-critical spring (0→50% in ~134ms, 90% ~314ms).
// - rich-text blocks: opacity-only on the 340/56 overdamped spring (50% ~80ms, 90% ~275ms).
export const SPRING_APPEAR_H = springEase({ stiffness: 144, damping: 24 })
export const SPRING_APPEAR_P = SPRING_PARAGRAPH

export function useAppeared() {
  const [on, setOn] = useState(false)
  useEffect(() => {
    let id2
    const id = requestAnimationFrame(() => { id2 = requestAnimationFrame(() => setOn(true)) })
    return () => { cancelAnimationFrame(id); cancelAnimationFrame(id2) }
  }, [])
  return on
}

const tr = (s, props, delay = 0) => props.map((p) => `${p} ${s.duration}s ${s.easing} ${delay}s`).join(', ')

// Heading appear: blur 10 + y 10 + fade. `base` keeps any transform the element already has (e.g. centering).
export function headingAppear(on, { delay = 0, base = '', blur = 10, y = 10 } = {}) {
  return on
    ? { opacity: 1, filter: 'blur(0px)', transform: `${base} translateY(0px)`.trim(), transition: tr(SPRING_APPEAR_H, ['opacity', 'filter', 'transform'], delay) }
    : { opacity: 0.001, filter: `blur(${blur}px)`, transform: `${base} translateY(${y}px)`.trim() }
}

// Text appear: fade only.
export function fadeAppear(on, { delay = 0, spring = SPRING_APPEAR_P } = {}) {
  return on ? { opacity: 1, transition: tr(spring, ['opacity'], delay) } : { opacity: 0.001 }
}
