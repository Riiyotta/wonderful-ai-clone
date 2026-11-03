import '../../../styles/product/product.css'
import '../../../styles/product/systems.css'

// "Software finally adapts to you." (white). D: 40% text column (space-between, h 717) + 782x717 image (aspect 1.09066).
// T: stacked, gap 64; image aspect 1.34. M: stacked; image aspect 1.05. No hover/scroll motion on live.
const ITEMS = [
  { t: 'You define the requirements', p: 'Legacy software makes you fit your business into its data model. Wonderful Systems is built around how you actually work, from day one, not adjusted to fit later.', w: 'm:gap-[24px]' },
  { t: 'Built to change as your business evolves', p: 'Your business keeps changing. Your software should too. Wonderful Systems evolve with your workflows, requirements, and organization instead of waiting on a vendor roadmap.', w: '[@media(min-width:1440px)]:w-[411px]' },
  { t: 'A custom view for every role', p: 'Legacy systems give everyone the same screens, no matter the role or the task. Wonderful Systems shapes the view to fit each one.', w: '' },
]

function Item({ it }) {
  return (
    <div className={`relative flex w-full flex-col items-start gap-[15px] ${it.w}`}>
      <div className="relative flex w-full flex-row items-center justify-start gap-[16px]">
        <h5 className="pr-h5 whitespace-pre text-[#171719] m:flex-1 m:whitespace-pre-wrap">{it.t}</h5>
      </div>
      <div className="relative w-full [text-wrap:balance] m:max-w-[300px]">
        <p className="pr-p17 text-[#777777]">{it.p}</p>
      </div>
    </div>
  )
}

export default function Adapts() {
  return (
    <section className="relative flex w-full flex-col items-center justify-center gap-[10px] overflow-clip bg-white px-[60px] py-[120px] t:px-[40px] m:px-[24px] m:py-[64px]">
      <div className="relative flex w-full max-w-[1680px] flex-row items-center justify-center gap-[10px] [@media(min-width:1440px)]:h-[717px] t:flex-col t:justify-start t:gap-[64px] m:flex-col">
        <div className="relative flex h-full flex-col items-start justify-between [@media(min-width:1440px)]:w-px [@media(min-width:1440px)]:max-w-[40%] [@media(min-width:1440px)]:flex-[1_0_0] [@media(min-width:1440px)]:pr-[50px] t:w-full t:justify-start t:gap-[60px] m:w-full m:pb-[64px]">
          <div className="relative flex w-full flex-col items-start gap-[32px] m:pb-[60px] m:pt-[32px]">
            <h2 className="pr-h2 w-full whitespace-pre-wrap break-words text-[#080808] [text-wrap:balance]">
              <span className="t:hidden">Software finally adapts to you.</span>
              <span className="hidden t:inline">Software finally<br />adapts to you.</span>
            </h2>
            <div className="relative w-full [text-wrap:balance] t:max-w-[60%]">
              <p className="pr-p17 text-[#393939] t:text-[#777777] m:text-[#777777]">For decades, enterprises adapted their operations to fit their software. Not anymore.</p>
            </div>
          </div>
          <div className="relative flex w-full flex-col items-start gap-[24px] m:gap-[32px]">
            <div className="h-px w-full bg-[rgba(0,0,0,0.1)]" />
            <Item it={ITEMS[0]} />
            <div className="h-px w-full bg-[rgba(0,0,0,0.1)]" />
            <Item it={ITEMS[1]} />
            <div className="h-px w-full bg-[rgba(0,0,0,0.1)]" />
            <Item it={ITEMS[2]} />
          </div>
        </div>
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-[8px] [@media(min-width:1440px)]:w-px [@media(min-width:1440px)]:flex-[1_0_0] [@media(min-width:1440px)]:[aspect-ratio:1.09066] t:w-full t:[aspect-ratio:1.34] m:w-full m:[aspect-ratio:1.05]">
          <div className="absolute inset-0 rounded-[inherit]">
            <img src="/assets/qshARn8V2zLQo9ggN6ZNPVsanF8.png" alt="" loading="lazy" className="block h-full w-full rounded-[inherit] object-cover object-center" />
          </div>
        </div>
      </div>
    </section>
  )
}
