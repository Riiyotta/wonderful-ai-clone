import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import LANDMASK from '../data/globeLandmask'

// Port of the live "Locations Globe" Framer code component (careers page): a canvas particle globe
// (fibonacci-sphere land dots from a 360x180 land mask + drifting "dust"), auto-rotating between city stops
// with DOM labels. Math, constants and behaviour are transcribed from the live module; the only change is
// startMode "nearest": live geolocates via ipapi.co (falling back to the browser timezone) - the clone uses
// the timezone fallback only, so no third-party request is made.
const W = 360, H = 180, DEG = Math.PI / 180

const TZ = {
  'America/New_York': [40.7128, -74.006], 'America/Chicago': [41.8781, -87.6298], 'America/Denver': [39.7392, -104.9903],
  'America/Los_Angeles': [34.0522, -118.2437], 'America/Sao_Paulo': [-23.5505, -46.6333], 'America/Mexico_City': [19.4326, -99.1332],
  'America/Bogota': [4.711, -74.0721], 'Europe/London': [51.5072, -0.1276], 'Europe/Paris': [48.8566, 2.3522], 'Europe/Berlin': [52.52, 13.405],
  'Europe/Athens': [37.9838, 23.7275], 'Europe/Istanbul': [41.0082, 28.9784], 'Europe/Madrid': [40.4168, -3.7038], 'Europe/Warsaw': [52.2297, 21.0122],
  'Europe/Stockholm': [59.3293, 18.0686], 'Europe/Zurich': [47.3769, 8.5417], 'Asia/Jerusalem': [31.7683, 35.2137], 'Asia/Dubai': [25.2048, 55.2708],
  'Asia/Kolkata': [19.076, 72.8777], 'Asia/Bangkok': [13.7563, 100.5018], 'Asia/Singapore': [1.3521, 103.8198], 'Asia/Jakarta': [-6.2088, 106.8456],
  'Asia/Hong_Kong': [22.3193, 114.1694], 'Asia/Seoul': [37.5665, 126.978], 'Asia/Tokyo': [35.6762, 139.6503], 'Australia/Sydney': [-33.8688, 151.2093],
  'Africa/Johannesburg': [-26.2041, 28.0473],
}

export const LOCATIONS = [
  ['Tel Aviv', 'Israel', 32.0853, 34.7818], ['Istanbul', 'Turkey', 41.0082, 28.9784], ['Athens', 'Greece', 37.9838, 23.7275],
  ['Bucharest', 'Romania', 44.4268, 26.1025], ['Riga', 'Baltics', 56.9496, 24.1052], ['Warsaw', 'Poland', 52.2297, 21.0122],
  ['Stockholm', 'Nordics', 59.3293, 18.0686], ['Vienna', 'Austria', 48.2082, 16.3738], ['Zagreb', 'Adriatics', 45.815, 15.9819],
  ['Prague', 'CZ / SK', 50.0755, 14.4378], ['Munich', 'Germany', 48.1351, 11.582], ['Milan', 'Italy', 45.4642, 9.19],
  ['Zurich', 'Switzerland', 47.3769, 8.5417], ['Amsterdam', 'Netherlands', 52.3676, 4.9041], ['Brussels', 'Belux', 50.8503, 4.3517],
  ['Paris', 'France', 48.8566, 2.3522], ['Madrid', 'Iberia', 40.4168, -3.7038], ['São Paulo', 'Brazil', -23.5505, -46.6333],
  ['Buenos Aires', 'S. Latam', -34.6037, -58.3816], ['Bogotá', 'Andean', 4.711, -74.0721], ['Mexico City', 'Mexico', 19.4326, -99.1332],
  ['Sydney', 'ANZ', -33.8688, 151.2093], ['Tokyo', 'Japan', 35.6762, 139.6503], ['Seoul', 'South Korea', 37.5665, 126.978],
  ['Hong Kong', 'Hong Kong', 22.3193, 114.1694], ['Jakarta', 'Indonesia', -6.2088, 106.8456], ['Singapore', 'Singapore', 1.3521, 103.8198],
  ['Bangkok', 'Thailand', 13.7563, 100.5018], ['Mumbai', 'India', 19.076, 72.8777], ['Almaty', 'CCA', 43.238, 76.8829],
  ['Dubai', 'UAE + KSA', 25.2048, 55.2708], ['Johannesburg', 'South Africa', -26.2041, 28.0473],
].map(([city, nation, latitude, longitude]) => ({ city, nation, latitude, longitude }))

const CSS = `
@keyframes wg-pulse { 0% { transform: scale(1); opacity: 0.5; } 70% { transform: scale(2.8); opacity: 0; } 100% { transform: scale(2.8); opacity: 0; } }
.wg-ring { animation: wg-pulse 2.8s ease-out infinite; }
.wg-line { transition: width 0.45s cubic-bezier(0.16, 1, 0.3, 1); }
@media (prefers-reduced-motion: reduce) { .wg-ring { animation: none; } }
`

function decodeMask() {
  try { const s = atob(LANDMASK); const b = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i); return b } catch { return null }
}
function isLand(mask, lat, lon) {
  let x = Math.floor((lon + 180) / 360 * W), y = Math.floor((90 - lat) / 180 * H)
  x = Math.min(Math.max(x, 0), 359); y = Math.min(Math.max(y, 0), 179)
  const i = y * W + x
  return ((mask[i >> 3] >> (i & 7)) & 1) === 1
}
function toVec(lat, lon) { const a = lat * DEG, b = lon * DEG, c = Math.cos(a); return { x: c * Math.cos(b), y: Math.sin(a), z: c * Math.sin(b) } }
function field(n, mask) {
  const g = Math.PI * (3 - Math.sqrt(5)), pos = new Float32Array(n * 3), land = new Uint8Array(n)
  let k = 0
  for (let o = 0; o < n; o++) {
    const y = 1 - o / (n - 1) * 2, r = Math.sqrt(Math.max(0, 1 - y * y)), t = g * o, x = Math.cos(t) * r, z = Math.sin(t) * r
    let f = true
    if (mask) f = isLand(mask, Math.asin(y) / DEG, Math.atan2(z, x) / DEG)
    if (f || o % 3 === 0) { pos[k * 3] = x; pos[k * 3 + 1] = y; pos[k * 3 + 2] = z; land[k] = f ? 1 : 0; k++ }
  }
  return { positions: pos.subarray(0, k * 3), land: land.subarray(0, k) }
}
function dust(n, seed = 0) {
  const d = new Float32Array(n * 5); let r = 1234567 + seed
  const rnd = () => (r = (r * 1103515245 + 12345) & 2147483647, r / 2147483647)
  for (let t = 0; t < n; t++) {
    const y = rnd() * 2 - 1, a = rnd() * Math.PI * 2, c = Math.sqrt(Math.max(0, 1 - y * y))
    d[t * 5] = Math.cos(a) * c; d[t * 5 + 1] = y; d[t * 5 + 2] = Math.sin(a) * c; d[t * 5 + 3] = 1.005 + rnd() * 0.22; d[t * 5 + 4] = rnd() * Math.PI * 2
  }
  return d
}
function angDiff(a, b) { let n = (b - a + 180) % 360 - 180; if (n < -180) n += 360; return n }
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
function haversine(a, b, c, d) {
  const i = a * DEG, j = c * DEG, o = (c - a) * DEG, s = (d - b) * DEG, x = Math.sin(o / 2), y = Math.sin(s / 2)
  const u = x * x + Math.cos(i) * Math.cos(j) * y * y
  return 6371 * (2 * Math.atan2(Math.sqrt(u), Math.sqrt(Math.max(0, 1 - u))))
}
function nearest(list, lat, lon) {
  let r = 0, best = Infinity
  list.forEach((l, i) => { const d = haversine(lat, lon, l.latitude, l.longitude); if (d < best) { best = d; r = i } })
  return r
}
function tzGuess() {
  if (typeof Intl === 'undefined') return null
  const z = Intl.DateTimeFormat().resolvedOptions().timeZone
  if (!z) return null
  if (TZ[z]) return TZ[z]
  const k = Object.keys(TZ).find((t) => z.startsWith(t.split('/')[0] + '/'))
  return k ? TZ[k] : null
}

export default function Globe(props) {
  const {
    locations = LOCATIONS, startMode = 'first', startCity = '', density = 'medium', dotColor = 'rgba(228, 224, 214, 0.55)',
    accentColor = 'rgb(50, 134, 245)', markerColor = 'rgb(138, 180, 248)', labelColor = 'rgb(250, 250, 250)', dotSize = 1.5,
    markerSize = 1, hitArea = 22, centerYOffset = 50, tiltX = 0, tiltY = 0, tiltZ = 0, focusPosition = 'front', visibleLabels = 1,
    labelSpacing = 100, oceanOpacity = 0.35, globeScale = 0.86, edgeOpacity = 0.05, danceAmount = 1, rotation = 'auto', dwell = 3.5,
    rotateSpeed = 4, tilt = 20,
    cityFont = { fontSize: 16, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: '1.2em' },
    nationFont = { fontSize: 13, fontWeight: 500, letterSpacing: '0.01em', lineHeight: '1.1em' },
    style,
  } = props
  const list = locations.length > 0 ? locations : LOCATIONS
  const cityIndex = useMemo(() => {
    const e = startCity.trim().toLowerCase(); if (!e) return 0
    const t = list.findIndex((l) => l.city.trim().toLowerCase() === e); return t >= 0 ? t : 0
  }, [list, startCity])
  const [nearestIdx, setNearestIdx] = useState(null)
  const startIdx = useMemo(() => (startMode === 'city' ? cityIndex : startMode === 'nearest' ? nearestIdx ?? 0 : 0), [cityIndex, nearestIdx, startMode])
  const rootRef = useRef(null), stageRef = useRef(null), canvasRef = useRef(null), labelRefs = useRef([]), sideRef = useRef([])
  const [active, setActive] = useState(startIdx)
  const [hovered, setHovered] = useState(-1)
  const [size, setSize] = useState({ width: 0, height: 0 })
  const shown = hovered >= 0 && hovered < list.length ? hovered : active
  const mask = useMemo(() => decodeMask(), [])
  const pts = useMemo(() => field(density === 'low' ? 14e3 : density === 'high' ? 52e3 : 3e4, mask), [density, mask])
  const dst = useMemo(() => dust(density === 'low' ? 700 : density === 'high' ? 2200 : 1400), [density])
  const vectors = useMemo(() => list.map((l) => toVec(l.latitude, l.longitude)), [list])
  const stops = useMemo(() => {
    if (list.length === 0) return { yaws: [0], pitches: [0] }
    let y = 90 - list[0].longitude
    const yaws = [y], up = focusPosition === 'top' ? 58 : 0, pitches = [clamp(list[0].latitude + up, -78, 78)]
    for (let i = 1; i < list.length; i++) { y += angDiff(y, 90 - list[i].longitude); yaws.push(y); pitches.push(clamp(list[i].latitude + up, -78, 78)) }
    return { yaws, pitches }
  }, [list, focusPosition])
  const st = useRef({ yaw: 0, pitch: 0, offsetYaw: 0, offsetPitch: 0, spin: 0, stopIndex: startIdx, dwellUntil: 0, velocity: 0, dragging: false, moved: false,
    pointerId: -1, pointerX: 0, pointerY: 0, pointerTime: 0, lastProgress: -1, visible: true, lastTime: 0, started: false })
  const cfg = useRef({})
  cfg.current = { field: pts, dust: dst, vectors, stops, dotColor, accentColor, markerColor, dotSize, oceanOpacity, globeScale, edgeOpacity, danceAmount,
    rotation, dwell, rotateSpeed, tilt, centerYOffset, tiltX, tiltY, tiltZ, focusPosition, visibleLabels, labelSpacing, active, hovered }

  const goTo = useCallback((i) => {
    const y = cfg.current.stops.yaws[i]; if (y === undefined) return
    const s = st.current
    if (cfg.current.rotation === 'auto') { s.stopIndex = i; s.offsetYaw = 0; s.dwellUntil = performance.now() + Math.max(cfg.current.dwell, 1) * 2e3 }
    else s.offsetYaw += angDiff(s.yaw, y)
    s.velocity = 0
  }, [])

  useEffect(() => { sideRef.current = [] }, [list])
  useEffect(() => {
    if (startMode !== 'nearest') { startTransition(() => setNearestIdx(null)); return }
    const g = tzGuess(); if (!g) return
    startTransition(() => setNearestIdx(nearest(list, g[0], g[1])))
  }, [list, startMode])
  useEffect(() => {
    startTransition(() => setActive(startIdx))
    const s = st.current; s.stopIndex = startIdx; s.offsetYaw = 0; s.offsetPitch = 0; s.spin = 0; s.dwellUntil = 0; s.started = false
  }, [startIdx])
  useEffect(() => {
    const el = rootRef.current; if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver((e) => { const r = e[0]?.contentRect; if (!r) return; const w = Math.round(r.width), h = Math.round(r.height); setSize((p) => (p.width === w && p.height === h ? p : { width: w, height: h })) })
    ro.observe(el); return () => ro.disconnect()
  }, [])
  useEffect(() => {
    const el = rootRef.current; if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((e) => { st.current.visible = e[e.length - 1].isIntersecting })
    io.observe(el); return () => io.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current, stage = stageRef.current, root = rootRef.current
    if (!canvas || !stage || !root) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const buckets = Array.from({ length: 12 }, () => [])
    const scroller = (() => { let e = root, t = null; while (e && e !== document.body) { if (getComputedStyle(e).position === 'sticky') t = e; e = e.parentElement } return t?.parentElement ?? root })()
    function progress() { const r = scroller.getBoundingClientRect(), h = window.innerHeight || 1, n = Math.max(r.height - h, h * 0.5); return clamp((h * 0.5 - r.top) / n, 0, 1) }
    function interp(p) {
      const { yaws, pitches } = cfg.current.stops
      if (yaws.length === 1) return { yaw: yaws[0], pitch: pitches[0] }
      const r = p * (yaws.length - 1), i = Math.min(Math.floor(r), yaws.length - 2), a = r - i
      return { yaw: yaws[i] + (yaws[i + 1] - yaws[i]) * a, pitch: pitches[i] + (pitches[i + 1] - pitches[i]) * a }
    }
    function geom() { const w = stage.clientWidth, h = stage.clientHeight; return { width: w, height: h, radius: Math.min(w, h) * 0.5 * cfg.current.globeScale, centerX: w / 2, centerY: h * (cfg.current.centerYOffset / 100) } }

    function draw(time) {
      const { field: F, dust: D, dotColor: dc, dotSize: ds, oceanOpacity: oo, edgeOpacity: eo, tiltX: tx, tiltY: ty, tiltZ: tz } = cfg.current
      const { yaw, pitch } = st.current
      const { width, height, radius: R, centerX: cx, centerY: cy } = geom()
      if (width === 0 || height === 0) return
      const Y = yaw + ty, P = clamp(pitch + tx, -85, 85), zr = tz * DEG, zc = Math.cos(zr), zs = Math.sin(zr)
      const rot = (x, y) => { const a = x - cx, b = y - cy; return { x: cx + a * zc - b * zs, y: cy + a * zs + b * zc } }
      if (canvas.width !== Math.round(width * dpr)) canvas.width = Math.round(width * dpr)
      if (canvas.height !== Math.round(height * dpr)) canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, width, height)
      const cY = Math.cos(Y * DEG), sY = Math.sin(Y * DEG), cP = Math.cos(P * DEG), sP = Math.sin(P * DEG), k = time / 1e3
      if (eo > 0) { ctx.globalAlpha = eo; ctx.strokeStyle = dc; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke() }
      for (const b of buckets) b.length = 0
      const half = buckets.length / 2, { danceAmount: dance } = cfg.current, pos = F.positions, land = F.land, t1 = k * 1.9, t2 = k * 1.3
      for (let e = 0, t = 0; e < land.length; e++, t += 3) {
        const x = pos[t], y = pos[t + 1], z = pos[t + 2], o = x * cY - z * sY, s = x * sY + z * cY, l = y * sP + s * cP
        if (l <= 0.02) continue
        const u = y * cP - s * sP, d = Math.min(half - 1, (Math.sqrt(l) * half) | 0), f = land[e] ? half + d : d, ph = e * 2.3999
        const m = dance * ds * (0.35 + 1.15 * (1 - l))
        const p = rot(cx - o * R + Math.sin(t1 + ph) * m, cy - u * R + Math.cos(t2 + ph * 1.7) * m)
        buckets[f].push(p.x, p.y)
      }
      ctx.fillStyle = dc
      const inv = 1 / half
      for (let e = 0; e < buckets.length; e++) {
        const b = buckets[e]; if (b.length === 0) continue
        const isLandB = e >= half, depth = (e % half + 0.5) * inv, flick = 0.92 + 0.08 * Math.sin(k * 1.7 + e * 1.9)
        ctx.globalAlpha = (0.16 + 0.84 * depth) * (isLandB ? 1 : oo) * flick
        const r = ds * (isLandB ? 0.75 + 0.35 * depth : 0.7) / 2
        for (let i = 0; i < b.length; i += 2) { ctx.beginPath(); ctx.arc(b[i], b[i + 1], r, 0, Math.PI * 2); ctx.fill() }
      }
      ctx.fillStyle = dc
      const dr = Math.max(1, ds * 0.7)
      for (let e = 0; e < D.length; e += 5) {
        const x = D[e], y = D[e + 1], z = D[e + 2], a = D[e + 3], ph = D[e + 4], c = a + 0.085 * Math.sin(k * 0.7 + ph)
        const l = (x * cY - z * sY) * c, u = (x * sY + z * cY) * c, d = y * sP * c + u * cP
        if (d <= -0.35) continue
        const f = y * cP * c - u * sP, p = 1 - Math.min(1, Math.abs(d) * 2.2)
        if (p <= 0.05) continue
        const m = 0.5 + 0.5 * Math.sin(k * 1.3 + ph * 2.4)
        ctx.globalAlpha = 0.6 * p * (0.3 + 0.7 * m)
        const q = rot(cx - l * R, cy - f * R)
        ctx.beginPath(); ctx.arc(q.x, q.y, dr / 2, 0, Math.PI * 2); ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    function labels() {
      const { vectors: V, active: act, hovered: hov, rotation: rmode, focusPosition: fp, visibleLabels: vl, labelSpacing: ls, tiltX: tx, tiltY: ty, tiltZ: tz, accentColor: ac, markerColor: mc } = cfg.current
      const { yaw, pitch } = st.current
      const { width, height, radius: R, centerX: cx, centerY: cy } = geom()
      if (width === 0 || height === 0) return
      const Y = yaw + ty, P = clamp(pitch + tx, -85, 85), zr = tz * DEG, zc = Math.cos(zr), zs = Math.sin(zr)
      const rot = (x, y) => { const a = x - cx, b = y - cy; return { x: cx + a * zc - b * zs, y: cy + a * zs + b * zc } }
      const focus = hov >= 0 && hov < V.length ? hov : act
      const cY = Math.cos(Y * DEG), sY = Math.sin(Y * DEG), cP = Math.cos(P * DEG), sP = Math.sin(P * DEG)
      const topMode = fp === 'top' && (rmode === 'auto' || rmode === 'scroll')
      let frontIdx = -1, frontZ = -2, activeZ = -2
      const cand = [], proj = []
      for (let n = 0; n < V.length; n++) {
        const { x, y, z } = V[n], o = x * cY - z * sY, s = x * sY + z * cY, c = y * sP + s * cP, l = y * cP - s * sP
        const zv = topMode && n === act ? Math.max(c, 0.45) : c
        if (c > frontZ) { frontZ = c; frontIdx = n }
        if (n === act) activeZ = c
        if (zv > 0) cand.push({ index: n, score: zv })
        const p = rot(cx - o * R, cy - l * R)
        proj.push({ zv, screenX: p.x, screenY: p.y, element: labelRefs.current[n] })
      }
      cand.sort((a, b) => b.score - a.score)
      const maxL = Math.max(1, Math.min(6, Math.round(vl))), chosen = new Set(), order = [], sp = Math.max(0, ls), sp2 = sp * sp
      if (focus >= 0 && focus < proj.length) { chosen.add(focus); order.push(focus) }
      for (let e = 0; e < cand.length && !(chosen.size >= maxL); e++) {
        const t = cand[e].index; if (chosen.has(t)) continue
        const n = proj[t]; if (!n || n.zv <= 0) continue
        let near = false
        for (const j of order) { const o = proj[j]; if (!o || o.zv <= 0) continue; const dx = n.screenX - o.screenX, dy = n.screenY - o.screenY; if (dx * dx + dy * dy < sp2) { near = true; break } }
        if (!near) { chosen.add(t); order.push(t) }
      }
      for (let e = 0; e < proj.length; e++) {
        const { zv, screenX: x, screenY: y, element: el } = proj[e]
        if (!el) continue
        const o = clamp(zv * 2.6, 0, 1), on = chosen.has(e), isFocus = e === focus && on
        if (zv <= 0) { if (e === hov) setHovered(-1); el.style.opacity = '0'; el.style.pointerEvents = 'none'; el.style.visibility = 'hidden'; continue }
        el.style.visibility = 'visible'
        el.style.opacity = String(on && zv > 0.05 ? Math.max(o, 0.9) : o)
        el.style.pointerEvents = o > 0.35 ? 'auto' : 'none'
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`
        el.style.zIndex = String(isFocus ? 4 : on ? 3 : 2)
        const row = el.firstElementChild, pin = row?.children[0], line = row?.children[1], text = row?.children[2]
        const ring = pin?.children[0], dot = pin?.children[1]?.firstElementChild
        if (dot) { dot.style.background = on ? ac : mc; dot.style.opacity = on ? '1' : '0.6' }
        if (ring) ring.style.opacity = isFocus ? '1' : '0'
        if (line) { line.style.width = on ? `${Math.max(44, Math.round(size.width * 0.09))}px` : '0px'; line.style.margin = on ? '0 12px' : '0 5px'; line.style.opacity = on ? '0.7' : '0' }
        if (text) { text.style.opacity = on ? '1' : '0'; text.style.transform = on ? 'none' : 'translateX(-6px)' }
        const right = x > width * 0.55
        if (sideRef.current[e] !== right) {
          sideRef.current[e] = right
          if (row) {
            row.style.flexDirection = right ? 'row-reverse' : 'row'; row.style.left = right ? 'auto' : '0px'; row.style.right = right ? '0px' : 'auto'
            row.style.setProperty('--wg-align', right ? 'flex-end' : 'flex-start'); row.style.setProperty('--wg-text', right ? 'right' : 'left')
          }
        }
      }
      if (frontIdx >= 0 && frontIdx !== act && frontZ > 0.15 && Math.acos(clamp(frontZ, -1, 1)) < Math.acos(clamp(activeZ, -1, 1)) - 3 * DEG) setActive(frontIdx)
    }

    function step(dt, now) {
      const s = st.current, { rotation: rmode, rotateSpeed: rs, dwell: dw, tilt: tl, stops: S } = cfg.current, { yaws, pitches } = S
      const idx = Math.min(Math.max(s.stopIndex, 0), Math.max(0, yaws.length - 1))
      if (s.stopIndex >= yaws.length) { s.stopIndex %= yaws.length; s.dwellUntil = 0 }
      if (rmode === 'spin' && !s.dragging) s.spin += rs * dt
      if (rmode === 'auto' && !s.dragging && yaws.length > 1) {
        const there = Math.abs(angDiff(s.yaw, yaws[s.stopIndex] + s.offsetYaw)) < 1.5 && Math.abs(pitches[s.stopIndex] + s.offsetPitch - s.pitch) < 1.5
        if (there && s.dwellUntil === 0) s.dwellUntil = now + Math.max(dw, 0.5) * 1e3
        else if (there && now > s.dwellUntil) { s.stopIndex = (s.stopIndex + 1) % yaws.length; s.dwellUntil = 0; s.offsetYaw = 0; s.offsetPitch = 0 }
      }
      let ty, tp
      if (rmode === 'scroll') {
        const p = progress()
        if (s.lastProgress >= 0 && Math.abs(p - s.lastProgress) > 0.002 && !s.dragging) {
          s.offsetYaw *= 0.9; s.offsetPitch *= 0.9
          if (Math.abs(s.offsetYaw) < 0.1) s.offsetYaw = 0
          if (Math.abs(s.offsetPitch) < 0.1) s.offsetPitch = 0
        }
        s.lastProgress = p
        const t = interp(p); ty = t.yaw; tp = t.pitch
      } else if (rmode === 'spin') { ty = yaws[idx] + s.spin; tp = tl }
      else if (rmode === 'auto') { ty = yaws[s.stopIndex]; tp = pitches[s.stopIndex] }
      else { ty = yaws[idx]; tp = tl }
      if (!s.dragging) {
        if (Math.abs(s.velocity) > 0.01) { s.velocity = clamp(s.velocity, -400, 400); s.offsetYaw += s.velocity * dt; s.velocity *= Math.exp(-dt * 3.4) }
        else s.velocity = 0
      }
      const gy = ty + s.offsetYaw, gp = clamp(tp + s.offsetPitch, -78, 78)
      if (!s.started) { s.started = true; s.yaw = gy; s.pitch = gp; return }
      const e = 1 - Math.exp(-dt * 5)
      s.yaw += angDiff(s.yaw, gy) * e; s.pitch += (gp - s.pitch) * e
    }

    let raf = 0
    const loop = (t) => {
      raf = requestAnimationFrame(loop)
      const s = st.current, dt = s.lastTime ? Math.min((t - s.lastTime) / 1e3, 0.05) : 0.016
      s.lastTime = t
      if (s.visible) { step(dt, t); draw(t); labels() }
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [pts, dst, vectors, stops, size.width, size.height, dotColor, dotSize, oceanOpacity, globeScale, edgeOpacity, danceAmount, rotation, tilt, startIdx])

  const onDown = useCallback((e) => {
    if (!e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return
    const s = st.current
    if (!s.dragging) { s.dragging = true; s.moved = false; s.velocity = 0; s.pointerId = e.pointerId; s.pointerX = e.clientX; s.pointerY = e.clientY; s.pointerTime = e.timeStamp }
  }, [])
  const onMove = useCallback((e) => {
    const s = st.current
    if (!s.dragging || e.pointerId !== s.pointerId) return
    if (e.pointerType === 'mouse' && e.buttons === 0) { s.dragging = false; s.moved = false; return }
    const dx = e.clientX - s.pointerX, dy = e.clientY - s.pointerY
    if (!s.moved && Math.abs(dx) + Math.abs(dy) < 3) return
    if (!s.moved) { s.moved = true; e.currentTarget.setPointerCapture?.(e.pointerId) }
    const dt = Math.min(Math.max((e.timeStamp - s.pointerTime) / 1e3, 1 / 240), 0.1)
    s.pointerX = e.clientX; s.pointerY = e.clientY; s.pointerTime = e.timeStamp
    s.offsetYaw += dx * 0.3; s.offsetPitch = clamp(s.offsetPitch + dy * 0.25, -60, 60); s.velocity = dx / dt * 0.1
  }, [])
  const onUp = useCallback((e) => {
    const s = st.current
    if (s.dragging && e.pointerId === s.pointerId) { s.dragging = false; if (s.moved) e.currentTarget.releasePointerCapture?.(e.pointerId); s.moved = false }
  }, [])

  return (
    <div ref={rootRef} role="group" aria-label="Our locations" style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'stretch', ...style }}>
      <style>{CSS}</style>
      <div ref={stageRef} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
        style={{ position: 'relative', flex: '1 1 0%', minWidth: 0, minHeight: 280, cursor: 'grab', touchAction: 'pan-y', userSelect: 'none' }}>
        <canvas ref={canvasRef} aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {list.map((l, i) => {
            const on = i === shown
            return (
              <div key={`${l.city}-${i}`} ref={(el) => { labelRefs.current[i] = el }} style={{ position: 'absolute', left: 0, top: 0, opacity: 0, willChange: 'transform, opacity' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, display: 'flex', flexDirection: 'row', alignItems: 'center', transform: 'translateY(-50%)', whiteSpace: 'nowrap' }}>
                  <span style={{ position: 'relative', width: 0, height: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                    <span className="wg-ring" aria-hidden="true" style={{ position: 'absolute', width: 7 * markerSize, height: 7 * markerSize, borderRadius: '50%', border: `1px solid ${accentColor}`, opacity: on ? 1 : 0 }} />
                    <button type="button" aria-label={`${l.city}, ${l.nation}`} aria-current={i === active ? 'location' : undefined}
                      onClick={() => goTo(i)} onPointerEnter={() => setHovered(i)} onPointerLeave={() => setHovered((h) => (h === i ? -1 : h))}
                      onFocus={() => { setHovered(i); goTo(i) }} onBlur={() => setHovered((h) => (h === i ? -1 : h))}
                      style={{ position: 'absolute', width: Math.max(8, hitArea), height: Math.max(8, hitArea), padding: 0, border: 'none', borderRadius: '50%', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'width 0.3s ease, height 0.3s ease' }}>
                      <span aria-hidden="true" style={{ width: (on ? 5 : 3.5) * markerSize, height: (on ? 5 : 3.5) * markerSize, borderRadius: '50%', background: on ? accentColor : markerColor, opacity: on ? 1 : 0.6, transition: 'width 0.3s ease, height 0.3s ease, background 0.3s ease, opacity 0.3s ease' }} />
                    </button>
                  </span>
                  <span className="wg-line" aria-hidden="true" style={{ display: 'block', height: 1, width: on ? Math.max(44, Math.round(size.width * 0.09)) : 0, margin: on ? '0 12px' : '0 5px', opacity: on ? 0.7 : 0, background: accentColor, flex: '0 0 auto' }} />
                  <span aria-hidden="true" style={{ display: 'flex', flexDirection: 'column', alignItems: 'var(--wg-align, flex-start)', textAlign: 'var(--wg-text, left)', gap: 3, opacity: on ? 1 : 0, transition: 'opacity 0.35s ease, transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)', transform: on ? 'none' : 'translateX(-6px)', pointerEvents: 'none', textShadow: '0 0 8px rgba(0, 0, 0, 0.9)' }}>
                    <span style={{ ...cityFont, color: accentColor }}>{l.city}</span>
                    <span style={{ ...nationFont, color: labelColor, opacity: 0.72 }}>{l.nation}</span>
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
