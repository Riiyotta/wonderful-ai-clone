import { Fragment, useEffect, useRef } from 'react'
import '../styles/reveal.css'

// CLONE_SPEC §4.4: per-word windows (2% / 50% / 99% progress), re-measured on live and expressed as r = scroll past
// the top of the sticky track (the 134vh / 171vh block), in the 1440x900 frame.
// Live behaviour across 1440x900, 1440x700, 1100x900, 600x900, 390x844, 390x700:
//  - before the track sticks (r < 0) the windows scale with the viewport height (identical in vh at every width);
//  - once it sticks (r >= 0) they scale with the sticky scroll range (track height - 100vh: 306px at 1440x900),
//    which is why mobile (171vh track) spreads the later words over twice the scroll.
const REF_VH = 900
const REF_RANGE = 306
const WORDS = [
  // [word, start, mid, end, accent, group]
  ['We', -890, -676, -455],
  ['bring', -740, -526, -305],
  ['together', -590, -376, -155],
  ['the', -440, -226, -5],
  ['AI', -290, -76, 26, true, 'a'],
  ['platform,', -140, 11, 48, true, 'a'],
  ['deployment', 1, 33, 69, true, 'b'],
  ['teams,', 22, 55, 89],
  ['and', 42, 76, 109],
  ['strategic', 63, 98, 133, true, 'c'],
  ['partnership', 85, 120, 158],
  ['to', 111, 142, 179],
  ['transform', 131, 164, 199],
  ['how', 152, 186, 219],
  ['enterprises', 173, 208, 240],
  ['work.', 194, 230, 267],
]

const FROM = [144, 144, 144, 0.26]
const TO_BASE = [74, 74, 74, 1] // #4a4a4a
const TO_ACCENT = [0, 0, 0, 1] // #000

// Piecewise-linear progress through the three measured points, extrapolated and clamped to [0,1].
function progressAt(s, [a, m, b]) {
  let p
  if (s <= m) p = 0.02 + ((s - a) * (0.5 - 0.02)) / (m - a)
  else p = 0.5 + ((s - m) * (0.99 - 0.5)) / (b - m)
  return Math.min(1, Math.max(0, p))
}

function mix(from, to, p) {
  const c = from.map((f, i) => f + (to[i] - f) * p)
  return `rgba(${c[0].toFixed(1)}, ${c[1].toFixed(1)}, ${c[2].toFixed(1)}, ${c[3].toFixed(3)})`
}

// Group consecutive words that Framer wraps in an inline relative span (AI platform, / deployment / strategic).
function groupWords() {
  const out = []
  WORDS.forEach((w, i) => {
    const g = w[5]
    const last = out[out.length - 1]
    if (g && last && last.group === g) last.items.push(i)
    else out.push({ group: g, items: [i] })
  })
  return out
}
const GROUPS = groupWords()

export default function RevealStatement() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const wordRefs = useRef([])

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = trackRef.current
      if (!el) return
      const vh = window.innerHeight
      const r = -el.getBoundingClientRect().top
      const range = Math.max(1, el.offsetHeight - vh)
      // Map to the measured 1440x900 frame (see WORDS).
      const s = r < 0 ? (r / vh) * REF_VH : (r / range) * REF_RANGE
      // Live M (<=879.98) also blurs unrevealed words: filter blur(2px * (1 - progress)); D stays unblurred.
      const mobile = window.matchMedia('(max-width: 879.98px)').matches
      WORDS.forEach((w, i) => {
        const node = wordRefs.current[i]
        if (!node) return
        const p = progressAt(s, [w[1], w[2], w[3]])
        node.style.color = mix(FROM, w[4] ? TO_ACCENT : TO_BASE, p)
        node.style.filter = mobile ? `blur(${(2 * (1 - p)).toFixed(3)}px)` : ''
      })
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  const word = (i) => (
    <span key={i} ref={(n) => (wordRefs.current[i] = n)} className="rv-word">{WORDS[i][0]} </span>
  )

  return (
    <section
      ref={sectionRef}
      id="vision"
      data-nav-theme="light"
      className="relative flex h-[800px] w-full flex-col items-center justify-center overflow-hidden bg-white px-[60px] py-[100px]
        t:px-[40px] t:pt-0 t:pb-[330px]
        m:h-[150vh] m:justify-start m:overflow-visible m:px-[24px] m:py-0"
    >
      <div className="relative w-[1000px] flex-none t:w-full m:w-full">
        <div ref={trackRef} className="relative h-[134vh] w-full m:h-[171vh]">{/* live M: 1443.2px on 844 -> sticky holds until scrollY 2460 */}
          <div className="sticky top-0 box-border flex h-screen w-full flex-col justify-center overflow-visible px-[3%] pt-0 pb-[300px] t:pt-[280px] m:px-[3.41px] m:pb-[100px]">
            <p className="rv-p">
              {GROUPS.map((g, gi) =>
                g.group ? (
                  <span key={gi} className="rv-group">{g.items.map(word)}</span>
                ) : (
                  <Fragment key={gi}>{g.items.map(word)}</Fragment>
                )
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
