import { useSearchParams } from 'react-router-dom'
import BLOG from './data/blog.json'
import { CardImage, HoverDim, useAppear, DATE_STYLE } from './Card'
import { SPRING_BLOG_CONTENT } from './motion'
import '../../styles/content/base.css'
import '../../styles/content/article.css'
import '../../styles/content/blog.css'

// Filter tabs write ?blog-category=<slug> (live behaviour); "All" clears it. Switching is instant on live.
const catSlug = (name) => name.toLowerCase().replace(/\s+/g, '-')
const MUTED = { '--framer-text-color': 'var(--token-3ac1333f-ede6-4ae6-bc1c-88560a943b79, rgb(107, 107, 107))' }

function Featured({ f }) {
  const desc = { '--framer-text-color': 'var(--extracted-r6o4lv, var(--token-3ac1333f-ede6-4ae6-bc1c-88560a943b79, rgb(107, 107, 107)))' }
  const variant = (cls, TitleTag, titlePreset, descPreset, hide) => (
    <div className={`cx-v ${hide}`}>
      <HoverDim className="cb-feat-wrap">
        <div className={`cc-card ${cls}`} data-cx={`feat-card-${cls}`}>
          <CardImage src={f.image} width={f.imageW} height={f.imageH} eager />
          <div className="cc-text">
            <div className="cc-title cx-rtc"><TitleTag className={`framer-text ${titlePreset}`} dir="auto" data-cx={`feat-title-${cls}`}>{f.title}</TitleTag></div>
            <div className="cc-date cx-rtc"><p dir="auto" className="framer-text" style={DATE_STYLE} data-cx={`feat-date-${cls}`}><time dateTime={f.datetime}>{f.date}</time></p></div>
            <div className="cc-desc cx-rtc"><p className={`framer-text ${descPreset}`} dir="auto" style={desc} data-cx={`feat-desc-${cls}`}>{f.description}</p></div>
          </div>
        </div>
      </HoverDim>
    </div>
  )
  return (
    <div className="cb-feat-grid">
      <a className="cb-feat-link" href={f.href} data-cx="feat">
        {variant('v-feat', 'h3', 'framer-styles-preset-pyuk04', 'framer-styles-preset-1ln1alt', 'cx-hide-t cx-hide-m')}
        {variant('v-phone', 'h4', 'framer-styles-preset-1ing3ma', 'framer-styles-preset-x0s9r5', 'cx-hide-d')}
      </a>
    </div>
  )
}

function Tabs({ tabs, active, onPick }) {
  return (
    <div className="cb-tabs">
      <div className="cb-tabs-row" data-cx="tabs">
        {tabs.map((t) => (
          <div className="cb-tab-wrap" key={t}>
            <div
              role="button"
              tabIndex={0}
              className={`cb-tab${t === active ? ' is-active' : ''}`}
              data-cx={`tab-${catSlug(t)}`}
              onClick={() => onPick(t)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(t) } }}
            >
              <div className="cb-tab-title cx-rtc">
                <p className="framer-text framer-styles-preset-x0s9r5" dir="auto" style={{ '--framer-text-alignment': 'start', '--framer-text-color': 'var(--extracted-r6o4lv)' }}>{t}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PostCard({ p }) {
  return (
    <a className="cb-card" href={p.href} data-cx="post">
      <div className="cb-card-img" data-cx="post-img">
        <div className="cx-bgimg"><img decoding="async" loading="lazy" width={p.imageW} height={p.imageH} src={p.image} alt="" /></div>
      </div>
      <div className="cb-card-text">
        <div className="cb-card-title cx-rtc">
          <h4 className="framer-text framer-styles-preset-1ing3ma" dir="auto" style={{ '--framer-text-color': 'var(--token-a8e7404c-6b78-46b2-a6de-2abafc63f26f, rgb(0, 0, 0))' }} data-cx="post-title">{p.title}</h4>
        </div>
        <div className="cb-card-date cx-rtc">
          <p className="framer-text framer-styles-preset-x0s9r5" dir="auto" style={{ '--framer-text-color': 'var(--token-cf8752dc-0729-482a-9cd3-23bcb89694dc, rgba(49, 49, 49, 0.4))' }} data-cx="post-date">
            <time dateTime={p.datetime}>{p.date}</time>
          </p>
        </div>
      </div>
    </a>
  )
}

export default function Blog() {
  const [params, setParams] = useSearchParams()
  const q = params.get('blog-category')
  const active = BLOG.tabs.find((t) => t !== 'All' && catSlug(t) === q) || 'All'
  const posts = active === 'All' ? BLOG.posts : BLOG.posts.filter((p) => p.category === active)
  const pick = (t) => setParams(t === 'All' ? {} : { 'blog-category': catSlug(t) }, { preventScrollReset: true })
  // Framer appear b89lqw: whole content block opacity .001 -> 1, y 50 -> 0 (spring .5s / bounce 0, delay .2s).
  const shown = useAppear()

  return (
    <div className="cx-rt cb-page" data-cx="blog">
      <div
        className="cb-content"
        data-cx="content"
        style={{
          opacity: shown ? 1 : 0.001,
          transform: shown ? 'none' : 'translateY(50px)',
          transition: `opacity ${SPRING_BLOG_CONTENT} .2s, transform ${SPRING_BLOG_CONTENT} .2s`,
        }}
      >
        <div className="cb-all cx-border" data-cx="all">
          <Featured f={BLOG.featured} />
          <div className="cb-head" data-cx="head">
            <div className="cb-head-text">
              <div className="cb-h1 cx-rtc">
                <h1 className="framer-text framer-styles-preset-pyuk04" dir="auto" style={{ '--framer-text-alignment': 'start' }} data-cx="h1">{BLOG.heading}</h1>
              </div>
              <div className="cx-v cx-hide-m">
                <div className="cb-sub cx-rtc"><p className="framer-text framer-styles-preset-1ln1alt" dir="auto" style={MUTED} data-cx="sub">{BLOG.subheading}</p></div>
              </div>
              <div className="cx-v cx-hide-t cx-hide-d">
                <div className="cb-sub cx-rtc"><p className="framer-text framer-styles-preset-x0s9r5" dir="auto" style={MUTED} data-cx="sub-m">{BLOG.subheading}</p></div>
              </div>
            </div>
            <div className="cb-divider" data-cx="divider" />
            <Tabs tabs={BLOG.tabs} active={active} onPick={pick} />
          </div>
          <div className="cb-grid" data-cx="grid">
            {posts.map((p) => <PostCard key={p.slug} p={p} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
