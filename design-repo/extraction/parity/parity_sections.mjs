#!/usr/bin/env node
// R12 live-vs-clone parity harness: per-section pixel compare at the same viewport and scroll offsets.
//
//   PLAYWRIGHT_MODULE=<path-or-name-of-playwright-package> \
//   node extraction/parity/parity_sections.mjs --live https://www.wonderful.ai --clone http://localhost:5288 \
//        [--routes /,/ai-os] [--out extraction/parity/parity-results.json] [--threshold 24] [--gate 0.8]
//
// Method (identical for both sides):
//   1. 1440x900 viewport, reducedMotion "no-preference", fresh isolated context per page.
//   2. Load (networkidle), hide the live consent panel (it is runtime UI, see utility.cookie-consent),
//      scroll the whole page in 600px steps (fires in-view reveals and lazy media), return to y=0, wait 1500ms.
//   3. Autoplay <video> elements are paused and seeked to t=0 on both sides (a playing video is a different frame in any
//      two captures; the same frame of the same encode is the only comparable state). Everything else (CSS/JS loops such
//      as gradient blobs, the lattice, tickers) is left running and reported with its real score.
//   4. One full-page screenshot per side.
//   5. Each section box comes from extraction/measured-values.json#/sectionHeights (clone geometry at 1440);
//      the same page rectangle is cropped from both screenshots (same scroll offsets by construction).
//   6. Score = share of pixels whose max channel difference is <= threshold (default 24/255).
//      A section passes at >= gate (default 0.80). The page average is the area-weighted mean.
// Time-based media (video frames, the lattice/globe/shader loops, the nav ticker) legitimately differ
// between two captures; those sections are reported with their real score, never adjusted.
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const REPO = path.dirname(path.dirname(HERE))
const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith('--') ? [...a, [v.slice(2), arr[i + 1]]] : a), []))
const LIVE = args.live || 'https://www.wonderful.ai'
const CLONE = args.clone || 'http://localhost:5288'
const THRESH = Number(args.threshold || 24)
const GATE = Number(args.gate || 0.8)
const sectionsFile = args.sections || path.join(REPO, 'extraction/measured-values.json')
const raw = JSON.parse(fs.readFileSync(sectionsFile, 'utf8'))
const routesData = raw.sectionHeights ? raw.sectionHeights.routes : raw.routes
const only = args.routes ? new Set(args.routes.split(',')) : null
const requireFromCwd = createRequire(path.join(process.cwd(), 'noop.js'))
const { chromium } = requireFromCwd(process.env.PLAYWRIGHT_MODULE || 'playwright')

async function capture(browser, url) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const page = await ctx.newPage()
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 }).catch(() => {})
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el)
      if (cs.position === 'fixed' && /cookie/i.test(el.innerText || '') && el.getBoundingClientRect().width < 500) el.style.display = 'none'
    }
  }).catch(() => {})
  const H = await page.evaluate(() => document.documentElement.scrollHeight).catch(() => 0)
  for (let y = 0; y < H; y += 600) { await page.evaluate((y) => window.scrollTo(0, y), y).catch(() => {}); await page.waitForTimeout(120) }
  await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {})
  await page.waitForTimeout(1500)
  // Freeze autoplay video on frame 0 (same rule on live and clone): load the first frame, seek, wait for the seek to paint.
  await page.evaluate(() => Promise.all([...document.querySelectorAll('video')].map((v) => new Promise((ok) => {
    v.pause()
    v.play = () => Promise.resolve() // in-view observers (live and clone) must not resume playback during the capture
    const seek = () => {
      if (v.readyState < 2) { ok(); return }
      v.addEventListener('seeked', () => ok(), { once: true })
      v.currentTime = 0
      setTimeout(ok, 25000) // a seek on the live CDN video takes several seconds
    }
    if (v.readyState >= 2) { seek(); return }
    v.preload = 'auto'
    v.addEventListener('loadeddata', seek, { once: true })
    v.load()
    setTimeout(ok, 25000)
  })))).catch(() => {})
  await page.waitForTimeout(500)
  const png = await page.screenshot({ fullPage: true, type: 'png' }).catch(() => null)
  const h = await page.evaluate(() => document.documentElement.scrollHeight).catch(() => 0)
  await ctx.close()
  return { png, h }
}

async function compare(browser, a, b, rects) {
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  await page.setContent('<html><body></body></html>')
  const res = await page.evaluate(async ({ a, b, rects, THRESH }) => {
    const load = (b64) => new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = ko; i.src = 'data:image/png;base64,' + b64 })
    const [ia, ib] = await Promise.all([load(a), load(b)])
    const draw = (img) => { const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(img, 0, 0); return x }
    const xa = draw(ia), xb = draw(ib)
    return rects.map((r) => {
      const top = Math.max(0, Math.round(r.top)), h = Math.round(Math.min(r.height, ia.height - top, ib.height - top))
      if (h <= 0) return { score: null, px: 0 }
      const da = xa.getImageData(0, top, 1440, h).data, db = xb.getImageData(0, top, 1440, h).data
      let ok = 0
      for (let i = 0; i < da.length; i += 4) {
        const d = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2]))
        if (d <= THRESH) ok++
      }
      return { score: ok / (da.length / 4), px: da.length / 4 }
    })
  }, { a: a.toString('base64'), b: b.toString('base64'), rects, THRESH })
  await ctx.close()
  return res
}

const browser = await chromium.launch()
const todo = Object.entries(routesData).filter(([p]) => !only || only.has(p))
const out = {}
let i = 0
const worker = async () => {
  while (i < todo.length) {
    const [p, data] = todo[i++]
    const [L, C] = await Promise.all([capture(browser, LIVE + encodeURI(p)), capture(browser, CLONE + encodeURI(p))])
    if (!L.png || !C.png) { out[p] = { error: 'capture failed', liveHeight: L.h, cloneHeight: C.h }; continue }
    const secs = data.sections.filter((s) => s.flow !== 'fixed' && s.heightPx >= 1)
    const scores = await compare(browser, L.png, C.png, secs.map((s) => ({ top: s.topPx, height: s.visibleHeightPx })))
    const rows = secs.map((s, k) => ({ section: s.section, instance: s.instance, topPx: s.topPx, heightPx: s.visibleHeightPx, score: scores[k].score === null ? null : Math.round(scores[k].score * 1000) / 1000 }))
    const scored = rows.filter((r) => r.score !== null && r.heightPx >= 2)
    const area = scored.reduce((a, r) => a + r.heightPx, 0)
    const avg = area ? scored.reduce((a, r) => a + r.score * r.heightPx, 0) / area : null
    out[p] = { liveHeight: L.h, cloneHeight: C.h, average: avg === null ? null : Math.round(avg * 1000) / 1000, minSection: scored.length ? Math.min(...scored.map((r) => r.score)) : null, allSectionsPass: scored.every((r) => r.score >= GATE), sections: rows }
    process.stderr.write(`${p} avg ${out[p].average} min ${out[p].minSection}\n`)
  }
}
await Promise.all(Array.from({ length: Number(args.concurrency || 3) }, worker))
await browser.close()
const ordered = Object.fromEntries(todo.map(([p]) => [p, out[p]]))
const all = Object.values(ordered).filter((r) => r && r.sections)
const secRows = all.flatMap((r) => r.sections.filter((s) => s.score !== null && s.heightPx >= 2))
const summary = {
  measuredAt: new Date().toISOString().slice(0, 10), live: LIVE, clone: CLONE, viewport: '1440x900', threshold: THRESH, gate: GATE,
  routesCompared: all.length, routesFailedCapture: Object.values(ordered).filter((r) => r && r.error).length,
  sectionsCompared: secRows.length, sectionsPassing: secRows.filter((s) => s.score >= GATE).length,
  meanSectionScore: secRows.length ? Math.round((secRows.reduce((a, s) => a + s.score, 0) / secRows.length) * 1000) / 1000 : null,
  meanPageAverage: all.length ? Math.round((all.reduce((a, r) => a + (r.average || 0), 0) / all.length) * 1000) / 1000 : null,
  routesAllSectionsPass: all.filter((r) => r.allSectionsPass).length,
}
fs.writeFileSync(args.out || path.join(HERE, 'parity-results.json'), JSON.stringify({ summary, routes: ordered }, null, 1))
console.log(JSON.stringify(summary, null, 1))
