// CRTC recipient-local calling window (lib/businessHours.ts).
import { test } from "node:test";
import assert from "node:assert/strict";
import { isRecipientCallable, recipientTimeZones, getCallingHoursStatus } from "../../lib/businessHours.ts";

// 2026-10-14 is a Wednesday. 02:00 UTC Thu = 19:00 PDT Wed = 22:00 EDT Wed.
const wedEvening = new Date("2026-10-15T02:00:00Z");

test("area codes map to time zones (unknown -> Pacific + Eastern)", () => {
  assert.deepEqual(recipientTimeZones("+1 (604) 555-0100"), ["America/Vancouver"]);
  assert.deepEqual(recipientTimeZones("4165550100"), ["America/Toronto"]);
  assert.deepEqual(recipientTimeZones("14035550100"), ["America/Edmonton"]);
  assert.deepEqual(recipientTimeZones("555"), ["America/Vancouver", "America/Toronto"]);
});

test("7pm Pacific: office open, Vancouver callable, Toronto (10pm) not callable", () => {
  assert.equal(getCallingHoursStatus(wedEvening).isOpen, true);
  assert.equal(isRecipientCallable("6045550100", wedEvening), true);
  assert.equal(isRecipientCallable("4165550100", wedEvening), false);
  assert.equal(isRecipientCallable(undefined, wedEvening), false); // unknown -> must fit Eastern too
});

test("weekday mid-morning Pacific is callable everywhere in BC/AB/ON", () => {
  const wedMorning = new Date("2026-10-14T17:00:00Z"); // 10:00 PDT / 13:00 EDT
  for (const p of ["6045550100", "4035550100", "4165550100", "8075550100"]) {
    assert.equal(isRecipientCallable(p, wedMorning), true, p);
  }
});

test("weekend window is 10:00-18:00 recipient time", () => {
  const satEarlyEast = new Date("2026-10-17T13:30:00Z"); // 09:30 EDT Sat
  assert.equal(isRecipientCallable("4165550100", satEarlyEast), false);
  const satNoonEast = new Date("2026-10-17T16:00:00Z"); // 12:00 EDT / 09:00 PDT
  assert.equal(isRecipientCallable("4165550100", satNoonEast), true);
  assert.equal(isRecipientCallable("6045550100", satNoonEast), false);
});
