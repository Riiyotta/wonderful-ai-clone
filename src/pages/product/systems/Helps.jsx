import { PhIcon } from '../shared/icons'
import '../../../styles/product/product.css'
import '../../../styles/product/systems.css'

// "What Wonderful helps you do" (#080808). D: row of 3 equal-height cells (flex 1, stretch), gap 24.
// T: 2x2 grid, gap 40/24, cells sized to content. M: column gap 16; cells get a top border + padding 30px 0.
// Live quirks kept: the 2nd H5 is #fff (others #fafafa); on tablet the 2nd cell's paragraph is an unstyled
// Framer variant (Inter 16/19.2, normal tracking, color #000 -> invisible on the dark band).
const CELLS = [
  { icon: 'Optionality', t: 'Modernize without the multi-year project', p: 'Legacy replacements are usually large, slow, and risky. This one moves in weeks, not years.' },
  { icon: 'Building', t: 'Lower total cost of ownership', p: 'A large part of software cost comes from customization and services. Here, that’s minimal, since building is AI-powered and custom from the start.', quirk: true },
  { icon: 'Cloud', t: 'Consolidate your tech stack', p: 'Workflows end up scattered across systems because each one only does its own piece. Built-for-you software lets you consolidate them.' },
]

export default function Helps() {
  return (
    <section data-nav-theme="dark" className="relative flex w-full flex-col items-center justify-center gap-[60px] overflow-hidden bg-band px-[60px] py-[120px] t:px-[40px] t:pb-[60px] m:px-[30px] m:py-[60px]">
      <div className="relative flex w-full max-w-[1680px] flex-col items-start gap-[24px]">
        <div className="relative w-auto [text-wrap:balance]">
          <h2 className="pr-h2 text-left text-[#fafafa]">What Wonderful helps you do</h2>
        </div>
        <div className="relative w-full max-w-[560px] whitespace-pre-wrap break-words">
          <p className="pr-p17 text-[#9e9e9e]">It costs less, moves faster, and needs fewer systems holding it together.</p>
        </div>
      </div>
      <div className="relative flex w-full max-w-[1680px] flex-row items-start gap-[24px] t:grid t:grid-cols-2 t:[grid-auto-rows:minmax(0,1fr)] t:gap-x-[24px] t:gap-y-[40px] m:flex-col m:gap-[16px]">
        {CELLS.map((c) => (
          <div key={c.t} className="sys-cell relative flex flex-col items-start self-stretch p-[32px] [@media(min-width:1440px)]:w-px [@media(min-width:1440px)]:flex-[1_0_0] t:w-full t:self-start m:w-full m:self-auto m:px-0 m:py-[30px]">
            <div className="flex w-full flex-col items-start gap-[60px]">
              <div className="relative h-[32px] w-[32px] flex-none text-white"><PhIcon name={c.icon} /></div>
              <div className="flex w-full flex-col items-start gap-[24px]">
                <h5 className={`pr-h5 w-full whitespace-pre-wrap break-words ${c.quirk ? 'text-white' : 'text-[#fafafa]'}`}>{c.t}</h5>
                <p className={`pr-p14 w-full whitespace-pre-wrap break-words text-[#9e9e9e] ${c.quirk ? 'sys-quirk-p' : ''}`}>{c.p}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
