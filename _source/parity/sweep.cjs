const { chromium } = require('playwright');
const fs = require('fs');
const paths = fs.readFileSync(process.argv[2], 'utf8').split('\n').filter(Boolean);
const widths = [1440, 1100, 390];
(async () => {
  const b = await chromium.launch();
  const jobs = [];
  for (const p of paths) for (const w of widths) jobs.push([p, w]);
  const res = [];
  const one = async (url, w, collect) => {
    const ctx = await b.newContext({ viewport: { width: w, height: w === 390 ? 844 : 900 } });
    const pg = await ctx.newPage();
    const errs = [], fails = [];
    if (collect) {
      pg.on('pageerror', (e) => errs.push('pageerror: ' + e.message.slice(0, 120)));
      pg.on('console', (m) => { if (m.type() === 'error' && !/same key|future flag/i.test(m.text())) errs.push(m.text().slice(0, 120)) });
      pg.on('response', (r) => { if (r.status() >= 400 && r.url().startsWith('http://localhost')) fails.push(r.status() + ' ' + r.url().replace('http://localhost:5288', '')) });
    }
    await pg.goto(url, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
    await pg.waitForTimeout(1200);
    const h = await pg.evaluate(() => document.documentElement.scrollHeight).catch(() => -1);
    const nf = collect ? await pg.evaluate(() => document.body.innerText.includes('Page not found')).catch(() => false) : false;
    await ctx.close();
    return { h, errs, fails, nf };
  };
  let i = 0;
  const worker = async () => {
    while (i < jobs.length) {
      const [p, w] = jobs[i++];
      const [l, c] = await Promise.all([one('https://www.wonderful.ai' + p, w, false), one('http://localhost:5288' + p, w, true)]);
      res.push({ p, w, live: l.h, clone: c.h, d: c.h - l.h, errs: c.errs, fails: c.fails, nf: c.nf });
    }
  };
  await Promise.all(Array.from({ length: 6 }, worker));
  fs.writeFileSync(process.argv[3], JSON.stringify(res, null, 1));
  const bad = res.filter((r) => Math.abs(r.d) > 2 || r.errs.length || r.fails.length || r.nf);
  console.log('checked', res.length, 'problems', bad.length);
  for (const r of bad.sort((a, b) => a.p.localeCompare(b.p))) console.log(r.p, r.w, `live ${r.live} clone ${r.clone} (${r.d})`, r.nf ? 'NOT-FOUND' : '', r.errs.slice(0, 2).join(' | '), r.fails.slice(0, 3).join(' | '));
  await b.close();
})();
