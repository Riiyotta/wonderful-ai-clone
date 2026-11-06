import { useState } from 'react'
import WordReveal from '../../../components/WordReveal'
import { springEase } from '../../../lib/spring'
import '../../../styles/product/product.css'
import '../../../styles/product/systems.css'

// "Deployed where you run, by local teams" (white). D: two hover-swap cards (variants Default / Expand 2):
// expanded card 60% wide with image + scrim + white title + paragraph; collapsed card rgba(17,17,17,.05) with a dark
// title only. Hovering the collapsed card swaps them; leaving restores Default. Width/colour spring measured on live:
// stiffness 400 / damping 42 (~480ms); image/scrim/paragraph switch instantly.
// T: both cards expanded side by side (470 tall). M: stacked (492 tall).
const SPRING = springEase({ stiffness: 400, damping: 42 })
const CARDS = [
  { t: 'FDE-led Rollout', img: '0mdyl04dtY9LVOwd1CjHfzZC3c.jpg',
    p: 'Our team maps how your business function actually runs, builds the system around it, and migrates your data and processes from the legacy tool it replaces.' },
  { t: 'Any cloud, on-prem, fully governed', img: 'QMeFdoJ9YmQHUHbVjmrBe9IL3g.jpg',
    p: 'Your system and its data run in your own environment or a Wonderful-managed cloud, under your access controls, with full auditability of every change made to it.' },
]

function Card({ c, i, active, setActive, animate }) {
  const open = active === i
  const tr = `${SPRING.duration}s ${SPRING.easing}`
  return (
    <a
      className={`sys-dep-card ${open ? 'is-open' : ''} ${active === 1 && open ? 'is-black' : ''}`}
      style={animate ? { transition: `width ${tr}, background-color ${tr}` } : undefined}
      onMouseEnter={() => setActive(i)}
    >
      <div className="sys-dep-media absolute inset-0 z-0">
        <div className="absolute inset-0"><img src={`/assets/${c.img}`} alt="" className="block h-full w-full object-cover object-center" /></div>
      </div>
      <div className="sys-dep-media absolute inset-0 z-[1]" style={{ background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 35%, rgba(0, 0, 0, .82) 100%)' }} />
      <div className="sys-dep-content relative z-[2] flex w-full flex-col items-start justify-start gap-[14px] overflow-hidden">
        <div className="sys-dep-title relative w-full [text-wrap:balance]">
          <h3 className="pr-h3" style={animate ? { transition: `color ${tr}` } : undefined}>{c.t}</h3>
        </div>
        <div className="sys-dep-p sys-dep-media relative w-full whitespace-pre-wrap break-words [text-wrap:balance]">
          <p className="pr-inter">{c.p}</p>
        </div>
      </div>
    </a>
  )
}

export default function Deployed() {
  const [active, setActive] = useState(0)
  // Animate only once the visitor has swapped cards; a viewport resize must re-resolve the percentage widths instantly.
  const [animate, setAnimate] = useState(false)
  const swap = (i) => { if (i !== active) setAnimate(true); setActive(i) }
  return (
    <section className="relative flex w-full flex-col items-center justify-center gap-[80px] overflow-clip bg-white px-[60px] py-[120px] t:px-[40px] m:items-start m:gap-[60px] m:overflow-hidden m:px-[24px] m:pb-[72px] m:pt-[84px]">
      <div className="relative flex w-full max-w-[1200px] flex-col items-center justify-center gap-[60px] overflow-hidden bg-white t:items-start m:items-start m:gap-[64px]">
        <div className="relative flex w-full max-w-[1200px] flex-row items-end justify-start gap-[32px] overflow-clip m:flex-col m:justify-center m:gap-[24px]">
          <div className="relative z-0 w-[701px] t:w-px t:flex-[1_0_0] m:w-full">
            <WordReveal as="h2" text="Deployed where you run, by local teams" className="pr-h2 text-left text-[#171719] [text-wrap:wrap]" />
          </div>
        </div>
        <div className="relative w-full max-w-[1200px]">
          <div className="sys-dep-row" onMouseLeave={() => swap(0)}>
            {CARDS.map((c, i) => <Card key={i} c={c} i={i} active={active} setActive={swap} animate={animate} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
