import Link from "next/link";

export const dynamic = "force-dynamic";

export default function MLILanding() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              MLI Select
            </span>{" "}
            Program
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Canada&apos;s most sophisticated multi-unit mortgage insurance program. 
            Save hundreds of thousands in CMHC premiums with our expertise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={"/mli-select" as any}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Access MLI Select Portal
            </Link>
            <Link
              href={"/contact" as any}
              className="px-8 py-4 border border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"
            >
              Get Free Assessment
            </Link>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose MLI Select?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Up to 50% Savings</h3>
              <p className="text-gray-300">Significant premium reductions through our three-pillar system</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">5+ Unit Properties</h3>
              <p className="text-gray-300">Designed for multi-unit residential developments</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Guidance</h3>
              <p className="text-gray-300">100+ successful applications with 95% approval rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Save on Your MLI Select Project?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Our MLI Select specialists are here to help you maximize your savings and streamline your application.
          </p>
          <Link
            href={"/mli-select" as any}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold rounded-lg transition-colors inline-block"
          >
            Access Full MLI Select Portal →
          </Link>
        </div>
      </section>
    </div>
  );
}