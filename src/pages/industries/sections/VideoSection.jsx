import { useEffect, useRef } from 'react'
import { useMediaQuery } from '../../../components/nav/hooks'
import Counter from './Counter'
import VideoLightbox from './VideoLightbox'

// Utilities only: "Video Section" (PPC Energie story). Background loop is 16:9 at >= 1400 and the 9:16 cut below,
// masked top/bottom; "Watch now" opens the full film in the lightbox; three count-up metrics.
export default function VideoSection({ data }) {
  const wide = useMediaQuery('(min-width: 1400px)')
  const src = wide ? data.bg : data.bgPortrait
  const vref = useRef(null)
  useEffect(() => {
    const v = vref.current
    if (!v) return
    v.muted = true
    const p = v.play()
    if (p && p.catch) p.catch(() => {})
  }, [src])
  return (
    <section className="inx-vid" data-nav-theme="dark" data-framer-name="Video Section">
      <div className="inx-vid-bg">
        <div className="inx-cover">
          <video key={src} ref={vref} src={src} autoPlay muted loop playsInline preload="auto" />
        </div>
      </div>
      <div className="inx-vid-head">
        <div className="inx-vid-title"><h2 className="inx-h2s">{data.title}</h2></div>
        <div className="inx-vid-btn">
          <p>Watch now</p>
          <VideoLightbox src={data.full} />
        </div>
      </div>
      <div className="inx-vid-dm inx-bd">
        <div className="inx-vid-row">
          <div className="inx-vid-desc">
            <div>
              <p className="inx-vid-desc-d">{data.desc}</p>
              <p className="inx-p17 inx-vid-desc-m">{data.desc}</p>
            </div>
          </div>
          <div className="inx-vid-metrics">
            {data.metrics.map((m) => (
              <div key={m.label} className="inx-vid-metric inx-bd">
                <div className="inx-vid-counterbox"><Counter value={m.value} suffix={m.suffix} /></div>
                <p className="inx-p17b inx-vid-label">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
