import { useEffect, useMemo, useRef } from 'react'

// Port of the live "Sticky_Reveal_Pro" Framer code component (careers "Main" statement).
// Wrapper is `scrollDuration`vh tall with a 100vh sticky child; scroll progress through the wrapper
// (motion useScroll offsets: fullyInView = ['start start','end end'], enteringView = ['start end','end end'] with an
// entry head start) drives each word i of L over [i/L*.8, min(i/L*.8+.15,.95)]: color base -> highlight, y, opacity, blur.
const parse = (c) => {
  const m = c.match(/rgba?\(([^)]+)\)/)
  if (m) { const p = m[1].split(',').map(Number); return [p[0], p[1], p[2], p[3] ?? 1] }
  const h = c.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1]
}
const lerp = (a, b, t) => a + (b - a) * t
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

export default function StickyReveal({
  text, scrollDuration = 250, startReveal = 'fullyInView', entryHeadStart = 0.1, yOffset = 0, startOpacity = 1, startBlur = 0,
  verticalAlignment = 'flex-start', alignment = 'center', wordSpacing = 0.25, topPadding = 40, bottomPadding = 40, sidePadding = 5,
  baseColor = 'rgb(161, 161, 170)', highlightColor = 'rgb(24, 24, 27)', font = {}, className,
  // Live passes the highlight as a CSS var() token on desktop, which motion cannot mix: the colour then snaps to the
  // highlight as soon as a word's window starts (t > 0). Plain rgb() colours are mixed (motion's linear-light mix).
  stepColor = false,
}) {
  const ref = useRef(null)
  const spans = useRef([])
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text])
  const base = useMemo(() => parse(baseColor), [baseColor])
  const hi = useMemo(() => parse(highlightColor), [highlightColor])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const L = words.length || 1
    const N = Math.min(Math.max(100 / Math.max(scrollDuration, 1), 0.001), 0.999)
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect(), vh = window.innerHeight
      let p
      if (startReveal === 'enteringView') {
        // offset ['start end', 'end end']: 0 when the top meets the viewport bottom, 1 when the bottoms align
        const m = clamp01((vh - r.top) / Math.max(r.height, 1))
        p = m <= N ? lerp(0, entryHeadStart, m / N) : lerp(entryHeadStart, 1, (m - N) / (1 - N))
      } else {
        p = clamp01(-r.top / Math.max(r.height - vh, 1))
      }
      for (let i = 0; i < spans.current.length; i++) {
        const s = spans.current[i]
        if (!s) continue
        const a = i / L * 0.8, b = Math.min(a + 0.15, 0.95), t = clamp01((p - a) / (b - a))
        if (stepColor) s.style.color = t > 0 ? highlightColor : baseColor
        else {
          const mix = (a, b2) => Math.round(Math.sqrt(Math.max(0, (1 - t) * a * a + t * b2 * b2)))
          s.style.color = `rgba(${mix(base[0], hi[0])}, ${mix(base[1], hi[1])}, ${mix(base[2], hi[2])}, ${lerp(base[3], hi[3], t)})`
        }
        s.style.transform = yOffset ? `translateY(${lerp(yOffset, 0, t)}px)` : 'none'
        s.style.opacity = String(lerp(startOpacity, 1, t))
        s.style.filter = `blur(${lerp(startBlur, 0, t)}px)`
      }
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (raf) cancelAnimationFrame(raf) }
  }, [words, scrollDuration, startReveal, entryHeadStart, yOffset, startOpacity, startBlur, base, hi, stepColor, baseColor, highlightColor])

  return (
    <div ref={ref} className={className} style={{ width: '100%', height: `${scrollDuration}vh`, position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: verticalAlignment,
        boxSizing: 'border-box', paddingTop: topPadding, paddingBottom: bottomPadding, paddingLeft: `${sidePadding}%`, paddingRight: `${sidePadding}%`, overflow: 'visible' }}>
        {/* live only forwards family/size/weight/line-height/letter-spacing from the font control, and its
            CSS.supports check resolves to text-wrap: pretty */}
        <p style={{ margin: 0, textAlign: alignment, textWrap: 'pretty', fontFamily: font.fontFamily || 'Inter, sans-serif', fontSize: font.fontSize,
          fontWeight: font.fontWeight || 600, lineHeight: font.lineHeight, letterSpacing: font.letterSpacing, width: '100%' }}>
          {words.map((w, i) => (
            <span key={i} ref={(e) => { spans.current[i] = e }}
              style={{ display: 'inline-block', color: baseColor, marginRight: `${wordSpacing}em`, marginBottom: '0.1em', willChange: 'transform, color, opacity, filter',
                transform: yOffset ? `translateY(${yOffset}px)` : 'none', opacity: startOpacity, filter: `blur(${startBlur}px)` }}>
              {w + ' '}
            </span>
          ))}
        </p>
      </div>
    </div>
  )
}
