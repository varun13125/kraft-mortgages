import { test } from 'node:test';
import assert from 'node:assert/strict';
import { importApp } from '../specialty/helpers/register-ts-paths.mjs';
const { benchmarkRateAnswer } = await importApp('lib/ai/chat/rateAnswers.ts');
const { submitCrmLead } = await importApp('lib/crm/submitLead.ts');

const now = Date.parse('2026-10-20T12:00:00Z');
const offer = (lender,rate,spread='Prime - 1.01%') => ({lender,rate,spread,product:'5 Year Variable',effective_date:'2026-10-20'});
const bucket = {lowest_rate:3.44,lowest_spread:'Prime - 1.01%',leading_lender:'Regional Credit Union',top_offers:[offer('Regional Credit Union',3.44),offer('National Lender',3.70,'Prime - 0.75%')]};
const family={insured:bucket,conventional:{...bucket,lowest_rate:3.80,top_offers:[offer('National Lender',3.80,'Prime - 0.65%')]}};
const rates={success:true,last_synced_utc:'2026-10-20T07:00:00Z',prime_rate:4.45,benchmarks:{variable_5yr:family,fixed_5yr:family,fixed_3yr:family}};
const markets=[{name:'Regional Credit Union',provinces:['ON']},{name:'National Lender',provinces:['BC','AB','ON']}];

test('simple variable answer is brief, dated and excludes known out-of-province offers',()=>{
  const bc=benchmarkRateAnswer('what is the current best variable rate',rates,'BC',markets,now);
  assert.match(bc,/3\.70%/);assert.doesNotMatch(bc,/3\.44|5-year fixed|\/apply|Bank of Canada Prime|rate hold/i);
  assert.match(bc,/Oct 20, 2026/);assert.ok(bc.split(/\s+/).length<110);
  assert.match(benchmarkRateAnswer('best variable rate',rates,'ON',markets,now),/3\.44%/);
});
test('refinance uses conventional product; unavailable terms never substitute a five-year rate',()=>{
  assert.match(benchmarkRateAnswer('variable refinance rate',rates,'BC',markets,now),/3\.80%.*conventional/s);
  for(const text of ['3-year variable rate','1 year fixed rate','compare fixed and variable rates','why do rates change']) assert.equal(benchmarkRateAnswer(text,rates,'BC',markets,now),null);
});
test('stale, unavailable and future rate feeds never produce a numeric quote',()=>{
  for(const feed of [null,{...rates,success:false},{...rates,last_synced_utc:'2026-09-01'},{...rates,last_synced_utc:'2027-01-01'}]) {
    const reply=benchmarkRateAnswer('best variable rate',feed,'BC',markets,now);
    assert.doesNotMatch(reply,/\d+\.\d+%/);assert.match(reply,/can’t verify/);
  }
  const prime=benchmarkRateAnswer('what is prime rate',rates,'BC',markets,now);
  assert.match(prime,/Banks set their own prime/);assert.match(prime,/4\.45%/);
});
test('unknown lender coverage cannot be advertised as an eligible regional rate',()=>{
  const reply=benchmarkRateAnswer('best variable rate',rates,'BC',[],now);
  assert.match(reply,/can’t verify one for BC/);assert.doesNotMatch(reply,/3\.44%|3\.70%/);
});
test('owner message-only workflow disables automated callback campaigns',async()=>{
  const { AUTOMATED_CALLBACKS_ENABLED }=await importApp('lib/voice/workflow.ts');
  assert.equal(AUTOMATED_CALLBACKS_ENABLED,false);
});
test('CRM delivery requires a genuine receipt; HTTP 200 or non-JSON is insufficient',async()=>{
  const original=globalThis.fetch;
  try {
    for(const [body,status,expected] of [[{success:true,personId:'id'},200,true],[{success:true},200,false],[{success:false},200,false],[{success:true,personId:'id'},502,false]]) {
      globalThis.fetch=async()=>new Response(JSON.stringify(body),{status});
      assert.equal(await submitCrmLead({firstName:'AUDIT'}),expected);
    }
    globalThis.fetch=async()=>new Response('<html>login</html>'); assert.equal(await submitCrmLead({}),false);
    globalThis.fetch=async()=>{throw Error('timeout')};assert.equal(await submitCrmLead({}),false);
  } finally {globalThis.fetch=original;}
});
