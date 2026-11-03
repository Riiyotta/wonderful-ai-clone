import { useEffect, useState } from 'react'
import '../../styles/industries/fonts.css'
import '../../styles/industries/casestudy.css'
import CharReveal from './CharReveal'
import { springEase } from '../../lib/spring'

// Case-study template (/case-studies/<slug>): 800px column, header with element + per-character reveals,
// banner, CMS rich text, quote card, rich text. Breakpoints: desktop >= 1200, tablet 810–1199.98, mobile < 810.
// Live motion (re-measured, page load): stats characters start first (50ms per char), the H1 ~30ms later as one
// element (blur 10 / y 10, spring ~140/24), subtitle lines ~90ms after the H1 with ~45ms per line (spring ~300/50).
const SPRING_CHAR = springEase({ stiffness: 300, damping: 50 })
const SPRING_H1 = springEase({ stiffness: 140, damping: 24 })

function QuoteCard({ q }) {
  return (
    <div className="cs-quote-box">
      <div className="cs-quote" data-framer-name="No Case Study">
        <div className="cs-quote-bar" data-framer-name="T" />
        <div className="cs-quote-main">
          <div className="cs-quote-col">
            <div className="cs-quote-top">
              <div className="cs-quote-logo" data-framer-name="Image">
                <img src={q.logo} alt={q.logoAlt} decoding="async" />
              </div>
              <div className="cs-quote-text"><p>{q.text}</p></div>
            </div>
            <div className="cs-quote-foot">
              <div className="cs-quote-who">
                <div className="cs-quote-whoin">
                  <div><p className="cs-quote-name">{q.name}</p></div>
                  <div><p className="cs-quote-role">{q.role}</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CaseStudyPage({ data }) {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)))
    return () => cancelAnimationFrame(id)
  }, [])
  const h1Style = shown
    ? { opacity: 1, filter: 'blur(0px)', transform: 'none', transition: ['opacity', 'filter', 'transform'].map((p) => `${p} ${SPRING_H1.duration}s ${SPRING_H1.easing} .03s`).join(', ') }
    : { opacity: 0.001, filter: 'blur(10px)', transform: 'translateY(10px)' }
  const [c1, c2] = data.content
  return (
    <div className="cs-page">
      <section className="cs-container" data-framer-name="Container">
        <div className="cs-header">
          <div className="cs-hcontent">
            <div className="cs-tagrow">
              <div className="cs-tag"><p className="cs-x0s">{data.tag}</p></div>
            </div>
            <div className="cs-title">
              <h1 className="cs-h1" style={h1Style}>{data.h1}</h1>
            </div>
            <div className="cs-sub">
              <CharReveal as="p" text={data.sub} by="line" stagger={0.045} delay={0.12} spring={SPRING_CHAR} className="cs-sub-p" />
            </div>
            <div className="cs-divider" />
            <div className="cs-stats">
              {data.counters.map(([label, value], i) => (
                <div key={label} className="cs-stat" data-framer-name="Number Counter">
                  <div className={i === 0 ? 'cs-stat-l cs-stat-l--w' : 'cs-stat-l'}><p className="cs-x0s">{label}</p></div>
                  <div className="cs-stat-v">
                    <CharReveal as="h2" text={value} by="char" stagger={0.05} spring={SPRING_CHAR} className="cs-stat-h2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="cs-banner" data-framer-name="Banner">
          <img src={data.banner} alt="" decoding="async" />
        </div>
        <div className="cs-rt" data-framer-name="Content" dangerouslySetInnerHTML={{ __html: c1 }} />
        <QuoteCard q={data.quote} />
        <div className="cs-rt" data-framer-name="Content" dangerouslySetInnerHTML={{ __html: c2 }} />
      </section>
    </div>
  )
}
