import { useEffect, useRef, useState } from 'react'
import WordReveal from './WordReveal'
import { H2_SECTION } from './sections/shared'
import '../styles/casestudies.css'

// CLONE_SPEC §2.3. Logo box: height 62 (card 7: 36) on D, width = height x aspect, capped at 194.
// M heights per variant CSS: 42 / 32 / 28 / 28 / 26. `null` logo = empty 62x62 slot.
const CARDS = [
  { href: '/blog-articles/ote', title: ['Agentifying a national ', 'telecom operator'], img: 'a1MmzRNQSPFf4uvoiutIdVnwoA.png',
    logo: { src: 'HtdGpsL3gaqKSEyF91kTC1E5yA.png', ar: '1.6383 / 1', h: 'h-[62px] m:h-[42px]' } },
  { href: '/blog-articles/banco-caja-social', title: ['Collections across ', '2.5 million clients'], img: 'pLpnYFl4P79sf1sqCEkoF2tZXJ4.png',
    logo: { src: 'zCbhv92CWw3fy9CUuRR6LAcuLEU.png', ar: '4.32558 / 1', h: 'h-[62px] m:h-[32px]' } },
  { href: '/blog-articles/the-execution-gap-no-model-can-close', title: ['The execution gap no model can close'], img: 'VPCDpsUTDRi5FglpROFPRh7Q.png', logo: null },
  { href: '/blog-articles/petrol-ofisi', title: ['Internal IT automated across thousands of stations '], img: 'OuYOIvuD0QSMclAG7aRDVAmS4Ew.png',
    logo: { src: 'QnIcjBcgnIer46l3sEKY15WAuY.png', ar: '5.32353 / 1', h: 'h-[62px] m:h-[28px]' } },
  { href: '/blog-articles/telefonica', title: ['91.5% containment rate across millions of customers '], img: 'NSDOoFlacIhG39rfnu8hBZnceAY.png',
    logo: { src: 'XNVB4d1x4hAhWTtl66slqgMRqw.png', ar: '4.17073 / 1', h: 'h-[62px] m:h-[28px]' }, midSpacer: true },
  { href: '/blog-articles/open-by-default-competitive-by-design', title: ['Open by default,', 'competitive by design '], img: 'JnUt2A5HsH8OTqMmne68u92Xo.png', logo: null },
  { href: '/blog-articles/ppc-energie', title: ['Billing resolved end-to-end for energy customers'], img: 'tF5KaZUKvJRdgpZqpCG0he015gk.jpg', pos: '26.4% 45.5%' /* live focal point */,
    logo: { src: '6ABuVojg9k3QJp0yIDvlSqtw6w.png', ar: '2.37143 / 1', h: 'h-[36px] m:h-[26px]' } },
]

// Symbol #3166100823 from the saved page (viewBox 24, chevron at translate(9 4.5)); stroke #141414, width 2.
function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" className="block h-[18px] w-[18px] opacity-60" aria-hidden="true">
      <path d="M 0 0 L 7.5 7.5 L 0 15 Z" fill="rgb(20,20,20)" fillOpacity="0" transform="translate(9 4.5)" />
      <path d="M 0 0 L 7.5 7.5 L 0 15" fill="transparent" stroke="rgb(20,20,20)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(9 4.5)" />
    </svg>
  )
}

function Card({ c }) {
  return (
    <a
      href={c.href}
      draggable="false"
      className="relative flex shrink-0 flex-col items-start justify-between overflow-hidden rounded-card no-underline
        w-[583px] aspect-square p-[32px]
        t:w-[480px] t:p-[24px]
        m:w-[330px] m:h-[391px] m:aspect-auto m:p-[24px]"
    >
      <div className="absolute inset-0 rounded-[inherit]">
        <img src={`/assets/${c.img}`} alt="" draggable="false" loading="lazy" className="block h-full w-full rounded-[inherit] object-cover object-center" style={c.pos ? { objectPosition: c.pos } : undefined} />
      </div>
      <div className="relative flex w-full select-none items-start justify-center gap-[12.96px] overflow-hidden">
        <h3 className="cs-h3 w-px flex-1">
          {c.title.map((t, i) => (
            <span key={i}>{t}{i < c.title.length - 1 && <br />}</span>
          ))}
        </h3>
        <h3 className="cs-h3 cs-h3--arrow flex-none" aria-hidden="true"> ↗</h3>
      </div>
      {c.midSpacer && <div className="relative flex h-[78px] w-full max-w-[428px] select-none flex-col overflow-hidden" />}
      <div className="relative flex w-full items-center justify-end gap-[12.96px]">
        {c.logo ? (
          <div className={`relative w-auto max-w-[194px] flex-none ${c.logo.h}`} style={{ aspectRatio: c.logo.ar }}>
            <img src={`/assets/${c.logo.src}`} alt="" loading="lazy" className="absolute inset-0 block h-full w-full object-contain object-center" />
          </div>
        ) : (
          <div className="relative h-[62px] w-[62px] max-w-[194px] flex-none" />
        )}
      </div>
    </a>
  )
}

export default function CaseStudies() {
  const scrollRef = useRef(null)
  const [atStart, setAtStart] = useState(true)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => setAtStart(el.scrollLeft <= 0)
    onScroll()
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const scrollBy = (dx) => scrollRef.current?.scrollBy({ left: dx, behavior: 'smooth' })

  return (
    <section
      id="team"
      data-nav-theme="light"
      className="relative flex w-full flex-col items-center bg-white pt-[60px] pb-[24px] t:pt-[80px] m:rounded-b-[8px] m:pt-0 m:pb-0"
    >
      <div className="relative flex w-full flex-col items-center">
        {/* Button Stack */}
        <div className="relative z-[1] flex w-full max-w-[1680px] items-center justify-between overflow-hidden px-[60px] pt-[40px] pb-[80px] t:px-[40px] m:flex-col m:items-end m:justify-end m:gap-[16px] m:px-[24px] m:pb-[40px]">
          <div className="w-px max-w-[70%] flex-1 m:w-full m:max-w-full m:flex-none">
            <WordReveal as="h2" text="Solving the problems that move the business." className={`${H2_SECTION} m-0 text-left text-ink-700 [text-wrap:balance]`} />
          </div>
          <div className="flex flex-none items-center justify-center gap-[10px] m:hidden">
            <button
              type="button"
              aria-label="Previous case studies"
              data-disabled={atStart}
              onClick={() => scrollBy(-400)}
              className="cs-arrow flex aspect-square w-[36px] cursor-pointer items-center justify-center overflow-hidden rounded-[1000px] border-0 bg-chip p-0 [transform:rotate(180deg)]"
            >
              <ChevronIcon />
            </button>
            <button
              type="button"
              aria-label="Next case studies"
              onClick={() => scrollBy(400)}
              className="cs-arrow flex aspect-square w-[36px] cursor-pointer items-center justify-center overflow-hidden rounded-[1000px] border-0 bg-chip p-0"
            >
              <ChevronIcon />
            </button>
          </div>
        </div>
        {/* ScrollContainer */}
        <div ref={scrollRef} className="cs-scroll relative flex w-full flex-col items-start">
          <div className="relative z-[1] flex w-max items-center gap-[16px]">
            <div aria-hidden="true" className="w-[46px] flex-none self-stretch t:w-[26px] m:w-[8px]" />
            {CARDS.map((c) => <Card key={c.href} c={c} />)}
            <div aria-hidden="true" className="w-[46px] flex-none self-stretch t:w-[26px] m:w-[8px]" />
          </div>
        </div>
      </div>
    </section>
  )
}
