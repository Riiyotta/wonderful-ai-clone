import '../../styles/company/common.css'
import '../../styles/company/press.css'
import LAYOUT from './data/pressLayout'
import { Appear, SPRING_PARA } from './sections/motion'
import { springEase } from '../../lib/spring'

// /press (CLONE_SPEC_COMPANY §3): dark page, "Wonderful in the news" + a mosaic of press cards. Live arranges
// different card variants/articles per breakpoint, so each breakpoint renders its own measured layout.
// Card appear (live, replays every time a card re-enters the viewport): container opacity 0 -> 1, y 40 -> 0,
// spring stiffness 320 / damping 52 (least-squares fit), fires at ~10% visibility.
const CARD_SPRING = springEase({ stiffness: 320, damping: 52 })
const cq = ([a, b]) => `calc(${a} * 100cqw + ${b}px)`
// Live tints each card's badge / text / logo for legibility: w = white (brightness(0) invert(1)), k = black (brightness(0)).
const FILTER = { w: 'brightness(0) invert(1)', k: 'brightness(0)' }
const fx = (f, k) => (f && f[k] ? { filter: FILTER[f[k]] } : undefined)

// Variant -> look. big = Featured family (h4 26px, 17px badge); logo: tr48 / tr26 (top-right) or c200 / c120 (centered).
const VARIANTS = {
  Featured: { big: true, logo: 'h48' },
  'Standard Center Logo': { big: true, logo: 'w200', clogo: true },
  'Featured Center Logo': { big: true, logo: 'w200', clogo: true, srcBig: true, titleMax: 710, h3: true },
  Hebrew: { logo: 'w120', clogo: true, end: true, titleMax: 290, heb: 'l' },
  'Hebrew Mobile': { logo: 'w120', clogo: true, end: true, titleMax: 290, heb: 'm' },
  Small: { logo: 'h26' },
  'Small Center  text': { logo: 'h26', ctext: true, titleMax: 300 },
  'Small Center Logo': { logo: 'w120', clogo: true, titleMax: 290 },
  'Small Center  text Center Logo': { logo: 'w120', clogo: true, ctext: true, titleMax: 290 },
}

function PressCard({ it }) {
  const V = VARIANTS[it.v] || VARIANTS.Small
  const cls = ['cpr-card', V.clogo && 'cpr-card--clogo', V.ctext && 'cpr-card--ctext', V.end && 'cpr-card--end'].filter(Boolean).join(' ')
  const T = V.h3 ? 'h3' : V.big ? 'h4' : 'h5'
  return (
    <a href={it.href} target="_blank" rel="noreferrer" className={cls} data-framer-name={it.v}>
      <div className="cpr-img" data-framer-name="Image">
        <img src={`/assets/${it.img}`} alt="" loading="lazy" decoding="async" />
        <div className="cpr-scrim" />
        <div className={`cpr-badge ${V.big ? 'cpr-badge--l' : 'cpr-badge--s'}`} data-framer-name="Badge" style={fx(it.f, 'b')}>
          <div className="cpr-dot" />
          <div data-framer-name="Media Type"><p>{it.badge}</p></div>
        </div>
        <div className="cpr-content" data-framer-name="Content" style={fx(it.f, 'c')}>
          <div className="cpr-meta">
            {it.source != null && <div data-framer-name="Source"><p className={`cpr-source ${V.srcBig ? 'cpr-source--big' : ''}`}>{it.source}</p></div>}
          </div>
          {it.title && (
            <div className="cpr-title" style={V.titleMax ? { maxWidth: V.titleMax } : undefined} data-framer-name="Title">
              <T dir="auto" className={V.heb ? `cpr-heb ${V.heb === 'm' ? 'cpr-heb--m' : ''}` : V.h3 ? 'cpr-h3' : undefined}>{it.title}</T>
            </div>
          )}
        </div>
        {it.logo && (
          <div className="cpr-logo-ov" data-framer-name="Logo Overlay">
            <div data-framer-name="Logo" className={`cpr-logo cpr-logo--${V.logo}`} style={fx(it.f, 'l')}><img src={`/assets/${it.logo}`} alt="" loading="lazy" /></div>
          </div>
        )}
      </div>
    </a>
  )
}

function Layout({ bp }) {
  return (
    <div className={`cpr-layout cpr-layout--${bp}`}>
      {LAYOUT[bp].items.map((it, i) => (
        <div key={i} className="cpr-item" data-framer-name="Press Item" style={{ left: cq(it.x), top: cq(it.y), width: cq(it.w) }}>
          <Appear className="cpr-anim" replay amount={0.1} from={{ opacity: 0, y: 40 }} ease={CARD_SPRING}>
            <PressCard it={it} />
          </Appear>
        </div>
      ))}
    </div>
  )
}

export default function Press() {
  const vars = { '--pr-h-d': cq(LAYOUT.d.h), '--pr-h-t': cq(LAYOUT.t.h), '--pr-h-m': cq(LAYOUT.m.h) }
  return (
    <div className="cpr-root" data-nav-theme="dark">
      <div className="cpr-cq">
        <section className="cpr-sec" data-framer-name="Section Press" style={vars}>
          <div className="cpr-head">
            <div className="w-full" data-framer-name="Page Title">
              <Appear as="h1" mode="mount" className="cpr-h1 co-favorit" from={{ opacity: 0.001, y: 10, blur: 10 }} ease={SPRING_PARA}>
                Wonderful in the news
              </Appear>
            </div>
            <div className="cpr-rule" />
          </div>
          <Layout bp="d" />
          <Layout bp="t" />
          <Layout bp="m" />
        </section>
      </div>
    </div>
  )
}
