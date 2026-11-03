import { useLayoutEffect, useRef } from 'react'
import WordReveal from '../../../components/WordReveal'

// Framer's runtime shrinks this title (inline font-size + nowrap) when its widest word, plus a 10% margin, is wider
// than the column: live "Healthcare" (845px at 200px) -> 189/193/197/200px at columns 880/900/920/940.
// Same rule: size = floor(base * column / (word * 1.1)).
function useFitWord(wrapRef) {
  useLayoutEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const h1 = wrap.querySelector('h1')
    const fit = () => {
      h1.style.fontSize = ''
      const base = parseFloat(getComputedStyle(h1).fontSize)
      let widest = 0
      for (const w of h1.querySelectorAll('.wr-word')) widest = Math.max(widest, Math.ceil(w.getBoundingClientRect().width))
      const avail = wrap.clientWidth
      if (widest * 1.1 > avail) h1.style.fontSize = `${Math.min(base, Math.floor((base * avail) / (widest * 1.1)))}px`
    }
    fit()
    document.fonts.ready.then(fit)
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [wrapRef])
}

// Hero (Framer "Hero"): full-bleed photo (separate portrait crop < 880px), two gradients, 200px title + bordered intro.
// Motion (live, re-measured): H1 word and intro words start together on mount; heading spring (blur 6 / y 16) for the
// H1, paragraph spring (blur 10 / y 10) for the intro, 50ms per-word stagger.
export default function IndustryHero({ hero }) {
  const h1Wrap = useRef(null)
  useFitWord(h1Wrap)
  return (
    <section className="inx-hero" data-nav-theme="dark" data-framer-name="Hero">
      <div className="inx-cover">
        <picture>
          <source media="(max-width: 879.98px)" srcSet={hero.imgMobile} />
          <img src={hero.img} alt={hero.alt} decoding="async" />
        </picture>
      </div>
      <div className="inx-hero-top" />
      <div className="inx-hero-overlay">
        <div className="inx-hero-inner">
          <div className="inx-hero-titlecol">
            <div className="inx-hero-h1wrap" ref={h1Wrap}>
              <WordReveal as="h1" text={hero.h1} variant="heading" onMount className="inx-hero-h1" />
            </div>
          </div>
          <div className="inx-hero-subwrap">
            <div className="inx-hero-subbd inx-bd">
              <div className="inx-hero-subtext">
                <WordReveal as="h4" text={hero.sub} variant="paragraph" onMount className="inx-h4 inx-hero-sub" />
                <WordReveal as="p" text={hero.sub} variant="paragraph" onMount className="inx-hero-subm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
