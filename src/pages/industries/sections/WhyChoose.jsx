import { useLayoutEffect, useRef, useState } from 'react'

// Live hover (>= 1400 only): row bg -> #f5f5f5, divider -> rgba(0,0,0,.1), image fades in, and an "—" (42px) appears
// before the title while the frame gap goes 8 -> 16; the title slides to its new spot (Framer layout animation).
// All on one curve: measured progress .216@50 .424@100 .596@150 .737@200 .85@250 .933@300 .98@350ms, same on leave
// -> cubic-bezier(.1,0,.4,1) over 420ms (least-squares fit).
const EASE = 'cubic-bezier(.1, 0, .4, 1)'
const DUR = 420

function Row({ row }) {
  const [hover, setHover] = useState(false)
  const titleRef = useRef(null)
  const prevX = useRef(null)
  const anim = useRef(null)

  const change = (h) => {
    if (titleRef.current) prevX.current = titleRef.current.getBoundingClientRect().left
    setHover(h)
  }

  useLayoutEffect(() => {
    const el = titleRef.current
    if (!el || prevX.current == null) return
    if (anim.current) anim.current.cancel()
    const dx = prevX.current - el.getBoundingClientRect().left
    prevX.current = null
    if (Math.abs(dx) < 0.5) return
    anim.current = el.animate([{ transform: `translateX(${dx}px)` }, { transform: 'none' }], { duration: DUR, easing: EASE })
  }, [hover])

  return (
    <div className="inx-row" data-hover={hover} onMouseEnter={() => change(true)} onMouseLeave={() => change(false)}>
      <div className="inx-row-line" />
      <div className="inx-row-body">
        <div className="inx-row-main">
          <div className="inx-row-tframe">
            <div className="inx-row-dash"><h3>—</h3></div>
            <div className="inx-row-title" ref={titleRef}>
              <h3 className="inx-h3">{row.title}</h3>
            </div>
          </div>
          <div className="inx-row-side">
            <div className="inx-row-img">
              <div className="inx-cover">
                <img src={row.img} alt="" decoding="auto" loading="lazy" />
              </div>
            </div>
            <div className="inx-row-desc">
              <p className="inx-p17">{row.desc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function WhyChoose({ data }) {
  return (
    <section className="inx-why inx-bd" data-framer-name="Why Choose" id="why">
      <div className="inx-why-head">
        <div><h2 className="inx-h2s inx-why-title">{data.title}</h2></div>
        <div><h2 className="inx-h2s inx-why-intro">{data.intro}</h2></div>
      </div>
      <div className="inx-why-rows">
        {data.rows.map((r) => <Row key={r.title} row={r} />)}
      </div>
    </section>
  )
}
