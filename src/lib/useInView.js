import { useEffect, useRef, useState } from 'react'

// Fires once when the element enters the viewport. `amount` is the visible fraction required (IO threshold):
// 0 = top edge crosses the viewport bottom (Framer "amount ~0"). Live word-reveal headings fire when ~25% of
// the heading box is visible (measured at 1440x900: 33px-tall H2 at top 891, 53px at 886.5, 104px at 873.9).
export function useInView({ once = true, rootMargin = '0px', amount = 0, immediate = false } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(immediate)
  useEffect(() => {
    if (immediate || !ref.current) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && e.intersectionRatio >= amount) { setInView(true); if (once) io.disconnect() }
      else if (!once) setInView(false)
    }, { rootMargin, threshold: amount })
    io.observe(ref.current)
    return () => io.disconnect()
  }, [once, rootMargin, amount, immediate])
  return [ref, inView]
}
