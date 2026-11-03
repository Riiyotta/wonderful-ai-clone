import { useEffect, useRef, useState } from 'react'
import { useInView } from '../../../lib/useInView'

// Framer counter code component: counts 0 -> value once in view. Live samples (75%/91%/77%):
// .027@83 .133@165 .267@246 .413@329 .533@414 .64@497 .72@581 .787@663 .84@746 .88@828 .92@912 .96@1078 1@1578ms
// -> cubic-bezier(.2,0,.15,1) over 1.5s (least-squares fit), value rounded.
function bezier(x1, y1, x2, y2) {
  const sample = (a, b, t) => 3 * (1 - t) * (1 - t) * t * a + 3 * (1 - t) * t * t * b + t * t * t
  return (x) => {
    let lo = 0, hi = 1
    for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (sample(x1, x2, m) < x) lo = m; else hi = m }
    return sample(y1, y2, (lo + hi) / 2)
  }
}
const EASE = bezier(0.2, 0, 0.15, 1)
const DURATION = 1500

export default function Counter({ value, suffix = '' }) {
  const [ref, inView] = useInView()
  const [n, setN] = useState(0)
  const raf = useRef(0)
  useEffect(() => {
    if (!inView) return
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / DURATION)
      setN(Math.round(EASE(p) * value))
      if (p < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [inView, value])
  return (
    <div className="inx-ctr" ref={ref}>
      <div className="inx-ctr-inner">
        <div className="inx-ctr-num">
          <h2 className="inx-ctr-ghost" aria-hidden="true">{value}{suffix}</h2>
          <h2 className="inx-ctr-val">{n}{suffix}</h2>
        </div>
      </div>
    </div>
  )
}
