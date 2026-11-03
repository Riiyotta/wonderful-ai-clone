import { useState } from 'react'
import WordReveal from './WordReveal'
import { useInView } from '../lib/useInView'
import { springEase } from '../lib/spring'
import { H2_SECTION, P_17, LinedHeading, PhosphorArrowRight } from './sections/shared'
import '../styles/closer.css'

// §3: closer card width swap. Least-squares fit to the live width curve (overdamped, long tail):
// .117@33 .339@66 .519@100 .71@151 .824@200 .909@267 .96@350 .985@450 .995@552ms -> stiffness 520 / damping 62.
const CARD_SPRING = springEase({ stiffness: 520, damping: 62 })

const CARDS = [
  { key: 'about', label: 'About us', href: '/about-us' },
  { key: 'careers', label: 'Careers', href: '/careers' },
]

export default function Closer() {
  const [hovered, setHovered] = useState(null)
  // About us is expanded by default; hovering Careers expands it and collapses About us.
  const expanded = hovered === 'careers' ? 'careers' : 'about'
  // Live: the paragraph reveal fires when the Closer section's top edge enters the viewport (measured D and M),
  // not when the paragraph itself does (~120px / ~180px earlier than the paragraph's own edge).
  const [sectionRef, sectionIn] = useInView()

  return (
    <section
      ref={sectionRef}
      id="Closer"
      data-nav-theme="dark"
      className="relative flex min-h-[70vh] w-full flex-col items-center justify-center gap-[60px] overflow-hidden px-[60px] py-[120px]
        t:items-start t:px-[40px]
        m:items-start m:gap-[64px] m:px-[24px] m:py-[84px]"
    >
      <div className="absolute inset-0">
        <img src="/assets/z2gffofvCT8lr3s0y08hDCe9MZ4.jpg" alt="" loading="lazy" className="block h-full w-full object-cover object-center" />
      </div>

      <div className="relative flex w-full max-w-[1280px] items-center justify-between overflow-clip m:flex-col m:justify-center m:gap-[16px]">
        <LinedHeading
          lines={['The team building', 'the future of applied AI.']}
          className={`${H2_SECTION} relative z-0 m-0 w-[472px] flex-none text-left text-offwhite [text-wrap:balance] t:w-[335px] m:w-full`}
        />
        <WordReveal
          as="p"
          variant="paragraph"
          show={sectionIn}
          text="A single unified system that compounds the intelligence and execution of the entire workforce, processes, and products. We're early, and we're hiring the people who'll define it."
          className={`${P_17} relative z-0 m-0 w-px max-w-[460px] flex-1 text-left text-offwhite t:max-w-[370px] m:w-full m:flex-none m:text-white m:[text-wrap:balance]`}
        />
      </div>

      <div className="relative w-full max-w-[1280px]">
        <div
          className="relative flex w-full items-center justify-center gap-[10px] overflow-hidden m:flex-col"
          style={{ '--cl-dur': `${CARD_SPRING.duration}s`, '--cl-ease': CARD_SPRING.easing }}
          onMouseLeave={() => setHovered(null)}
        >
          {CARDS.map((c) => (
            <a
              key={c.key}
              href={c.href}
              data-expanded={expanded === c.key}
              onMouseEnter={() => setHovered(c.key)}
              className="cl-card relative flex flex-none cursor-pointer flex-col items-start gap-[10px] overflow-hidden no-underline"
            >
              <div className={`relative z-[1] flex w-full items-start justify-between ${expanded === c.key ? 'overflow-visible' : 'overflow-hidden'}`}>
                <p className="cl-label relative m-0">{c.label}</p>
                <div className="relative z-[1] flex w-min flex-col items-end justify-end gap-[24px]">
                  <div className="cl-btn relative z-[1] aspect-square w-[44px] flex-none overflow-hidden rounded-[50%]">
                    <PhosphorArrowRight className="cl-icon absolute block" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
