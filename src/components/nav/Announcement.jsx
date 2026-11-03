import { useEffect, useState } from 'react'
import { ArrowRight } from './Logos'

// Two slides alternating every 7.0s (CLONE_SPEC §1 "Announcement bar", §4.5 ticker).
// Slide phases: 'in' (visible), 'out' (leaving: fade + y -6, 250ms ease-in),
// 'wait' (parked at y +6, hidden, no transition). Incoming starts 150ms after outgoing.
const SWITCH_MS = 7000
const OUT_MS = 250

function ReadMore({ href, mobileSmall }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={`nv-ann-more${mobileSmall ? ' nv-ann-more--msmall' : ''}`}>
      <span>Read more</span>
      <ArrowRight className="nv-ann-arrow" />
    </a>
  )
}

function SlideBayern() {
  return (
    <div className="nv-ann-row">
      <div className="nv-ann-lead" aria-label="Wonderful × FC Bayern partnership">
        <div className="nv-ann-crest">
          <img src="/assets/6cKN5QhpxMqywH8AgpxaZDLfasw.svg" width="40" height="40" alt="FC Bayern" />
        </div>
        <p className="nv-ann-text">Official Enterprise AI Partner</p>
      </div>
      <ReadMore href="/blog-articles/fcbayern-and-wonderful-announce-enterprise-ai-partnership" />
    </div>
  )
}

function SlideRaising() {
  return (
    <div className="nv-ann-row">
      <p className="nv-ann-text">Wonderful Raises $550M Series C</p>
      <ReadMore href="/blog-articles/wonderful-raises-550m-series-c" mobileSmall />
    </div>
  )
}

const SLIDES = [SlideBayern, SlideRaising]

export default function Announcement({ collapsed }) {
  const [phases, setPhases] = useState(['in', 'wait'])
  useEffect(() => {
    let active = 0
    let parkTimer
    const id = setInterval(() => {
      const prev = active
      active = 1 - active
      setPhases(prev === 0 ? ['out', 'in'] : ['in', 'out'])
      parkTimer = setTimeout(() => {
        setPhases((p) => p.map((ph, i) => (i === prev ? 'wait' : ph)))
      }, OUT_MS)
    }, SWITCH_MS)
    return () => { clearInterval(id); clearTimeout(parkTimer) }
  }, [])

  return (
    <div className="nv-ann" data-collapsed={collapsed ? 'true' : 'false'}>
      <div className="nv-ann-inner">
        {SLIDES.map((Slide, i) => (
          <div key={i} className="nv-ann-slide" data-phase={phases[i]} aria-hidden={phases[i] !== 'in'}>
            <Slide />
          </div>
        ))}
      </div>
    </div>
  )
}
