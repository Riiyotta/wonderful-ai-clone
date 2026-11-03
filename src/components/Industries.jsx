import { useEffect, useRef, useState } from 'react'
import { H2_SECTION, P_17, LinedHeading } from './sections/shared'
import '../styles/industries.css'

// CLONE_SPEC §2.6 tab data (tab order from §2.6 chip list).
const INDUSTRIES = [
  { slug: 'banking', title: 'Banking', subtitle: 'Accuracy, Compliance, and Trust', img: 'Z6ITE2va5GBIFUhQaiHnfePJmaY.jpg' },
  { slug: 'telecommunication', title: 'Telecommunications', subtitle: 'Reliability, Scale, and Speed', img: 'FFdLCmKHmSQ4OZaBx3pFj3de65A.jpg' },
  { slug: 'healthcare', title: 'Healthcare', subtitle: 'Safety, Privacy, and Care', img: 'cvajetGWTDvJ06wQgNqFbZ79w60.jpg' },
  { slug: 'retail', title: 'Retail', subtitle: 'Personalization, Reach, and Trust', img: 'ciChxsmc9Ulla7nbNs1CRdWq7ew.jpg' },
  { slug: 'utilities', title: 'Utilities', subtitle: 'Reliability, Scale, and Service', img: 'gauGNjiMjJQ5nem2UNlcqeILxVc.jpg' },
  { slug: 'insurance', title: 'Insurance', subtitle: 'Precision, Compliance, and Trust', img: 'NQUtNQPJbCeeC92AlGEiZSe1hk.jpg' },
  { slug: 'airlines', title: 'Airlines', subtitle: 'Disruption, Revenue, and Service', img: 'aqVMSZQBodIwmH6xYMyI9Tk27zk.jpg' },
]
const PARAM = 'selected-industry'
// Live: the tab switch (chip crossfade + card swap) lands ~85–180ms after the click (median ~130ms; Framer's
// state/URL update). The clone commits after a fixed delay so the chip and card timing line up with live.
const COMMIT_DELAY_MS = 120

function readSlug() {
  if (typeof window === 'undefined') return INDUSTRIES[0].slug
  const s = new URLSearchParams(window.location.search).get(PARAM)
  return INDUSTRIES.some((i) => i.slug === s) ? s : INDUSTRIES[0].slug
}

export default function Industries() {
  const [slug, setSlug] = useState(readSlug)
  const active = INDUSTRIES.find((i) => i.slug === slug)

  useEffect(() => {
    const onPop = () => setSlug(readSlug())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const pending = useRef(0)
  useEffect(() => () => clearTimeout(pending.current), [])
  const select = (s) => {
    clearTimeout(pending.current)
    pending.current = setTimeout(() => commit(s), COMMIT_DELAY_MS)
  }
  const commit = (s) => {
    setSlug(s)
    const url = new URL(window.location.href)
    url.searchParams.set(PARAM, s)
    window.history.replaceState(window.history.state, '', url)
  }

  return (
    <section
      id="Industries"
      data-nav-theme="light"
      className="relative flex w-full flex-col items-center justify-center overflow-clip bg-white px-[60px] py-[120px] t:px-[40px] m:px-[24px] m:py-0"
    >
      <div className="relative flex w-full max-w-[1280px] flex-col items-center justify-start gap-[64px] m:gap-[32px] m:py-[84px]">
        {/* Header */}
        <div className="relative flex w-full flex-col items-center justify-center gap-[32px] overflow-clip m:gap-[12px]">
          <LinedHeading
            lines={['Deep in regulated,', 'mission-critical industries']}
            className={`${H2_SECTION} m-0 w-full max-w-[1400px] text-center text-ink [text-wrap:balance]`}
          />
          <div className="relative flex w-full items-center justify-center m:w-min m:max-w-[330px]">
            <div role="tablist" aria-label="Industries" className="ind-tabs relative flex w-min max-w-full items-center justify-start gap-[2px] overflow-x-auto overflow-y-hidden rounded-[999px] bg-chip p-[4px]">
              {INDUSTRIES.map((ind) => {
                const on = ind.slug === slug
                return (
                  <button
                    key={ind.slug}
                    type="button"
                    role="tab"
                    aria-selected={on}
                    onClick={() => select(ind.slug)}
                    className={`ind-tab flex flex-none cursor-pointer items-center justify-center gap-[8px] whitespace-pre rounded-[999px] border-0 px-[16px] py-[9px] font-inter text-[14px] font-normal leading-[16.8px] tracking-[-0.84px] ${on ? 'bg-white text-ink-900' : 'bg-transparent text-ink-400'}`}
                  >
                    {ind.title}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Card List */}
        <div className="relative flex w-full max-w-[1200px] flex-col items-center justify-start">
          <a
            key={active.slug}
            href={`/industries/${active.slug}`}
            className="ind-card relative flex h-[600px] w-full cursor-pointer flex-col items-center justify-between overflow-clip rounded-[12px] px-[24px] pt-[240px] pb-[44px] no-underline
              t:pt-[210px] m:h-[460px] m:rounded-[8px] m:pt-[160px]"
          >
            <div className="absolute inset-0 rounded-[inherit]">
              <img src={`/assets/${active.img}`} alt="" className="block h-full w-full rounded-[inherit] object-cover object-center" />
            </div>
            <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,0,0,0)_0%,rgba(0,0,0,0.12)_73%,rgba(0,0,0,0.35)_100%)]" />
            <div className="ind-card-text relative z-[1] flex w-full max-w-[800px] flex-col items-center justify-start gap-[8px]">
              <h3 className="ind-h3 w-full whitespace-pre-wrap break-words">{active.title}</h3>
            </div>
            <div className="relative flex w-full flex-col items-center justify-center gap-[16px] overflow-clip">
              <p className={`${P_17} m-0 w-full whitespace-pre-wrap break-words text-center text-[rgba(255,255,255,0.88)]`}>{active.subtitle}</p>
              <span className="relative z-[1] flex h-[36px] items-center justify-center rounded-pill bg-white px-[12px] py-[6px] font-inter text-[12px] font-normal leading-[10px] tracking-[-0.5px] text-black">
                Explore more
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}
