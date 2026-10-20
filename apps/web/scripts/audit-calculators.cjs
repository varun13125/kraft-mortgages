/* Read-only local browser audit. No leads, calls, or other POSTs are submitted.
 * Install playwright and @axe-core/playwright outside the repo, then set
 * AUDIT_TOOLS to that node_modules directory. Uses installed Chrome.
 * AUDIT_BASE_URL defaults to http://localhost:3100; AUDIT_OUTPUT is required.
 */
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(path.join(process.env.AUDIT_TOOLS, 'playwright'));
const AxeBuilder = require(path.join(process.env.AUDIT_TOOLS, '@axe-core/playwright')).default;
const root = path.resolve(__dirname, '..');
const site = path.join(root, 'app', '(site)');
const out = path.resolve(process.env.AUDIT_OUTPUT);
fs.mkdirSync(out, { recursive: true });
const routes = [];
function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(file);
    else if (ent.name === 'page.tsx') {
      const route = '/' + path.relative(site, dir).split(path.sep).join('/');
      if (/\/calculators\/[^/]+$/.test(route)) routes.push(route);
    }
  }
}
walk(site);
routes.sort();
const selected = process.env.AUDIT_ROUTES ? process.env.AUDIT_ROUTES.split(',') : routes;
const base = process.env.AUDIT_BASE_URL || 'http://localhost:3100';
const badNumber = /(?:\$|[-\s])(?:NaN|Infinity|∞)(?:%|\s|$)|NaN%/g;
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  await context.route('**/*', route => {
    const req = route.request();
    // No side effects or third-party widgets during stress testing.
    if (!['GET', 'HEAD'].includes(req.method())) return route.abort();
    const url = new URL(req.url());
    if (url.origin !== new URL(base).origin && !url.hostname.endsWith('googleapis.com') &&
        !url.hostname.endsWith('gstatic.com')) return route.abort();
    return route.continue();
  });
  const results = [];
  for (const route of selected) {
    const page = await context.newPage();
    const item = { route, errors: [], inputs: [], scenarios: [], selects: [], mobile: {}, accessibility: [] };
    page.on('pageerror', error => item.errors.push(error.message));
    try {
      const start = Date.now();
      const response = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 120000 });
      item.status = response.status();
      item.loadMs = Date.now() - start;
      await page.locator('h1').first().waitFor({ timeout: 20000 });
      // networkidle can precede hydration on a cold dev compilation. Wait until
      // Framer's initial opacity has cleared before auditing visible controls.
      await page.waitForFunction(() => {
        let el = document.querySelector('h1');
        if (!el) return false;
        for (; el; el = el.parentElement) if (Number(getComputedStyle(el).opacity) < .9) return false;
        return true;
      }, null, { timeout: 30000 });
      await page.waitForTimeout(500);
      item.title = await page.locator('h1').first().innerText();
      item.canonical = await page.locator('link[rel=canonical]').getAttribute('href').catch(() => null);
      item.baseline = (await page.locator('body').innerText()).slice(0, 18000);
      item.baselineBadNumbers = item.baseline.match(badNumber) || [];
      const audit = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
      item.accessibility = audit.violations.map(v => ({ id: v.id, impact: v.impact, count: v.nodes.length,
        examples: v.nodes.slice(0, 4).map(n => ({ target: n.target, summary: n.failureSummary })) }));
      const inputs = page.locator('main input[type=number], main input[type=range]');
      const count = await inputs.count();
      for (let i = 0; i < count; i++) {
        if (process.env.AUDIT_QUICK === '1') break;
        const input = inputs.nth(i);
        if (!await input.isVisible()) continue;
        const info = await input.evaluate(el => ({
          type: el.type, value: el.value, min: el.min, max: el.max, step: el.step,
          name: el.getAttribute('aria-label') || [...el.labels || []].map(l => l.textContent.trim()).join(' '),
          nearby: el.parentElement.parentElement.textContent.trim().slice(0, 180)
        }));
        item.inputs.push(info);
        if (info.type === 'range') {
          for (const val of [info.min, info.max]) {
            await input.focus();
            await input.press(val === info.min ? 'Home' : 'End');
            const text = await page.locator('body').innerText();
            item.scenarios.push({ input: i, value: val, type: 'range-boundary', badNumbers: text.match(badNumber) || [] });
          }
          await input.evaluate((el, value) => {
            Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, value);
            el.dispatchEvent(new Event('input', { bubbles: true }));
          }, info.value);
          continue;
        }
        const normal = String(Math.min(info.max ? Number(info.max) : Infinity,
          Math.max(info.min ? Number(info.min) : 0, Number(info.value) + (Number(info.step) || 1))));
        for (const val of [normal, '', '-1', '1e12']) {
          await input.fill(val, { timeout: 3000 });
          // Let React commit, without waiting for animations/third-party resources.
          await page.waitForTimeout(35);
          const text = await page.locator('body').innerText();
          item.scenarios.push({ input: i, value: val, badNumbers: text.match(badNumber) || [],
            changed: text !== item.baseline,
            warnings: text.split('\n').filter(t => /last valid|must be|cannot|invalid|minimum|maximum|enter a valid|exceed/i.test(t)).slice(0, 8) });
          await input.fill(info.value);
        }
        await input.blur();
      }
      const selects = page.locator('main select');
      for (let i = 0; i < await selects.count(); i++) {
        if (process.env.AUDIT_QUICK === '1') break;
        const select = selects.nth(i);
        if (!await select.isVisible()) continue;
        const original = await select.inputValue();
        const options = await select.locator('option:not([disabled])').evaluateAll(es => es.map(e => e.value));
        for (const val of options) {
          await select.selectOption(val);
          const text = await page.locator('body').innerText();
          item.selects.push({ input: i, value: val, badNumbers: text.match(badNumber) || [] });
        }
        await select.selectOption(original);
      }
      {
        const toggles = page.locator('main input[type=checkbox], main button[aria-pressed]');
        const total = await toggles.count();
        for (let i = 0; i < total; i++) {
          const toggle = toggles.nth(i);
          if (!await toggle.isVisible() || !await toggle.isEnabled()) continue;
          await toggle.click();
          const text = await page.locator('body').innerText();
          item.scenarios.push({ input: i, type: 'toggle', badNumbers: text.match(badNumber) || [] });
          await toggle.click();
        }
      }
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(150);
      item.mobile = await page.evaluate(() => ({
        viewport: innerWidth, documentWidth: document.documentElement.scrollWidth,
        overflowing: [...document.querySelectorAll('main input,main select,main button,main h1,main table')].filter(el => {
          const r = el.getBoundingClientRect();
          return r.width && (r.right > innerWidth + 2 || r.left < -2) &&
            !el.closest('.overflow-x-auto');
        }).map(el => ({ tag: el.tagName, text: el.textContent.slice(0, 80), right: el.getBoundingClientRect().right })).slice(0, 15)
      }));
      if (/\/(payment|mortgage-qualifier|rent-vs-buy|cap-rate|progressive-draw|scenario-compare|premium)$/.test(route)) {
        await page.screenshot({ path: path.join(out, route.replaceAll('/', '_') + '-mobile.png'), fullPage: true });
        await page.setViewportSize({ width: 1440, height: 1000 });
        await page.screenshot({ path: path.join(out, route.replaceAll('/', '_') + '-desktop.png'), fullPage: true });
      }
    } catch (error) {
      item.failure = error.message.slice(0, 1200);
    }
    results.push(item);
    fs.writeFileSync(path.join(out, 'browser-results.json'), JSON.stringify(results, null, 2));
    console.log(JSON.stringify({ route, status: item.status, inputs: item.inputs.length,
      scenarios: item.scenarios.length, bad: item.scenarios.filter(s => s.badNumbers.length).length,
      errors: item.errors.length, failure: item.failure, a11y: item.accessibility.map(v => `${v.id}:${v.count}`) }));
    await page.close();
  }
  await browser.close();
  console.log(`Completed ${results.length}/${selected.length} routes.`);
})().catch(e => { console.error(e); process.exitCode = 1; });
