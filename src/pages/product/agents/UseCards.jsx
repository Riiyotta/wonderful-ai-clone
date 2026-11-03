import '../../../styles/product/product.css'
import '../../../styles/product/agents.css'

// "Transform the way you work" (white). Three link cards (href ./agents), image swapped per breakpoint.
// D: row gap 16, cards flex 1, aspect .813447 (middle .8125), content max-w 600 bottom-left, H4 26 + p 17.
// T: column, cards 1020x700, H2-preset title 42 + p 20 (o1ogpi). M: column, 342x510, H4 24 + p 17.
const CARDS = [
  { title: 'Automate and improve work', text: "Agents that do the work itself. Complete business processes, executed end to end, from the moment work arrives until it's resolved.",
    d: 'kLjlUak6WSaFDUkOapOQD2Yw.png', t: 's0SPGt2AKVF2XHxuZDx4SINH9g.png', m: '2F8adlyUJOMSl8DvN58coDayfn4.png', ar: '.813447' },
  { title: 'Serve and grow customers', text: 'Agents engage customers across every channel, deliver faster and more effective service, and create new opportunities to drive revenue.',
    d: 'zmHgufjgUxRTipAfDErDclnRFU.png', t: 'fQVHdIGB0TEUgNwyMvn1Zt73uZc.png', m: 'WVnBTdqJjN1ZV6aU3Re9LBdQ9c.png', ar: '.8125' },
  { title: 'Make employees more productive', text: "Agents work alongside your people, drawing on the organization's knowledge to answer questions, support decisions, and get tasks done.",
    d: 'PCqf8VFC8rNBzSqKtj1V5GRNKQA.png', t: 'N3UbkdCg6U0zQg3BFGos2Y0pJAM.png', m: 'x7QqxerGFiM7YRk92Pz2v9cbYo.png', mPos: '58.7% 27.1%', ar: '.813447' },
]

function Card({ c }) {
  return (
    <a href="/agents" className="ag-use-card relative flex flex-col items-center justify-end overflow-clip rounded-[8px] t:items-start px-[20px] py-[28px] no-underline" style={{ '--ar': c.ar }}>
      <div className="absolute inset-0 rounded-[inherit]">
        <picture>
          <source media="(max-width: 879.98px)" srcSet={`/assets/${c.m}`} />
          <source media="(max-width: 1439.98px)" srcSet={`/assets/${c.t}`} />
          <img src={`/assets/${c.d}`} alt="" loading="lazy" className="ag-use-img block h-full w-full rounded-[inherit] object-cover" style={{ '--mpos': c.mPos || '50% 50%' }} />
        </picture>
      </div>
      <div className="relative flex w-full max-w-[600px] flex-col items-start gap-[12px]">
        <div className="relative w-full [text-wrap:balance]">
          <h4 className="pr-h4 text-[#fafafa] t:hidden">{c.title}</h4>
          <h2 className="pr-h2 [text-wrap:balance] hidden text-[#fafafa] t:block">{c.title}</h2>
        </div>
        <div className="relative w-full whitespace-pre-wrap break-words">
          <p className="pr-p17 text-[rgba(255,255,255,0.7)] t:hidden">{c.text}</p>
          <p className="pr-p20 hidden text-[rgba(255,255,255,0.7)] t:block">{c.text}</p>
        </div>
      </div>
    </a>
  )
}

export default function UseCards() {
  return (
    <section data-nav-theme="light" className="relative flex w-full flex-col items-center justify-start gap-[80px] bg-white px-[60px] py-[120px] t:px-[40px] m:gap-[40px] m:px-[24px] m:py-[84px]">
      <div className="relative w-full max-w-[1680px] whitespace-pre-wrap break-words">
        <h2 className="pr-h2 [text-wrap:balance] text-[#171719]">Transform the way you work</h2>
      </div>
      <div className="relative flex w-full max-w-[1680px] flex-row items-start justify-start gap-[16px] t:flex-col m:flex-col">
        {CARDS.map((c) => <Card key={c.title} c={c} />)}
      </div>
    </section>
  )
}
