import '../../styles/company/common.css'
import '../../styles/company/cta.css'
import '../../styles/company/careers.css'
import WordReveal from '../../components/WordReveal'
import { useMediaQuery } from '../../components/nav/hooks'
import CtaBand from './sections/CtaBand'
import Globe from './sections/Globe'
import StickyReveal from './sections/StickyReveal'
import { Appear, SPRING_SOFT, durationSpring } from './sections/motion'
import { springEase, TWEEN_FADE } from '../../lib/spring'

// /careers (CLONE_SPEC_COMPANY §2). Live has no third-party jobs widget on this page (Comeet's script is loaded
// but unused): roles are a static list and "Apply here" / "Submit your role" are mailto links.
const STATEMENT = 'We hire high-ownership, mission-driven builders and operators who care more about shipping impact in production than theory, titles, or comfort, and who thrive working on-site with customers to solve hard problems end to end.'
const FAVORIT = '"ABC Favorit Light", "ABC Favorit Light Placeholder", sans-serif'
const REVEAL_FONT = { fontFamily: FAVORIT, fontFeatureSettings: "'ss11' on, 'ss02' on, 'ss03' on, 'ss04' on, 'ss05' on, 'ss06' on", fontStyle: 'normal', fontWeight: 300, letterSpacing: '-0.05em', lineHeight: '115%' }

const ROLES = [
  { title: 'Deployment Strategist (DS)', img: 'cXLe4OBiqrbKuj4qEda2nakG4ME.png',
    text: 'Problem-solving leaders with a can-do mindset and strong technical fluency. Backgrounds include high-impact operational and technical roles, consultants, founders, or early startup employees, typically with CS or engineering degrees. Own deployment and are measured on customer P&L outcomes.' },
  { title: 'Forward Deployed Engineer (FDE)', img: 'uh60m11xISwvZs5ECj6MPM1Q.jpg',
    text: 'Deployed engineers who are either generalists across integrations, agents, and data, or specialists such as telephony solution architects. Dive into complex workflows to design and ship AI agents that solve real business challenges.' },
  { title: 'Go To Market (GTM)', img: 'ZYPbLsRDakRJhMOB6K4vgHF4c8.jpg',
    text: 'Consultative enterprise sellers who deeply understand buying processes, personas, and organizational dynamics. Not required to be deeply technical, but must understand how the technology works and coordinate a Wonderful pod.' },
  { title: 'Other Positions', img: '6bXlUBRKfKudw0C6sbKQUBdBO8.jpg',
    text: 'We are also hiring across operations and leadership as we scale the company globally.' },
]

// Globe instance props (live code-component props + per-breakpoint overrides).
const INTER = '"Inter", "Inter Placeholder", sans-serif'
const GLOBE_BASE = {
  accentColor: 'rgb(50, 134, 245)', centerYOffset: 50, danceAmount: 2.4, density: 'high', dotColor: 'rgba(255, 255, 255, 0.33)', dotSize: 2.25,
  dwell: 1.5, edgeOpacity: 0.19, focusPosition: 'front', globeScale: 1, hitArea: 22, labelColor: 'rgb(250, 250, 250)', labelSpacing: 100,
  markerColor: 'rgb(97, 165, 255)', markerSize: 1.5, oceanOpacity: 0, rotateSpeed: 4, rotation: 'auto', startCity: 'Athens', startMode: 'nearest',
  tilt: 9, tiltX: -23, tiltY: 0, tiltZ: 0, visibleLabels: 3,
  cityFont: { fontFamily: INTER, fontSize: '20px', fontStyle: 'normal', fontWeight: 600, letterSpacing: '-0.01em', lineHeight: '1.2em' },
  nationFont: { fontFamily: INTER, fontSize: '16px', fontStyle: 'normal', fontWeight: 500, letterSpacing: '0.01em', lineHeight: '1.1em' },
}
const GLOBE_OVERRIDES = {
  xl: { cityFont: { ...GLOBE_BASE.cityFont, fontSize: '20px', lineHeight: '0.7em' }, danceAmount: 1.2, dotColor: 'rgba(255, 255, 255, 0.4)',
    nationFont: { ...GLOBE_BASE.nationFont, fontSize: '18px' }, tiltX: -24, visibleLabels: 4 },
  d: {},
  t: { cityFont: { ...GLOBE_BASE.cityFont, fontSize: '18px' }, dotColor: 'rgba(255, 255, 255, 0.5)', dotSize: 1.25 },
  m: { cityFont: { ...GLOBE_BASE.cityFont, fontSize: '14px' }, dotSize: 1, dwell: 1, markerSize: 0.8,
    nationFont: { ...GLOBE_BASE.nationFont, fontSize: '14px', lineHeight: '0.5em' }, tiltX: -5, tiltY: 10, visibleLabels: 2 },
}

// Role row hover (bg -> #f5f5f5, image opacity 0 -> 1): fast critically-damped spring (fit of live samples).
const ROW_SPRING = springEase({ stiffness: 164, damping: 25.6 })
const LEAD_SPRING = durationSpring(0.5, 0)
const RISE = { from: { opacity: 0, y: 24 }, delay: 0.1, ease: { duration: 0.6, easing: TWEEN_FADE } }

function useBreakpoint() {
  const xl = useMediaQuery('(min-width: 1800px)')
  const t = useMediaQuery('(min-width: 810px) and (max-width: 1439.98px)')
  const m = useMediaQuery('(max-width: 809.98px)')
  return xl ? 'xl' : t ? 't' : m ? 'm' : 'd'
}

function RoleRow({ r }) {
  return (
    <div className="ccr-row" data-framer-name="Variant 1">
      <div className="ccr-row-line" />
      <div className="ccr-row-in">
        <div className="ccr-row-l">
          <div className="ccr-row-t" data-framer-name="Frame 2087326949">
            <div><h3 className="ccr-h3 co-favorit">{r.title}</h3></div>
          </div>
          <div className="ccr-row-r">
            <div className="ccr-row-img" data-framer-name="Image"><img src={`/assets/${r.img}`} alt="" loading="lazy" /></div>
            <div className="ccr-row-desc"><p className="co-p17">{r.text}</p></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Careers() {
  const bp = useBreakpoint()
  const globeProps = { ...GLOBE_BASE, ...GLOBE_OVERRIDES[bp] }
  return (
    <div className="ccr-root" style={{ '--ccr-row-spring': `${ROW_SPRING.duration}s ${ROW_SPRING.easing}` }}>
      {/* Hero: h1 opacity spring 200/60 delay .1, copy spring .5s delay .2, image tween .6s delay .3 (appear ids 11kiysw / 1adjs4t / 86e7bs) */}
      <div className="ccr-hero" data-framer-name="Hero">
        <div className="ccr-hero-row">
          <Appear mode="mount" delay={0.1} ease={SPRING_SOFT} className="ccr-h1wrap" data-framer-name="Text 1">
            <h1 className="ccr-h1 co-favorit">Careers at Wonderful</h1>
          </Appear>
          <div className="ccr-copy" data-framer-name="Copy Bottom">
            <Appear mode="mount" delay={0.2} ease={LEAD_SPRING} className="w-full">
              <p>We help enterprises move from AI ambition to measurable production impact in weeks, not months, through a repeatable operating model built for real-world constraints.</p>
            </Appear>
          </div>
        </div>
        <Appear mode="mount" delay={0.3} ease={{ duration: 0.6, easing: TWEEN_FADE }} className="ccr-hero-img">
          <img src="/assets/DaRx2baZKdT8MXy9uSPueaN9wc.png" alt="" />
        </Appear>
      </div>

      {/* Statement: scroll-linked word colour reveal (Sticky_Reveal_Pro) */}
      <div className="ccr-main" data-framer-name="Main">
        <div className="ccr-main-c">
          <StickyReveal text={STATEMENT} scrollDuration={185} startReveal="fullyInView" entryHeadStart={0.3} verticalAlignment="center" alignment="center"
            wordSpacing={0.25} topPadding={0} bottomPadding={300} sidePadding={3} baseColor="rgb(118, 118, 118)" highlightColor="rgb(57, 57, 57)" stepColor
            font={{ ...REVEAL_FONT, fontSize: bp === 't' ? '42px' : '62px' }} />
        </div>
      </div>
      <div className="ccr-main-m" data-framer-name="Main">
        {bp === 'm' && (
          <StickyReveal text={STATEMENT} scrollDuration={171} startReveal="enteringView" entryHeadStart={0.3} verticalAlignment="center" alignment="center"
            wordSpacing={0.2} topPadding={0} bottomPadding={100} sidePadding={1} baseColor="rgb(118, 118, 118)" highlightColor="rgb(0, 0, 0)"
            yOffset={2} startBlur={2} font={{ ...REVEAL_FONT, fontSize: '28px' }} />
        )}
      </div>

      {/* Global by Design + locations globe */}
      <section className="ccr-about" data-framer-name="About 1" data-nav-theme="dark">
        <div className="ccr-about-in">
          <div className="ccr-about-head">
            <div className="ccr-about-h2wrap" data-framer-name="Text 1">
              <WordReveal as="h2" variant="paragraph" className="ccr-about-h2 ccr-about-h2--d co-h2" text={'Global by Design.\nLocal by Execution.'} />
              <WordReveal as="h2" variant="paragraph" className="ccr-about-h2 ccr-about-h2--t co-favorit" style={{ fontSize: 32, lineHeight: 1.3, letterSpacing: '-2px', fontFeatureSettings: 'normal' }}
                text={'Global by Design.\nLocal by Execution.'} />
            </div>
            <div className="ccr-about-p">
              <WordReveal as="p" variant="paragraph" className="co-p17" text="We operate in key markets today and expand continuously, with local teams embedded wherever we deploy." />
            </div>
          </div>
          <Appear {...RISE}>
            <a href="mailto:careers@wonderful.ai" className="co-pill co-pill--s co-pill--white ccr-pill-border" data-framer-name="Grey small"><span className="co-btn-s">Submit your role</span></a>
          </Appear>
        </div>
        <div className="ccr-globe-wrap" data-framer-name="Locations Globe">
          <div className="ccr-globe" data-framer-name="Globe">
            <Globe key={bp} {...globeProps} style={{ height: '100%', width: '100%' }} />
          </div>
        </div>
      </section>

      {/* Main roles */}
      <div className="ccr-roles" data-framer-name="Container">
        <div className="ccr-roles-h" data-framer-name="Heading">
          <div data-framer-name="Text 1">
            <WordReveal as="h2" variant="paragraph" className="co-h2" style={{ margin: 0, color: bp === 't' ? '#171719' : '#000', textAlign: 'left' }} text="Main Roles" />
          </div>
        </div>
        <div className="ccr-list" data-framer-name="Roles List">
          {ROLES.map((r) => <RoleRow key={r.title} r={r} />)}
        </div>
        <Appear {...RISE} className="ccr-apply" data-framer-name="Apply Here (static)">
          <div className="ccr-apply-line" />
          <div className="ccr-apply-in">
            <div className="ccr-apply-row">
              <div className="ccr-apply-l" data-framer-name="Frame 2087326949">
                <div>
                  <h3 className="ccr-apply-h ccr-apply-h--d co-favorit"><a className="ccr-link" href="mailto:careers@wonderful.ai" target="_blank" rel="noreferrer">Apply here</a></h3>
                  <h3 className="ccr-apply-h ccr-apply-h--t co-favorit" style={{ textAlign: 'center' }}><a className="ccr-link" href="mailto:careers@wonderful.ai" target="_blank" rel="noreferrer">Apply here</a></h3>
                  <h3 className="ccr-apply-h ccr-apply-h--m co-favorit" style={{ textAlign: 'center', color: '#171719' }}>Accelerating delivery</h3>
                </div>
              </div>
              <div className="ccr-apply-r">
                <div><p className="co-p17"><a className="ccr-link" href=" mailto:careers@wonderful.ai" target="_blank" rel="noreferrer">Email careers@wonderful.ai</a></p></div>
                <div><p className="co-p17">Wonderful will process personal data submitted through your application in accordance with the <a className="ccr-link" href="/careers/candidate_notice">Candidate Privacy Notice</a>.</p></div>
              </div>
            </div>
          </div>
        </Appear>
      </div>

      <CtaBand />
    </div>
  )
}
