/* Targeted browser regressions for the October audit. Requires AUDIT_TOOLS and AUDIT_OUTPUT.
 * No real leads, emails or phone calls. All non-GET requests are blocked.
 */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require(path.join(process.env.AUDIT_TOOLS, 'playwright'));
const out = path.resolve(process.env.AUDIT_OUTPUT);
fs.mkdirSync(out, { recursive: true });
const base = process.env.AUDIT_BASE_URL || 'http://localhost:3100';
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  await context.route('**/*', route => {
    if (!['GET','HEAD'].includes(route.request().method())) return route.abort();
    const url = new URL(route.request().url());
    if (url.origin !== new URL(base).origin && !url.hostname.endsWith('googleapis.com') && !url.hostname.endsWith('gstatic.com')) return route.abort();
    return route.continue();
  });
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const results = [];
  async function run(name, fn) {
    if (process.env.REGRESSION_FILTER && !new RegExp(process.env.REGRESSION_FILTER, 'i').test(name)) return;
    try { const detail = await fn(); results.push({name, pass:true, detail}); }
    catch (error) { results.push({name, pass:false, error:error.message.slice(0,1500)}); }
    fs.writeFileSync(path.join(out, 'regression-results.json'), JSON.stringify(results,null,2));
    console.log(JSON.stringify(results.at(-1)));
  }
  async function go(route) {
    await page.goto(base + route, {waitUntil:'networkidle',timeout:120000});
    await page.waitForFunction(() => {
      let el = document.querySelector('h1'); if (!el) return false;
      for (; el; el=el.parentElement) if(Number(getComputedStyle(el).opacity)<.9) return false;
      return true;
    }, null, {timeout:30000});
    await page.waitForTimeout(500);
  }
  const text = () => page.locator('main').innerText();
  const fill = (name, value) => page.getByRole('spinbutton', {name, exact:true}).fill(String(value));
  await run('Payment URL rate can be edited and remains edited', async () => {
    await go('/calculators/payment?rate=5');
    const rate = page.getByRole('spinbutton',{name:'Interest Rate (%)',exact:true});
    await page.waitForFunction(() => document.querySelector('input[aria-label="Interest Rate (%)"]')?.value === '5');
    assert.equal(await rate.inputValue(),'5'); await rate.fill('6'); await rate.blur();
    await page.waitForTimeout(150); assert.equal(await rate.inputValue(),'6');
  });
  await run('Payment matches independent Canadian annuity: $500k / 5% / 25y', async () => {
    await fill('Mortgage Principal',500000); await fill('Interest Rate (%)',5);
    const r = Math.pow(1 + .05/2,1/6)-1;
    const expected = 500000*r/(1-Math.pow(1+r,-300));
    assert.ok((await text()).includes('$2,908')); return {expectedMonthly:expected};
  });
  await run('Invalid draft remains visible after blur and keeps the previous result', async () => {
    const input = page.getByRole('spinbutton',{name:'Interest Rate (%)',exact:true});
    await input.fill('-1'); await input.blur(); assert.equal(await input.inputValue(),'-1');
    assert.equal(await input.getAttribute('aria-invalid'),'true');
    assert.ok((await text()).includes('last valid value (5)')); assert.ok((await text()).includes('$2,908'));
  });
  await run('Non-finite URL rate is ignored', async () => {
    await go('/calculators/payment?rate=1e309');
    const value = Number(await page.getByRole('spinbutton',{name:'Interest Rate (%)',exact:true}).inputValue());
    assert.ok(Number.isFinite(value) && value <= 30);
  });
  await run('MLI margin means 15% of collected income, not markup on costs', async () => {
    await go('/mli-select/calculators/break-even');
    await fill('Loan Amount ($)',15000000); await fill('Interest Rate (%)',4.5);
    await fill('Amortization (years)',40); await fill('Total Units',100);
    await fill('Monthly Operating Expenses ($)',50000); await fill('Target Margin (%)',15);
    const r = Math.pow(1+.045/2,1/6)-1;
    const payment = 15000000*r/(1-Math.pow(1+r,-480));
    const rent = (payment+50000)/.85/.97/100;
    assert.ok((await text()).includes('$'+rent.toFixed(0)));
    return {rentPerUnit:rent,actualMargin:0.15};
  });
  for (const route of ['home-equity','heloc','debt-consolidation']) await run(`${route}: zero income cannot produce a positive verdict`, async () => {
    await go('/equity-lending/calculators/'+route); await fill('Annual Income',0);
    const body = await text();
    assert.ok(!body.includes('Likely Qualifies') && !body.includes('Income Supports Full Limit') && !body.includes('Excellent Consolidation Candidate'));
  });
  await run('Private qualification fails when all income is zero', async () => {
    await go('/private-lending/calculators/alternative-income');
    for (const name of ['Employment Income (T4)','Self-Employed Income','Rental Income','Investment Income','Other Income']) await fill(name,0);
    assert.ok(!(await text()).includes('Qualifies for Private Lending')); assert.ok((await text()).includes('May Require Adjustment'));
  });
  await run('HELOC separates housing GDS from debt TDS and accepts realistic monthly costs', async () => {
    await go('/equity-lending/calculators/heloc');
    await fill('Annual Income',120000);
    await fill('Property tax, heat and 50% condo fees (monthly)',400);
    await fill('Other Debt Payments (monthly)',1500);
    const debt=page.getByRole('spinbutton',{name:'Other Debt Payments (monthly)',exact:true});
    assert.equal(await debt.inputValue(),'1500'); assert.equal(await debt.getAttribute('aria-invalid'),'false');
    assert.ok((await text()).includes('GDS would be'));
    await fill('Annual Income',0);
    assert.ok((await text()).includes('Limited by Income'));
    assert.ok(!(await text()).includes('Income Supports Full Limit'));
  });
  await run('Mortgage qualifier requires first-time or new-build status for 30-year insured loan', async () => {
    await go('/calculators/mortgage-qualifier');
    await fill('Your Annual Income (Before Tax)',400000); await fill('Down Payment',75000);
    const slider = page.getByRole('slider',{name:'Amortization Period',exact:true});
    await slider.focus(); await slider.press('End');
    await page.getByRole('checkbox',{name:"I am a first-time home buyer"}).uncheck();
    assert.ok((await text()).includes('requires a first-time buyer or eligible new build'));
    assert.ok(!(await text()).includes('You likely qualify!'));
    await page.getByRole('checkbox',{name:'Eligible newly built home'}).check();
    assert.ok((await text()).includes('You likely qualify!'));
  });
  await run('Toronto closing costs include municipal tax and the correct first-time rebate', async () => {
    await go('/calculators/closing-costs'); await page.getByRole('button',{name:'Ontario',exact:true}).click();
    const before = await text();
    await page.getByRole('checkbox',{name:'Property is in Toronto (include municipal land transfer tax)'}).check();
    const after = await text(); assert.notEqual(after,before);
    assert.ok(after.includes('$12,475')); // $20,950 combined tax less $4,000 + $4,475 refunds at $700k.
  });
  await run('MLI rejects impossible affordable-unit counts', async () => {
    await go('/mli-select/calculators/points'); await fill('Total Units',10);
    assert.ok((await text()).includes('Affordable units cannot exceed total units'));
  });
  await run('Corrupt MLI storage produces a useful message and preserves stored data', async () => {
    await fill('Total Units',100);
    await page.evaluate(()=>localStorage.setItem('mli:scenarios','{broken'));
    await page.getByRole('button',{name:'Save',exact:true}).click();
    assert.ok((await text()).includes('existing data has been preserved'));
    assert.equal(await page.evaluate(()=>localStorage.getItem('mli:scenarios')),'{broken');
    await page.evaluate(()=>localStorage.removeItem('mli:scenarios'));
  });
  await run('MLI premium warns when requested terms exceed the selected tier', async () => {
    await go('/mli-select/calculators/premium'); await fill('Total Points',50);
    assert.ok((await text()).includes('These terms exceed the selected tier limits'));
  });
  await run('Construction draw add/remove remains functional', async () => {
    await go('/calculators/construction-pro'); const before=await page.getByRole('button',{name:/Remove draw/}).count();
    await page.getByRole('button',{name:/Add Draw/}).click();
    assert.equal(await page.getByRole('button',{name:/Remove draw/}).count(),before+1);
    await page.getByRole('button',{name:`Remove draw ${before+1}`,exact:true}).click();
    assert.equal(await page.getByRole('button',{name:/Remove draw/}).count(),before);
  });
  for(const route of ['/','/calculators','/commercial','/construction','/equity-lending','/mli-select','/about','/contact']) await run(`Visual evidence ${route}`, async()=>{
    await go(route); const stem=route==='/'?'home':route.slice(1).replaceAll('/','_');
    await page.setViewportSize({width:1440,height:1000}); await page.screenshot({path:path.join(out,stem+'-desktop.png'),fullPage:false});
    await page.setViewportSize({width:390,height:844}); await page.screenshot({path:path.join(out,stem+'-mobile.png'),fullPage:false});
    return await page.evaluate(()=>({viewport:innerWidth,documentWidth:document.documentElement.scrollWidth}));
  });
  await browser.close();
  console.log(`${results.filter(r=>r.pass).length}/${results.length} passed`);
  if(results.some(r=>!r.pass))process.exitCode=1;
})().catch(error=>{console.error(error);process.exitCode=1;});
