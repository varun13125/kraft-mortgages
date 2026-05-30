import { notFound } from 'next/navigation';
import React from 'react';

interface CityPageProps {
  params: { city: string };
}

interface RegionalMetadata {
  name: string;
  province: string;
  regulatoryBody: string;
  license: string;
}

const CITY_METADATA: Record<string, RegionalMetadata> = {
  surrey: { name: 'Surrey', province: 'British Columbia', regulatoryBody: 'BCFSA', license: 'BCFSA License #SR220230' },
  vancouver: { name: 'Vancouver', province: 'British Columbia', regulatoryBody: 'BCFSA', license: 'BCFSA License #SR220230' },
  burnaby: { name: 'Burnaby', province: 'British Columbia', regulatoryBody: 'BCFSA', license: 'BCFSA License #SR220230' },
  richmond: { name: 'Richmond', province: 'British Columbia', regulatoryBody: 'BCFSA', license: 'BCFSA License #SR220230' },
  kelowna: { name: 'Kelowna', province: 'British Columbia', regulatoryBody: 'BCFSA', license: 'BCFSA License #SR220230' },
  calgary: { name: 'Calgary', province: 'Alberta', regulatoryBody: 'RECA', license: 'LIC-00655428' },
  edmonton: { name: 'Edmonton', province: 'Alberta', regulatoryBody: 'RECA', license: 'LIC-00655428' },
  toronto: { name: 'Toronto', province: 'Ontario', regulatoryBody: 'FSRA', license: 'FSRA #12918' },
  ottawa: { name: 'Ottawa', province: 'Ontario', regulatoryBody: 'FSRA', license: 'FSRA #12918' },
  mississauga: { name: 'Mississauga', province: 'Ontario', regulatoryBody: 'FSRA', license: 'FSRA #12918' },
  brampton: { name: 'Brampton', province: 'Ontario', regulatoryBody: 'FSRA', license: 'FSRA #12918' },
};

export async function generateStaticParams() {
  return Object.keys(CITY_METADATA).map((city) => ({
    city: city,
  }));
}

export default async function CityBrokerageLandingPage({ params }: CityPageProps) {
  const targetCityNormalized = params?.city?.toLowerCase();

  if (!targetCityNormalized || !CITY_METADATA[targetCityNormalized]) {
    notFound();
  }

  const meta = CITY_METADATA[targetCityNormalized];

  return (
    <main className="min-h-screen bg-slate-950 text-white p-12 flex flex-col justify-center items-center">
      <div className="max-w-2xl border border-slate-800 p-8 rounded-xl bg-slate-900 shadow-2xl text-center">
        <span className="px-3 py-1 bg-emerald-950 border border-emerald-800 rounded-full text-xs text-emerald-400 font-bold tracking-wider uppercase">
          Regional Compliance Pipeline Activated
        </span>
        <h1 className="text-3xl font-extrabold mt-4 mb-2">
          Premier Mortgage Broker in {meta.name}, {meta.province}
        </h1>
        <p className="text-slate-400 text-sm mb-6">
          Providing specialized alternative equity extraction solutions, commercial development draw pipelines, and CMHC MLI Select multi-unit lending options under localized cross-provincial regulatory oversight.
        </p>
        <div className="p-4 bg-slate-950 rounded border border-slate-800 text-xs text-slate-400 text-left space-y-2">
          <div>📍 Operational Footprint Vector: {meta.name} Hub</div>
          <div>🛡️ Compliance Licensing: {meta.regulatoryBody} Multi-Jurisdictional Framework</div>
          <div>📋 License Identifier: {meta.license}</div>
        </div>
      </div>
    </main>
  );
}
