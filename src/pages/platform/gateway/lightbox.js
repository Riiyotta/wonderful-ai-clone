// Video lightbox, ported from the live site's shared "Play video" code component
// (framerusercontent toplevel-deps module, function Sa). Fixed backdrop (rgba(0,0,0,.4) + blur 10) and a
// 16:9 dialog (min(90vw, 1100) wide, <= 90vh), with Minimize (to a 320x180 corner player) / Expand / Close.
const ICONS = {
  close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>',
  minimize: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L9 15"/><path d="M9 9v6h6"/></svg>',
  expand: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 15L18 6"/><path d="M18 12V6h-6"/></svg>',
  closeSmall: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>',
}
const KEY = '__wonderfulVideoLightbox'
const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

export function openVideoLightbox(src) {
  const w = window
  if (w[KEY]) w[KEY].destroy()
  const d = document
  let mode = 'open'
  const prevOverflow = d.body.style.overflow
  const backdrop = d.createElement('div')
  Object.assign(backdrop.style, {
    position: 'fixed', inset: '0', zIndex: '9998', background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', opacity: '0', transition: 'opacity 0.25s ease', cursor: 'pointer',
  })
  const dialog = d.createElement('div')
  Object.assign(dialog.style, {
    position: 'fixed', zIndex: '9999', background: '#000', borderRadius: '12px', overflow: 'hidden',
    boxShadow: '0px 30px 60px 0px rgba(0, 0, 0, 0.25)', opacity: '0', transform: 'scale(0.96)',
  })
  dialog.setAttribute('role', 'dialog')
  dialog.setAttribute('aria-modal', 'true')
  const video = d.createElement('video')
  video.src = src
  video.autoplay = true
  video.controls = true
  video.playsInline = true
  Object.assign(video.style, { width: '100%', height: '100%', objectFit: 'contain', display: 'block', background: '#000' })
  const bar = d.createElement('div')
  Object.assign(bar.style, { position: 'absolute', display: 'flex', gap: '10px', zIndex: '2' })

  function button(svg, label, size, fn) {
    const b = d.createElement('button')
    b.type = 'button'
    b.setAttribute('aria-label', label)
    b.innerHTML = svg
    Object.assign(b.style, {
      width: size + 'px', height: size + 'px', borderRadius: '100px', border: 'none', background: 'rgba(0, 0, 0, 0.59)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: '0',
    })
    b.addEventListener('click', (e) => { e.stopPropagation(); fn() })
    return b
  }
  function renderBar() {
    bar.innerHTML = ''
    if (mode === 'open') {
      Object.assign(bar.style, { top: '15px', right: '15px', gap: '10px' })
      bar.appendChild(button(ICONS.minimize, 'Minimize video', 44, minimize))
      bar.appendChild(button(ICONS.close, 'Close video', 44, close))
    } else {
      Object.assign(bar.style, { top: '8px', right: '8px', gap: '6px' })
      bar.appendChild(button(ICONS.expand, 'Expand video', 30, expand))
      bar.appendChild(button(ICONS.closeSmall, 'Close video', 30, close))
    }
  }
  function openRect() {
    const vw = w.innerWidth, vh = w.innerHeight
    let width = Math.min(vw * 0.9, 1100), height = (width * 9) / 16
    if (height > vh * 0.9) { height = vh * 0.9; width = (height * 16) / 9 }
    return { left: (vw - width) / 2, top: (vh - height) / 2, width, height }
  }
  const miniRect = () => ({ left: 20, top: w.innerHeight - 180 - 20, width: 320, height: 180 })
  function place(r) {
    dialog.style.left = r.left + 'px'
    dialog.style.top = r.top + 'px'
    dialog.style.width = r.width + 'px'
    dialog.style.height = r.height + 'px'
  }
  const onKey = (e) => { if (e.key === 'Escape' && mode === 'open') close() }
  const onResize = () => place(mode === 'open' ? openRect() : miniRect())
  const sizeTransition = `left 0.35s ${EASE}, top 0.35s ${EASE}, width 0.35s ${EASE}, height 0.35s ${EASE}, box-shadow 0.35s ${EASE}`
  function minimize() {
    mode = 'mini'
    d.body.style.overflow = prevOverflow
    backdrop.style.opacity = '0'
    w.setTimeout(() => { backdrop.parentNode && backdrop.parentNode.removeChild(backdrop) }, 260)
    dialog.style.transition = sizeTransition
    dialog.style.boxShadow = '0px 10px 30px 0px rgba(0, 0, 0, 0.3)'
    place(miniRect())
    renderBar()
  }
  function expand() {
    mode = 'open'
    d.body.style.overflow = 'hidden'
    backdrop.style.opacity = '0'
    d.body.appendChild(backdrop)
    requestAnimationFrame(() => { backdrop.style.opacity = '1' })
    dialog.style.transition = sizeTransition
    dialog.style.boxShadow = '0px 30px 60px 0px rgba(0, 0, 0, 0.25)'
    place(openRect())
    renderBar()
  }
  function close() {
    d.body.style.overflow = prevOverflow
    w.removeEventListener('keydown', onKey)
    w.removeEventListener('resize', onResize)
    backdrop.style.opacity = '0'
    dialog.style.transition = 'opacity 0.2s ease, transform 0.2s ease'
    dialog.style.opacity = '0'
    dialog.style.transform = 'scale(0.96)'
    w.setTimeout(() => {
      backdrop.parentNode && backdrop.parentNode.removeChild(backdrop)
      dialog.parentNode && dialog.parentNode.removeChild(dialog)
    }, 220)
    delete w[KEY]
  }
  backdrop.addEventListener('click', close)
  w.addEventListener('keydown', onKey)
  w.addEventListener('resize', onResize)
  dialog.appendChild(video)
  dialog.appendChild(bar)
  renderBar()
  place(openRect())
  d.body.appendChild(backdrop)
  d.body.appendChild(dialog)
  d.body.style.overflow = 'hidden'
  requestAnimationFrame(() => {
    backdrop.style.opacity = '1'
    dialog.style.transition = `opacity 0.25s ${EASE}, transform 0.25s ${EASE}`
    dialog.style.opacity = '1'
    dialog.style.transform = 'scale(1)'
    w.setTimeout(() => { dialog.style.transform = ''; dialog.style.transition = '' }, 300)
  })
  w[KEY] = { destroy: close }
}
