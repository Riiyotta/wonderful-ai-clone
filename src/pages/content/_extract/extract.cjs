#!/usr/bin/env node
// Content group extractor. Reads the server-rendered Framer HTML in _source/pages and writes:
//   src/pages/content/data/blog.json              blog index (featured + grid + categories)
//   src/pages/content/data/articles/<slug>.json   one per /blog-articles/<slug>
//   src/pages/content/data/legal/<slug>.json      one per /legal/<slug>
//   src/styles/content/richtext.gen.css           Framer rich-text base + preset CSS, scoped to .cx-rt
// and downloads any referenced framerusercontent / cdn.wonderful.ai asset missing from /public.
//
// Usage (from the project root): node src/pages/content/_extract/extract.cjs [--no-download]
// Parsing happens in a JS-disabled, network-blocked headless Chromium (setContent), so the
// SSR markup is read exactly as served.
const fs = require('fs')
const path = require('path')
const { chromium } = require('/Users/riyaghosh/langchain-home/node_modules/playwright')
const postcss = require(path.resolve(__dirname, '../../../../node_modules/postcss'))

const ROOT = path.resolve(__dirname, '../../../..')
const SRC = path.join(ROOT, '_source/pages')
const OUT = path.join(ROOT, 'src/pages/content/data')
const CSS_OUT = path.join(ROOT, 'src/styles/content/richtext.gen.css')
const NO_DL = process.argv.includes('--no-download')
const CATS = require('./categories.live.json')

// cdn.wonderful.ai videos get clean local names.
const CDN_VIDEO_NAMES = {
  'https://cdn.wonderful.ai/videos/AI%20Gateway/Online%20v8%20(Web%2C%20under%2020MB).mp4': 'ai-gateway-online-v8.mp4',
  'https://cdn.wonderful.ai/videos/PPC%20Romnia/16x9_PPCxWonderful%20(No%20Ai%20Leaders).mp4': 'ppc-energie-16x9-no-ai-leaders.mp4',
  'https://cdn.wonderful.ai/videos/Series%20C%20Post%20_New_V4.mp4': 'series-c-post-new-v4.mp4',
}

const needed = new Map() // local public path -> remote url

function localAsset(url) {
  if (!url) return url
  const u = new URL(url.replace(/&amp;/g, '&'))
  if (CDN_VIDEO_NAMES[u.origin + u.pathname]) {
    const p = '/videos/' + CDN_VIDEO_NAMES[u.origin + u.pathname]
    needed.set(p, u.origin + u.pathname)
    return p
  }
  if (u.hostname === 'cdn.wonderful.ai') {
    const p = '/videos/' + decodeURIComponent(path.basename(u.pathname)).toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-|-(?=\.)/g, '')
    needed.set(p, u.origin + u.pathname)
    return p
  }
  if (u.hostname !== 'framerusercontent.com') return url
  const base = path.basename(u.pathname)
  const p = (/\.(mp4|webm|mov)$/i.test(base) ? '/videos/' : '/assets/') + base
  needed.set(p, u.origin + u.pathname)
  return p
}

// Internal links -> absolute paths; external untouched.
function localHref(href, pagePath) {
  if (!href || href.startsWith('#') || /^(mailto|tel):/i.test(href)) return href
  let u
  try { u = new URL(href, 'https://www.wonderful.ai' + pagePath) } catch { return href }
  if (!/^(www\.)?wonderful\.ai$/.test(u.hostname)) return href
  let p = decodeURI(u.pathname)
  if (p.length > 1) p = p.replace(/\/$/, '')
  return p + u.search + u.hash
}

async function main() {
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ javaScriptEnabled: false })
  const page = await ctx.newPage()
  await page.route('**/*', (r) => r.abort())
  const load = async (file) => page.setContent(fs.readFileSync(path.join(SRC, file), 'utf8'), { waitUntil: 'domcontentloaded' })

  // Shared in-page helper: serialise a rich-text container to clean HTML (keeps framer-text classes).
  const SERIALIZE = `
    window.__ser = (root) => {
      const KEEP = new Set(['class','href','target','rel','src','alt','width','height','colspan','rowspan','datetime','data-width','data-preset-tag','style','poster','loop','muted','playsinline','autoplay','controls','preload','start','type'])
      const walk = (n) => {
        if (n.nodeType === 3) return n.textContent.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        if (n.nodeType !== 1) return ''
        const tag = n.tagName.toLowerCase()
        if (tag === 'style' || tag === 'script') return ''
        let attrs = ''
        for (const a of n.attributes) {
          if (!KEEP.has(a.name)) continue
          let v = a.value
          if (a.name === 'style') { v = v.replace(/(^|;)\s*transform:\s*none\s*(?=;|$)/g, '$1').replace(/^;|;$/g, ''); if (!v) continue }
          attrs += ' ' + a.name + (v === '' && a.name !== 'alt' ? '' : '="' + v.replace(/&/g,'&amp;').replace(/"/g,'&quot;') + '"')
        }
        if (/^(br|img|hr|source)$/.test(tag)) return '<' + tag + attrs + '>'
        let inner = ''
        // ssr-variant wrappers inside rich text: keep only the first variant's content
        if (n.classList.contains('framer-text-module')) {
          const v = n.querySelector(':scope > .ssr-variant') || n
          inner = [...v.childNodes].map(walk).join('')
        } else inner = [...n.childNodes].map(walk).join('')
        return '<' + tag + attrs + '>' + inner + '</' + tag + '>'
      }
      return [...root.childNodes].map(walk).join('')
    }`

  const fixHtml = (html, pagePath) =>
    html
      .replace(/ href="([^"]*)"/g, (m, h) => ' href="' + localHref(h.replace(/&amp;/g, '&'), pagePath).replace(/&/g, '&amp;') + '"')
      .replace(/ (src|poster)="([^"]*)"/g, (m, a, s) => ' ' + a + '="' + localAsset(s) + '"')

  // ---------- articles ----------
  const files = fs.readdirSync(SRC).filter((f) => f.startsWith('blog-articles__'))
  const articleMeta = {}
  for (const f of files) {
    await load(f)
    await page.evaluate(SERIALIZE)
    const slug = decodeURIComponent(f.slice('blog-articles__'.length, -5))
    const pagePath = '/blog-articles/' + slug
    const r = await page.evaluate(() => {
      const root = document.querySelector('.framer-xgdb3b')
      const head = root.querySelector('.framer-oat0ye')
      const author = head.querySelector('.framer-x24vmj p').textContent
      const time = head.querySelector('.framer-1e7qfkx time')
      const titleEl = root.querySelector('[data-framer-name="Title"] h1')
      const descEl = root.querySelector('[data-framer-name="Description"] p')
      const banner = root.querySelector('[data-framer-name="Banner"]')
      const vid = banner && banner.querySelector('video')
      const img = banner && banner.querySelector('img')
      const hero = banner && {
        image: img ? { src: img.getAttribute('src'), width: +img.getAttribute('width'), height: +img.getAttribute('height'), alt: img.getAttribute('alt') || '' } : null,
        video: vid ? { src: vid.getAttribute('src'), poster: vid.getAttribute('poster'), controls: vid.hasAttribute('controls'), autoplay: vid.hasAttribute('autoplay'), loop: vid.hasAttribute('loop'), muted: vid.hasAttribute('muted'), preload: vid.getAttribute('preload') } : null,
      }
      const body = root.querySelector('[data-framer-name="Content"]')
      const sideKids = root.querySelector('[data-framer-name="Content + Sidebar"]').children.length
      const sb = root.querySelector('[data-framer-name="Story Details"]')
      const sidebar = sb && {
        heading: sb.querySelector(':scope > [data-framer-component-type] p').textContent,
        details: [...sb.querySelectorAll('[data-framer-name="Details"] > div')].map((d) => {
          const ps = d.querySelectorAll('p')
          return { name: d.getAttribute('data-framer-name'), label: ps[0].textContent, value: ps[1] ? ps[1].textContent : '' }
        }),
        metrics: [...sb.querySelectorAll('[data-framer-name="Metrics"] > div')].map((d) => {
          const ps = d.querySelectorAll('p')
          return { value: ps[0].textContent, label: ps[1] ? ps[1].textContent : '' }
        }),
      }
      const bodyStyle = body.getAttribute('style') || ''
      // Desktop variant (hidden-1ue2nml hidden-se78ug) and tablet/mobile variant (hidden-19eckod) list different counts.
      const variants = [...root.querySelectorAll('.framer-z9sj5l > .ssr-variant')]
      const vD = variants.find((v) => v.classList.contains('hidden-se78ug')) || root.querySelector('.framer-z9sj5l')
      const vTM = variants.find((v) => v.classList.contains('hidden-19eckod')) || vD
      const cards = (more) => [...more.querySelectorAll(':scope > a')].map((a) => ({
        href: a.getAttribute('href'),
        title: a.querySelector('h4').textContent,
        date: a.querySelector('time').textContent,
        datetime: a.querySelector('time').getAttribute('datetime'),
        image: a.querySelector('img') && a.querySelector('img').getAttribute('src'),
        imageW: a.querySelector('img') && +a.querySelector('img').getAttribute('width'),
        imageH: a.querySelector('img') && +a.querySelector('img').getAttribute('height'),
      }))
      const related = cards(vD)
      const relatedTM = cards(vTM)
      return {
        pageTitle: document.title,
        author, date: time.textContent, datetime: time.getAttribute('datetime'),
        title: titleEl.textContent, titleTag: titleEl.tagName.toLowerCase(),
        description: descEl ? descEl.textContent.trim() : '',
        hero, sideKids, sidebar, bodyStyle, bodyHtml: window.__ser(body), related, relatedTM,
      }
    })
    if (r.sideKids !== (r.sidebar ? 2 : 1)) console.warn('!! unexpected Content + Sidebar children in', slug)
    if (r.hero && r.hero.image) r.hero.image.src = localAsset(r.hero.image.src)
    if (r.hero && r.hero.video) {
      r.hero.video.src = localAsset(r.hero.video.src)
      if (r.hero.video.poster) r.hero.video.poster = localAsset(r.hero.video.poster)
    }
    r.bodyHtml = fixHtml(r.bodyHtml, pagePath)
    const fixRel = (c) => ({ ...c, href: localHref(c.href, pagePath), image: localAsset(c.image) })
    r.related = r.related.map(fixRel)
    r.relatedTM = r.relatedTM.map(fixRel)
    delete r.sideKids
    const data = { slug, path: pagePath, category: CATS.bySlug[slug] || null, ...r }
    fs.writeFileSync(path.join(OUT, 'articles', slug + '.json'), JSON.stringify(data, null, 1))
    articleMeta[slug] = { title: r.title, pageTitle: r.pageTitle }
  }
  console.log('articles:', files.length)

  // ---------- blog index ----------
  await load('blog.html')
  const blog = await page.evaluate(() => {
    const feat = document.querySelector('.framer-2osvhj a')
    const fi = feat.querySelector('img')
    const card = (a) => ({
      href: a.getAttribute('href'),
      title: a.querySelector('h4,h3').textContent,
      date: a.querySelector('time').textContent,
      datetime: a.querySelector('time').getAttribute('datetime'),
      image: a.querySelector('img').getAttribute('src'),
      imageW: +a.querySelector('img').getAttribute('width'),
      imageH: +a.querySelector('img').getAttribute('height'),
    })
    return {
      pageTitle: document.title,
      heading: document.querySelector('.framer-1nr2swy').textContent,
      subheading: document.querySelector('.framer-bgdlfn').textContent,
      tabs: [...document.querySelectorAll('.framer-kdx865 p')].map((p) => p.textContent),
      featured: { ...card(feat), description: feat.querySelector('.framer-gevinz p').textContent },
      posts: [...document.querySelectorAll('.framer-1bzwa9q > a')].map(card),
    }
  })
  const fixCard = (c) => {
    const href = localHref(c.href, '/blog')
    const slug = href.replace('/blog-articles/', '')
    return { ...c, href, slug, category: CATS.bySlug[slug] || null, image: localAsset(c.image) }
  }
  blog.featured = fixCard(blog.featured)
  blog.posts = blog.posts.map(fixCard)
  fs.writeFileSync(path.join(OUT, 'blog.json'), JSON.stringify(blog, null, 1))
  console.log('blog posts:', blog.posts.length, 'uncategorised:', blog.posts.filter((p) => !p.category).map((p) => p.slug))

  // ---------- legal ----------
  const legalFiles = fs.readdirSync(SRC).filter((f) => f.startsWith('legal__'))
  for (const f of legalFiles) {
    await load(f)
    await page.evaluate(SERIALIZE)
    const slug = f.slice('legal__'.length, -5)
    const pagePath = '/legal/' + slug
    const r = await page.evaluate(() => {
      const dates = [...document.querySelectorAll('.framer-87ouly [data-framer-name="Date"] p')].map((p) => p.textContent)
      return {
        pageTitle: document.title,
        title: document.querySelector('.framer-1p3fsdq').textContent,
        dateLabel: document.querySelector('.framer-1mao8f6 p').textContent,
        dates,
        bodyHtml: window.__ser(document.querySelector('.framer-d1r6to')),
      }
    })
    r.bodyHtml = fixHtml(r.bodyHtml, pagePath)
    fs.writeFileSync(path.join(OUT, 'legal', slug + '.json'), JSON.stringify({ slug, path: pagePath, ...r }, null, 1))
  }
  console.log('legal:', legalFiles.length)

  // legal index title
  await load('legal.html')
  const legalIndexTitle = await page.evaluate(() => document.title)

  fs.writeFileSync(path.join(OUT, 'titles.json'), JSON.stringify({
    blog: blog.pageTitle,
    legal: legalIndexTitle,
    articles: Object.fromEntries(Object.entries(articleMeta).map(([k, v]) => [k, v.pageTitle])),
    legalPages: Object.fromEntries(legalFiles.map((f) => { const s = f.slice(7, -5); return [s, require(path.join(OUT, 'legal', s + '.json')).pageTitle] })),
  }, null, 1))
  await browser.close()

  // ---------- CSS ----------
  writeCss([...files.map((f) => f), 'blog.html', 'legal.html', ...legalFiles])

  // ---------- assets ----------
  const missing = [...needed].filter(([p]) => !fs.existsSync(path.join(ROOT, 'public', p)))
  console.log('assets referenced:', needed.size, 'missing:', missing.length)
  if (!NO_DL) for (const [p, url] of missing) {
    process.stdout.write('  downloading ' + url + ' -> ' + p + ' ... ')
    await download(url, path.join(ROOT, 'public', p))
    console.log('ok')
  }
}

// Framer rich-text CSS: base `.framer-text` rules + every text preset, re-scoped under `.cx-rt`.
function writeCss(files) {
  const seen = new Set()
  const out = []
  const tokens = new Map()
  for (const f of files) {
    const s = fs.readFileSync(path.join(SRC, f), 'utf8')
    const css = [...s.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n')
    const root = postcss.parse(css)
    root.walkDecls(/^--token-/, (d) => { const at = d.parent.parent; if (at && at.type === 'atrule') return; if (!tokens.has(d.prop)) tokens.set(d.prop, d.value) })
    root.walkRules((r) => {
      const sel = r.selector
      const isPreset = /\.framer-styles-preset-[a-z0-9]+/.test(sel)
      const isBase = !isPreset && /framer-text/.test(sel) && !/framer-fit-text|html\[lang|html:not/.test(sel)
      if (!isPreset && !isBase) return
      let newSel
      if (isPreset) newSel = r.selectors.map((x) => x.replace(/^\.framer-[A-Za-z0-9]{5}(?=[ .])/, '.cx-rt')).join(',')
      else newSel = r.selectors.map((x) => '.cx-rt ' + x).join(',')
      const media = r.parent && r.parent.type === 'atrule' ? '@' + r.parent.name + ' ' + r.parent.params : ''
      const body = r.nodes.map((d) => d.toString()).join(';')
      // Keep the LAST copy of duplicated rules: Framer repeats preset blocks per component, and the
      // cascade outcome depends on the final occurrence (base rule before its @media overrides).
      const key = media + '|' + newSel + '|' + body
      if (seen.has(key)) out.splice(out.findIndex((o) => o.key === key), 1)
      seen.add(key)
      out.push({ key, media, text: newSel + '{' + body + '}' })
    })
  }
  // Group by media, keeping source order.
  let css = '/* GENERATED by src/pages/content/_extract/extract.cjs from _source/pages Framer CSS. Do not edit. */\n'
  css += '.cx-rt{' + [...tokens].map(([k, v]) => k + ':' + v).join(';') + '}\n'
  for (const o of out) css += o.media ? o.media + '{' + o.text + '}\n' : o.text + '\n'
  // Fallback faces: live's placeholder @font-face rules carry metric overrides; other groups' CSS redefines the
  // same family names without them (and loads later), so the content pages use private names (see fonts.css).
  css = css.replace(/"ABC Favorit Light Placeholder"/g, '"CX Favorit Light Placeholder"').replace(/"Inter Placeholder"/g, '"CX Inter Placeholder"').replace(/Inter Placeholder,/g, 'CX Inter Placeholder,')
  fs.writeFileSync(CSS_OUT, css)
  console.log('css rules:', out.length, 'tokens:', tokens.size)
}

// curl (system trust store) rather than node https: this machine sits behind a TLS-inspecting proxy.
function download(url, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  const r = require('child_process').spawnSync('curl', ['-fsSL', '-o', dest + '.part', url], { stdio: 'inherit' })
  if (r.status !== 0) throw new Error('download failed ' + url)
  fs.renameSync(dest + '.part', dest)
}

main().catch((e) => { console.error(e); process.exit(1) })
