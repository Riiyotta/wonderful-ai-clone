import { useEffect, useState } from 'react'
import { FooterLogo } from '../../../components/nav/Logos'
import { springEase, TWEEN_FADE } from '../../../lib/spring'
import AsciiPattern from './AsciiPattern'
import WarpGradient from './WarpGradient'
import { useMediaQuery } from '../../../components/nav/hooks'
import '../../../styles/content/lightfooter.css'

// "White L" variant of the site footer (only /legal uses it on live): a CTA band with two animated
// canvases (warp gradient, multiply; binary ASCII pattern, overlay) above the light footer columns.
// The shared <Footer/> only implements the dark "L" variant, so this lives in the content group.

// Appear 10fpt9j: title opacity .001 -> 1, spring stiffness 200 / damping 60, delay .5s.
const TITLE_SPRING = springEase({ stiffness: 200, damping: 60 })
// "Black Main" hover: background #000 -> rgba(0,0,0,.8) + shadow alpha .3 -> 0 (sampled; overdamped ~200/60).
const BTN_SPRING = springEase({ stiffness: 200, damping: 60 })

const COLUMNS = [
  { title: 'Platform', links: [
    ['AI OS Overview', '/ai-os'], ['Wonderful Agents', '/agents'], ['Wonderful Systems', '/systems'], ['Wonderful AI Gateway', '/ai-gateway'],
    // Live uses the dark-footer link preset (1unrh5u, rgba(255,255,255,.7)) for these two: invisible on white.
    ['Deployment', '/deployment', { preset: '1unrh5u' }], ['Strategy', '/ai-transformation', { preset: '1unrh5u' }],
  ] },
  { title: 'Industries', links: [
    ['Banking', '/industries/banking'], ['Telecommunications', '/industries/telecommunication'], ['Healthcare', '/industries/healthcare'],
    ['Utilities', '/industries/utilities'], ['Insurance', '/industries/insurance'], ['Retail', '/industries/retail'], ['Airlines', '/industries/airlines'],
  ] },
  { title: 'Company', links: [
    ['About us', '/about-us'], ['Blog', '/blog'], ['Press', '/press'], ['Careers', '/careers'],
    ['Trust Center', 'https://trust.wonderful.ai/', { external: true }], ['Contact', '/contact'],
  ] },
  { title: 'Social', flat: true, links: [
    ['LinkedIn', 'https://www.linkedin.com/company/wonderfulcx/posts/?feedView=all', { external: true }],
    ['X (Twitter)', 'https://x.com/wonderful_ai', { external: true, opacity: 0.8 }],
  ] },
  { title: 'Legal', flat: true, cookie: true, links: [
    ['Legal Policies ', '/legal', { current: true }], ['Privacy Policy', '/legal/privacy'], ['Website Terms of Use', '/legal/websiteterms'],
    ['Candidate Privacy Notice', '/careers/candidate_notice'], ['Bug Bounty', '/legal/bug-bounty-terms'], ['AI Safety', '/safety'],
  ] },
]

const SMALL = { '--framer-text-alignment': 'start', '--framer-text-color': 'var(--extracted-r6o4lv, var(--token-31794b1a-15a5-479d-a023-90cee9928db8))' }

function useAppear() {
  const [on, setOn] = useState(false)
  useEffect(() => { const id = requestAnimationFrame(() => requestAnimationFrame(() => setOn(true))); return () => cancelAnimationFrame(id) }, [])
  return on
}

function Link({ label, href, opts = {} }) {
  const p = (
    <div className="lf-nowrap cx-rtc">
      <p className="framer-text framer-styles-preset-1gjbdzu" dir="auto" style={{ '--framer-text-alignment': 'start', '--framer-text-color': 'var(--extracted-r6o4lv, rgba(31, 31, 31, 0.8))' }}>
        <a
          className={`framer-text framer-styles-preset-${opts.preset || '1e7mtqr'}`}
          href={href}
          {...(opts.external ? { target: '_blank', rel: '' } : {})}
          {...(opts.current ? { 'data-framer-page-link-current': 'true' } : {})}
        >{label}</a>
      </p>
    </div>
  )
  return opts.opacity !== undefined ? <div style={{ opacity: opts.opacity }}>{p}</div> : p
}

export default function LightFooter() {
  const shown = useAppear()
  const isTM = useMediaQuery('(max-width: 1199.98px)')
  const [hover, setHover] = useState(false)
  return (
    <footer className="lf cx-border" data-cx="light-footer" data-framer-name="White L">
      <div className="lf-cta-wrap">
        <div className="lf-band" data-cx="band">
          <div className="lf-tag">
            <div className="lf-title cx-rtc" style={{ opacity: shown ? 1 : 0.001, transition: `opacity ${TITLE_SPRING.duration}s ${TITLE_SPRING.easing} .5s` }}>
              <h2 className="framer-text framer-styles-preset-190xti5" dir="auto" style={{ '--framer-text-alignment': 'center', '--framer-text-color': 'var(--extracted-1of0zx5, var(--token-131554be-526d-44ca-b5e0-fc9be840a862, rgb(57, 57, 57)))' }} data-cx="band-title">
                Transform your operating model with Wonderful.
              </h2>
            </div>
            <div className="lf-btn-wrap" style={{ opacity: shown ? 1 : 0.001, transition: `opacity .6s ${TWEEN_FADE} .5s` }}>
              <a
                className="lf-main-btn"
                href="/contact"
                data-cx="band-btn"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{
                  backgroundColor: hover ? 'rgba(0, 0, 0, 0.8)' : 'rgb(0, 0, 0)',
                  boxShadow: `0px 0px 0px 0px rgba(79, 26, 214, ${hover ? 0 : 0.3})`,
                  transition: `background-color ${BTN_SPRING.duration}s ${BTN_SPRING.easing}, box-shadow ${BTN_SPRING.duration}s ${BTN_SPRING.easing}`,
                }}
              >
                <div className="lf-btn-text cx-rtc">
                  <p className="framer-text framer-styles-preset-2mfvz6" dir="auto" style={{ '--framer-text-alignment': 'center', '--framer-text-color': 'var(--extracted-r6o4lv, rgb(255, 255, 255))' }}>Get in touch</p>
                </div>
              </a>
            </div>
          </div>
          <div className="lf-canvas-a">
            <WarpGradient swirlIterations={isTM ? 16 : 4} />
          </div>
          <div className="lf-canvas-b">
            <AsciiPattern />
          </div>
        </div>
      </div>

      <div className="lf-main">
        <div className="lf-top" data-cx="top">
          <div className="lf-inner">
            <div className="lf-left">
              <div className="lf-brand">
                <a aria-label="Wonderful home" className="lf-logo" href="/" data-cx="logo"><FooterLogo /></a>
                <div className="lf-brand-text cx-rtc"><p className="framer-text framer-styles-preset-1mywhy3" dir="auto" style={SMALL}>Transform your operating model with Wonderful.</p></div>
              </div>
              <div className="lf-btn-wrap" style={{ opacity: shown ? 1 : 0.001, transition: `opacity .6s ${TWEEN_FADE} .5s` }}>
                <a className="lf-pill" href="/contact" data-cx="pill">
                  <div className="lf-btn-text cx-rtc" style={{ '--extracted-r6o4lv': 'var(--token-1eeffa50-d0e7-475a-ae85-eb2a3f2ffc02, rgb(255, 255, 255))' }}>
                    <p className="framer-text framer-styles-preset-x0s9r5" dir="auto" style={{ '--framer-text-alignment': 'center', '--framer-text-color': 'var(--extracted-r6o4lv, rgb(255, 255, 255))' }}>Get in touch</p>
                  </div>
                </a>
              </div>
              <div className="lf-nowrap cx-rtc"><p className="framer-text framer-styles-preset-1mywhy3" dir="auto" style={SMALL}>© 2026 Wonderful AI B.V.</p></div>
            </div>
            <div className="lf-right">
              {COLUMNS.map((col) => (
                <div key={col.title} className={`lf-col${col.flat ? ' flat' : ''}`}>
                  <div className="lf-col-head">
                    <div className="lf-nowrap cx-rtc" style={{ '--extracted-r6o4lv': 'var(--token-31794b1a-15a5-479d-a023-90cee9928db8)' }}><p className="framer-text framer-styles-preset-1mywhy3" dir="auto" style={SMALL}>{col.title}</p></div>
                  </div>
                  <div className="lf-links">
                    {col.links.map(([label, href, opts]) => <Link key={label} label={label} href={href} opts={opts} />)}
                  </div>
                  {col.cookie && (
                    <div className="lf-cookie">
                      <button type="button" aria-label="Cookie Trigger"><span style={{ whiteSpace: 'nowrap' }}>Cookie Settings</span></button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="lf-mark cx-border">
          <div className="lf-mark-img">
            <div className="cx-bgimg"><img decoding="async" width="1680" height="402" src="/assets/EfwFwuoTD4PdYVDGaAhoN1b4ns.png" alt="" /></div>
          </div>
        </div>
      </div>
    </footer>
  )
}
