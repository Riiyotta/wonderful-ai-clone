import { useEffect, useState } from 'react'
import { SPRING_CARD_IMAGE, SPRING_CARD_HOVER, SPRING_CARD_UNHOVER } from './motion'

// Framer appear h4me46: the card image fades .001 -> 1 once on page load (also below the fold).
export function useAppear() {
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)))
    return () => cancelAnimationFrame(id)
  }, [])
  return shown
}

// Hover: the component container dims to .8 (spring ~ duration .4 / bounce .2); back to 1 on a softer spring.
export function HoverDim({ className = '', children }) {
  const [hover, setHover] = useState(false)
  return (
    <div
      className={className}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ opacity: hover ? 0.8 : 1, transition: `opacity ${hover ? SPRING_CARD_HOVER : SPRING_CARD_UNHOVER}` }}
    >
      {children}
    </div>
  )
}

export function CardImage({ src, width, height, className = 'cc-image', eager = false }) {
  const shown = useAppear()
  return (
    <div className={className} data-cx="card-image" style={{ opacity: shown ? 1 : 0.001, transition: `opacity ${SPRING_CARD_IMAGE}` }}>
      <div className="cx-bgimg">
        <img decoding="async" loading={eager ? undefined : 'lazy'} width={width} height={height} src={src} alt="" />
      </div>
    </div>
  )
}

// Framer "Card" (fr5mj, variant 9rut2n): image, title (h4 1ing3ma), date (14px Inter, #696969).
export function Card({ card }) {
  return (
    <div className="cc-card" data-cx="card">
      <CardImage src={card.image} width={card.imageW} height={card.imageH} />
      <div className="cc-text">
        <div className="cc-title cx-rtc">
          <h4 className="framer-text framer-styles-preset-1ing3ma" dir="auto">{card.title}</h4>
        </div>
        <div className="cc-date cx-rtc">
          <p dir="auto" className="framer-text" style={DATE_STYLE}>
            <time dateTime={card.datetime}>{card.date}</time>
          </p>
        </div>
      </div>
    </div>
  )
}

export const DATE_STYLE = {
  '--framer-font-open-type-features': "'blwf' on, 'cv09' on, 'cv03' on, 'cv04' on, 'cv11' on",
  '--framer-font-size': '14px',
  '--framer-letter-spacing': '-0.02em',
  '--framer-line-height': '1.6em',
  '--framer-text-color': 'var(--extracted-r6o4lv, rgb(105, 105, 105))',
}
