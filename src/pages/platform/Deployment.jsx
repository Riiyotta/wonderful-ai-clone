import { useEffect, useRef, useState } from 'react'
import WordReveal from '../../components/WordReveal'
import { springEase } from '../../lib/spring'
import { Appear, CountUp, H1, H2, H3, P17, P20 } from './shared'
import PlatformCards from './PlatformCards'
import FeatureGrid from './FeatureGrid'
import Closer from './Closer'
import { DEPLOYMENT_ICONS } from './icons'
import { useMediaQuery } from '../../components/nav/hooks'
import '../../styles/platform/platform.css'

// /deployment — CLONE_SPEC_PLATFORM.md §2.

function Hero() {
  const isMobile = useMediaQuery('(max-width: 879.98px)')
  const isTablet = useMediaQuery('(min-width: 880px) and (max-width: 1439.98px)')
  return (
    <section
      data-nav-theme="dark"
      data-framer-name="Hero animation"
      className="relative flex h-[85vh] min-h-[500px] w-full flex-col items-center justify-center gap-[120px] overflow-clip px-[60px] pb-[60px] pt-[106px] t:min-h-[560px] t:p-0 m:h-[80vh] m:min-h-0 m:px-0 m:pb-0 m:pt-[49px]"
    >
      <div className="absolute inset-0">
        <picture>
          <source media="(max-width: 879.98px)" srcSet="/assets/OUaQj58Pzu6qHzTmcPtPerUlsQ.png" />
          <img src="/assets/GE2ff9hpxjunCs3VZvJODYW4IoQ.jpg" alt="" className="block h-full w-full object-cover object-center m:object-[65%_48%]" />
        </picture>
      </div>
      <div className="relative flex w-[950px] flex-col items-center justify-center gap-[32px] t:h-px t:w-full t:flex-[1_0_0] t:gap-[16px] t:px-[40px] t:pb-[60px] t:pt-[166px] m:w-full m:gap-[16px] m:p-[24px]">
        <Appear delay={0.1} className="relative z-[2] w-full">
          <h1 className={`m-0 whitespace-pre-wrap text-center text-offwhite ${H1}`}>
            {isMobile ? 'Deployment is\nwhere enterprise AI succeeds or fails.' : 'Deployment is where\nenterprise AI succeeds or fails.'}
          </h1>
        </Appear>
        <div className="relative w-full t:max-w-[80%] m:max-w-full">
          <WordReveal
            key={isMobile ? 'm' : 'd'}
            as="p"
            variant="paragraph"
            onMount
            text={isMobile ? 'Wonderful provides on-site deployment teams who get AI into production, deliver business impact fast, and hand you the keys.' : 'Wonderful provides on-site deployment teams who get AI into production,\ndeliver business impact fast, and hand you the keys.'}
            className={`m-0 text-center text-offwhite ${isMobile || isTablet ? P17 : P20}`}
          />
        </div>
      </div>
    </section>
  )
}

const CARDS = [
  {
    title: 'FDE | Makes it work.',
    text: 'Builds the agents, integrations, and workflows into your stack. Works on site to solve data access, governance, and performance issues during implementation.',
    image: '/assets/vVKXkk2ypeDiIuOY2R7fWqH8U.jpg',
  },
  {
    title: 'DS | Makes it matter.',
    text: 'Defines the use cases, metrics, and business case with you. Drives adoption across the organization and builds the transformation roadmap from the first use case onward.',
    image: '/assets/cXLe4OBiqrbKuj4qEda2nakG4ME.png',
  },
]

function Teams() {
  return (
    <section
      id="2nd-section"
      className="relative flex min-h-[70vh] w-full flex-col items-center justify-center gap-[60px] overflow-hidden bg-white px-[60px] py-[120px] t:items-start t:gap-[64px] t:px-[40px] m:items-start m:gap-[64px] m:px-[24px] m:py-[84px]"
    >
      <div className="relative flex w-full max-w-[1680px] flex-row items-end justify-start gap-[32px] overflow-clip m:flex-col m:justify-center m:gap-[16px]">
        <div className="relative flex w-px flex-[1_0_0] flex-row items-start gap-[12px] overflow-clip t:flex-col t:gap-[32px] m:w-full m:flex-none m:flex-col m:gap-[64px]">
          <div className="relative flex w-px flex-[1_0_0] flex-col items-start justify-center gap-[16px] overflow-clip t:w-full t:flex-none m:w-full m:flex-none">
            <WordReveal as="h2" variant="paragraph" text="Locally embedded deployment teams" className={`m-0 w-full text-left text-black [text-wrap:balance] ${H2}`} />
            <p className={`m-0 w-full text-left text-[#6b6b6b] [text-wrap:balance] ${P17}`}>
              Forward-deployed engineers and deployment strategists work inside your environment to deliver value fast and build lasting internal capability. Not a remote vendor - a dedicated deployment pod that sits with your team.
            </p>
          </div>
          <div className="relative flex w-px flex-[1_0_0] flex-row items-center justify-end gap-[24px] overflow-clip t:w-full t:flex-none t:flex-col t:items-start m:w-full m:flex-none m:flex-col m:items-start m:justify-start">
            <div className="relative w-px flex-none self-stretch bg-black/10 t:h-px t:w-full t:self-auto m:h-px m:w-full m:self-auto" />
            <div className="relative flex w-[40%] flex-col items-start justify-end gap-[16px] overflow-clip t:w-full m:w-full">
              <div className="relative flex w-[400px] max-w-full flex-col items-start overflow-hidden">
                <div className="relative flex w-[115px] flex-col items-start justify-center overflow-hidden">
                  <CountUp to={40} suffix="+" className="m-0 whitespace-nowrap text-center font-['Inter_Display','Inter_Display_Placeholder',sans-serif] text-[60px] font-normal leading-[1em] tracking-[-1.8px] text-black" />
                </div>
              </div>
              <WordReveal
                as="p"
                variant="paragraph"
                text="Local teams driving AI in complex environments, worldwide."
                className="m-0 w-full font-inter text-[16px] leading-[24px] tracking-[-0.5px] text-black/60 t:w-[408px]"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full max-w-[1680px]">
        <PlatformCards cards={CARDS} tabletStack />
      </div>
    </section>
  )
}

const PHASES = [
  {
    title: 'Get the right use case into production, fast.',
    pct: 75,
    text: 'We start with your data, find what’s worth building, and ship it to production so value is real before you scale.',
    chips: ['Discovery & scoping', 'AI Workshops', 'Production pilots'],
  },
  {
    title: 'We build with you, so you can build on your own.',
    pct: 50,
    text: 'We co-build with your teams and train them as we go, so the capacity to build stays after we leave.',
    chips: ['Co-building', 'Training', 'Builder enablement'],
  },
  {
    title: 'Keep production running and take ownership.',
    pct: 25,
    text: 'We keep your use cases running and transfer ownership cleanly, with support sized to what’s at stake.',
    chips: ['Support', 'Handover', 'Production pilots'],
  },
]
// Measured: tab bg/text crossfade spring 540/38; progress fill spring 160/22 (the % label follows the fill).
const TAB_SPRING = springEase({ stiffness: 540, damping: 38 })
const FILL = { k: 160, c: 22 }

function useSpringValue(target) {
  const [v, setV] = useState(target)
  const st = useRef({ x: target, vel: 0, raf: 0 })
  useEffect(() => {
    const s = st.current
    cancelAnimationFrame(s.raf)
    let last = performance.now()
    const step = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      for (let i = 0; i < 8; i++) {
        const a = -FILL.k * (s.x - target) - FILL.c * s.vel
        s.vel += a * (dt / 8)
        s.x += s.vel * (dt / 8)
      }
      setV(s.x)
      if (Math.abs(s.x - target) > 0.01 || Math.abs(s.vel) > 0.01) s.raf = requestAnimationFrame(step)
      else { s.x = target; s.vel = 0; setV(target) }
    }
    s.raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(s.raf)
  }, [target])
  return v
}

function Phases() {
  const [active, setActive] = useState(0)
  const ph = PHASES[active]
  const fill = useSpringValue(ph.pct)
  return (
    <section
      id="wonderful-lead"
      data-nav-theme="dark"
      className="relative flex w-full flex-col items-center justify-center gap-[120px] overflow-hidden bg-band px-[60px] py-[120px] t:px-[40px] m:px-[20px] m:py-[84px]"
    >
      <div className="relative flex w-full max-w-[1200px] flex-col items-start justify-center gap-[32px]">
        <h2 className={`m-0 w-full whitespace-pre-wrap text-left text-offwhite ${H2}`}>{'From Wonderful-led to\nfull client ownership, by design.'}</h2>
        <div className="relative flex w-full flex-col items-start gap-[120px]">
          <div className="relative flex w-min flex-row items-center gap-[2px] overflow-clip rounded-[999px] bg-[#232323] p-[4px]" style={{ '--tab-dur': `${TAB_SPRING.duration}s`, '--tab-ease': TAB_SPRING.easing }}>
            {[0, 1, 2].map((i) => (
              <button
                key={i}
                type="button"
                data-active={active === i}
                onClick={() => setActive(i)}
                className="ph-tab relative flex w-min cursor-pointer flex-row items-center justify-center whitespace-pre rounded-[999px] border-0 px-[16px] py-[9px] font-inter text-[14px] leading-[1.2] tracking-[-0.06em]"
              >
                {`Phase 0​${i + 1}`}
              </button>
            ))}
          </div>
          <div className="relative flex w-full flex-col items-start gap-[32px]">
            <h3 className={`m-0 w-full text-left text-offwhite [text-wrap:balance] ${H3}`}>{ph.title}</h3>
            <div className="relative flex w-full flex-col items-start gap-[12px]">
              <div className="relative flex w-full flex-row items-center justify-start gap-[32px]">
                <div className="relative flex h-[8px] w-px flex-[1_0_0] items-center overflow-clip rounded-[999px] bg-[#ebebeb]">
                  <div className="relative h-[8px] flex-none rounded-[999px] bg-[#1c7fff]" style={{ width: `${fill}%` }} />
                </div>
                <p className="m-0 w-[127px] whitespace-pre font-inter text-[64px] font-light leading-[1] tracking-[-0.03em] text-[#1c7fff]">{Math.round(fill)}%</p>
              </div>
              <p className={`m-0 w-full text-left text-offwhite [text-wrap:balance] ${P17}`}>{ph.text}</p>
            </div>
            <div className="relative flex w-full flex-wrap items-center justify-start gap-[8px]">
              {ph.chips.map((c) => (
                <div key={c} className="relative flex w-min flex-row items-center justify-center rounded-[6px] bg-white/[.08] px-[12px] py-[8px]">
                  <p className="m-0 whitespace-pre font-inter text-[16px] leading-[1.2] text-[#b4b4b4]">{c}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const FEATURES = [
  { title: 'Multi-tenant', text: 'Continuous updates, fully monitored by Wonderful, with secure logical isolation and seamless autoscaling.' },
  { title: 'Single tenant', text: 'Fully isolated, dedicated infrastructure with automatic updates and custom configuration.' },
  { title: 'Bring your own cloud', text: 'Your data never leaves your organization; you control security, governance, and upgrade timing.' },
  { title: 'On-premise', text: 'Completely air-gapped, zero external dependencies, with full on-site maintenance by our engineers.' },
]

export default function Deployment() {
  return (
    <div className="relative flex w-full flex-col items-center bg-white">
      <Hero />
      <Teams />
      <Phases />
      <FeatureGrid
        id="deploy"
        title="Deploy anywhere"
        subtitle={'Run AI across every deployment model, matched to your infrastructure\nand compliance needs.'}
        items={FEATURES}
        icons={DEPLOYMENT_ICONS}
      />
      <Closer image="/assets/4ZA5mL5EVVXzpKojiSLE8M02o.jpg" imagePosition="50% 100%" />
    </div>
  )
}
