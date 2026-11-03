import '../../styles/company/common.css'
import '../../styles/company/cta.css'
import '../../styles/company/about.css'
import WordReveal from '../../components/WordReveal'
import CtaBand from './sections/CtaBand'
import { Appear, SPRING_SOFT, durationSpring } from './sections/motion'

// /about-us (CLONE_SPEC_COMPANY §1).
// Motion: hero H1 opacity spring 200/60 delay .1 (1p03929), lead spring .5s/bounce 0 delay .2 (lcb4ij), both on load;
// section headings + the backers paragraph reveal word by word (blur 10 / y 10, paragraph spring) on view.
const LOGOS = [
  'htqhvVaKZgcNX3BRmhWVyww5knk.png', '7fcK2r4zpzJThudOubtueQgYH8.png', 'lG5y98I6hlP6xWmpbiI8TawMSM.png',
  'E31LvuynHu4aJveo2MgJXNNrqM.png', 'k7eHKWSqWj0KqnLhBQB3vOimkhg.png', 'DiYt0kilHxJ7mXEL6da4jYrBY.png',
]
const STORIES = [
  { href: '/blog-articles/ai-doesnt-care-about-your-org-chart', img: 'aEmQo8nQfXHJOa0BXFqzt2YP4o.jpg', title: "AI Doesn't Care About Your Org Chart" },
  { href: '/blog-articles/the-execution-gap-no-model-can-close', img: 'NwRXU7LRhTui9IZMksXiCbxmDww.png', title: 'The Execution Gap No Model Can Close' },
  { href: '/blog-articles/open-by-default-competitive-by-design', img: 'eKecJ2roidLhTKbjenx06bQ7Y.jpeg', title: 'Open by default, competitive by design' },
  { href: 'https://www.prnewswire.com/news-releases/wonderful-raises-150m-series-b-to-accelerate-enterprise-ai-adoption-in-30-markets-302712238.html', img: '3lSedUj3UWyULh3EM6pQQ5esYI4.gif', title: 'Wonderful Raises $150M Series B to Accelerate Enterprise AI Adoption in 30+ Markets', last: true },
]
const LEAD_SPRING = durationSpring(0.5, 0)
const H2 = (cls = '') => `cab-h2 co-h2 ${cls}`

function Story({ s }) {
  return (
    <div className={`cab-story-w ${s.last ? 'cab-story-w--last' : ''}`}>
      <a href={s.href} className="cab-story">
        <div className="cab-story-img"><img src={`/assets/${s.img}`} alt="" loading="lazy" /></div>
        <div className={`cab-story-t ${s.last ? 'cab-story-t--clamp' : ''}`} data-framer-name="Title">
          <h5 className="cab-h5">{s.title}</h5>
        </div>
      </a>
    </div>
  )
}

export default function AboutUs() {
  return (
    <div className="cab-root">
      <div className="cab-body" data-framer-name="Body">
        {/* Hero */}
        <div className="cab-hero" data-framer-name="Hero">
          <div className="cab-hero-row">
            <Appear mode="mount" delay={0.1} ease={SPRING_SOFT} className="cab-h1wrap" data-framer-name="Text 1">
              <h1 className="cab-h1 cab-h1--d co-favorit">The Engine behind enterprise<br />AI Transformation.</h1>
              <h1 className="cab-h1 cab-h1--t co-favorit">The Engine behind<br />enterprise AI Transformation.</h1>
              <h1 className="cab-h1 cab-h1--m co-favorit">The Engine behind enterprise<br />AI Transformation.</h1>
            </Appear>
            <Appear mode="mount" delay={0.2} ease={LEAD_SPRING} className="cab-lead">
              <p>We take your most critical workflows into production across the enterprise, in weeks, not months.</p>
            </Appear>
          </div>
          <div className="cab-hero-img"><img src="/assets/cmqQxan6cL1XElc3smnbClk93c.jpg" alt="" /></div>
        </div>

        {/* Mission */}
        <div className="cab-sec2" data-framer-name="Container">
          <div className="cab-sec2-in">
            <div className="cab-top" data-framer-name="Top">
              <div className="cab-col-h" data-framer-name="Text 1">
                <WordReveal as="h2" variant="paragraph" className={H2()} text="Turning AI potential into operational reality" />
              </div>
              <div className="cab-col">
                <div className="cab-text" data-framer-name="Text">
                  <p className="co-p17">AI will reshape how enterprises operate, but only if it becomes part of the operating model itself.</p>
                  <p className="co-p17">Wonderful partners with forward-thinking enterprises to accelerate AI adoption, combining a multi-model AI platform, local deployment teams, and expert advisors to help enterprises transform customer, employee and back-office workflows.{' '}</p>
                </div>
                <div className="cab-img"><img src="/assets/ZYPbLsRDakRJhMOB6K4vgHF4c8.jpg" alt="" loading="lazy" style={{ objectPosition: '11.8% 45.9%' }} /></div>
              </div>
            </div>
            <div className="cab-rule" />
            <div className="cab-top" data-framer-name="Top">
              <div className="cab-col-h" data-framer-name="Text 1">
                <WordReveal as="h2" variant="paragraph" className={H2()} text="Built to close the gap" />
              </div>
              <div className="cab-col cab-col--40">
                <div className="cab-text cab-text--balance" data-framer-name="Text">
                  <p className="co-p17">Our mission is to unlock the full potential of the organizations our world runs on. That mission demands speed, precision, and resilience. At Wonderful, we move fast, take ownership, and solve problems before they grow. We bring professionalism to every interaction, delivering clarity, expertise, and trust in a space where enterprises cannot afford mistakes. We value independence and resourcefulness, giving people the freedom to make decisions and drive progress without waiting for permission. And we keep a sharp, competitive edge while staying team driven. We play to win.</p>
                </div>
                <a href="/careers" className="co-pill co-pill--l co-pill--outline" data-framer-name="Outline Balck"><span className="co-btn-l">See open positions</span></a>
              </div>
            </div>
            <div className="cab-rule" />
          </div>
        </div>

        {/* Backers + stories */}
        <div className="cab-sec3" data-framer-name="Frame 2087326808">
          <div className="cab-sec3-in">
            <div className="cab-backed" data-framer-name="Top">
              <div className="cab-backed-l">
                <div className="cab-backed-h" data-framer-name="Text 1">
                  <WordReveal as="h2" variant="paragraph" className={H2('cab-h2--black')} text="Backed by the best" />
                </div>
                <div className="cab-backed-p cab-backed-p--d">
                  <WordReveal as="p" variant="paragraph" className="co-p17" text={'Our backers include highly accomplished venture firms\nand some of the world’s most exceptional founders and builders.'} />
                </div>
                <div className="cab-backed-p cab-backed-p--m">
                  <WordReveal as="p" variant="paragraph" className="co-p17" text="Our backers include highly accomplished venture firms and some of the world’s most exceptional founders and builders." />
                </div>
              </div>
              <div className="cab-logos-wrap">
                <div className="cab-logos" data-framer-name="Row 1">
                  {LOGOS.map((l, i) => (
                    <div key={l} className={`cab-logo ${i === LOGOS.length - 1 ? 'cab-logo--last' : ''}`} data-framer-name="Client Card">
                      <div className="cab-logo-img" data-framer-name="Image"><img src={`/assets/${l}`} alt="" loading="lazy" /></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="cab-rule" />
            <div className="cab-stories">
              <div className="cab-stories-top" data-framer-name="Top">
                <div className="w-full" data-framer-name="Text 1">
                  <WordReveal as="h2" variant="paragraph" className={H2('cab-h2--black')} text="Stories by us and stories about us" />
                </div>
              </div>
              <div className="cab-stories-row">
                {STORIES.map((s) => <Story key={s.href} s={s} />)}
              </div>
            </div>
          </div>
        </div>

        <CtaBand />
      </div>
    </div>
  )
}
