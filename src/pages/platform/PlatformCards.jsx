import { useState } from 'react'
import { springEase } from '../../lib/spring'
import { useMediaQuery } from '../../components/nav/hooks'
import { H3 } from './shared'
import '../../styles/platform/platform.css'

// Two-card hover component (Framer "Platform Card" / "Deployment Card", CLONE_SPEC_PLATFORM.md §3).
// Desktop (>=1440): the expanded card is 60% wide (image + scrim + paragraph), the other flex:1 and collapsed
// (bg rgba(17,17,17,.05), dark title). Hovering the second card swaps them; leaving restores the default.
// Width/colour transition: measured spring stiffness 360 / damping 38. Tablet/mobile: both cards expanded.
const SPRING = springEase({ stiffness: 360, damping: 38 })

export default function PlatformCards({ cards, tabletStack = false }) {
  const isDesktop = useMediaQuery('(min-width: 1440px)')
  const [hovered, setHovered] = useState(0)
  const [touched, setTouched] = useState(false)
  const expandedIdx = hovered
  return (
    <div
      className={`plat-cards relative flex w-full items-center justify-center gap-[10px] overflow-hidden m:flex-col ${tabletStack ? 't:flex-col' : ''}`}
      style={{ '--pc-dur': `${SPRING.duration}s`, '--pc-ease': SPRING.easing }}
      onMouseLeave={() => setHovered(0)}
    >
      {cards.map((c, i) => {
        const expanded = !isDesktop || expandedIdx === i
        const Tag = c.href ? 'a' : 'div'
        return (
          <Tag
            key={c.title}
            href={c.href}
            data-expanded={expanded}
            data-anim={touched ? 'on' : undefined}
            onMouseEnter={() => { if (!isDesktop) return; setHovered(i); if (i !== hovered) setTouched(true) }}
            className={`pc-card relative flex cursor-pointer flex-col items-start justify-end gap-[14px] overflow-hidden rounded-[8px] p-[32px] no-underline ${tabletStack ? 't:h-[492px] t:w-full t:flex-none' : 't:h-[470px] t:w-px t:flex-[1_0_0]'} t:p-[24px] m:h-[492px] m:w-full m:flex-none m:p-[24px]`}
          >
            {expanded && (
              <>
                <div className="absolute inset-0 z-0">
                  <picture>
                    {c.imageTablet && <source media="(min-width: 880px) and (max-width: 1439.98px)" srcSet={c.imageTablet} />}
                    {c.imageMobile && <source media="(max-width: 879.98px)" srcSet={c.imageMobile} />}
                    <img src={c.image} alt="" className="absolute inset-0 block h-full w-full object-cover object-center" />
                  </picture>
                </div>
                <div className="absolute inset-0 z-[1]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0) 35%, rgba(0,0,0,.82) 100%)' }} />
              </>
            )}
            <div key={expanded ? 'x' : 'c'} className="relative z-[2] flex w-full flex-col items-start gap-[14px] overflow-hidden t:max-w-[450px] m:max-w-[450px]">
              <div className="relative w-full max-w-[450px] t:max-w-[400px] m:max-w-[400px]">
                <h3 className={`pc-title m-0 [text-wrap:balance] ${H3}`}>{c.title}</h3>
              </div>
              {expanded && (
                <p className="pc-text m-0 w-full max-w-[80%] font-inter text-[17px] leading-[1.4] tracking-[-0.01em] [text-wrap:balance] t:max-w-none m:max-w-none">
                  {c.text}
                </p>
              )}
            </div>
          </Tag>
        )
      })}
    </div>
  )
}
