import { Fragment, useLayoutEffect, useRef, useState } from 'react'
import { springEase } from '../../../lib/spring'
import '../../../styles/product/product.css'
import '../../../styles/product/agents.css'

// "Built for real enterprise work" (dark). D/T: click accordion (one item open). Framer layout animation on switch,
// measured with rAF on live: positions settle in ~200ms with ~1.5% overshoot -> spring 480/34 (fit). Header colours
// (#f5f5f5 active, rgba(255,255,255,.45) idle) ride the same spring. The opened paragraph appears immediately.
// Quirk kept from live: the H2 subtitle shows text only while "Grounded in organizational knowledge" is open.
// M: static list (4 items, all open, no "Tested before it ships"), image below.
const SPRING = springEase({ stiffness: 480, damping: 34 })
const ITEMS = [
  { t: 'Across channels and modalities', p: 'Voice, chat, email, documents, and any other channel the work comes through. Agents work across all of them.', w: 425 },
  { t: 'Handles real complexity', p: 'Agents that handle many steps and make real decisions along the way, not just follow a fixed path.', w: 470 },
  { t: 'Fully integrated', p: 'Connected to the systems the work runs on, so the agent reads data, triggers actions, and updates records directly.', w: 425 },
  { t: 'Grounded in organizational knowledge', p: 'Agents are built on what the organization already knows. Your data, documents, and policies become the context every agent works from.', w: 425 },
  { t: 'Tested before it ships', p: 'Every agent is evaluated as it’s built, behavior tested and quality measured, so what reaches production is already proven.', w: 385 },
]
const SUB = 'Enterprise work spans channels, runs long, and lives inside your systems. Wonderful agents are built for exactly that.'
const IMG = '/assets/0idj71nARTQPJF29WjuFQFbfZGY.png'

function useFlip(dep) {
  const root = useRef(null)
  const prev = useRef(null)
  const snapshot = () => {
    const m = new Map()
    root.current?.querySelectorAll('[data-flip]').forEach((el) => m.set(el.dataset.flip, el.getBoundingClientRect().top))
    prev.current = m
  }
  useLayoutEffect(() => {
    const before = prev.current
    if (!before || !root.current) return
    prev.current = null
    const els = [...root.current.querySelectorAll('[data-flip]')]
    els.forEach((el) => {
      const b = before.get(el.dataset.flip)
      if (b === undefined) return
      const dy = b - el.getBoundingClientRect().top
      if (Math.abs(dy) < 0.5) return
      el.style.transition = 'none'
      el.style.transform = `translateY(${dy}px)`
    })
    root.current.getBoundingClientRect()
    requestAnimationFrame(() => els.forEach((el) => {
      if (!el.style.transform) return
      el.style.transition = `transform ${SPRING.duration}s ${SPRING.easing}`
      el.style.transform = ''
    }))
  }, [dep])
  return [root, snapshot]
}

function Desktop() {
  const [open, setOpen] = useState(0)
  const [root, snapshot] = useFlip(open)
  const pick = (i) => { if (i === open) return; snapshot(); setOpen(i) }
  const colorT = `color ${SPRING.duration}s ${SPRING.easing}`
  return (
    <div ref={root} className="relative flex w-full max-w-[1680px] flex-row items-start justify-center gap-[10px] t:flex-col t:justify-start t:gap-[64px] m:hidden">
      <div className="relative flex w-[556px] flex-none flex-col items-start justify-between self-stretch pr-[50px] t:w-full t:justify-start t:gap-[160px] t:self-auto t:pr-0">
        <div data-flip="top" className="relative flex w-full flex-col items-start gap-[32px]">
          <div className="relative w-full whitespace-pre-wrap break-words t:max-w-[600px]">
            <h2 className="pr-h2 [text-wrap:balance] text-[#f5f5f5]">Built for real enterprise work</h2>
          </div>
          <div className="relative w-full max-w-[490px] whitespace-pre-wrap break-words t:[text-wrap:balance]">
            <p className="pr-p17 text-[#b3b3b3]">{open === 3 ? SUB : ' '}</p>
          </div>
        </div>
        <div className="relative flex w-full flex-col items-start gap-[24px]">
          {ITEMS.map((it, i) => (
            <Fragment key={it.t}>
              <div data-flip={`d${i}`} className="relative h-px w-full flex-none bg-[rgba(255,255,255,0.18)]" />
              <div data-flip={`i${i}`} className="relative flex w-full flex-col items-start gap-[20px]">
                <div className="relative flex w-full flex-row items-center justify-between" onClick={() => pick(i)} style={{ cursor: 'pointer' }}>
                  <h4 className="pr-h4 whitespace-pre" style={{ color: i === open ? '#f5f5f5' : 'rgba(255,255,255,0.45)', transition: colorT }}>{it.t}</h4>
                </div>
                {i === open && (
                  <div className="relative max-w-[490px] whitespace-pre-wrap break-words t:!w-full t:[text-wrap:balance]" style={{ width: it.w }}>
                    <p className="ag-rw-p">{it.p}</p>
                  </div>
                )}
              </div>
            </Fragment>
          ))}
        </div>
      </div>
      <div className="relative flex-[1_0_0] self-start overflow-hidden rounded-[8px] [aspect-ratio:1.21087] t:w-full t:flex-none t:[aspect-ratio:1.336]">
        <img src={IMG} alt="" className="absolute inset-0 block h-full w-full rounded-[inherit] object-cover" />
      </div>
    </div>
  )
}

function Mobile() {
  return (
    <div className="relative hidden w-full flex-col items-start gap-[32px] m:flex">
      <div className="relative w-full whitespace-pre-wrap break-words"><h2 className="pr-h2 [text-wrap:balance] text-[#fafafa]">Built for real enterprise work</h2></div>
      <div className="relative w-full whitespace-pre-wrap break-words"><p className="pr-p17 text-[#9e9e9e]">{SUB}</p></div>
      {ITEMS.slice(0, 4).map((it) => (
        <Fragment key={it.t}>
          <div className="relative h-px w-full bg-[rgba(255,255,255,0.18)]" />
          <div className="relative flex w-full flex-col items-start gap-[12px]">
            <h4 className="pr-h4 w-full text-[#f5f5f5]">{it.t}</h4>
            <p className="pr-p14 w-full text-left text-[#9e9e9e]">{it.p}</p>
          </div>
        </Fragment>
      ))}
      <div className="relative w-full overflow-clip rounded-[8px] [aspect-ratio:1.22493]">
        <img src={IMG} alt="" className="absolute inset-0 block h-full w-full rounded-[inherit] object-cover" />
      </div>
    </div>
  )
}

export default function RealWork() {
  return (
    <section data-nav-theme="dark" className="relative flex w-full flex-col items-center justify-center gap-[10px] overflow-clip bg-band px-[60px] py-[120px] t:px-[40px] m:px-[24px] m:py-[64px]">
      <Desktop />
      <Mobile />
    </section>
  )
}
