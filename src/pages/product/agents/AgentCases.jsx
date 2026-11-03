import { useEffect, useRef, useState } from 'react'
import WordReveal from '../../../components/WordReveal'
import '../../../styles/casestudies.css'
import '../../../styles/product/product.css'
import '../../../styles/product/agents.css'

// "Solving the problems that move the business." on /agents: the homepage carousel component (CLONE_SPEC §2.3) in its
// "agents page" variants: bg #000, heading #fafafa, 5 cards (no "execution gap" / "open by default"), section padding
// 120px 0 (M 24px 0 120px). D arrows rgba(255,255,255,.2) with a #fafafa chevron; T arrows #f5f5f5 with #141414.
const ALL = [
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

const CARDS = ALL.filter((c) => !/execution-gap|open-by-default/.test(c.href))

// Symbol #3166100823 (viewBox 24, chevron at translate(9 4.5)); stroke = currentColor, width 2.
function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" className="block h-[18px] w-[18px] opacity-60" aria-hidden="true">
      <path d="M 0 0 L 7.5 7.5 L 0 15" fill="transparent" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="translate(9 4.5)" />
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

export default function AgentCases() {
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
    <section data-nav-theme="dark" className="relative flex w-full flex-col items-center overflow-hidden bg-black py-[120px] m:pb-[120px] m:pt-[24px]">
      <div className="relative flex w-full flex-col items-center">
        <div className="relative z-[1] flex w-full max-w-[1680px] items-center justify-between overflow-hidden px-[60px] pb-[80px] pt-[40px] t:px-[40px] m:flex-col m:items-end m:justify-end m:gap-[16px] m:px-[24px] m:pb-[40px]">
          <div className="w-px max-w-[70%] flex-1 m:w-full m:max-w-full m:flex-none">
            <WordReveal as="h2" text="Solving the problems that move the business." className="pr-h2 text-left text-[#fafafa] [text-wrap:balance]" />
          </div>
          <div className="flex flex-none items-center justify-center gap-[10px] m:hidden">
            <button type="button" aria-label="Previous case studies" data-disabled={atStart} onClick={() => scrollBy(-400)}
              className="cs-arrow ag-arrow flex aspect-square w-[36px] cursor-pointer items-center justify-center overflow-hidden rounded-[1000px] border-0 p-0 [transform:rotate(180deg)]">
              <ChevronIcon />
            </button>
            <button type="button" aria-label="Next case studies" onClick={() => scrollBy(400)}
              className="cs-arrow ag-arrow flex aspect-square w-[36px] cursor-pointer items-center justify-center overflow-hidden rounded-[1000px] border-0 p-0">
              <ChevronIcon />
            </button>
          </div>
        </div>
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
