"use client";
import { useState } from "react";
import SectionHero from "@/components/SectionHero";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  return (<>
    <SectionHero title="Contact Us" subtitle="Request an MLI Select assessment — we’ll respond same business day." />
    <section className="section-pad">
      <div className="container-tight grid gap-6 md:grid-cols-2">
        <div className="card">
          <div className="card-body">
            {!sent ? (
              <form onSubmit={(e)=>{ e.preventDefault(); setSent(true); }} className="grid gap-3">
                <label>Name</label><input required placeholder="Your name" />
                <label>Email</label><input required type="email" placeholder="you@example.com" />
                <label>Phone (optional)</label><input placeholder="+1 (___) ___-____" />
                <label>Project Type</label>
                <select><option>New Build</option><option>Refinance</option><option>Retrofit</option><option>Other</option></select>
                <label>Message</label><textarea rows={5} placeholder="Tell us about your project…" />
                <button className="btn btn-primary mt-2" type="submit">Send</button>
              </form>
            ) : (
              <div>
                <h3 className="text-lg font-semibold">Thanks — we’ll be in touch!</h3>
                <p className="text-sm text-slate-600 mt-1">You’ll receive a confirmation shortly.</p>
              </div>
            )}
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <h3 className="text-lg font-semibold">Why Kraft Mortgages</h3>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1 mt-2">
              <li>Deep CMHC multi-unit expertise</li>
              <li>Fast scenario sizing & underwriting packaging</li>
              <li>Nationwide lender network</li>
              <li>Hands-on support from LOI to funding</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </>);
}
