import { Fragment, createElement, useEffect, useState } from 'react'
import { useInView } from '../lib/useInView'
import { SPRING_HEADING, SPRING_PARAGRAPH } from '../lib/spring'

// `amount`: in-view fraction that triggers the reveal (live: headings ~25% visible, paragraphs at the edge).
const VARIANTS = {
  heading: { spring: SPRING_HEADING, blur: 6, y: 16, amount: 0.25 },
  paragraph: { spring: SPRING_PARAGRAPH, blur: 10, y: 10, amount: 0 },
}

// Splits text into inline-block words that blur/fade/rise in with a 50ms stagger.
// `onMount` starts on mount (hero) instead of on scroll-into-view; `show` overrides the trigger; `delay` is seconds.
export default function WordReveal({ as = 'p', text, variant = 'heading', onMount = false, show, delay = 0, stagger = 0.05, className, style, wordClassName, renderWord }) {
  const [ref, inView] = useInView({ immediate: false, amount: VARIANTS[variant].amount })
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    if (!onMount) return
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)))
    return () => cancelAnimationFrame(id)
  }, [onMount])
  // `show` lets a parent drive the trigger (e.g. the closer paragraph fires when its section enters).
  const go = onMount ? mounted : show !== undefined ? show : inView
  const v = VARIANTS[variant]
  // "\n" in text forces a line break; the stagger index runs across lines.
  const words = text.replace(/\n/g, ' \n ').split(/ +/).filter(Boolean)
  let n = -1
  return createElement(as, { ref, className, style },
    words.map((w, k) => {
      if (w === '\n') return <br key={`br${k}`} />
      const i = ++n
      const last = k === words.length - 1 || words[k + 1] === '\n'
      // Live keeps the inter-word space as a text node *outside* the inline-block span,
      // so it collapses at line ends (affects centered lines and word widths).
      return (
      <Fragment key={k}>
      <span
        className={`wr-word ${wordClassName || ''}`}
        data-state={go ? 'shown' : 'hidden'}
        style={go ? {
          transition: `opacity ${v.spring.duration}s ${v.spring.easing} ${delay + i * stagger}s, filter ${v.spring.duration}s ${v.spring.easing} ${delay + i * stagger}s, transform ${v.spring.duration}s ${v.spring.easing} ${delay + i * stagger}s`,
        } : { filter: `blur(${v.blur}px)`, transform: `translateY(${v.y}px)` }}
      >
        {renderWord ? renderWord(w, i) : w}
      </span>{last ? '' : ' '}
      </Fragment>
      )
    })
  )
}
