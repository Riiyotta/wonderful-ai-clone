import Navbar from '../../components/Navbar'
import LightFooter from './footer/LightFooter'
import { springCss } from './motion'
import '../../styles/content/base.css'
import '../../styles/content/legal.css'

// /legal index. Live renders the site nav and the "White L" light footer (not the dark one), so the
// route uses chrome 'none' and mounts the shared Navbar itself.
const DOCS = [
  ['Master Service Agreement (MSA)', '/legal/msa'],
  ['Service Level Agreement (SLA)', '/legal/sla'],
  ['Data Processing Agreement (DPA)', '/legal/dpa'],
  ['Acceptable Use Policy (AUP)', '/legal/aup'],
  ['Data Act Addendum', '/legal/data-act'],
  ['Financial Services Industry Addendum (DORA)', '/legal/dora'],
  ['Website Privacy Policy', '/legal/privacy'],
  ['Bug Bounty Terms and Conditions', '/legal/bug-bounty-terms'],
  ['Website Terms of Use', '/legal/websiteterms'],
]

// Link hover: text colour rgb(0,102,204) -> rgba(0,102,204,.75); sampled spring ≈ duration .3 / bounce .2.
const HOVER = springCss({ duration: 0.3, bounce: 0.2 })
const LINK_TEXT = {
  '--framer-font-open-type-features': "'ss03' on",
  '--framer-font-size': '14px',
  '--framer-letter-spacing': '-0.05em',
  '--framer-line-height': '150%',
  '--framer-text-alignment': 'left',
  '--framer-text-color': 'var(--extracted-r6o4lv, rgb(0, 102, 204))',
  transition: `color ${HOVER}`,
}

export default function LegalIndex() {
  return (
    <>
      <Navbar />
      <div className="cx-rt cli-page" data-cx="legal-index">
        <div className="cli-container" data-cx="container">
          <div className="cli-head">
            <div className="cli-h1 cx-rtc">
              <h1 className="framer-text framer-styles-preset-j6r4ug" dir="auto" style={{ '--framer-text-alignment': 'left', '--framer-text-color': 'var(--token-a8e7404c-6b78-46b2-a6de-2abafc63f26f, rgb(0, 0, 0))' }} data-cx="h1">Wonderful legal</h1>
            </div>
          </div>
          <div className="cli-divider" data-cx="divider" />
          <div className="cli-row" data-cx="row">
            <div className="cli-col">
              <div className="cli-h2 cx-rtc">
                <h2 className="framer-text framer-styles-preset-190xti5" dir="auto" style={{ '--framer-text-color': 'var(--token-a8e7404c-6b78-46b2-a6de-2abafc63f26f, rgb(0, 0, 0))' }} data-cx="h2">Legal policies </h2>
              </div>
              <div className="cli-links" data-cx="links">
                {DOCS.map(([label, href]) => (
                  <div className="cli-item" key={href}>
                    <div className="cli-link-wrap">
                      <a className="cli-link" href={href} data-cx="legal-link">
                        <div className="cli-link-text cx-rtc">
                          <p dir="auto" className="framer-text" style={LINK_TEXT}>{label}</p>
                        </div>
                        <span className="cli-link-icon" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <LightFooter />
      </div>
    </>
  )
}
