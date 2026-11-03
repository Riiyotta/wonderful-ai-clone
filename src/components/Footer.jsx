import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import '../styles/footer.css'
import { FooterLogo } from './nav/Logos'
import { TWEEN_FADE } from '../lib/spring'

const COLUMNS = [
  {
    title: 'Platform',
    links: [
      ['AI OS Overview', '/ai-os'],
      ['Wonderful Agents', '/agents'],
      ['Wonderful Systems', '/systems'],
      ['Wonderful AI Gateway', '/ai-gateway'],
      ['Deployment', '/deployment'],
      ['Strategy', '/ai-transformation'],
    ],
  },
  {
    title: 'Industries',
    links: [
      ['Banking', '/industries/banking'],
      ['Telecommunications', '/industries/telecommunication'],
      ['Healthcare', '/industries/healthcare'],
      ['Utilities', '/industries/utilities'],
      ['Insurance', '/industries/insurance'],
      ['Retail', '/industries/retail'],
      ['Airlines', '/industries/airlines'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['About us', '/about-us'],
      ['Blog', '/blog'],
      ['Press', '/press'],
      ['Careers', '/careers'],
      ['Trust Center', 'https://trust.wonderful.ai/', true],
      ['Contact', '/contact'],
    ],
  },
  {
    title: 'Social',
    links: [
      ['LinkedIn', 'https://www.linkedin.com/company/wonderfulcx/posts/?feedView=all', true],
      ['X (Twitter)', 'https://x.com/wonderful_ai', true, 0.8],
    ],
    flat: true,
  },
  {
    title: 'Legal',
    links: [
      ['Legal Policies', '/legal'],
      ['Privacy Policy', '/legal/privacy'],
      ['Website Terms of Use', '/legal/websiteterms'],
      ['Candidate Privacy Notice', '/careers/candidate_notice'],
      ['Bug Bounty', '/legal/bug-bounty-terms'],
      ['AI Safety', '/safety'],
    ],
    cookie: true,
    flat: true,
  },
]

// §4.1 t7l7t2: footer "Get in touch" opacity .001 -> 1, tween .6s delay .5, [.44,0,.56,1] (on-load appear).
function Appear({ delay, children }) {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)))
    return () => cancelAnimationFrame(id)
  }, [])
  return (
    <div className="relative flex-none" style={{ opacity: shown ? 1 : 0.001, transition: `opacity .6s ${TWEEN_FADE} ${delay}s` }}>
      {children}
    </div>
  )
}

function Column({ col, index }) {
  const { pathname } = useLocation()
  // Mobile: every column except Platform is 133px wide (Framer variant CSS).
  const mobileW = index === 0 ? '' : 'fm:w-[133px]'
  return (
    <div className={`relative flex w-min flex-none flex-col items-start justify-start gap-[12px] overflow-hidden ft:w-full ft:self-start ${mobileW}`}>
      <div className="relative flex flex-none flex-row items-center gap-[10px] overflow-hidden opacity-[0.65]">
        <p className="ft-small whitespace-nowrap">{col.title}</p>
      </div>
      {/* Live: Platform/Industries/Company nest their links in a gap-10 stack; Social and Legal
          place links directly in the gap-12 column (measured 28.8px pitch vs 26.8px). */}
      <div className={`relative flex flex-none flex-col items-start ${col.flat ? 'gap-[12px]' : 'gap-[10px]'} overflow-hidden`}>
        {col.links.map(([label, href, external, op]) => (
          <div key={label} style={op !== undefined ? { opacity: op } : undefined}>
            <p className="ft-linkp">
              <a href={href} className="ft-link" style={href === pathname ? { color: '#fafafa' } : undefined} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>{label}</a>
            </p>
          </div>
        ))}
        {col.cookie && (
          <div className="opacity-0 fm:hidden">
            <button type="button" className="ft-cookie ft-link" aria-label="Cookie Trigger"><span>Cookie Settings</span></button>
          </div>
        )}
      </div>
    </div>
  )
}

// Live switches the footer layout at each page template's own breakpoints (homepage 1440/880, industry pages
// 1400/880, case studies 1200/810), so layout mode comes from the route instead of the global m:/t: screens.
// `desktop`: min width of the desktop layout; `mobile`: widths below this use the mobile layout.
const DEFAULT_BP = { desktop: 1440, mobile: 880 }

function useFooterMode({ desktop, mobile }) {
  const get = () => (window.innerWidth >= desktop ? 'd' : window.innerWidth >= mobile ? 't' : 'm')
  const [mode, setMode] = useState(get)
  useEffect(() => {
    const on = () => setMode(get())
    on()
    window.addEventListener('resize', on)
    return () => window.removeEventListener('resize', on)
  }, [desktop, mobile])
  return mode
}

export default function Footer({ breakpoints = DEFAULT_BP }) {
  const mode = useFooterMode(breakpoints)
  return (
    <footer data-nav-theme="dark" data-framer-name="L" data-fmode={mode} className="relative z-[7] w-full bg-band">
      <div className="relative z-[7] flex w-full flex-col items-center justify-center overflow-hidden fm:overflow-clip">
        {/* Top */}
        <div className="relative z-[2] flex w-full flex-none flex-row items-start justify-center gap-[10px] overflow-visible p-[60px] ft:flex-col ft:justify-start ft:gap-[42px] fm:flex-col fm:justify-start fm:gap-[42px] fm:px-[24px] fm:pb-[24px] fm:pt-[60px]">
          <div className="relative flex w-px max-w-[1200px] flex-[1_0_0] flex-row items-center justify-between ft:w-full ft:flex-none ft:items-start ft:justify-start ft:gap-[64px] fm:w-full fm:flex-none fm:flex-col fm:items-start fm:justify-start fm:gap-[60px]">
            {/* Left */}
            <div className="relative flex w-min flex-none flex-col items-start justify-center gap-[32px] pr-[50px]">
              <div className="relative flex w-min flex-none flex-col items-start justify-center gap-[10px]">
                <a href="/" aria-label="Wonderful home" className="relative block aspect-[4.08] w-[122px] flex-none text-offwhite">
                  <FooterLogo className="block h-full w-full" />
                </a>
                <div className="relative w-[183px] flex-none">
                  <p className="ft-small whitespace-pre-wrap break-words">Transform your operating model with Wonderful.</p>
                </div>
              </div>
              <Appear delay={0.5}>
                <a href="/contact" className="ft-pill">Get in touch</a>
              </Appear>
              <div className="relative flex-none">
                <p className="ft-small whitespace-nowrap">© 2026 Wonderful AI B.V.</p>
              </div>
            </div>

            {/* Right */}
            <div className="relative flex w-min flex-none flex-row items-start justify-end gap-[60px] ft:grid ft:w-px ft:flex-[1_0_0] ft:grid-cols-[repeat(2,minmax(50px,1fr))] ft:grid-rows-[repeat(2,minmax(0,1fr))] ft:auto-rows-[minmax(0,1fr)] ft:justify-center fm:w-full fm:flex-wrap fm:justify-start fm:gap-x-[42px] fm:gap-y-[32px]">
              {COLUMNS.map((col, i) => <Column key={col.title} col={col} index={i} />)}
            </div>
          </div>
        </div>

        {/* Bottom wordmark: 95% (max 1400) of (width - 17px), clipped to 173px; tablet 136 / 93% x 187; mobile 80 / 87%, contain */}
        <div className="relative flex h-[173px] w-full max-w-[1680px] flex-none flex-col items-center justify-start overflow-clip pr-[17px] ft:h-[136px] fm:h-[80px] fm:pt-[20px]">
          <div className="relative w-[95%] max-w-[1400px] flex-none opacity-[0.1] ft:h-[187px] ft:w-[93%] fm:h-[91px] fm:w-[87%]">
            <img
              src="/assets/EfwFwuoTD4PdYVDGaAhoN1b4ns.png"
              width="1680"
              height="402"
              alt=""
              loading="lazy"
              className="block aspect-[1680/402] h-auto w-full object-cover ft:h-full ft:aspect-auto ft:object-contain fm:h-full fm:aspect-auto fm:object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
