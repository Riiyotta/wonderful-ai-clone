import { createElement, useLayoutEffect, useRef, useState } from 'react'

// Framer per-character text effect (case-study subtitle and stats): every character is an inline-block that rises
// from blur(10px) / y 10 / opacity .001. `by="line"` staggers whole lines (subtitle: ~45ms per line), `by="char"`
// staggers characters (stats: 50ms per character). Words sit in nowrap wrappers except the last one, which Framer
// leaves at white-space:unset (so it can break mid-word, as on live).
export default function CharReveal({ as = 'p', text, by = 'char', stagger = 0.05, delay = 0, spring, className, style }) {
  const ref = useRef(null)
  const [delays, setDelays] = useState(null)
  const [go, setGo] = useState(false)
  useLayoutEffect(() => {
    const chars = ref.current ? [...ref.current.querySelectorAll('.cr-ch')] : []
    let d
    if (by === 'line') {
      const tops = [...new Set(chars.map((c) => Math.round(c.offsetTop)))].sort((a, b) => a - b)
      d = chars.map((c) => delay + tops.indexOf(Math.round(c.offsetTop)) * stagger)
    } else d = chars.map((_, i) => delay + i * stagger)
    setDelays(d)
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setGo(true)))
    return () => cancelAnimationFrame(id)
  }, [text, by, stagger, delay])
  let k = -1
  const words = text.split(' ')
  return createElement(as, { ref, className, style },
    words.map((w, wi) => (
      <span key={wi}>
        <span style={{ whiteSpace: wi === words.length - 1 && w ? 'unset' : 'nowrap' }}>
          {[...w].map((ch, ci) => {
            k += 1
            const dl = delays ? delays[k] : 0
            return (
              <span
                key={ci}
                className="cr-ch"
                style={go ? {
                  display: 'inline-block', opacity: 1, filter: 'blur(0px)', transform: 'none',
                  transition: `opacity ${spring.duration}s ${spring.easing} ${dl}s, filter ${spring.duration}s ${spring.easing} ${dl}s, transform ${spring.duration}s ${spring.easing} ${dl}s`,
                } : { display: 'inline-block', opacity: 0.001, filter: 'blur(10px)', transform: 'translateY(10px)' }}
              >{ch}</span>
            )
          })}
        </span>{wi < words.length - 1 ? ' ' : ''}
      </span>
    )))
}
