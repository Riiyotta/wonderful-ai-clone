#!/usr/bin/env node
// Re-measure tool for the wrapper-height gate (R9). Optional: the committed numbers live in
// extraction/measured-values.json#/sectionHeights; this script reproduces them from a running clone.
//
//   PLAYWRIGHT_MODULE=<path-or-name-of-playwright-package> \
//   node extraction/measure_sections.mjs --base http://localhost:5288 [--routes /,/ai-os] [--out file.json]
//
// - The browser driver is resolved ONLY from the PLAYWRIGHT_MODULE env var (default: the bare package name
//   "playwright" resolved from the current working directory). No machine path is stored in this repo.
// - Viewport is pinned to extraction/section-map.json#/viewport (1440x900). Boxes come from
//   getBoundingClientRect after networkidle + 1000ms; heights are clipped to the document height
//   ("visibleHeightPx") because some live pages clip their canvas (job posts are cut at 1080px).
// - Section attribution follows section-map.json (selectors over the rendered DOM; provenance only).
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const REPO = path.dirname(HERE)
const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith('--') ? [...a, [v.slice(2), arr[i + 1]]] : a), []))
const BASE = args.base || process.env.MEASURE_BASE_URL || 'http://localhost:5288'
const map = JSON.parse(fs.readFileSync(path.join(REPO, 'extraction/section-map.json'), 'utf8'))
const routes = JSON.parse(fs.readFileSync(path.join(REPO, 'templates/routes.json'), 'utf8')).routes
const only = args.routes ? new Set(args.routes.split(',')) : null
const requireFromCwd = createRequire(path.join(process.cwd(), 'noop.js'))
const { chromium } = requireFromCwd(process.env.PLAYWRIGHT_MODULE || 'playwright')

function planFor(route) {
  const t = map.templates[route.template]
  if (!t) throw new Error(`no section-map entry for template ${route.template}`)
  const steps = (t.routeSteps && t.routeSteps[route.path]) || t.steps
  const shell = (t.routeShell && t.routeShell[route.path]) || t.shell || []
  return { steps, shell: shell.map((k) => map.shell[k]) }
}

// Runs in the page. Returns [{section, variant, instance, topPx, heightPx, visibleHeightPx, flow, headingWordsMax, paragraphWordsMax, headings}]
function measureInPage({ steps, shell, headingSelector, paragraphSelector }) {
  const docH = document.documentElement.scrollHeight
  const vis = (el) => { const r = el.getBoundingClientRect(); return r.height > 0 && r.width > 0 && getComputedStyle(el).display !== 'none' }
  const box = (els) => {
    let top = Infinity, bottom = -Infinity
    for (const el of els) { const r = el.getBoundingClientRect(); top = Math.min(top, r.top + scrollY); bottom = Math.max(bottom, r.bottom + scrollY) }
    return { top, bottom }
  }
  const words = (s) => (s || '').trim().split(/\s+/).filter(Boolean).length
  const textStats = (els) => {
    let hw = 0, pw = 0; const heads = []
    for (const el of els) {
      const hs = el.matches(headingSelector) ? [el] : [...el.querySelectorAll(headingSelector)]
      for (const h of hs) if (vis(h)) { hw = Math.max(hw, words(h.innerText)); if (heads.length < 3 && h.innerText.trim()) heads.push(h.innerText.trim().replace(/\s+/g, ' ').slice(0, 80)) }
      const ps = el.matches(paragraphSelector) ? [el] : [...el.querySelectorAll(paragraphSelector)]
      for (const p of ps) if (vis(p)) pw = Math.max(pw, words(p.innerText))
    }
    return { headingWordsMax: hw, paragraphWordsMax: pw, headings: heads }
  }
  const out = []
  const count = {}
  const push = (section, variant, els, flow, extra = {}) => {
    const b = box(els)
    if (!isFinite(b.top)) return
    const i = (count[section] = (count[section] ?? -1) + 1)
    const top = Math.round(b.top * 10) / 10
    const h = Math.round((b.bottom - b.top) * 10) / 10
    const visH = Math.round((Math.min(b.bottom, docH) - Math.max(b.top, 0)) * 10) / 10
    out.push({ section, ...(variant ? { variant } : {}), instance: i, topPx: top, heightPx: h, visibleHeightPx: Math.max(0, visH), flow: flow || 'in-flow', ...textStats(els), ...extra })
  }
  const errors = []
  const blocksUnder = (root) => {
    let cur = root
    for (let k = 0; k < 6; k++) {
      const kids = [...cur.children].filter((c) => vis(c) && !['absolute', 'fixed'].includes(getComputedStyle(c).position))
      if (kids.length === 1) cur = kids[0]; else return kids
    }
    return [...cur.children].filter(vis)
  }
  const chunk = (container, split, section, classSections) => {
    const cls = classSections && Object.keys(classSections).find((c) => container.classList.contains(c))
    if (cls) { push(classSections[cls], null, [container]); return }
    const kids = [...container.children].filter(vis)
    let cur = []
    const parts = []
    for (const k of kids) {
      if (k.matches(split) && cur.length) { parts.push(cur); cur = [] }
      cur.push(k)
    }
    if (cur.length) parts.push(cur)
    for (let i = 0; i < parts.length; i++) {
      // a part runs from its first element's top to the next part's first top (keeps inter-block margins)
      const top = parts[i][0].getBoundingClientRect().top + scrollY
      const end = i + 1 < parts.length ? parts[i + 1][0].getBoundingClientRect().top + scrollY : container.getBoundingClientRect().bottom + scrollY
      const fake = { getBoundingClientRect: () => ({ top: top - scrollY, bottom: end - scrollY }) }
      const startsWithHeading = parts[i][0].matches(split)
      const b = { top, bottom: end }
      const n = (count[section] = (count[section] ?? -1) + 1)
      out.push({ section, instance: n, topPx: Math.round(top * 10) / 10, heightPx: Math.round((end - top) * 10) / 10, visibleHeightPx: Math.round((Math.min(end, docH) - top) * 10) / 10, flow: 'in-flow', ...textStats(parts[i]), boundary: startsWithHeading ? 'heading' : 'preamble' })
      void fake; void b
    }
  }
  const runEntry = (entry, el) => {
    if (typeof entry === 'string') return push(entry, null, [el])
    if (entry.skip) return
    if (entry.children) {
      const kids = [...el.children].filter((c) => vis(c) && !['absolute', 'fixed'].includes(getComputedStyle(c).position))
      if (kids.length !== entry.children.length) errors.push(`children count ${kids.length} != ${entry.children.length}`)
      entry.children.forEach((e, i) => kids[i] && runEntry(e, kids[i]))
      return
    }
    push(entry.section, entry.variant, [el], entry.flow)
  }
  for (const s of steps) {
    if (s.blocks) {
      const root = document.querySelector('main')
      const kids = blocksUnder(root)
      if (kids.length !== s.blocks.length) errors.push(`blocks count ${kids.length} != ${s.blocks.length}`)
      s.blocks.forEach((e, i) => kids[i] && runEntry(e, kids[i]))
    } else if (s.sel) {
      const el = [...document.querySelectorAll(s.sel)].find(vis)
      if (!el) { if (!s.optional) errors.push(`missing ${s.sel}`); continue }
      push(s.section, s.variant, [el], s.flow)
    } else if (s.selAll) {
      for (const el of [...document.querySelectorAll(s.selAll)].filter(vis)) push(s.section, s.variant, [el], s.flow)
    } else if (s.union) {
      const els = s.union.flatMap((q) => [...document.querySelectorAll(q)].filter(vis))
      if (!els.length) { errors.push(`missing union ${s.union}`); continue }
      push(s.section, s.variant, els, s.flow)
    } else if (s.chunksOrdered) {
      const cs = [...document.querySelectorAll(s.chunksOrdered)].filter(vis)
      if (!cs.length) errors.push(`missing ${s.chunksOrdered}`)
      for (const c of cs) chunk(c, s.split, s.section, s.classSections)
    } else if (s.classmap) {
      for (const el of [...document.querySelectorAll(s.classmap)].filter(vis)) {
        const cls = Object.keys(s.map).find((c) => el.classList.contains(c))
        if (!cls) { errors.push(`unmapped block ${el.className}`); continue }
        push(s.map[cls], null, [el])
      }
    }
  }
  for (const s of shell) {
    const el = [...document.querySelectorAll(s.sel)].find(vis)
    if (!el) { errors.push(`missing shell ${s.sel}`); continue }
    push(s.section, s.variant, [el], s.flow)
  }
  out.sort((a, b) => a.topPx - b.topPx)
  return { pageHeightPx: docH, sections: out, errors }
}

const browser = await chromium.launch()
const results = {}
const todo = routes.filter((r) => !only || only.has(r.path))
let i = 0
const worker = async () => {
  while (i < todo.length) {
    const r = todo[i++]
    const ctx = await browser.newContext({ viewport: map.viewport })
    const page = await ctx.newPage()
    await page.goto(BASE + encodeURI(r.path), { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {})
    await page.waitForTimeout(1000)
    const plan = planFor(r)
    const res = await page.evaluate(measureInPage, { ...plan, headingSelector: map.headingSelector, paragraphSelector: map.paragraphSelector })
    results[r.path] = { template: r.template, viewportWidth: map.viewport.width, viewportHeight: map.viewport.height, ...res }
    await ctx.close()
  }
}
await Promise.all(Array.from({ length: Number(args.concurrency || 6) }, worker))
await browser.close()
const ordered = Object.fromEntries(todo.map((r) => [r.path, results[r.path]]))
const payload = JSON.stringify({ measuredAt: new Date().toISOString().slice(0, 10), base: BASE, viewport: map.viewport, routes: ordered }, null, 1)
if (args.out) fs.writeFileSync(args.out, payload); else process.stdout.write(payload)
const errs = Object.entries(ordered).filter(([, v]) => v.errors.length)
for (const [p, v] of errs) console.error('ATTRIBUTION', p, v.errors.join('; '))
console.error(`measured ${todo.length} routes, ${errs.length} with attribution errors`)
