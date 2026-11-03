import '../../../styles/product/product.css'

// "Build or replace your core business systems" (#080808). D: 2x2, cards flex 1 / aspect 1.4276, full-bleed image,
// title bottom-left (padding 32, gap 10). T/M: #141414 card, image on top (aspect 1.751), title below (0 24px 24px).
// The description <p> is empty on live (still adds the 12px gap). No hover state.
const CARDS = [
  { t: 'Customer relationship management', img: '9rfgYXmF9SBC6EUB2jXO5LpmfrA.jpg' },
  { t: 'Customer value management', img: 'A4kwn19AjNGKY8cum7zimmO0tM.jpg' },
  { t: 'Knowledge management', img: 'Ch4XdpulzzTSIyiLMXICKLimNeI.jpg' },
  { t: 'Human capital management', img: 'ntWrufB5PA18uoF4cb6UYZxNx5c.jpg' },
]

function Card({ c }) {
  return (
    <div className="relative [@media(min-width:1440px)]:w-px [@media(min-width:1440px)]:flex-[1_0_0] [@media(min-width:1440px)]:[aspect-ratio:1.4276] t:w-px t:flex-[1_0_0] m:w-full">
      {/* D */}
      <div className="relative flex h-full w-full flex-col items-start justify-end gap-[10px] overflow-clip rounded-[8px] p-[32px] t:hidden m:hidden">
        <div className="absolute inset-0 rounded-[inherit]">
          <img src={`/assets/${c.img}`} alt="" loading="lazy" className="block h-full w-full rounded-[inherit] object-cover object-center" />
        </div>
        <div className="relative flex w-full max-w-[600px] flex-col items-start gap-[12px]">
          <div className="relative w-full [text-wrap:balance]"><h4 className="pr-h4 text-white">{c.t}</h4></div>
          <div className="relative w-full"><p className="pr-p17 text-white" /></div>
        </div>
      </div>
      {/* T / M */}
      <div className="relative hidden w-full flex-col items-start justify-start gap-[24px] overflow-clip rounded-[8px] bg-[#141414] t:flex m:flex">
        <div className="relative w-full flex-none [aspect-ratio:1.751]">
          <div className="absolute inset-0">
            <img src={`/assets/${c.img}`} alt="" loading="lazy" className="block h-full w-full object-cover object-center" />
          </div>
        </div>
        <div className="relative flex w-full max-w-[600px] flex-col items-start gap-[12px] px-[24px] pb-[24px]">
          <div className="relative w-full [text-wrap:balance]"><h4 className="pr-h4 text-white">{c.t}</h4></div>
          <div className="relative w-full"><p className="pr-p17 text-white" /></div>
        </div>
      </div>
    </div>
  )
}

export default function Replace() {
  return (
    <section data-nav-theme="dark" className="relative flex w-full flex-col items-center justify-start gap-[80px] bg-band px-[60px] py-[120px] t:px-[40px] m:gap-[64px] m:px-[24px] m:py-[84px]">
      <div className="relative w-full max-w-[1680px] whitespace-pre-wrap break-words">
        <h2 className="pr-h2 text-[#fafafa] [text-wrap:balance]">Build or replace your core business systems</h2>
      </div>
      <div className="relative flex w-full max-w-[1680px] flex-col items-center justify-start gap-[24px]">
        {[0, 2].map((i) => (
          <div key={i} className="relative flex w-full flex-row items-center justify-start gap-[24px] m:flex-col">
            <Card c={CARDS[i]} />
            <Card c={CARDS[i + 1]} />
          </div>
        ))}
      </div>
    </section>
  )
}
