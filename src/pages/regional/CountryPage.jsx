import '../../styles/regional/fonts.css'
import '../../styles/regional/country.css'
import { COUNTRIES } from './countries.data'
import { useAppeared, headingAppear, fadeAppear } from './appear'

const BPS = ['d', 't', 'm']

// Per-breakpoint gap/order as CSS vars; hidden breakpoints as a data attribute.
function blockProps(b) {
  const style = {}
  BPS.forEach((bp, i) => { style[`--g${bp}`] = `${b.gap[i]}px`; style[`--o${bp}`] = Math.max(0, b.ord[i]) })
  const hide = BPS.filter((_, i) => b.ord[i] < 0).join(' ')
  return { style, 'data-hide': hide || undefined }
}

function Runs({ runs }) {
  return runs.map((r, i) =>
    r.br ? <br key={i} /> : r.href ? <a key={i} href={r.href}>{r.t}</a> : <span key={i}>{r.t}</span>)
}

function TextBlock({ b, on }) {
  const p = blockProps(b)
  const abs = b.abs
  const style = { ...p.style, ...(b.appear ? fadeAppear(on) : null), ...(abs ? { top: abs.top, left: abs.left, transform: abs.transform, marginTop: 0 } : null) }
  return (
    <div className={`rg-block rg-text${abs ? ' rg-abs' : ''}`} data-hide={p['data-hide']} style={style}>
      {b.paras.map((runs, i) => <p key={i}><Runs runs={runs} /></p>)}
    </div>
  )
}

function Quote({ b }) {
  const p = blockProps(b)
  return (
    <div className="rg-block rg-quote" {...p}>
      <p className="rg-quote-text">{b.text}</p>
      <div className="rg-quote-by">
        <p className="rg-quote-name">{b.name}</p>
        <p className="rg-quote-role">{b.role}</p>
      </div>
    </div>
  )
}

function Links({ b, on }) {
  const p = blockProps(b)
  return (
    <div className="rg-block rg-links" data-hide={p['data-hide']} style={{ ...p.style, minHeight: b.minH }}>
      {b.items.map((it, i) => (
        <a key={i} className="rg-link" href={it.href} target="_blank" rel="noopener" style={{ width: it.w, minHeight: it.minH }}>
          {it.name && (
            <>
              <p style={{ width: it.nameW, ...(it.appear ? fadeAppear(on) : null) }}>{it.name}</p>
              {it.icon && <img src={it.icon} alt="" decoding="async" />}
            </>
          )}
        </a>
      ))}
    </div>
  )
}

export default function CountryPage({ slug }) {
  const c = COUNTRIES[slug]
  const on = useAppeared()
  return (
    <div className="rg-country">
      <section className="rg-country-hero">
        <h1 className="rg-country-title" style={headingAppear(on)}>{c.title}</h1>
        <div className="rg-country-banner">
          <img src={c.img} alt={c.alt} decoding="async" style={{ objectPosition: c.pos }} />
        </div>
      </section>
      <section className="rg-country-body">
        {c.blocks.map((b, i) => {
          if (b.t === 'text') return <TextBlock key={i} b={b} on={on} />
          if (b.t === 'divider') return <div key={i} className="rg-block rg-divider" {...blockProps(b)} />
          if (b.t === 'quote') return <Quote key={i} b={b} />
          return <Links key={i} b={b} on={on} />
        })}
      </section>
    </div>
  )
}
