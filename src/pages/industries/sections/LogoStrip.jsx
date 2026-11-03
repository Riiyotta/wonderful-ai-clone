import WordReveal from '../../../components/WordReveal'

function Logo({ logo }) {
  return (
    <div className="inx-logo" data-framer-name="Logo">
      <div className="inx-logo-card" data-framer-name="Client Card">
        <div className="inx-logo-img">
          <img src={logo.src} alt={logo.alt} decoding="async" loading="lazy" />
        </div>
      </div>
    </div>
  )
}

// Logo Strip: 8 logos as two rows of 4 (>= 880) or 6 in one row (healthcare/utilities; 3x2 grid on tablet);
// mobile is a 2-column grid of the same logos in the same order.
export default function LogoStrip({ logos }) {
  const { items, singleRow, heading } = logos
  return (
    <section className="inx-logos" data-framer-name="Logo Strip">
      <div className="inx-logos-head">
        <WordReveal as="h4" text={heading} variant="heading" className="inx-h4" />
      </div>
      {singleRow ? (
        <div className="inx-logos-single">
          {items.map((l, i) => <Logo key={i} logo={l} />)}
        </div>
      ) : (
        <div className="inx-logos-d">
          <div className="inx-logos-row">{items.slice(0, 4).map((l, i) => <Logo key={i} logo={l} />)}</div>
          <div className="inx-logos-row">{items.slice(4).map((l, i) => <Logo key={i} logo={l} />)}</div>
        </div>
      )}
      <div className="inx-logos-m">
        <div className="inx-logos-grid">{items.map((l, i) => <Logo key={i} logo={l} />)}</div>
      </div>
    </section>
  )
}
