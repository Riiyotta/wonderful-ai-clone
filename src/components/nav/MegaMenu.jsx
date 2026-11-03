import { useLayoutEffect, useRef, useState } from 'react'
import { NavLogo } from './Logos'
import { PLATFORM, INDUSTRIES, COMPANY, FEATURE, PRESS } from './menuData'

// Live per-item reveal on open (re-measured with a real pointer, warm hovers): [delay ms, rise px, duration ms].
// Items: opacity 0->1 + 7px rise, ~270ms; cards 40px / 400ms; Company "Latest press" label 20px / 350ms.
const ANIM = {
  platform: { items: [15, 81, 148, 198, 265, 314], card: [366, 7, 300] },
  // INDUSTRIES order: Banking, Utilities, Retail, Airlines | Telecommunications, Healthcare, Insurance
  industries: { items: [121, 321, 520, 622, 221, 420, 622], card: [389, 40, 400] },
  company: { items: [22, 123, 321], label: [173, 20, 350], cards: [[331, 40, 400], [382, 40, 400]] },
}
const anim = (d, y = 7, dur = 270) => ({ '--mm-d': `${d}ms`, '--mm-y': `${y}px`, '--mm-dur': `${dur}ms` })

function Item({ item, d }) {
  return (
    <a href={item.href} className="nv-mm-item nv-mm-anim" style={{ ...(item.minH ? { minHeight: item.minH } : null), ...anim(d) }}>
      <span className="nv-mm-item-title">{item.title}</span>
      {item.desc && <span className="nv-mm-item-desc">{item.desc}</span>}
    </a>
  )
}

function PlayButton() {
  return (
    <span className="nv-mm-play" aria-hidden="true">
      {/* 13px icon; the glyph itself is not in the spec - a plain play triangle is used. */}
      <svg viewBox="0 0 13 13" width="13" height="13"><path d="M3 1.5v10l8.5-5z" fill="#000" /></svg>
    </span>
  )
}

function VideoCard({ card, a }) {
  return (
    <a href={card.href} className="nv-mm-card nv-mm-anim" style={anim(...a)} {...(card.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
      <span className="nv-mm-card-img">
        <img src={card.img} alt="" loading="lazy" />
        {card.play && <PlayButton />}
      </span>
      <span className="nv-mm-card-text">
        <span className="nv-mm-card-title" style={card.titleColor ? { color: card.titleColor } : undefined}>{card.title}</span>
        {card.sub && <span className="nv-mm-card-sub">{card.sub}</span>}
      </span>
    </a>
  )
}

// Live renders the two link lists as side-by-side flex columns (not a shared-row grid), so row heights
// are independent per column.
function Columns({ items, split, className, delays }) {
  return (
    <div className={`nv-mm-cols ${className}`}>
      <div className="nv-mm-col">{items.slice(0, split).map((it, i) => <Item key={it.title} item={it} d={delays[i]} />)}</div>
      <div className="nv-mm-col">{items.slice(split).map((it, i) => <Item key={it.title} item={it} d={delays[split + i]} />)}</div>
    </div>
  )
}

function Panel({ menu }) {
  if (menu === 'platform') {
    return (
      <>
        <div className="nv-mm-left">
          <NavLogo className="nv-mm-logo" />
          <Columns items={PLATFORM} split={3} className="nv-mm-cols--platform" delays={ANIM.platform.items} />
        </div>
        <VideoCard card={FEATURE.platform} a={ANIM.platform.card} />
      </>
    )
  }
  if (menu === 'industries') {
    return (
      <>
        <div className="nv-mm-left">
          <NavLogo className="nv-mm-logo" />
          <Columns items={INDUSTRIES} split={4} className="nv-mm-cols--industries" delays={ANIM.industries.items} />
        </div>
        <VideoCard card={FEATURE.industries} a={ANIM.industries.card} />
      </>
    )
  }
  return (
    <>
      <div className="nv-mm-left">
        <NavLogo className="nv-mm-logo" />
        <div className="nv-mm-list">
          {COMPANY.map((it, i) => <Item key={it.title} item={it} d={ANIM.company.items[i]} />)}
        </div>
      </div>
      <div className="nv-mm-press" data-name="Latest press">
        <p className="nv-mm-press-label nv-mm-anim" style={anim(...ANIM.company.label)}>Latest press</p>
        <div className="nv-mm-press-cards">
          {PRESS.map((c, i) => <VideoCard key={c.title} card={c} a={ANIM.company.cards[i]} />)}
        </div>
      </div>
    </>
  )
}

// Full-width dropdown body under the bar. Live: height snaps open/closed in one frame; items stagger in (ANIM).
export default function MegaMenu({ menu, open }) {
  const ref = useRef(null)
  const [h, setH] = useState(0)
  useLayoutEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const measure = () => setH(el.offsetHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [menu])
  return (
    <div className="nv-mm" style={{ height: open ? h : 0 }} aria-hidden={!open}>
      <div ref={ref} className="nv-mm-body">
        <div className="nv-mm-inner">{menu && <Panel key={menu} menu={menu} />}</div>
      </div>
    </div>
  )
}
