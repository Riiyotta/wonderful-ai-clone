import { useEffect, useRef, useState } from 'react'
import { useInView } from '../../lib/useInView'
import { springEase, TWEEN_FADE } from '../../lib/spring'

// Framer text presets used by the platform pages (CLONE_SPEC_PLATFORM.md §0). Breakpoints are the presets' own
// media queries (they differ from the page breakpoints 880/1440).
// H1 1idioqq: 64/105%/-.06em; 810–1199 48/-.05em; <810 38/-.05em.
export const H1 =
  'font-favorit font-light text-[64px] leading-[1.05] tracking-[-0.06em] [font-feature-settings:"ss04","ss05"] ' +
  '[@media(min-width:810px)_and_(max-width:1199.98px)]:text-[48px] [@media(min-width:810px)_and_(max-width:1199.98px)]:tracking-[-0.05em] ' +
  '[@media(max-width:809.98px)]:text-[38px] [@media(max-width:809.98px)]:tracking-[-0.05em]'
// H2 190xti5: 48/105%/-.04em; 800–1199 42/115%; <800 34/115%/-.05em; 3px bottom padding.
export const H2 =
  'font-favorit font-light text-[48px] leading-[1.05] tracking-[-0.04em] pb-[3px] [font-feature-settings:"ss04","ss05"] ' +
  '[@media(min-width:800px)_and_(max-width:1199.98px)]:text-[42px] [@media(min-width:800px)_and_(max-width:1199.98px)]:leading-[1.15] ' +
  '[@media(max-width:799.98px)]:text-[34px] [@media(max-width:799.98px)]:leading-[1.15] [@media(max-width:799.98px)]:tracking-[-0.05em]'
// H3 pyuk04: 32/115%/-.04em; 810–1439 22; <810 24.
export const H3 =
  'font-favorit font-light text-[32px] leading-[1.15] tracking-[-0.04em] [font-feature-settings:"ss02","ss04","ss05","ss11"] ' +
  '[@media(min-width:810px)_and_(max-width:1439.98px)]:text-[22px] [@media(max-width:809.98px)]:text-[24px]'
// Body 17 (1ln1alt).
export const P17 = 'font-inter font-normal text-[17px] leading-[1.28] tracking-[-0.02em] [font-feature-settings:"blwf","cv03","cv04","cv09"]'
// Hero sub (o1ogpi): Inter 20/125%/-.4px.
export const P20 = 'font-inter font-normal text-[20px] leading-[1.25] tracking-[-0.4px]'
// Small body (x0s9r5): Inter 14/150%/-.02em, ss03.
export const P14 = 'font-inter font-normal text-[14px] leading-[1.5] tracking-[-0.02em] [font-feature-settings:"ss03"]'

// Framer appear: opacity .001 -> 1 on load. `spring` (200/60) for headings, tween .6s [.44,0,.56,1] for buttons.
const APPEAR_SPRING = springEase({ stiffness: 200, damping: 60 })
export function Appear({ delay = 0, tween = false, className = '', style, children, as: Tag = 'div' }) {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)))
    return () => cancelAnimationFrame(id)
  }, [])
  const tr = tween ? `opacity .6s ${TWEEN_FADE} ${delay}s` : `opacity ${APPEAR_SPRING.duration}s ${APPEAR_SPRING.easing} ${delay}s`
  return (
    <Tag className={className} style={{ ...style, opacity: shown ? 1 : 0.001, transition: tr }}>
      {children}
    </Tag>
  )
}

// Block reveal (Framer "Paragraphs" text effect): each child block fades from blur(10px)/y10/opacity .001
// with a 50ms stagger once half of the group is visible. Measured spring: stiffness 300, damping 50.
const BLOCK_SPRING = springEase({ stiffness: 300, damping: 50 })
export function useBlockReveal(amount = 0.5) {
  const [ref, inView] = useInView({ amount })
  const styleFor = (i) =>
    inView
      ? { opacity: 1, filter: 'blur(0px)', transform: 'none', transition: ['opacity', 'filter', 'transform'].map((p) => `${p} ${BLOCK_SPRING.duration}s ${BLOCK_SPRING.easing} ${i * 0.05}s`).join(', ') }
      : { opacity: 0.001, filter: 'blur(10px)', transform: 'translateY(10px)' }
  return [ref, styleFor]
}

// White pill button ("Grey", preset 2mfvz6): 16/26 #000, padding 6px 18px.
export function PillButton({ href, children, className = '' }) {
  return (
    <a href={href} className={`plat-pill inline-flex h-[50px] items-center justify-center overflow-hidden rounded-[50px] bg-white px-[18px] py-[6px] font-inter text-[16px] leading-[26px] tracking-[-0.5px] text-black no-underline ${className}`}>
      {children}
    </a>
  )
}

// Small white pill ("Grey small", preset x0s9r5): 14/21 #171719, padding 6px 16px.
export function PillSmall({ href, children, className = '' }) {
  return (
    <a href={href} className={`plat-pill inline-flex h-[37px] items-center justify-center overflow-hidden rounded-[50px] bg-white px-[16px] py-[6px] text-center text-ink no-underline ${P14} ${className}`}>
      {children}
    </a>
  )
}

// Counts 0 -> to with CSS `ease` over 1.3s (floor), once in view (deployment "40+").
export function CountUp({ to, suffix = '', className, style }) {
  const [ref, inView] = useInView()
  const [n, setN] = useState(0)
  const raf = useRef(0)
  useEffect(() => {
    if (!inView) return
    const ease = cubicBezier(0.25, 0.1, 0.25, 1)
    const t0 = performance.now()
    const tick = (t) => {
      const x = Math.min(1, (t - t0) / 1300)
      setN(Math.floor(to * ease(x)))
      if (x < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [inView, to])
  return (
    <div ref={ref} className="relative">
      <p className={className} style={{ ...style, opacity: 0 }} aria-hidden="true">{to}{suffix}</p>
      <p className={`${className} absolute inset-0`} style={style}>{n}{suffix}</p>
    </div>
  )
}

export function cubicBezier(p1x, p1y, p2x, p2y) {
  const bx = (t) => 3 * (1 - t) * (1 - t) * t * p1x + 3 * (1 - t) * t * t * p2x + t * t * t
  const by = (t) => 3 * (1 - t) * (1 - t) * t * p1y + 3 * (1 - t) * t * t * p2y + t * t * t
  return (x) => {
    if (x <= 0) return 0
    if (x >= 1) return 1
    let lo = 0, hi = 1
    for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (bx(m) < x) lo = m; else hi = m }
    return by((lo + hi) / 2)
  }
}
