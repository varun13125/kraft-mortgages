/* Safe browser verification: no calls, leads, emails or non-GET requests. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require(path.join(process.env.AUDIT_TOOLS, 'playwright'));
const AxeBuilder = require(path.join(process.env.AUDIT_TOOLS, '@axe-core/playwright')).default;
const base = process.env.AUDIT_BASE_URL || 'http://localhost:3100';
const out = path.resolve(process.env.AUDIT_OUTPUT);
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce', acceptDownloads: true });
  await context.route('**/*', route => {
    const req = route.request(), url = new URL(req.url());
    if (!['GET','HEAD'].includes(req.method())) return route.abort();
    if (url.origin !== new URL(base).origin && !url.hostname.endsWith('googleapis.com') && !url.hostname.endsWith('gstatic.com')) return route.abort();
    return route.continue();
  });
  const page = await context.newPage(), results = [], errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.setDefaultTimeout(20000);
  async function run(name, fn) {
    if (process.env.PREMIUM_FILTER && !new RegExp(process.env.PREMIUM_FILTER, 'i').test(name)) return;
    try { const detail = await fn(); results.push({ name, pass: true, detail }); }
    catch(e) { results.push({ name, pass: false, error: e.message.slice(0,1800) }); }
    console.log(JSON.stringify(results.at(-1)));
    fs.writeFileSync(path.join(out, 'premium-regressions.json'), JSON.stringify({ results, errors }, null, 2));
  }
  async function go(route) {
    const res = await page.goto(base + route, { waitUntil: 'networkidle', timeout: 120000 });
    assert.equal(res.status(),200); await page.locator('h1').first().waitFor(); await page.waitForTimeout(700);
  }
  const fill = async (name, value) => { await page.getByRole('spinbutton',{name,exact:true}).fill(String(value)); await page.waitForTimeout(100); };
  const main = () => page.locator('main').innerText();
  await run('directory searches every public calculator and filters by goal', async () => {
    await go('/calculators'); assert.equal(await page.locator('.calc-catalog a').count(),53);
    await page.getByRole('searchbox').fill('renewal'); assert.equal(await page.locator('.calc-catalog a').count(),1);
    await page.getByRole('searchbox').fill(''); await page.getByRole('button',{name:'Rental development',exact:true}).click(); assert.equal(await page.locator('.calc-catalog a').count(),10);
    await page.getByRole('searchbox').fill('no-such-tool'); assert.ok((await main()).includes('No calculators match'));
  });
  await run('payment preserves URL/manual rate and matches independent Canadian payment', async () => {
    await go('/calculators/payment?rate=5'); await fill('Mortgage Principal',500000);
    assert.equal(await page.getByRole('spinbutton',{name:'Interest Rate (%)',exact:true}).inputValue(),'5');
    assert.ok((await main()).includes('$2,908.02'));
    await fill('Interest Rate (%)',6); await page.waitForTimeout(300); assert.equal(await page.getByRole('spinbutton',{name:'Interest Rate (%)',exact:true}).inputValue(),'6');
    await fill('Interest Rate (%)',-1); await page.getByRole('spinbutton',{name:'Interest Rate (%)',exact:true}).blur(); assert.ok((await main()).includes('last valid value (6)'));
  });
  await run('renewal uses renewal quote, handles extension, fees, cashback and early-break horizon', async () => {
    await go('/calculators/renewal');
    await fill('Quoted renewal rate (%)',5); await fill('Offer A rate (%)',5); await fill('Offer B rate (%)',6);
    await fill('Your lender amortization (years)',20); await fill('Offer A amortization (years)',30); await fill('Offer B retained cashback ($)',0);
    assert.ok((await page.locator('.calc-results h2').first().innerText()).includes('Your lender'));
    await fill('Offer A rate (%)',4); await fill('Offer A cash-paid fees ($)',2000); await fill('Offer A retained cashback ($)',500);
    await page.getByRole('checkbox',{name:'I am considering breaking my mortgage before renewal'}).check();
    assert.ok((await main()).includes('Comparison limited to 36 months'));
    assert.equal(await page.getByRole('spinbutton',{name:'Actual payout penalty ($)',exact:true}).inputValue(),'20000');
    await fill('Your lender remaining term (months)',12); assert.ok((await main()).includes('Comparison limited to 12 months'));
  });
  await run('MLI eligibility suppresses invalid units; financed premium affects sizing and tier caps apply', async () => {
    await go('/mli-select/calculators/deal-sizer');
    const before = await page.getByTestId('mli-base-loan').innerText(); await fill('Annual stabilized NOI ($)',800000);
    const financed = await page.getByTestId('mli-base-loan').innerText(); assert.notEqual(before,financed);
    await page.getByRole('checkbox',{name:'Add the insurance premium to the mortgage'}).uncheck();
    assert.notEqual(await page.getByTestId('mli-base-loan').innerText(),financed);
    await fill('Affordable units',25.5); assert.ok((await main()).includes('Review this scenario')); assert.equal(await page.getByTestId('mli-base-loan').count(),0);
    await fill('Affordable units',101); assert.ok((await main()).includes('Review this scenario')); assert.equal(await page.getByTestId('mli-base-loan').count(),0);
    await fill('Affordable units',10); await fill('Energy improvement vs NECB Tier 1 (%)',0);
    await page.getByText('Accessibility commitments',{exact:true}).click(); await fill('Accessible units (%)',0);
    assert.ok((await main()).includes('40-year tier maximum'));
    await fill('Affordable units',0); assert.ok((await main()).includes('50-point MLI Select threshold'));
  });
  await run('one help launcher, keyboard close, chat focus and voice consent without a call', async () => {
    await go('/calculators/payment');
    assert.equal(await page.getByRole('button',{name:'Get guidance',exact:true}).count(),1);
    await page.getByRole('button',{name:'Get guidance',exact:true}).click();
    let scan = await new AxeBuilder({page}).include('.advisor-help').withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
    assert.deepEqual(scan.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
    await page.getByRole('button',{name:'Ask the AI assistant'}).click();
    await page.getByRole('dialog',{name:'Kraft Mortgages AI chat assistant'}).waitFor(); await page.waitForTimeout(300);
    assert.equal(await page.getByRole('button',{name:'Get guidance',exact:true}).count(),0);
    scan = await new AxeBuilder({page}).include('[role="dialog"]').withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
    assert.deepEqual(scan.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
    await page.getByRole('button',{name:'Close AI chat',exact:true}).click();
    await page.getByRole('button',{name:'Get guidance',exact:true}).click();
    await page.getByRole('button',{name:'Ask the AI assistant'}).click();
    await page.keyboard.press('Escape'); await page.getByRole('button',{name:'Get guidance',exact:true}).waitFor();
    assert.equal(await page.evaluate(() => document.activeElement?.textContent),'Get guidance');
    await page.getByRole('button',{name:'Get guidance',exact:true}).click(); await page.getByRole('button',{name:'Talk to voice AI'}).click();
    await page.getByRole('dialog',{name:'Kraft Mortgages voice AI assistant'}).waitFor();
    await page.waitForTimeout(250);
    scan = await new AxeBuilder({page}).include('[role="dialog"]').withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
    assert.deepEqual(scan.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
    assert.equal(await page.locator('#thinkrr-voice-container').count(),0);
    await page.keyboard.press('Escape'); await page.getByRole('button',{name:'Get guidance',exact:true}).waitFor();
    return 'No call view mounted and all non-GET requests blocked.';
  });
  for (const [route,slug] of [['/calculators/payment','payment'],['/calculators/renewal','renewal'],['/mli-select/calculators/deal-sizer','mli-deal']]) {
    await run(`${slug}: PDF reflects current results and downloads without lead capture`, async () => {
      await go(route); const downloaded = page.waitForEvent('download'); await page.getByRole('button',{name:'Download scenario PDF',exact:true}).click();
      const download = await downloaded; const file = path.join(out,slug+'-scenario.pdf'); await download.saveAs(file);
      const bytes = fs.readFileSync(file); assert.equal(bytes.subarray(0,5).toString(),'%PDF-'); assert.ok(bytes.length > 5000);
      const resultNumber = slug === 'payment' ? await page.getByTestId('monthly-payment').innerText() : slug === 'mli-deal' ? await page.getByTestId('mli-base-loan').innerText() : await page.getByTestId('renewal-savings').innerText();
      assert.ok(bytes.toString('latin1').includes(resultNumber.replace(/,/g,',')), `PDF must contain displayed result ${resultNumber}`);
      assert.equal(await page.getByRole('dialog').count(),0); return { bytes: bytes.length, result: resultNumber };
    });
    await run(`${slug}: desktop/mobile accessibility, no overflow and visual capture`, async () => {
      await go(route); const canonical = await page.locator('link[rel=canonical]').getAttribute('href'); assert.equal(new URL(canonical).pathname,route);
      for (const [width,height] of [[1440,1000],[390,844],[320,740]]) {
        await page.setViewportSize({width,height}); await page.waitForTimeout(200);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
        const scan = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
        assert.deepEqual(scan.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
        if(width===390) assert.equal(await page.locator('.calc-mobile-summary').isVisible(),true);
        if(width!==320) await page.screenshot({path:path.join(out,`${slug}-${width}.png`),fullPage:true});
      }
      await page.setViewportSize({width:1440,height:1000});
    });
  }
  await run('no uncaught browser errors', () => assert.deepEqual(errors,[]));
  await browser.close();
  if(results.some(r=>!r.pass)) process.exitCode=1;
})();
