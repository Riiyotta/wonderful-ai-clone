import WordReveal from '../WordReveal'

const CARDS = [
  {
    title: 'Deployment teams in every market.',
    body: 'Local teams who build it with you, then hand it over and move to the next use case.',
    cta: 'See the model',
    href: '/deployment',
    img: '/assets/GE2ff9hpxjunCs3VZvJODYW4IoQ.jpg',
    imgM: '/assets/GE2ff9hpxjunCs3VZvJODYW4IoQ.jpg',
    overlay: 'linear-gradient(rgba(20,20,20,0) 0%, rgba(20,20,20,.1) 40%, #141414 70%)',
  },
  {
    title: 'Strategy that drives AI transformation.',
    body: 'Shaping the shift: which problems, what order, how the organization changes.',
    cta: 'Explore the approach',
    href: '/ai-transformation',
    img: '/assets/aa4tkKpVkqnWNLuv9cZYR9CEP5o.png',
    imgM: '/assets/we6aamQFKOLkq1wkIsxi4cTaDw.png',
    overlay: 'linear-gradient(rgba(20,20,20,0) 0%, rgba(20,20,20,.1) 40%, #141414 100%)',
    // Live M: the Strategy card uses the same 70% stop as Deployment.
    overlayM: 'linear-gradient(rgba(20,20,20,0) 0%, rgba(20,20,20,.1) 40%, #141414 70%)',
  },
]

function Card({ card, mobile }) {
  return (
    <div
      className={mobile
        ? 'relative flex h-[500px] w-full flex-col items-center justify-end gap-[64px] overflow-clip rounded-[8px] px-[24px] pb-[40px] pt-[60px]'
        : 'relative flex h-full w-px max-w-[1000px] flex-[1_0_0] flex-col items-center justify-end gap-[64px] overflow-clip rounded-[8px] pb-[60px] pl-[42px] pr-[60px] pt-[42px] [will-change:transform]'}
    >
      <div className="absolute inset-0 rounded-[inherit]">
        <img src={mobile ? card.imgM : card.img} alt="" loading="lazy" decoding="async" className="h-full w-full rounded-[inherit] object-cover object-center" />
      </div>
      <div className="absolute left-0 top-[.0715315%] z-[1] h-full w-full overflow-clip" style={{ background: mobile ? (card.overlayM || card.overlay) : card.overlay }} />
      <div className={`relative z-[2] flex w-full flex-col items-center justify-start overflow-clip ${mobile ? 'gap-[16px]' : 'gap-[32px]'}`}>
        <div className="relative flex w-full flex-col items-center justify-center gap-[10px] overflow-clip">
          <WordReveal as="h3" text={card.title} variant="heading" className="db-h3 relative w-full max-w-[404px]" />
          <p className="db-body relative w-full">{card.body}</p>
        </div>
        <a
          href={card.href}
          className="relative flex h-[37px] w-min items-center justify-center gap-[10px] overflow-hidden rounded-[50px] bg-white px-[16px] py-[6px] no-underline shadow-[inset_0_0_0_1px_#fff]"
        >
          <span className="db-btn-s">{card.cta}</span>
        </a>
      </div>
    </div>
  )
}

// D/tablet: row of two cards inside the dark band (§2.5b).
export function DeployCardsDesktop() {
  return (
    <div className="relative z-[1] flex w-full flex-col items-center justify-center gap-[80px] overflow-hidden px-[60px] pb-[180px] pt-[100px] t:px-[40px] m:hidden" data-framer-name="Industries Section">
      <div className="relative flex h-[699px] w-full max-w-[1200px] flex-row items-start justify-center gap-[16px] overflow-clip">
        {CARDS.map((c) => <Card key={c.cta} card={c} />)}
      </div>
    </div>
  )
}

// M: separate #000 section, cards stacked, Strategy uses a different image (§2.5b M).
export function DeployCardsMobile() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center gap-[42px] bg-black px-[24px] pb-[84px] pt-[40px] d:hidden" data-framer-name="Industries Section">
      <div className="relative flex w-full flex-col items-center gap-[16px]">
        {CARDS.map((c) => <Card key={c.cta} card={c} mobile />)}
      </div>
    </div>
  )
}
