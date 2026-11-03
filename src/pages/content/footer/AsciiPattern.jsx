import { useEffect, useRef } from 'react'

// Port of the Framer code component "Animated Pattern Background" (ASCII style) used by the
// White L footer band on /legal. Props mirror the live instance: characterSet binary (" 01"),
// pattern 3 (mode 2), frequencyA 100, frequencyB 0, centerASpeed 8, centerBSpeed 4, easing 62,
// invert, colour mode "color" rgb(49,49,49), Fragment Mono 12px / 1em, interval .01s.
const CHARSETS = { binary: ' 01' }
const MODES = { 1: 0, 2: 1, 3: 2 }
const remap = (e, t, n, r, i) => ((e - t) / (n - t)) * (i - r) + r
const dist = (a, b) => Math.hypot(b[0] - a[0], b[1] - a[1])
function easingFn(e) {
  if (e === 0) return (x) => x
  e = Math.max(-1, Math.min(1, e))
  const t = 1 + Math.abs(e) * 2
  return e > 0 ? (x) => Math.max(0, Math.min(1, x)) ** t : (x) => 1 - (1 - Math.max(0, Math.min(1, x))) ** t
}
// Live measures a "W" in an off-screen div whose font-size is left unset (the component passes a
// unitless number), so it inherits the page body's 12px; lineHeight 1. Ratio = width / height.
function glyphRatio(fontFamily, fontWeight) {
  const d = document.createElement('div')
  Object.assign(d.style, { position: 'absolute', visibility: 'hidden', whiteSpace: 'nowrap', fontFamily, fontWeight, fontSize: '12px', lineHeight: '1', letterSpacing: '0' })
  d.textContent = 'W'
  document.body.appendChild(d)
  const r = d.offsetWidth / d.offsetHeight
  document.body.removeChild(d)
  return r
}

export default function AsciiPattern({
  backgroundColor = 'rgb(201, 211, 255)',
  color = 'rgb(49, 49, 49)',
  characterSet = 'binary',
  pattern = '3',
  frequencyA = 100,
  frequencyB = 0,
  centerASpeed = 8,
  centerBSpeed = 4,
  easing = 62,
  invert = true,
  scale = 1,
  fontFamily = '"Fragment Mono", "Fragment Mono Placeholder", monospace',
  fontSize = 12,
  fontWeight = 400,
  interval = 0.01,
}) {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: true })
    const chars = CHARSETS[characterSet] || characterSet
    const mode = MODES[pattern] ?? 0
    const fA = frequencyA / 100, fB = frequencyB / 100, sA = centerASpeed / 50, sB = centerBSpeed / 50
    const smooth = easingFn(remap(easing, 0, 100, -1, 1))
    const start = performance.now()
    let time = 0, drawn = -1, raf = 0, timer = 0, visible = false

    const draw = (n) => {
      const v = canvas.width, y = canvas.height, dpr = window.devicePixelRatio || 1, aspect = v / y
      ctx.clearRect(0, 0, v, y)
      ctx.textBaseline = 'top'
      ctx.textAlign = 'left'
      ctx.fillStyle = color
      const A = fontSize * scale * dpr
      ctx.font = `${fontWeight} ${A}px ${fontFamily}`
      ctx.imageSmoothingEnabled = false
      const ratio = glyphRatio(fontFamily, fontWeight)
      const rowH = A * 1, colW = rowH * ratio
      const ae = Math.min(v, y)
      const M = remap(Math.cos(n * fA), -1, 1, 6, 60), oe = remap(Math.cos(n * fB), -1, 1, 6, 60)
      const l = [Math.cos(n * 3 * sA) * 0.5, Math.sin(n * 7 * sA) * 0.5]
      const d = [Math.cos(n * 5 * sB) * 0.5, Math.sin(n * 4 * sB) * 0.5]
      for (let t = 0; t < y; t += rowH) {
        for (let r = 0; r < v; r += colW) {
          const a = [Math.floor(r), Math.floor(t)]
          const o = [(2 * (a[0] - v / 2)) / ae, (2 * (a[1] - y / 2)) / ae]
          o[0] *= aspect
          const e1 = mode % 2 === 0 ? Math.atan2(l[1] - o[1], l[0] - o[0]) : dist(o, l)
          const e2 = mode === 0 ? Math.atan2(d[1] - o[1], d[0] - o[0]) : dist(o, d)
          let b = smooth((Math.cos(e1 * M) * Math.cos(e2 * oe) + 1) / 2)
          if (invert) b = 1 - b
          const ch = chars[Math.floor(b * chars.length)]
          if (ch) ctx.fillText(ch, a[0], a[1])
        }
      }
    }
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.clientWidth * dpr
      canvas.height = canvas.clientHeight * dpr
      draw(time)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)
    resize()
    // Redraw the font once Fragment Mono has loaded.
    document.fonts?.load(`${fontWeight} ${fontSize}px "Fragment Mono"`).then(() => { drawn = -1 }).catch(() => {})

    const loop = () => {
      if (drawn !== time) { draw(time); drawn = time }
      raf = requestAnimationFrame(loop)
    }
    const tick = () => { time = (performance.now() - start) * 0.1 * 1e-4 }
    const play = () => { if (raf) return; tick(); raf = requestAnimationFrame(loop); timer = setInterval(tick, interval * 1000) }
    const stop = () => { cancelAnimationFrame(raf); raf = 0; clearInterval(timer); timer = 0 }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? play() : stop() })
    io.observe(wrap)
    return () => { ro.disconnect(); io.disconnect(); stop() }
  }, [backgroundColor, color, characterSet, pattern, frequencyA, frequencyB, centerASpeed, centerBSpeed, easing, invert, scale, fontFamily, fontSize, fontWeight, interval])

  return (
    <div ref={wrapRef} style={{ height: '100%', width: '100%', backgroundColor, borderRadius: 0, overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ height: '100%', width: '100%', display: 'block' }} />
    </div>
  )
}
