import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { openVideoLightbox } from './lightbox'

// "Gateway Video Section" — port of the live Framer code component (behaviour "expand"; "simple" below an
// 810px-wide section or with reduced motion). CLONE_SPEC_PLATFORM.md §1.3.
// expand: 240vh track, sticky 100vh stage. p = scroll progress (start start -> end end);
// u = clamp((p - .04) / .66); e = 1 - (1 - u)^2; frame width = o*.56 + o*.44*e (o = 1680 max | vw-120 | vw-80 | vw-48),
// height = min(9/16 w, vh - 48); media scale 1.1 -> 1; title halves slide ±x over u 0..0.6, title opacity 1 -> 0 over
// u .3 -> .58; play button shows from p >= .72.
const TITLE = 'Wonderful AI Gateway'
const LOOP = '/videos/U8Du8JtkAFEjYT2j40UACIxYg.mp4'
const FULL = '/videos/ai-gateway-online-v8.mp4'
const POSTER = '/assets/zI0osPtDNdBRZiVuPMMxWySYxY.jpg'

const clamp01 = (x) => Math.max(0, Math.min(1, x))
const wrapW = (w) => (w >= 1440 ? Math.min(1680, w - 120) : w >= 880 ? w - 80 : w - 48)

function useNearVisible(ref) {
  const [state, setState] = useState({ near: false, visible: false })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) setState((s) => ({ near: s.near || e.isIntersecting, visible: e.isIntersecting }))
    }, { rootMargin: '300px' })
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
  return state
}

function Media() {
  const ref = useRef(null)
  const vid = useRef(null)
  const { near, visible } = useNearVisible(ref)
  const [playing, setPlaying] = useState(false)
  useEffect(() => {
    const v = vid.current
    if (!v) return
    if (visible) { const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}) } else v.pause()
  }, [visible, near])
  return (
    <div ref={ref} className="gvs-clip">
      <img className="gvs-media" src={POSTER} alt="" loading="lazy" decoding="async" />
      {near && (
        <video
          ref={vid}
          className="gvs-media gvs-video"
          src={LOOP}
          poster={POSTER}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setPlaying(true)}
          style={{ opacity: playing ? 1 : 0 }}
        />
      )}
    </div>
  )
}

function Play({ on }) {
  const open = () => openVideoLightbox(FULL)
  return (
    <>
      <div className={`gvs-play${on ? ' is-on' : ''}`} aria-hidden="true">
        <div className="gvs-play-btn">
          <svg width="22" height="24" viewBox="0 0 22 24" aria-hidden="true"><path d="M3 1.8v20.4c0 1.2 1.3 1.9 2.3 1.3l16-10.2c.9-.6.9-2 0-2.6L5.3.5C4.3-.1 3 .6 3 1.8Z" fill="#000" /></svg>
        </div>
      </div>
      <div className="gvs-hit" aria-label={`Play video: ${TITLE}`} role="group" style={on ? undefined : { pointerEvents: 'none', cursor: 'default' }}>
        <div
          role="button"
          aria-label="Play video"
          tabIndex={0}
          style={{ position: 'relative', width: '100%', height: '100%', cursor: 'pointer' }}
          onClick={open}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open() } }}
        />
      </div>
    </>
  )
}

function Expand() {
  const track = useRef(null)
  const stage = useRef(null)
  const title = useRef(null)
  const frame = useRef(null)
  const inner = useRef(null)
  const left = useRef(null)
  const right = useRef(null)
  const h2 = useRef(null)
  const [on, setOn] = useState(false)
  useLayoutEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const t = track.current
      if (!t) return
      const vw = stage.current.clientWidth || window.innerWidth
      const vh = window.innerHeight
      const r = t.getBoundingClientRect()
      const range = r.height - vh
      const p = range > 0 ? clamp01(-r.top / range) : 0
      const u = clamp01((p - 0.04) / 0.66)
      const e = 1 - (1 - u) ** 2
      const o = wrapW(vw)
      const l = o * 0.56
      const w = l + (o - l) * e
      frame.current.style.width = `${w}px`
      frame.current.style.height = `${Math.min((9 / 16) * w, vh - 48)}px`
      const s = 1.1 - 0.1 * e
      inner.current.style.transform = s === 1 ? 'none' : `scale(${s})`
      const x = Math.max(0, (vw - title.current.offsetWidth) / 2 - 48)
      const k = clamp01(u / 0.6)
      left.current.style.transform = k ? `translateX(${-x * k}px)` : 'none'
      right.current.style.transform = k ? `translateX(${x * k}px)` : 'none'
      h2.current.style.opacity = String(u <= 0.3 ? 1 : clamp01(1 - (u - 0.3) / 0.28))
      setOn(p >= 0.72)
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) }
  }, [])
  return (
    <div ref={track} style={{ position: 'relative', height: '240vh', background: '#080808' }}>
      <div ref={stage} style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'grid', placeItems: 'center' }}>
        <div ref={frame} className="gvs-frame" style={{ maxWidth: 1680 }}>
          <div ref={inner} style={{ position: 'absolute', inset: 0 }}>
            <Media />
          </div>
          <Play on={on} />
        </div>
        <h2 ref={h2} className="gvs-title gvs-split" aria-label={TITLE}>
          <div ref={title} style={{ display: 'flex', gap: '0.28em', whiteSpace: 'nowrap' }}>
            <span ref={left} aria-hidden="true">Wonderful AI</span>
            <span ref={right} aria-hidden="true">Gateway</span>
          </div>
        </h2>
      </div>
    </div>
  )
}

function Simple() {
  return (
    <div style={{ position: 'relative', background: '#080808', padding: '60px 0' }}>
      <div className="gvs-wrap">
        <div className="gvs-frame" style={{ aspectRatio: '16 / 9' }}>
          <Media />
          <Play on />
        </div>
      </div>
    </div>
  )
}

export default function VideoSection() {
  const ref = useRef(null)
  const [simple, setSimple] = useState(() => typeof window !== 'undefined' && (window.innerWidth < 810 || window.matchMedia('(prefers-reduced-motion: reduce)').matches))
  useEffect(() => {
    const el = ref.current
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)')
    const check = () => setSimple(el.clientWidth < 810 || rm.matches)
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  // Close an open lightbox when leaving the page.
  useEffect(() => () => { window.__wonderfulVideoLightbox && window.__wonderfulVideoLightbox.destroy() }, [])
  return (
    <section ref={ref} data-nav-theme="dark" data-framer-name="Gateway Video Section" className="gvs" aria-label={TITLE} style={{ position: 'relative', width: '100%', background: '#080808' }}>
      {simple ? <Simple /> : <Expand />}
    </section>
  )
}
