import '../../../styles/company/common.css'
import '../../../styles/company/cta.css'
import { Appear, SPRING_SOFT } from './motion'
import { TWEEN_FADE } from '../../../lib/spring'

// "Built for The Enterprise" closer (about-us / careers): masked image over #080808, centered H2 + white pill.
// Appear: H2 opacity spring 200/60 delay .5; button tween .6s delay .5 (appear ids 1t6pugu / z3ckz).
export default function CtaBand() {
  return (
    <div className="ccta-band" data-framer-name="Built for The Enterprise" data-nav-theme="dark">
      <div className="ccta-in">
        <div className="ccta-tt" data-framer-name="Tag & Title">
          <div className="ccta-head">
            <Appear className="ccta-h2wrap" delay={0.5} ease={SPRING_SOFT}>
              <h2 className="ccta-h2 co-h2">Transform your operating model with Wonderful.</h2>
            </Appear>
          </div>
          <Appear delay={0.5} ease={{ duration: 0.6, easing: TWEEN_FADE }}>
            <a href="/contact" className="co-pill co-pill--l co-pill--white" data-framer-name="Grey"><span className="co-btn-l">Get in touch</span></a>
          </Appear>
        </div>
        <div className="ccta-img"><img src="/assets/93SjXd7ceCNvJA26xK3NXv1Nw2I.jpg" alt="" loading="lazy" /></div>
      </div>
    </div>
  )
}
