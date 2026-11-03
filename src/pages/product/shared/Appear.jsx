import { useEffect, useState } from 'react'
import { springEase, TWEEN_FADE } from '../../../lib/spring'
import { useInView } from '../../../lib/useInView'

// Framer "appear" effects used on the product pages (from #__framer__appearAnimationsContent):
//  - text:   opacity .001 -> 1, spring stiffness 200 / damping 60 / mass 1, delay .1 (H1) or .5 (CTA H2)
//  - button: opacity .001 -> 1, tween .6s cubic-bezier(.44,0,.56,1), delay .5
export const SPRING_200_60 = springEase({ stiffness: 200, damping: 60 })

export function useMounted() {
  const [m, setM] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setM(true)))
    return () => cancelAnimationFrame(id)
  }, [])
  return m
}

// `on`: 'mount' (above the fold, runs on load) or 'view' (runs once when it scrolls into view).
export default function Appear({ as: Tag = 'div', on = 'mount', kind = 'spring', delay = 0.1, className, style, children, ...rest }) {
  const mounted = useMounted()
  const [ref, inView] = useInView({ amount: 0 })
  const shown = on === 'mount' ? mounted : inView
  const transition = kind === 'spring'
    ? `opacity ${SPRING_200_60.duration}s ${SPRING_200_60.easing} ${delay}s`
    : `opacity .6s ${TWEEN_FADE} ${delay}s`
  return (
    <Tag ref={ref} className={className} style={{ opacity: shown ? 1 : 0.001, transition, ...style }} {...rest}>
      {children}
    </Tag>
  )
}
