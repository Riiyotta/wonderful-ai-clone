import Appear, { SPRING_200_60 } from '../shared/Appear'
import '../../../styles/product/aios.css'

// "Transform your operating model with Wonderful." CTA (640px). H2 appear wlft2t (opacity spring 200/60, delay .5) and
// button appear 1fgfqc9 (tween .6s [.44,0,.56,1], delay .5), both when in view. Button hover opacity .6 (spring 200/60).
export default function Cta() {
  return (
    <section data-nav-theme="dark" className="cta-wrap">
      <div className="cta-inner">
        <div className="relative z-[8] flex w-full max-w-[1680px] flex-col items-center justify-start gap-[32px]">
          <div className="relative flex w-full flex-col items-center justify-center gap-[24px] overflow-clip">
            <Appear on="view" delay={0.5} className="cta-text">
              <h2 className="pr-h2 text-center text-[#fafafa]">Transform your operating model with Wonderful.</h2>
            </Appear>
          </div>
          <Appear on="view" kind="tween" delay={0.5} className="relative flex-none">
            <a href="/contact" className="pr-pill" style={{ transition: `opacity ${SPRING_200_60.duration}s ${SPRING_200_60.easing}` }}>
              <span>Get in touch</span>
            </a>
          </Appear>
        </div>
        <div className="cta-bg">
          <div className="absolute inset-0">
            <img src="/assets/93SjXd7ceCNvJA26xK3NXv1Nw2I.jpg" alt="" loading="lazy" className="block h-full w-full object-cover object-center" />
          </div>
        </div>
      </div>
    </section>
  )
}
