import { useEffect, useRef, useState } from 'react'
import '../styles/hero.css'
import WordReveal from './WordReveal'
import { springEase, TWEEN_FADE } from '../lib/spring'
import { useMediaQuery } from './nav/hooks'

// §3: hero "Get in touch" hover opacity 1 -> .6, overdamped spring (stiffness 200, damping 60, mass 1), same on leave.
const HOVER = springEase({ stiffness: 200, damping: 60 })

// §2.1 H1 copy is authored with hard breaks: "Accelerate" / "AI transformation" / "across the enterprise".
const H1_LINES = ['Accelerate', 'AI transformation', 'across the enterprise']

// §4.1 on-load appear: opacity .001 -> 1, tween .6s, ease [.44,0,.56,1]. Live re-measured relative to the first
// H1 word starting: "Explore the platform" reaches 50% at ~+535ms, "Get in touch" at ~+635ms (.25s / .35s delays here;
// the Framer nominal .4/.5s count from page appear, which precedes the word reveal on live).
function Appear({ delay, children }) {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)))
    return () => cancelAnimationFrame(id)
  }, [])
  return (
    <div style={{ opacity: shown ? 1 : 0.001, transition: `opacity .6s ${TWEEN_FADE} ${delay}s`, willChange: 'transform' }}>
      {children}
    </div>
  )
}

export default function Hero() {
  const isMobile = useMediaQuery('(max-width: 879.98px)')
  const videoRef = useRef(null)
  const src = isMobile ? '/videos/hp-9x16.mp4' : '/videos/hp-16x9.mp4'

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = true
    const p = v.play()
    if (p && p.catch) p.catch(() => {})
  }, [src])

  let wordIndex = 0
  return (
    <section
      data-nav-theme="dark"
      data-framer-name="Hero animation"
      className="relative flex w-full flex-col items-center justify-end overflow-hidden bg-black h-[100vh] min-h-[500px] t:h-[85vh] t:min-h-[560px] m:h-[90vh] m:min-h-0 m:justify-center"
    >
      {/* Text block */}
      <div className="absolute bottom-0 left-1/2 z-[2] flex w-full max-w-[1680px] -translate-x-1/2 flex-row items-end justify-center gap-[10px] overflow-clip px-[60px] pb-[80px] t:bottom-auto t:top-1/2 t:-translate-y-1/2 t:flex-col t:items-start t:gap-[32px] t:px-[40px] t:pb-0 m:bottom-auto m:top-1/2 m:-translate-y-1/2 m:flex-col m:items-center m:gap-[24px] m:px-[24px] m:pb-[84px] m:pt-[64px] [@media(min-width:1800px)]:max-w-none">
        <div className="relative flex w-px max-w-[1680px] flex-[1_0_0] flex-row items-end justify-between overflow-clip t:w-full t:flex-none t:flex-col t:items-center t:justify-center t:gap-[16px] t:overflow-visible m:w-full m:flex-none m:flex-col m:justify-center m:gap-[16px] m:overflow-visible">
          <div className="relative w-[946px] flex-none t:w-full m:w-full [@media(min-width:1800px)]:w-[934px]">
            <h1 className="hero-h1">
              {H1_LINES.map((line) => {
                const start = wordIndex
                wordIndex += line.split(' ').length
                return <WordReveal key={line} as="span" text={line} variant="heading" onMount delay={start * 0.05} className="block" />
              })}
            </h1>
          </div>
          <div className="relative flex w-min flex-none flex-col items-start justify-end gap-[24px] pt-[12px] t:w-full t:items-center t:justify-center t:gap-[32px] m:w-full m:items-center m:justify-center m:pt-0">
            <div className="relative w-[370px] flex-none t:max-w-[400px]">
              <WordReveal as="p" text="Wonderful helps enterprises drive AI adoption to unlock their full potential." variant="paragraph" onMount className="hero-sub" />
            </div>
            <div className="relative flex w-min flex-none flex-row items-center justify-start gap-[10px] t:justify-center m:max-w-full m:justify-center">
              <Appear delay={0.35}>
                <a href="/contact" className="hero-btn hero-btn--fill" style={{ transition: `opacity ${HOVER.duration}s ${HOVER.easing}` }}>
                  Get in touch
                </a>
              </Appear>
              <Appear delay={0.25}>
                <a href="/ai-os" className="hero-btn hero-btn--outline">Explore the platform</a>
              </Appear>
            </div>
          </div>
        </div>
      </div>

      {/* Background video + overlay */}
      <div className="relative flex h-full w-full flex-none items-center justify-center overflow-clip">
        <div className="relative h-full w-full flex-none t:w-px t:flex-[1_0_0] t:opacity-80 m:w-px m:flex-[1_0_0] m:opacity-70">
          <video
            key={src}
            ref={videoRef}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="block h-full w-full object-cover object-center"
          />
        </div>
        <div className="hero-overlay absolute bottom-0 left-0 z-[1] h-full w-full overflow-clip" />
      </div>
    </section>
  )
}
