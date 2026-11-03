import { useLayoutEffect, useRef, useState } from 'react'
import WordReveal from '../../components/WordReveal'
import { springEase } from '../../lib/spring'
import { useMediaQuery } from '../../components/nav/hooks'
import { Appear, H1, H2, P17, useBlockReveal } from './shared'
import PlatformCards from './PlatformCards'
import Closer from './Closer'
import '../../styles/platform/platform.css'

// /ai-transformation — CLONE_SPEC_PLATFORM.md §3.

function Hero() {
  return (
    <section
      data-nav-theme="dark"
      data-framer-name="Hero animation"
      className="relative flex h-[85vh] min-h-[500px] w-full flex-col items-center justify-center gap-[120px] overflow-clip px-[60px] pb-[60px] pt-[106px] t:min-h-[560px] t:p-0 m:h-[80vh] m:min-h-0 m:px-[24px] m:py-[60px]"
    >
      <div className="absolute inset-0">
        <picture>
          <source media="(max-width: 879.98px)" srcSet="/assets/65w2jyk7QPANeGgS4laK4t3SiA.png" />
          <img src="/assets/7sauqX3tqZfJt3jtEuhYVLmPQvY.jpg" alt="" className="block h-full w-full object-cover object-center" />
        </picture>
      </div>
      <div className="absolute left-0 top-0 z-[1] h-full w-full overflow-clip bg-black/10" />
      <Appear delay={0.1} className="relative z-[2] w-full max-w-[1200px] m:max-w-full">
        <h1 className={`m-0 whitespace-pre-wrap text-center text-offwhite [text-wrap:balance] m:hidden ${H1}`}>{"AI is not a technology you adopt.\nIt's a change to how your organization operates."}</h1>
        <h1 className="m-0 hidden whitespace-pre-wrap text-center font-favorit text-[32px] font-light leading-[1.05] tracking-[-0.07em] text-ink [text-wrap:balance] m:block">
          <span className="block text-offwhite">AI is not a technology</span>
          <span className="block text-offwhite">{"you adopt. It's a change\nto how your organization operates."}</span>
        </h1>
      </Appear>
    </section>
  )
}

const PARAS = [
  'Every major technology wave has had an adoption curve. You buy it, you implement it, you move on. ERP, CRM, cloud — each one had a go-live date. The SaaS era trained enterprises to think about technology this way: identify a problem, find a tool that solves it, procure it, deploy it, done. That model worked because the problems were bounded. A CRM for sales. An HRIS for HR. A platform for support. The software fit inside the org chart because it was designed to — it existed to store information and coordinate the humans already working inside those structures.',
  "AI doesn't have a go-live date. It has a starting point. And it doesn't fit inside the org chart, because it doesn't coordinate humans — it performs work. Work that crosses every functional boundary the SaaS model was built around. The value isn't in the deployment. It's in what the organization becomes because of it. That is not a technology adoption. It is an operating model transformation.",
  'Most enterprises are running an AI adoption program when what is actually required is an operating model transformation. One ends with new tools running inside old structures. The other ends with a business that thinks, moves, and scales at a fundamentally different level.',
  'Getting there requires more than the right technology. It requires getting five things right.',
]

const PRINCIPLES = [
  ['Solve the right problem, in the right sequence', 'The sequencing question is strategic, not technical. Which use case builds a foundation that makes everything after it faster? Speed comes from starting right, not starting first — with a clear view of the operating model being built toward and a deliberate path for getting there.'],
  ['Deploy AI across workflows, not functions', "Enterprises are organized into functions, but work is not. Deploying function-specific AI doesn't reduce fragmentation. It adds an intelligent layer on top of it. What's needed is a single system that can carry a process through to completion regardless of how many departments it crosses."],
  ['Build your AI muscle in-house', 'The goal is not permanent dependency on a vendor. It is an enterprise that owns its own AI capability — where engineers build, business teams run, and the organization grows stronger with each deployment. The right partner co-builds from the start, transfers knowledge deliberately, and measures success partly by how much less you need them over time.'],
  ['Maintain control and flexibility', 'Vendor lock-in was a manageable cost in the SaaS era. In the AI era it is a strategic risk. Every integration, skill, and governance configuration should be portable. The relationship should be sustained by the value it creates, not by the cost of leaving. The same logic applies to models. No single foundation model is best at everything, and the frontier is shifting constantly. The right architecture routes each task to its best engine and remains free to adapt. Betting an enterprise transformation on one model provider is a risk disguised as a simplification.'],
  ['Measure AI by throughput, not just cost', 'The right question is not how much AI saves on a given task, but whether it raises the ceiling on what the organization can do. When a process that took months takes hours, the economics of being wrong collapse — and decisions that required heavy approval processes start to look like low-cost experiments. Cost reduction is a project. Throughput is a transformation. The enterprises that get these five things right will not just be more efficient. They will be operating at a different level entirely — one where every quarter the gap between what they can do and what their competitors can do grows wider. That is what it means to rebuild around AI rather than adopt it.'],
]

// Measured: item height spring 540/38 (slight overshoot), caret rotation spring 280/28.
const HEIGHT_SPRING = springEase({ stiffness: 540, damping: 38 })
const CARET_SPRING = springEase({ stiffness: 280, damping: 28 })

function Caret({ open }) {
  return (
    <svg
      viewBox="0 0 24 24"
      role="presentation"
      className="relative block h-[22px] w-[22px] flex-none"
      style={{ transform: open ? 'rotate(180deg)' : 'none', transition: `transform ${CARET_SPRING.duration}s ${CARET_SPRING.easing}` }}
    >
      <path d="M 15 0 L 7.5 7.5 L 0 0" fill="transparent" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="#31313199" transform="translate(4.5 9)" />
    </svg>
  )
}

function Principle({ n, title, text, last, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const ref = useRef(null)
  const prevH = useRef(null)
  const first = useRef(true)
  const toggle = () => {
    prevH.current = ref.current.getBoundingClientRect().height
    setOpen((o) => !o)
  }
  useLayoutEffect(() => {
    const el = ref.current
    if (first.current) { first.current = false; return }
    const to = el.scrollHeight
    el.style.transition = 'none'
    el.style.height = `${prevH.current}px`
    el.getBoundingClientRect()
    el.style.transition = `height ${HEIGHT_SPRING.duration}s ${HEIGHT_SPRING.easing}`
    el.style.height = `${to}px`
    const done = () => { el.style.transition = ''; el.style.height = '' }
    const id = setTimeout(done, HEIGHT_SPRING.duration * 1000 + 30)
    return () => clearTimeout(id)
  }, [open])
  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      onClick={toggle}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle() } }}
      className="relative flex w-full cursor-pointer flex-col justify-center gap-[24px] overflow-clip outline-none"
    >
      <div className="relative flex w-full flex-col items-start gap-[24px]">
        <div className="relative flex w-full flex-row items-start justify-between">
          <div className="relative flex w-px flex-[1_0_0] flex-wrap items-center justify-start gap-x-[12px] gap-y-[8px]">
            <h4 className="pr-num m-0 whitespace-pre">{String(n).padStart(2, '0')}</h4>
            <h4 className="pr-title m-0 max-w-full [text-wrap:balance]">{title}</h4>
          </div>
          <Caret open={open} />
        </div>
        {open && <p className={`m-0 w-full text-ink-300 [text-wrap:balance] ${P17}`}>{text}</p>}
      </div>
      {!last && <div className="relative h-px w-full flex-none bg-white/[.18]" />}
    </div>
  )
}

function Body() {
  const isTablet = useMediaQuery('(min-width: 880px) and (max-width: 1439.98px)')
  const [parasRef, paraStyle] = useBlockReveal(0.5)
  return (
    <section
      id="body"
      className="relative flex w-full flex-col items-center justify-center gap-[80px] overflow-clip bg-white px-[60px] py-[120px] t:px-[40px] m:items-start m:gap-[64px] m:overflow-hidden m:px-[24px] m:py-[84px]"
    >
      <div className="relative z-[1] flex w-full max-w-[1200px] flex-row items-start gap-[60px] t:flex-col t:gap-[40px] m:flex-col m:gap-[32px]">
        <div className="relative z-[1] w-px max-w-[40%] flex-[1_0_0] t:w-full t:max-w-full t:flex-none m:w-full m:max-w-full m:flex-none">
          <WordReveal
            key={isTablet ? 't' : 'd'}
            as="h2"
            variant="paragraph"
            text={isTablet ? 'Built for teams building at scale' : 'The enterprise of the future'}
            className={`m-0 text-ink [text-wrap:balance] ${H2}`}
          />
        </div>
        <div ref={parasRef} className="relative z-[1] flex w-px max-w-[540px] flex-[1_0_0] flex-col gap-[30px] t:w-full t:max-w-none t:flex-none m:w-full m:max-w-none m:flex-none">
          {PARAS.map((t, i) => (
            <p key={i} className={`m-0 text-left text-ink-300 ${P17}`} style={paraStyle(i)}>{t}</p>
          ))}
        </div>
      </div>
      <div className="relative h-px w-full max-w-[1200px] flex-none bg-black/10" />
      <div className="relative z-[1] flex w-full max-w-[1200px] flex-row items-start gap-[60px] pb-[40px] t:flex-col t:gap-[64px] m:flex-col m:gap-[32px]">
        <div className="relative flex w-px max-w-[40%] flex-[1_0_0] flex-col items-start gap-[24px] t:w-full t:max-w-full t:flex-none m:w-full m:max-w-none m:flex-none m:py-[32px]">
          <h2 className={`m-0 w-full text-ink-700 [text-wrap:balance] ${H2}`}>AI transformation principles</h2>
        </div>
        <div className="relative flex w-1/2 max-w-[540px] flex-col items-start gap-[42px] t:w-full t:max-w-none m:w-full m:max-w-none">
          {PRINCIPLES.map(([title, text], i) => (
            <Principle key={title} n={i + 1} title={title} text={text} last={i === PRINCIPLES.length - 1} defaultOpen={i === 0} />
          ))}
        </div>
      </div>
      <div className="relative h-px w-full max-w-[1200px] flex-none bg-black/10 t:hidden" />
      <div id="light-team" className="relative flex w-full flex-col items-center justify-center gap-[60px] overflow-hidden bg-white t:items-start m:items-start m:gap-[64px]">
        <div className="relative flex w-full max-w-[1200px] flex-row items-end justify-start gap-[32px] overflow-clip m:flex-col m:justify-center m:gap-[16px]">
          <div className="relative flex w-px flex-[1_0_0] flex-col items-start gap-[12px] overflow-clip m:w-full m:flex-none">
            <div className="relative w-[701px] t:w-full m:w-full">
              <WordReveal
                key={isTablet ? 't' : 'd'}
                as="h2"
                text={isTablet ? 'Helping critical organizations\naccelerate AI adoption' : 'Helping critical organizations accelerate AI adoption'}
                className={`m-0 text-left text-ink ${H2}`}
              />
            </div>
          </div>
        </div>
        <div className="relative w-full max-w-[1200px]">
          <PlatformCards
            cards={[
              { title: 'AI OS', text: 'The unified operating layer for the AI-native enterprise', href: '/ai-os', image: '/assets/PbxeRt98ocw3ESBEOGvSkFl16OM.jpg', imageMobile: '/assets/wmeFBLFUCYVow7a5wWGbAoUuMeI.png' },
              { title: 'Deployment', text: 'Wonderful provides on-site deployment teams who get AI into production, deliver business impact fast, and hand you the keys.', href: '/deployment', image: '/assets/OUaQj58Pzu6qHzTmcPtPerUlsQ.png', imageTablet: '/assets/SOzfY9h8TwBWWchCRTSsrXuhJLw.jpg', imageMobile: '/assets/bz6BytQbubpmLiLZqfSlYDbaPI.jpg' },
            ]}
          />
        </div>
      </div>
    </section>
  )
}

export default function Transformation() {
  return (
    <div className="relative flex w-full flex-col items-center bg-band">
      <Hero />
      <Body />
      <Closer variant="transformation" image="/assets/93SjXd7ceCNvJA26xK3NXv1Nw2I.jpg" mask="radial-gradient(141% 80% at 50.5% 100%, rgba(0,0,0,0) 35.4088%, #000 100%)" />
    </div>
  )
}
