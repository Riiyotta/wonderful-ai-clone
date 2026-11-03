import { useEffect, useState } from 'react'
import '../styles/darkband.css'
import Lattice from './darkband/Lattice'
import { DeployCardsDesktop, DeployCardsMobile } from './darkband/DeployCards'
import { springEase, TWEEN_FADE } from '../lib/spring'
import { useInView } from '../lib/useInView'

// Appear 16lndwp (H2) and the "Get in touch"-style hover both use stiffness 200 / damping 60 / mass 1 (§3, §4.1).
const SPRING_200_60 = springEase({ stiffness: 200, damping: 60 })

export default function DarkBand() {
  const [h2Ref, h2In] = useInView()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)))
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div data-nav-theme="dark">
      {/* Wrapper: #080808, flex column, clip (§2.5). */}
      <div className="relative flex w-full flex-col items-center justify-center overflow-clip bg-band">
        {/* AIOS (§2.5a): 95vh (min 500) D, 80vh tablet, 100vh M (#000). */}
        <div
          id="aios"
          className="relative flex h-[95vh] min-h-[500px] w-full flex-col items-center justify-center gap-[120px] overflow-clip bg-band px-[60px] pt-[24px] t:h-[80vh] t:px-[40px] t:pt-0 m:h-[100vh] m:gap-[44px] m:bg-black m:px-[24px] m:pt-0"
        >
          <div className="absolute left-0 top-0 z-[1] h-full w-full overflow-clip">
            <Lattice />
          </div>
          <div className="relative flex w-[950px] flex-col items-center justify-center gap-[24px] m:w-full">
            <img
              src="/assets/KPfLioy5w5ahgt9CtWgxoijuvwc.svg"
              alt="wonderful AI OS"
              width="193"
              height="31"
              className="relative z-[1] h-[31px] w-[193px] object-contain object-center m:h-auto m:w-[149px] m:[aspect-ratio:6.22581]"
            />
            <div className="relative flex w-full flex-col items-center justify-center gap-[42px] overflow-clip">
              <div
                ref={h2Ref}
                className="relative z-[2] w-full max-w-[782px] [will-change:transform]"
                style={{
                  opacity: h2In ? 1 : 0.001,
                  transition: `opacity ${SPRING_200_60.duration}s ${SPRING_200_60.easing} .1s`,
                }}
              >
                <h2 className="db-h2 whitespace-pre-wrap break-words">The unified operating layer for the AI-native enterprise</h2>
              </div>
              <div
                className="relative z-[1] [will-change:transform]"
                style={{ opacity: mounted ? 1 : 0.001, transition: `opacity .6s ${TWEEN_FADE} .5s` }}
              >
                <a
                  href="/ai-os"
                  className="db-os-btn relative flex h-[50px] w-min min-w-[140px] items-center justify-center gap-[10px] overflow-hidden rounded-[50px] bg-white px-[18px] py-[6px] no-underline m:h-[37px] m:min-w-0 m:px-[16px]"
                  style={{ transition: `opacity ${SPRING_200_60.duration}s ${SPRING_200_60.easing}` }}
                >
                  <span className="db-btn-l">Explore the OS</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <DeployCardsDesktop />

        {/* Masked bg image: 85% of wrapper height, paints over AIOS bg, under lattice (§2.5). */}
        <div className="pointer-events-none absolute left-0 top-0 z-0 h-[85%] w-full overflow-clip [mask:linear-gradient(#000_65%,#0000_100%)] [-webkit-mask:linear-gradient(#000_65%,#0000_100%)]">
          <img src="/assets/PbxeRt98ocw3ESBEOGvSkFl16OM.jpg" alt="" loading="lazy" decoding="async" className="h-full w-full object-cover object-center" />
        </div>
      </div>

      <DeployCardsMobile />
    </div>
  )
}
