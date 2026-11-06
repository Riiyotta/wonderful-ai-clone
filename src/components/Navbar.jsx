import { useEffect, useState } from 'react'
import '../styles/navbar.css'
import Announcement from './nav/Announcement'
import MegaMenu from './nav/MegaMenu'
import MobileMenu from './nav/MobileMenu'
import { NavLogo } from './nav/Logos'
import { MENUS } from './nav/menuData'
import { useHasScrolled, useMediaQuery, useNavTheme } from './nav/hooks'
import { springEase } from '../lib/spring'

// Live trigger colour springs (re-measured): theme switch / menu open ~ stiffness 335, damping 26; menu close ~ 685 / 46.
const TRIG_OPEN = springEase({ stiffness: 335, damping: 26 })
const TRIG_CLOSE = springEase({ stiffness: 685, damping: 46 })
const NAV_VARS = {
  '--nv-trig-open': `${TRIG_OPEN.duration}s ${TRIG_OPEN.easing}`,
  '--nv-trig-close': `${TRIG_CLOSE.duration}s ${TRIG_CLOSE.easing}`,
}

// CLONE_SPEC §1. Fixed nav: announcement (48 D / 40 M, collapses on first scroll) + 60px bar (49 M) + 1px line.
// Variant follows the section under the top edge: [data-nav-theme="dark"] -> "White", else frosted "Desktop".
// hideLang: the site's Framer 404 page (/ashby) renders the bar without the language chip (verified live, desktop and mobile).
export default function Navbar({ hideLang = false }) {
  const isMobile = useMediaQuery('(max-width: 879.98px)')
  const scrolled = useHasScrolled()
  const theme = useNavTheme()
  const [menu, setMenu] = useState(null) // last hovered mega-menu key (kept while closing)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // `closing` flags the close-spring window after the mega-menu closes (trigger colours use the faster close
  // spring). Set in the same render as the close so the transition starts with the right curve.
  const [closing, setClosing] = useState(false)
  const open = (key) => { setMenu(key); setMenuOpen(true); setClosing(false) }
  const close = () => { if (menuOpen) setClosing(true); setMenuOpen(false) }
  const megaOpen = !isMobile && menuOpen
  useEffect(() => {
    if (!closing) return
    const id = setTimeout(() => setClosing(false), Math.ceil(TRIG_CLOSE.duration * 1000) + 50)
    return () => clearTimeout(id)
  }, [closing])

  return (
    <header
      className="nv"
      data-theme={theme}
      data-menu={megaOpen ? 'open' : 'closed'}
      data-menu-closing={closing ? 'true' : 'false'}
      style={NAV_VARS}
      data-mobile-open={isMobile && mobileOpen ? 'true' : 'false'}
      onMouseLeave={close}
    >
      <Announcement collapsed={scrolled} />

      {isMobile ? (
        <div className="nv-bar nv-bar--m">
          <a href="/" aria-label="Wonderful home" className="nv-logo nv-logo--m"><NavLogo className="block h-full w-full" /></a>
          {!hideLang && (
            <div className="nv-lang nv-lang--m" data-name="Lang slot">
              <button type="button" className="nv-chip nv-chip--m" aria-label="Language: English">EN</button>
            </div>
          )}
          <button
            type="button"
            className="nv-burger"
            data-name="Menu Icon"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className="nv-burger-bar nv-burger-bar--1" />
            <span className="nv-burger-bar nv-burger-bar--2" />
          </button>
        </div>
      ) : (
        <div className="nv-bar">
          <div className="nv-bar-inner">
            <div className="nv-left">
              <a href="/" aria-label="Wonderful home" className="nv-logo" onMouseEnter={close}><NavLogo className="block h-full w-full" /></a>
              <div className="nv-name" data-name="Name" />
              {MENUS.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  className="nv-trigger"
                  data-active={megaOpen && menu === m.key ? 'true' : 'false'}
                  aria-expanded={megaOpen && menu === m.key}
                  onMouseEnter={() => open(m.key)}
                  onFocus={() => open(m.key)}
                >
                  <span>{m.label}</span>
                  <span className="nv-chev-slot" aria-hidden="true" />
                </button>
              ))}
              <a href="/blog" className="nv-blog" onMouseEnter={close} onFocus={close}>Blog</a>
            </div>
            <div className="nv-right" onMouseEnter={close}>
              {!hideLang && (
                <div className="nv-lang" data-name="Lang slot">
                  <button type="button" className="nv-chip" aria-label="Language: English">EN</button>
                </div>
              )}
              <a href="/contact" className="nv-pill">Get in touch</a>
            </div>
          </div>
        </div>
      )}

      {!isMobile && <MegaMenu menu={menu} open={megaOpen} />}
      {isMobile && <MobileMenu open={mobileOpen} />}
      <div className="nv-line" />
    </header>
  )
}
