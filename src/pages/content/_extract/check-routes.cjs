#!/usr/bin/env node
// Automated smoke check for every content route against the running dev server.
// For each of the 51 /blog-articles/<slug> (+ /blog, /legal, 9 /legal/<slug>): loads the page, scrolls it,
// and asserts title + body rendered, document.title matches, no console errors / page errors,
// no >=400 responses, and every <img>/<video poster> under the page decoded.
// Usage: node src/pages/content/_extract/check-routes.cjs [baseUrl=http://localhost:5288] [--width=1440]
const path = require('path')
const { chromium } = require('/Users/riyaghosh/langchain-home/node_modules/playwright')
const TITLES = require(path.resolve(__dirname, '../data/titles.json'))

const base = (process.argv.find((a) => a.startsWith('http')) || 'http://localhost:5288').replace(/\/$/, '')
const width = +((process.argv.find((a) => a.startsWith('--width=')) || '--width=1440').split('=')[1])
// React dev warning emitted by the shared App shell on every route (sibling <Navbar key> and <main key>
// share the pathname key) — not a content-group error; reported separately.
const IGNORE = [/Encountered two children with the same key/]

const routes = [
  ...Object.entries(TITLES.articles).map(([slug, title]) => ({ path: '/blog-articles/' + encodeURI(slug).replace(/'/g, '%27'), title, kind: 'article' })),
  { path: '/blog', title: TITLES.blog, kind: 'blog' },
  { path: '/legal', title: TITLES.legal, kind: 'legal-index' },
  ...Object.entries(TITLES.legalPages).map(([slug, title]) => ({ path: '/legal/' + slug, title, kind: 'legal' })),
]

;(async () => {
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: { width, height: width < 800 ? 844 : 900 } })
  let fail = 0
  for (const r of routes) {
    const page = await ctx.newPage()
    const errors = []
    page.on('console', (m) => { if (m.type() === 'error' && !IGNORE.some((re) => re.test(m.text()))) errors.push('console: ' + m.text().slice(0, 200)) })
    page.on('pageerror', (e) => errors.push('pageerror: ' + e.message))
    page.on('response', (res) => { if (res.status() >= 400) errors.push(res.status() + ' ' + res.url()) })
    await page.goto(base + r.path, { waitUntil: 'load' })
    await page.waitForTimeout(400)
    const H = await page.evaluate(() => document.documentElement.scrollHeight)
    for (let y = 0; y < H; y += 700) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(30) }
    await page.waitForLoadState('networkidle').catch(() => {})
    const res = await page.evaluate(async (kind) => {
      const q = (s) => document.querySelector(s)
      const title = q('[data-cx=title]') || q('[data-cx=h1]')
      const body = q('[data-cx=body]') || q('[data-cx=grid]') || q('[data-cx=links]')
      const imgs = [...document.querySelectorAll('[data-cx] img')].filter((i) => i.getClientRects().length) // display:none variants never load lazy images
      await Promise.all(imgs.map((i) => (i.complete ? null : new Promise((ok) => { i.onload = i.onerror = ok; setTimeout(ok, 8000) }))))
      const broken = imgs.filter((i) => !(i.complete && i.naturalWidth > 0)).map((i) => i.getAttribute('src'))
      return {
        docTitle: document.title,
        titleText: title ? title.textContent.trim() : '',
        bodyChildren: body ? body.children.length : 0,
        bodyText: body ? body.textContent.trim().length : 0,
        related: kind === 'article' ? document.querySelectorAll('[data-cx=related]').length : -1,
        imgs: imgs.length,
        broken,
        H: document.documentElement.scrollHeight,
      }
    }, r.kind)
    const problems = [...errors]
    if (!res.titleText) problems.push('no title')
    if (res.bodyChildren < 1 || res.bodyText < 20) problems.push('empty body')
    if (res.docTitle !== r.title) problems.push(`document.title "${res.docTitle}" != "${r.title}"`)
    if (r.kind === 'article' && res.related < 3) problems.push('related cards ' + res.related)
    if (res.broken.length) problems.push('broken images: ' + res.broken.join(', '))
    if (problems.length) fail++
    console.log((problems.length ? 'FAIL ' : 'ok   ') + r.path.padEnd(70) + ` H=${res.H} children=${res.bodyChildren} imgs=${res.imgs}` + (problems.length ? '\n       ' + problems.join('\n       ') : ''))
    await page.close()
  }
  console.log(`\n${routes.length - fail}/${routes.length} routes passed at ${width}px`)
  await browser.close()
  process.exit(fail ? 1 : 0)
})()
