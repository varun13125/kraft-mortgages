import { notFound } from 'next/navigation';
import React from 'react';

interface CityPageProps {
  params: { city: string };
}

// Pre-generated static boundaries to protect edge performance speeds
const VALID_REGIONAL_CITIES = ['surrey', 'vancouver', 'calgary', 'toronto', 'edmonton', 'ottawa'];

export async function generateStaticParams() {
  return VALID_REGIONAL_CITIES.map((city) => ({
    city: city,
  }));
}

export default async function CityBrokerageLandingPage({ params }: CityPageProps) {
  const targetCityNormalized = params?.city?.toLowerCase();

  if (!targetCityNormalized || !VALID_REGIONAL_CITIES.includes(targetCityNormalized)) {
    notFound();
  }

  const cityDisplayTitle = targetCityNormalized.charAt(0).toUpperCase() + targetCityNormalized.slice(1);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-12 flex flex-col justify-center items-center">
      <div className="max-w-2xl border border-slate-800 p-8 rounded-xl bg-slate-900 shadow-2xl text-center">
        <span className="px-3 py-1 bg-emerald-950 border border-emerald-800 rounded-full text-xs text-emerald-400 font-bold tracking-wider uppercase">
          Regional Compliance Pipeline Activated
        </span>
        <h1 className="text-3xl font-extrabold mt-4 mb-2">
          Premier Mortgage Broker in {cityDisplayTitle}, Canada
        </h1>
        <p className="text-slate-400 text-sm mb-6">
          Providing specialized alternative equity extraction solutions, commercial development draw pipelines, and CMHC MLI Select multi-unit lending options under localized cross-provincial regulatory oversight.
        </p>
        <div className="p-4 bg-slate-950 rounded border border-slate-800 text-xs text-slate-500 text-left space-y-1">
          <div>📍 Operational Footprint Vector: {cityDisplayTitle} Hub</div>
          <div>🛡️ Compliance Licensing: BCFSA | RECA | FSRA Multi-Jurisdictional Framework</div>
        </div>
      </div>
    </main>
  );
}
