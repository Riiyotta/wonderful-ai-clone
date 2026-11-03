import { useState } from 'react'
import { MENUS } from './menuData'

// Live symbol svg1949262026_354: 6x3 stroked chevron (#393939, round caps) centred in a 14x14 slot.
// Expanded variant flips it and the slot sits 14px further left.
function Chevron({ open }) {
  return (
    <span className="nv-mob-chev-slot" data-open={open ? 'true' : 'false'} aria-hidden="true">
      <svg className="nv-mob-chev" width="6" height="3" viewBox="0 0 6 3" overflow="visible">
        <path d={open ? 'M 0 3 L 3 0 L 6 3' : 'M 0 0 L 3 3 L 6 0'} fill="transparent" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

// "Mobile / Open / White" panel (CLONE_SPEC §1 Mobile nav).
export default function MobileMenu({ open }) {
  const [expanded, setExpanded] = useState(null)
  if (!open) return null
  return (
    <div className="nv-mob-panel">
      <div className="nv-mob-list">
        {MENUS.map((m) => {
          const isOpen = expanded === m.key
          return (
            <div key={m.key} className="nv-mob-group">
              <button type="button" className="nv-mob-row" data-open={isOpen ? 'true' : 'false'} aria-expanded={isOpen} onClick={() => setExpanded(isOpen ? null : m.key)}>
                <span className="nv-mob-row-label">{m.label}</span>
                <Chevron open={isOpen} />
              </button>
              {isOpen && (
                <div className="nv-mob-sub">
                  {m.items.map((it) => <a key={it.title} href={it.href} className="nv-mob-sublink">{it.title}</a>)}
                </div>
              )}
              <div className="nv-mob-sep" />
            </div>
          )
        })}
        <div className="nv-mob-group">
          <a href="/blog" className="nv-mob-blog">Blog</a>
          <div className="nv-mob-sep" />
        </div>
      </div>
      <div className="nv-mob-cta">
        <a href="/contact" className="nv-mob-cta-btn">Get Started</a>
      </div>
    </div>
  )
}
