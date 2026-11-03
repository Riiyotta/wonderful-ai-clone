import { useEffect, useRef, useState } from 'react'
import { Card, HoverDim } from './Card'
import '../../styles/content/base.css'
import '../../styles/content/article.css'

// One JSON per article, extracted from the SSR HTML by _extract/extract.cjs; loaded on demand.
const ARTICLES = import.meta.glob('./data/articles/*.json', { import: 'default' })

export function useArticle(slug) {
  const [data, setData] = useState(null)
  useEffect(() => {
    let live = true
    const load = ARTICLES[`./data/articles/${slug}.json`]
    if (load) load().then((d) => live && setData(d))
    return () => { live = false }
  }, [slug])
  return data
}

// Inline vars Framer puts on the header text (per breakpoint variant).
const V = {
  authorDT: { '--framer-text-alignment': 'center', '--framer-text-color': 'var(--token-22a8b8b5-6892-4091-bd4d-0ca7f9df2ec2, rgba(31, 31, 31, 0.8))' },
  authorM: { '--framer-text-alignment': 'left', '--framer-text-color': 'var(--token-759f7430-f948-43b1-854c-8b88940134e1)' },
  sepDT: { '--framer-text-alignment': 'center', '--framer-text-color': 'rgba(0, 0, 0, 0.1)' },
  sepM: { '--framer-text-alignment': 'left', '--framer-text-color': 'rgba(0, 0, 0, 0.1)' },
  dateDT: { '--framer-text-alignment': 'center', '--framer-text-color': 'var(--token-cf8752dc-0729-482a-9cd3-23bcb89694dc, rgba(49, 49, 49, 0.4))' },
  dateM: { '--framer-text-alignment': 'left', '--framer-text-color': 'var(--token-cf8752dc-0729-482a-9cd3-23bcb89694dc, rgba(49, 49, 49, 0.4))' },
  title: { '--framer-text-alignment': 'center', '--framer-text-color': 'var(--token-a8e7404c-6b78-46b2-a6de-2abafc63f26f, rgb(0, 0, 0))' },
  desc: { '--framer-text-alignment': 'center', '--framer-text-color': 'var(--token-22a8b8b5-6892-4091-bd4d-0ca7f9df2ec2, rgba(31, 31, 31, 0.8))' },
}

function Meta({ a }) {
  return (
    <div className="ca-meta" data-cx="meta">
      <div className="cx-v cx-hide-m"><div className="ca-meta-item cx-rtc"><p className="framer-text framer-styles-preset-1bkfxbx" dir="auto" style={V.authorDT} data-cx="author">{a.author}</p></div></div>
      <div className="cx-v cx-hide-t cx-hide-d"><div className="ca-meta-item cx-rtc"><p className="framer-text framer-styles-preset-1bkfxbx" dir="auto" style={V.authorM} data-cx="author-m">{a.author}</p></div></div>
      <div className="cx-v cx-hide-m"><div className="ca-meta-item cx-rtc"><p className="framer-text framer-styles-preset-1ln1alt" dir="auto" style={V.sepDT} data-cx="sep">|</p></div></div>
      <div className="cx-v cx-hide-t cx-hide-d"><div className="ca-meta-item cx-rtc" style={{ transform: 'rotate(90deg)' }}><p className="framer-text framer-styles-preset-1ln1alt" dir="auto" style={V.sepM} data-cx="sep-m">|</p></div></div>
      <div className="cx-v cx-hide-m"><div className="ca-meta-item cx-rtc"><p className="framer-text framer-styles-preset-1bkfxbx" dir="auto" style={V.dateDT} data-cx="date"><time dateTime={a.datetime}>{a.date}</time></p></div></div>
      <div className="cx-v cx-hide-t cx-hide-d"><div className="ca-meta-item cx-rtc"><p className="framer-text framer-styles-preset-1bkfxbx" dir="auto" style={V.dateM} data-cx="date-m"><time dateTime={a.datetime}>{a.date}</time></p></div></div>
    </div>
  )
}

function HeroVideo({ v }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.muted = v.muted
    if (v.autoplay) el.play().catch(() => {})
  }, [v])
  return (
    <div className="ca-banner-video" data-cx="banner-video">
      {/* Live hydrates the SSR preload="metadata" to "auto". */}
      <video ref={ref} src={v.src} poster={v.poster} loop={v.loop} autoPlay={v.autoplay} muted={v.muted} controls={v.controls} preload="auto" playsInline />
    </div>
  )
}

function Banner({ hero }) {
  if (!hero) return null
  return (
    <div className="ca-banner" data-cx="banner">
      {hero.image && (
        <div className="cx-bgimg">
          <img decoding="async" width={hero.image.width} height={hero.image.height} src={hero.image.src} alt={hero.image.alt} />
        </div>
      )}
      {hero.video && <HeroVideo v={hero.video} />}
    </div>
  )
}

const SIDE_LABEL = { '--framer-text-alignment': 'start', '--framer-text-color': 'var(--token-22a8b8b5-6892-4091-bd4d-0ca7f9df2ec2)' }
const SIDE_VALUE = { '--framer-text-alignment': 'start', '--framer-text-color': 'var(--token-a8e7404c-6b78-46b2-a6de-2abafc63f26f)' }

function Sidebar({ s }) {
  return (
    <div className="ca-side cx-border" data-cx="side">
      <div className="ca-side-text cx-rtc">
        <p className="framer-text framer-styles-preset-1b18csx" dir="auto" style={{ '--framer-text-alignment': 'start', '--framer-text-color': 'var(--token-3ac1333f-ede6-4ae6-bc1c-88560a943b79, rgb(107, 107, 107))' }}>{s.heading}</p>
      </div>
      <div className="ca-side-details">
        {s.details.map((d) => (
          <div className="ca-side-detail" key={d.name}>
            <div className="ca-side-text cx-rtc"><p className="framer-text framer-styles-preset-1bkfxbx" dir="auto" style={SIDE_LABEL}>{d.label}</p></div>
            <div className="ca-side-text cx-rtc"><p className="framer-text framer-styles-preset-1ln1alt" dir="auto" style={SIDE_VALUE}>{d.value}</p></div>
          </div>
        ))}
      </div>
      {s.metrics.length > 0 && (
        <div className="ca-side-metrics cx-border">
          {s.metrics.map((m, i) => (
            <div className="ca-side-metric" key={i}>
              <div className="ca-side-text cx-rtc"><p className="framer-text framer-styles-preset-7plcua" dir="auto" style={SIDE_VALUE}>{m.value}</p></div>
              <div className="ca-side-text cx-rtc"><p className="framer-text framer-styles-preset-x0s9r5" dir="auto" style={SIDE_LABEL}>{m.label}</p></div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Desktop lists 3 related posts, tablet/mobile 4 (separate Framer variants; the first 3 are identical).
function RelatedGrid({ desktop, tm }) {
  const cards = tm && tm.length >= desktop.length ? tm : desktop
  return (
    <div className="ca-grid" data-cx="grid">
      {cards.map((c, i) => (
        <a key={c.href} className={`ca-card-link${i >= desktop.length ? ' cx-hide-d' : ''}`} href={c.href} data-cx="related">
          <HoverDim className="ca-card-wrap"><Card card={c} /></HoverDim>
        </a>
      ))}
    </div>
  )
}

// Rich-text video modules: SSR ships preload="none" without autoplay; live's Video component hydrates them to
// autoplay / muted / loop / preload="auto".
function useBodyVideos(ref, html) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.querySelectorAll('.framer-text-module video').forEach((v) => {
      v.muted = true
      v.autoplay = true
      v.preload = 'auto'
      v.play().catch(() => {})
    })
  }, [ref, html])
}

export default function Article({ slug }) {
  const a = useArticle(slug)
  const bodyRef = useRef(null)
  useBodyVideos(bodyRef, a && a.bodyHtml)
  if (!a) return <div className="cx-rt" style={{ minHeight: '100vh' }} />
  return (
    <div className="cx-rt w-full" data-cx="article">
      <div className="ca-root" data-cx="root">
        <div className="ca-head" data-cx="head">
          <Meta a={a} />
          <div className="ca-titles">
            <div className="ca-title cx-rtc">
              <h1 className="framer-text framer-styles-preset-190xti5" dir="auto" style={V.title} data-cx="title">{a.title}</h1>
            </div>
            <div className="ca-desc cx-rtc">
              <p className="framer-text framer-styles-preset-1ln1alt" dir="auto" style={V.desc} data-cx="desc">{a.description}</p>
            </div>
          </div>
        </div>
        <Banner hero={a.hero} />
        <div className="ca-row" data-cx="row">
          <div ref={bodyRef} className="ca-body cx-rtc" data-cx="body" dangerouslySetInnerHTML={{ __html: a.bodyHtml }} />
          {a.sidebar && <Sidebar s={a.sidebar} />}
        </div>
        <div className="ca-divider" data-cx="divider" />
        <div className="ca-more" data-cx="more">
          <div className="ca-more-title">
            <div className="cx-v cx-hide-m">
              <div className="ca-more-title-text cx-rtc"><h3 className="framer-text framer-styles-preset-pyuk04" dir="auto" style={{ '--framer-text-color': 'rgb(0, 0, 0)' }} data-cx="more-title">More Posts</h3></div>
            </div>
            <div className="cx-v cx-hide-t cx-hide-d">
              <div className="ca-more-title-text cx-rtc"><h4 className="framer-text framer-styles-preset-1ing3ma" dir="auto" style={{ '--framer-text-color': 'rgb(0, 0, 0)' }} data-cx="more-title-m">More Posts</h4></div>
            </div>
          </div>
          <RelatedGrid desktop={a.related} tm={a.relatedTM} />
        </div>
      </div>
    </div>
  )
}
