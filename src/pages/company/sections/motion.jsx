import { createElement, useEffect, useRef, useState } from 'react'
import { springEase, TWEEN_FADE } from '../../../lib/spring'

// Framer appear presets used across the company pages (values from each page's __framer__appearAnimationsContent
// or sampled live; see CLONE_SPEC_COMPANY.md §0).
export const SPRING_SOFT = springEase({ stiffness: 200, damping: 60 }) // opacity springs (headings "Text 1", buttons)
export const SPRING_PARA = springEase({ stiffness: 340, damping: 56 }) // whole-element paragraph-style blur reveal

// Hover springs as CSS custom properties (used by src/styles/company/common.css).
if (typeof document !== 'undefined') {
  document.documentElement.style.setProperty('--co-spring-soft', `${SPRING_SOFT.duration}s ${SPRING_SOFT.easing}`)
}
// Framer duration/bounce springs -> stiffness = (2π/d)², damping = 2(1-bounce)√stiffness.
export function durationSpring(duration, bounce = 0) {
  const k = (2 * Math.PI / duration) ** 2
  return springEase({ stiffness: k, damping: 2 * (1 - bounce) * Math.sqrt(k) })
}

// Fires once (or every time with `replay`) when the element intersects the viewport.
export function useReveal({ mode = 'view', amount = 0, replay = false, rootMargin = '0px' } = {}) {
  const ref = useRef(null)
  const [on, setOn] = useState(false)
  useEffect(() => {
    if (mode === 'mount') {
      const id = requestAnimationFrame(() => requestAnimationFrame(() => setOn(true)))
      return () => cancelAnimationFrame(id)
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && e.intersectionRatio >= amount) { setOn(true); if (!replay) io.disconnect() }
      else if (replay && !e.isIntersecting) setOn(false)
    }, { threshold: amount, rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [mode, amount, replay, rootMargin])
  return [ref, on]
}

// Generic appear: animates opacity / y / blur / scale from `from` to rest.
// `ease` is either a springEase() result or { duration, easing } for tweens.
export function Appear({
  as = 'div', mode = 'view', amount = 0, replay = false, rootMargin, from = { opacity: 0.001 }, delay = 0,
  ease = { duration: 0.6, easing: TWEEN_FADE }, className, style, children, ...rest
}) {
  const [ref, on] = useReveal({ mode, amount, replay, rootMargin })
  const hidden = {
    opacity: from.opacity ?? 1,
    transform: `translateY(${from.y || 0}px) scale(${from.scale ?? 1})`,
    filter: from.blur ? `blur(${from.blur}px)` : undefined,
  }
  const shown = { opacity: 1, transform: 'none', filter: from.blur ? 'blur(0px)' : undefined }
  const t = `${ease.duration}s ${ease.easing} ${delay}s`
  return createElement(as, {
    ref, className, ...rest,
    style: { ...style, ...(on ? shown : hidden), transition: on ? `opacity ${t}, transform ${t}, filter ${t}` : 'none' },
  }, children)
}
