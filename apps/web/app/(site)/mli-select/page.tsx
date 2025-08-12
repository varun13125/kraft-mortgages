import Link from "next/link";

export const dynamic = "force-dynamic";

export default function MliSelectHub() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-4">CMHC MLI Select — Program Hub</h1>
      <p className="text-gray-600 mb-6">Explore our complete MLI Select microsite with calculators, eligibility, scoring, and FAQs.</p>
      <div className="flex gap-3">
        <a href="/mli" className="px-4 py-2 rounded bg-blue-600 text-white">Open Full MLI Select Microsite</a>
      </div>
    </div>
  );
}
