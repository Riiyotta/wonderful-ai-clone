import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// Live "Video Lightbox" code component (measured): click -> blurred overlay (rgba(0,0,0,.4), blur 10, opacity .25s)
// and a 16:9 dialog centred at min(1100, 90vw, 90vh*16/9) wide; dialog fades/scales .96 -> 1 over .25s
// cubic-bezier(.22,1,.36,1). Minimize docks it 320x180 at 20px from the bottom-left (overlay fades out, page scrolls);
// expand / close buttons; body scroll locked while expanded.
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

function frame(min) {
  const vw = window.innerWidth, vh = window.innerHeight
  if (min) return { left: 20, top: vh - 180 - 20, width: 320, height: 180 }
  const w = Math.min(1100, vw * 0.9, (vh * 0.9 * 16) / 9)
  const h = (w * 9) / 16
  return { left: (vw - w) / 2, top: (vh - h) / 2, width: w, height: h }
}

const MinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L9 15" /><path d="M9 9v6h6" /></svg>
)
const ExpandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 15L18 6" /><path d="M18 12V6h-6" /></svg>
)
const CloseIcon = ({ s }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"><path d="M5 5l14 14M19 5L5 19" /></svg>
)

function Dialog({ src, onClose }) {
  const [min, setMin] = useState(false)
  const [shown, setShown] = useState(false)
  const [closing, setClosing] = useState(false)
  const [, force] = useState(0)
  const moved = useRef(false)

  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [])
  useEffect(() => {
    const onResize = () => force((x) => x + 1)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  useEffect(() => {
    if (min) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [min])
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const close = () => { setClosing(true); setTimeout(onClose, 250) }
  const toggle = () => { moved.current = true; setMin((m) => !m) }
  const f = frame(min)
  const visible = shown && !closing
  const style = {
    ...f,
    opacity: visible ? 1 : 0,
    boxShadow: min ? 'rgba(0,0,0,.3) 0 10px 30px 0' : 'rgba(0,0,0,.25) 0 30px 60px 0',
    transform: moved.current ? undefined : visible ? 'scale(1)' : 'scale(0.96)',
    transition: moved.current
      ? ['left', 'top', 'width', 'height', 'box-shadow'].map((p) => `${p} .35s ${EASE}`).join(', ') + `, opacity .25s ${EASE}`
      : `opacity .25s ${EASE}, transform .25s ${EASE}`,
  }
  const btn = min ? 30 : 44
  return (
    <>
      <div className="inx-lb-overlay" style={{ opacity: visible && !min ? 1 : 0, pointerEvents: min ? 'none' : 'auto' }} onClick={close} />
      <div className="inx-lb" role="dialog" aria-modal="true" style={style}>
        <video src={src} autoPlay controls playsInline />
        <div className="inx-lb-ctrls" style={min ? { gap: 6, top: 8, right: 8 } : { gap: 10, top: 15, right: 15 }}>
          <button type="button" aria-label={min ? 'Expand video' : 'Minimize video'} onClick={toggle} style={{ width: btn, height: btn }}>
            {min ? <ExpandIcon /> : <MinIcon />}
          </button>
          <button type="button" aria-label="Close video" onClick={close} style={{ width: btn, height: btn }}>
            <CloseIcon s={min ? 14 : 20} />
          </button>
        </div>
      </div>
    </>
  )
}

export default function VideoLightbox({ src }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <div
        className="inx-vid-lb"
        role="button"
        aria-label="Play video"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true) } }}
      />
      {open && createPortal(<Dialog src={src} onClose={() => setOpen(false)} />, document.body)}
    </>
  )
}
