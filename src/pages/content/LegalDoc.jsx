import { useEffect, useState } from 'react'
import '../../styles/content/base.css'
import '../../styles/content/legal.css'

// One JSON per /legal/<slug>, extracted from the SSR HTML by _extract/extract.cjs; loaded on demand.
const DOCS = import.meta.glob('./data/legal/*.json', { import: 'default' })

const TITLE = { '--framer-text-alignment': 'left', '--framer-text-color': 'var(--token-a8e7404c-6b78-46b2-a6de-2abafc63f26f, rgb(0, 0, 0))' }
const DATE_DT = { '--framer-text-alignment': 'center', '--framer-text-color': 'var(--token-759f7430-f948-43b1-854c-8b88940134e1)' }
const DATE_M = { '--framer-text-alignment': 'left', '--framer-text-color': 'rgba(0, 0, 0, 0.5)' }

export default function LegalDoc({ slug }) {
  const [d, setD] = useState(null)
  useEffect(() => {
    let live = true
    const load = DOCS[`./data/legal/${slug}.json`]
    if (load) load().then((x) => live && setD(x))
    return () => { live = false }
  }, [slug])

  // Anchor links inside the documents (e.g. MSA "Definitions ... click here") jump within the page.
  useEffect(() => {
    if (!d || !location.hash) return
    const el = document.getElementById(decodeURIComponent(location.hash.slice(1)))
    if (el) el.scrollIntoView()
  }, [d])

  return (
    <div className="cx-rt cl-page" data-cx="legal-doc">
      {d && (
        <div className="cl-container" data-cx="container">
          <div className="cl-head" data-cx="head">
            <div className="cl-title cx-rtc">
              <h2 className="framer-text framer-styles-preset-190xti5" dir="auto" style={TITLE} data-cx="title">{d.title}</h2>
            </div>
            <div className="cl-date-row" data-cx="date-row">
              <div className="cl-date-label cx-rtc"><p className="framer-text" data-cx="date-label">{d.dateLabel}</p></div>
              <div className="cx-v cx-hide-m">
                <div className="cl-date cx-rtc"><p className="framer-text framer-styles-preset-1ln1alt" dir="auto" style={DATE_DT} data-cx="date">{d.dates[0]}</p></div>
              </div>
              <div className="cx-v cx-hide-t cx-hide-d">
                <div className="cl-date cx-rtc"><p className="framer-text framer-styles-preset-1ln1alt" dir="auto" style={DATE_M} data-cx="date-m">{d.dates[1] ?? d.dates[0]}</p></div>
              </div>
            </div>
          </div>
          <div className="cl-divider cx-hide-m" data-cx="divider" />
          <div className="cl-body cx-rtc" data-cx="body" dangerouslySetInnerHTML={{ __html: d.bodyHtml }} />
        </div>
      )}
    </div>
  )
}
