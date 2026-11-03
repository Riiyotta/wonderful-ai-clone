import { useEffect, useState } from 'react'
import { useInView } from '../../../lib/useInView'
import { springEase, TWEEN_FADE } from '../../../lib/spring'

// Appear 1wvlngc (H2): opacity .001 -> 1, spring stiffness 200 / damping 60, delay .5s, when in view.
// Appear 1qhs1gm (button): opacity tween .6s [.44,0,.56,1], delay .5s.
// Button hover (shared "Grey" pill): opacity 1 -> .6 on the same 200/60 spring (CLONE_SPEC §3).
const SPRING_200_60 = springEase({ stiffness: 200, damping: 60 })

export default function ClosingCta() {
  const [ref, inView] = useInView()
  const [btnIn, setBtnIn] = useState(false)
  useEffect(() => { if (inView) setBtnIn(true) }, [inView])
  return (
    <section className="inx-cta" data-nav-theme="dark" data-framer-name="Closing CTA" ref={ref}>
      <div className="inx-cta-abs">
        <div className="inx-cta-tt">
          <div className="inx-cta-tw">
            <div className="inx-cta-text" style={{ opacity: inView ? 1 : 0.001, transition: `opacity ${SPRING_200_60.duration}s ${SPRING_200_60.easing} .5s` }}>
              <h2 className="inx-h2s">Transform your operating model with Wonderful</h2>
            </div>
          </div>
          <div style={{ opacity: btnIn ? 1 : 0.001, transition: `opacity .6s ${TWEEN_FADE} .5s` }}>
            <a href="/contact" className="inx-btn inx-btn-hover" style={{ '--hv-t': `${SPRING_200_60.duration}s ${SPRING_200_60.easing}` }}>
              <p>Get in touch</p>
            </a>
          </div>
        </div>
        <div className="inx-cta-img">
          <div className="inx-cover">
            <img src="/assets/93SjXd7ceCNvJA26xK3NXv1Nw2I.jpg" alt="" decoding="async" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  )
}
