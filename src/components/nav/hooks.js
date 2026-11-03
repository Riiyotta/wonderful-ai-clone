import { useEffect, useState } from 'react'

export function useMediaQuery(query) {
  const get = () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false)
  const [matches, setMatches] = useState(get)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatches(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return matches
}

// True once the page has been scrolled at all (banner "Open" -> "Close"; never reopens, §1).
export function useHasScrolled() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    if (scrolled) return
    const on = () => { if (window.scrollY > 0) setScrolled(true) }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [scrolled])
  return scrolled
}

// 'dark' while any [data-nav-theme="dark"] element spans the top edge of the viewport
// (measured: hero 0-900 dark, light from scrollY 900, dark band from 2941, ...).
export function useNavTheme() {
  const [theme, setTheme] = useState('dark')
  useEffect(() => {
    let raf = 0
    const check = () => {
      raf = 0
      let dark = false
      for (const el of document.querySelectorAll('[data-nav-theme="dark"]')) {
        const r = el.getBoundingClientRect()
        if (r.height > 0 && r.top <= 0 && r.bottom > 0) { dark = true; break }
      }
      setTheme(dark ? 'dark' : 'light')
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(check) }
    check()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  return theme
}
