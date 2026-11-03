import '../../../styles/product/product.css'

// "Transform the way you work on a unified platform" cross-sell (Framer component awQoL, used on /ai-os, /agents,
// /systems and /ai-gateway). Four cards; live hides the current page's card with
// `.wf-xsell-card:has(a[data-framer-page-link-current]) { display:none }` -> pass `current`.
// D (>=1440): row, gap 16, cards flex 1 / aspect .697297. T (880-1439): 1 col grid, cards 350px tall, gap 16.
// M (<880): column gap 12, cards width 100% / aspect .813953.
const CARDS = [
  { key: 'ai-os', href: '/ai-os', bg: 'PbxeRt98ocw3ESBEOGvSkFl16OM.jpg', lockup: 'KPfLioy5w5ahgt9CtWgxoijuvwc.svg', ar: 6.225806451612903,
    lockCls: 'w-[153px] t:w-[215px] m:h-[30px] m:w-auto', text: 'The unified operating layer for the AI-native enterprise', w: 'w-[80%]' },
  { key: 'agents', href: '/agents', bg: 'hjpNFIV0jqgolK5AlfsawzB3y7w.png', lockup: 'UIOywUdFKZG6y3aToEb8LswWffk.svg', ar: 6.242424242424242,
    lockCls: 'h-[28px] t:h-[35px] m:h-[30px]', text: 'Engage customers, assist employees, and execute work.', w: 'w-[60%]' },
  { key: 'systems', href: '/systems', bg: 'VNq3SEFbm1DGqP9OAywNQSYA.png', lockup: 'm9NwXolMW9WRfbDA1Issz2oFEfA.svg', ar: 6.787878787878788,
    lockCls: 'h-[28px] t:h-[35px] m:h-[30px]', text: 'Modernize your stack with AI-native business applications.', w: 'w-[80%]' },
  { key: 'ai-gateway', href: '/ai-gateway', bg: 'NblmY11u9f54gCzRL1iDMiYA6o.png', lockup: 'U29EBGe281HXvQxGiFfMNvdrQfA.svg', ar: 7.696969696969697,
    lockCls: 'h-[28px] t:h-[35px] t:w-[266px] m:h-[30px]', text: 'Control and govern all enterprise AI from a single place.', w: 'w-[80%]' },
]

function Card({ c }) {
  return (
    <div
      className="relative flex flex-col items-center justify-start gap-[12px] overflow-clip rounded-[8px] px-[20px] py-[28px]
        [@media(min-width:1440px)]:w-px [@media(min-width:1440px)]:flex-[1_0_0] [@media(min-width:1440px)]:[aspect-ratio:.697297]
        t:h-[350px] t:w-full t:flex-none t:[aspect-ratio:auto]
        m:w-full m:flex-none m:[aspect-ratio:.813953]"
      style={{ cursor: 'pointer' }}
    >
      <div className="absolute inset-0 rounded-[inherit]">
        <img src={`/assets/${c.bg}`} alt="" loading="lazy" className="block h-full w-full rounded-[inherit] object-cover object-center" />
      </div>
      <div className="relative h-px w-full flex-[1.4_0_0]" />
      <div className={`relative flex-none ${c.lockCls}`} style={{ aspectRatio: c.ar }}>
        <img src={`/assets/${c.lockup}`} alt="" className="absolute inset-0 block h-full w-full object-contain object-center" />
      </div>
      <div className="relative h-px w-full flex-[1_0_0]" />
      <div className={`relative max-w-[218px] flex-none ${c.w} [text-wrap:balance]`}>
        <p className="pr-p14 text-center text-[#fafafa]">{c.text}</p>
      </div>
      <div className="relative flex-none">
        <a href={c.href} className="pr-pill-s"><p className="pr-p14 text-center text-[#171719]">Explore</p></a>
      </div>
    </div>
  )
}

export default function ProductCards({ current, title = 'Transform the way you work on a unified platform' }) {
  return (
    <section
      data-nav-theme="dark"
      className="relative flex w-full flex-col items-center justify-start gap-[84px] overflow-clip bg-band px-[60px] py-[120px]
        t:px-[40px] t:pb-[80px] m:gap-[64px] m:px-[20px] m:py-[72px]"
    >
      <div className="relative flex w-full max-w-[1680px] flex-row items-center justify-start gap-[10px]">
        <div className="relative w-[560px] max-w-full m:w-full">
          <h2 className="pr-h2 text-[#fafafa]">{title}</h2>
        </div>
      </div>
      <div className="relative flex w-full max-w-[1680px] flex-row items-start justify-start gap-[16px] t:grid t:grid-cols-1 t:grid-rows-[repeat(4,min-content)] t:gap-[16px] m:flex-col m:gap-[12px]">
        {CARDS.filter((c) => c.key !== current).map((c) => <Card key={c.key} c={c} />)}
      </div>
    </section>
  )
}
