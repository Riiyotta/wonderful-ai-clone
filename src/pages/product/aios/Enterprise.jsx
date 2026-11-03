import '../../../styles/product/aios.css'

// "Built for the enterprise." (white). D: hover rows (component "Variant 1"): bg -> #f5f5f5, top line -> rgba(0,0,0,.1),
// a 42px "—" appears and the title slides right 51.2px, the 310x196 image fades in; all .4s ease (fitted to live rAF samples).
// T/M: no hover; text then image (gap 42), image always visible.
const ROWS = [
  { title: 'Flexible deployment', text: 'Multi-tenant SaaS, single-tenant, or BYOC across AWS, Azure, and GCP.', img: 'YdIXaP18pnOxoT9ul79mQcUU8k.png' },
  { title: 'Built-in security', text: 'Prompt injection protection, agent guardrails, enterprise MCP gateways, and third-party pen testing twice a year.', img: 'bHBi0ZlxL7qSzMWXzhCFhhLbVQ.png' },
  { title: 'Data protection', text: 'Zero data retention with all AI providers. Automatic PII redaction. AES-256 encryption.', img: 'WDmw2AX4aCWFLvPmdvcuQxCMZ0k.png' },
  { title: 'Compliance & standards', text: 'SOC 2 Type II, ISO 27001:2022, GDPR, PCI DSS, and EU AI Act aligned. Independently verified annually.', img: '721DZpmWeYabvFk7cKWFAZjpPo.png' },
]

function Row({ r }) {
  return (
    <div className="en-row">
      <div className="en-line" />
      <div className="en-body">
        <div className="en-inner">
          <div className="en-title">
            <h3 className="pr-h3 en-dash" aria-hidden="true">—</h3>
            <div className="en-title-text"><h3 className="pr-h3 text-[#171719]">{r.title}</h3></div>
          </div>
          <div className="en-right">
            <div className="en-img">
              <div className="absolute inset-0 rounded-[inherit]">
                <img src={`/assets/${r.img}`} alt="" loading="lazy" className="block h-full w-full rounded-[inherit] object-cover object-center" />
              </div>
            </div>
            <div className="en-text">
              <div className="relative w-full whitespace-pre-wrap break-words"><p className="pr-p17 text-[#777777]">{r.text}</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Enterprise() {
  return (
    <section id="built" className="relative flex w-full flex-col items-center justify-center gap-[80px] overflow-hidden bg-white pt-[120px] m:py-[84px]">
      <div className="relative flex w-full flex-row items-center justify-center gap-[10px] overflow-clip px-[60px] t:px-[40px] m:px-[24px]">
        <div className="relative w-full max-w-[1680px] whitespace-pre-wrap break-words">
          <h2 className="pr-h2 en-h2 m:hidden">
            <span className="text-[#171719]">Built for the enterprise.</span><br />From deployment to data protection<br />to compliance, every layer is built to meet<br />the bar enterprises run on.
          </h2>
          <h2 className="pr-h2 hidden text-[#171719] m:block">
            <span className="text-[#171719]">Built for the enterprise.</span><br />
            <span className="text-[#6b6b6b]">From deployment to data protection to compliance, every layer is built to meet</span><br />
            <span className="text-[#6b6b6b]">the bar enterprises run on.</span>
          </h2>
        </div>
      </div>
      <div className="relative flex w-full flex-col items-center justify-center gap-0 overflow-clip">
        {ROWS.map((r) => <Row key={r.title} r={r} />)}
      </div>
    </section>
  )
}
