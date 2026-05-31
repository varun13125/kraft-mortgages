import { notFound } from 'next/navigation';
import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Navigation from "@/components/Navigation";
import { MapPin, Phone, Building, Users, Briefcase, Home, TrendingUp } from "lucide-react";

export const dynamicParams = true;

interface CityPageProps {
  params: { city: string };
}

interface FAQ {
  question: string;
  answer: string;
}

interface RegionalMetadata {
  name: string;
  province: string;
  regulatoryBody: string;
  license: string;
  heading: string;
  description: string;
  marketOverview: string;
  faqs: FAQ[];
}

const CITY_METADATA: Record<string, RegionalMetadata> = {
  surrey: {
    name: 'Surrey',
    province: 'British Columbia',
    regulatoryBody: 'BCFSA',
    license: 'BCFSA License #SR220230',
    heading: "Surrey's Premier Mortgage Brokerage",
    description: "Navigate Surrey's fast-growing housing market with expert mortgage strategies. From transit-oriented townhouse developments to detached family homes, we secure the lowest rates available.",
    marketOverview: "Surrey is on track to become British Columbia's most populous city. Its real estate market is incredibly diverse, offering excellent opportunities for first-time home buyers, growing families, and commercial real estate investors.",
    faqs: [
      { question: "What is the down payment requirement in Surrey?", answer: "Down payment guidelines follow standard Canadian metrics: 5% for the first $500,000, 10% for any portion between $500,000 and $999,999, and 20% for homes valued at $1 million or more." },
      { question: "Are there specific programs for first-time buyers in Surrey?", answer: "Yes, you can leverage the federal First Home Savings Account (FHSA) and provincial property transfer tax exemptions to maximize your affordability in Surrey." }
    ]
  },
  vancouver: {
    name: 'Vancouver',
    province: 'British Columbia',
    regulatoryBody: 'BCFSA',
    license: 'BCFSA License #SR220230',
    heading: "Vancouver's Premier Mortgage Brokerage",
    description: "Get elite mortgage strategies tailored for Vancouver's premium property market. From downtown condos to West Side properties, we negotiate custom solutions with top institutional lenders.",
    marketOverview: "Vancouver is a world-class, highly competitive real estate market. Average home values exceed $1.2 million, making fast mortgage pre-approval and deep lender relationships crucial for successful purchasing.",
    faqs: [
      { question: "What is the minimum down payment for a home over $1 Million in Vancouver?", answer: "Properties priced at $1,000,000 or above require a minimum 20% down payment because they are ineligible for government-backed default insurance." },
      { question: "Can I qualify for an investment property mortgage in Vancouver?", answer: "Yes, we work with specialized lenders who recognize up to 80% of rental income to help you qualify for high-value Vancouver real estate investments." }
    ]
  },
  burnaby: {
    name: 'Burnaby',
    province: 'British Columbia',
    regulatoryBody: 'BCFSA',
    license: 'BCFSA License #SR220230',
    heading: "Burnaby's Premier Mortgage Brokerage",
    description: "Maximize your buying power in Burnaby. Whether purchasing a modern high-rise condo in Metrotown or a family home in Brentwood, we deliver market-leading mortgage solutions.",
    marketOverview: "Burnaby's real estate market offers high-density transit hubs and quiet residential communities. It serves as a major economic center in Metro Vancouver, attracting families, professionals, and investors.",
    faqs: [
      { question: "How does SkyTrain proximity affect Burnaby property appraisals?", answer: "Properties near major transit hubs like Brentwood or Metrotown generally hold premium values and are highly favored by institutional lenders." },
      { question: "Are condo mortgages easy to secure in Burnaby?", answer: "Yes, provided the strata corporation is in good financial health and the building has no major outstanding special assessments." }
    ]
  },
  richmond: {
    name: 'Richmond',
    province: 'British Columbia',
    regulatoryBody: 'BCFSA',
    license: 'BCFSA License #SR220230',
    heading: "Richmond's Premier Mortgage Brokerage",
    description: "Secure the best interest rates in Richmond. We specialize in custom financing for residential homes, strata condos, and new construction projects under localized BC regulations.",
    marketOverview: "Richmond's housing market is known for its strong community character, excellent transit connections, and high-demand waterfront developments along the Fraser River.",
    faqs: [
      { question: "Can I get a mortgage for a property with a secondary suite in Richmond?", answer: "Yes, secondary suites are excellent for generating helper income, which many lenders allow us to add to your qualification calculations." },
      { question: "What should I know about soil and flood insurance in Richmond?", answer: "Strata complexes and homes in Richmond have specific engineering standards. Lenders are fully familiar with these and require standard title insurance at closing." }
    ]
  },
  kelowna: {
    name: 'Kelowna',
    province: 'British Columbia',
    regulatoryBody: 'BCFSA',
    license: 'BCFSA License #SR220230',
    heading: "Kelowna's Premier Mortgage Brokerage",
    description: "Finance your Okanagan dream home with Kelowna's mortgage experts. We provide tailored solutions for recreational properties, secondary homes, and primary residences.",
    marketOverview: "Kelowna is the economic hub of the Okanagan Valley, featuring a highly active real estate market driven by lifestyle buyers, retirees, and a growing technology sector.",
    faqs: [
      { question: "How do lenders view seasonal or recreational properties in Kelowna?", answer: "If a property is winterized, has year-round road access, and has a permanent heat source, it can be financed under standard residential terms." },
      { question: "Are vacation rentals easy to finance in Kelowna?", answer: "Yes, although vacation rentals have unique zoning regulations. We work with lenders who specialize in tourism-driven real estate financing." }
    ]
  },
  calgary: {
    name: 'Calgary',
    province: 'Alberta',
    regulatoryBody: 'RECA',
    license: 'LIC-00655428',
    heading: "Calgary's Premier Mortgage Brokerage",
    description: "Navigating Calgary's dynamic real estate market takes more than luck — it takes a mortgage broker who knows every neighbourhood, from Beltline condos to detached homes in Mahogany, and every strategy to secure the best rates.",
    marketOverview: "Calgary's real estate market has experienced rapid growth, with the average home price near $580,000 in early 2025. Driven by interprovincial migration and strong economic fundamentals, the market spans highly sought-after inner-city condos and expansive suburban single-family developments.",
    faqs: [
      {
        question: "What is the minimum down payment required in Calgary?",
        answer: "For homes under $500,000, the minimum is 5%. For homes between $500,000 and $999,999, it is 5% on the first $500,000 and 10% on the remainder. For homes over $1 million, it is 20%. Given Calgary's relative affordability, many buyers can enter the market with under $40,000 down."
      },
      {
        question: "How does the Alberta prompt-pay legislation affect builder mortgages in Calgary?",
        answer: "Alberta's prompt payment rules keep construction projects moving. For custom home builds or developer draws in neighbourhoods like Mahogany or Aspen Woods, we structure progress draw mortgages that align perfectly with contractor billing schedules."
      },
      {
        question: "Can I qualify for a Calgary mortgage using interprovincial relocation income?",
        answer: "Yes! Many buyers relocating from Vancouver or Toronto purchase homes in Calgary before moving. If you have a confirmed job offer or remote work agreement with your employer, we have lenders who will approve your mortgage based on that transition income."
      },
      {
        question: "What are the best neighbourhoods for first-time buyers in Calgary?",
        answer: "Neighbourhoods like Evanston and Redstone in the north, or legacy communities in the south, offer excellent value-per-square-foot. Inner-city areas like the Beltline and Bridgeland are popular for condos. We can help you secure pre-approvals for all options."
      },
      {
        question: "Do I need a local Calgary mortgage broker?",
        answer: "Absolutely. A local broker understands Alberta's land title registration system, property transfer procedures, and local market dynamics, assuring a smooth closing process."
      }
    ]
  },
  edmonton: {
    name: 'Edmonton',
    province: 'Alberta',
    regulatoryBody: 'RECA',
    license: 'LIC-00655428',
    heading: "Edmonton's Premier Mortgage Brokerage",
    description: "Edmonton's real estate market offers incredible affordability and opportunity. From mature neighbourhoods like Strathcona to new developments in Windermere, we secure the absolute lowest interest rates for your home purchase.",
    marketOverview: "Edmonton remains one of the most accessible major metropolitan housing markets in Canada, with average home prices hovering around $400,000. This affordability makes Edmonton a magnet for first-time home buyers and real estate investors looking for high-yield rental properties.",
    faqs: [
      {
        question: "Why are rental property mortgages so popular in Edmonton?",
        answer: "Edmonton has favorable rent-to-value ratios, making cash-flow positive investment properties highly achievable. We work with lenders who recognize up to 80% of rental income to help you qualify for investment financing."
      },
      {
        question: "What is the process for a progress draw mortgage in Edmonton?",
        answer: "When building a new home in developments like Windermere or Griesbach, a progress draw mortgage releases funds at key stages (foundation, lock-up, drywall, completion). We coordinate directly with your builder to streamline approvals."
      },
      {
        question: "How do I qualify as a first-time buyer in Edmonton?",
        answer: "With lower average purchase prices, first-time buyers in Edmonton can often qualify with down payments under $20,000. Programs like the federal First Home Savings Account (FHSA) can be combined with our preferred lender rates to maximize your budget."
      },
      {
        question: "What strata considerations apply to Edmonton condos?",
        answer: "Lenders review the building's reserve fund study and condo corporation finances. Whether buying near the University of Alberta or downtown, we ensure your building choice meets all lending requirements."
      },
      {
        question: "How does the local economy affect Edmonton mortgage rates?",
        answer: "While global bond yields drive fixed rates, Edmonton's diverse economic sectors (health, education, tech, energy) create unique local lending incentives. We compare over 40 lenders to find the optimal fit."
      }
    ]
  },
  toronto: {
    name: 'Toronto',
    province: 'Ontario',
    regulatoryBody: 'FSRA',
    license: 'FSRA #12918',
    heading: "Toronto's Trusted Mortgage Brokerage",
    description: "Navigating the competitive Toronto housing market demands elite financial strategy. From high-rise downtown condos to detached homes in Lawrence Park, we deliver custom mortgage solutions and preferred institutional rates.",
    marketOverview: "Toronto's world-class housing market is highly competitive, with average home prices exceeding $1.1 million. Successful buying requires a combination of swift pre-approval, aggressive lender negotiation, and customized mortgage structure.",
    faqs: [
      {
        question: "How do I navigate Toronto's double Land Transfer Tax?",
        answer: "Buyers in the City of Toronto pay both Ontario provincial and Toronto municipal land transfer taxes. First-time buyers receive rebates on both. We calculate these upfront so your closing costs are fully covered."
      },
      {
        question: "What are the requirements for high-net-worth mortgage programs in Toronto?",
        answer: "If you have significant liquid assets but non-traditional income, we offer custom high-net-worth programs with major banks and private wealth lenders that bypass standard stress-test ratios."
      },
      {
        question: "Can I secure financing for a laneway suite or garden suite in Toronto?",
        answer: "Yes! Toronto's bylaws allow secondary suites to increase density. We specialize in construction and refinance loans that factor in the future rental income of laneway suites to boost your borrowing power."
      },
      {
        question: "What down payment is required for a Toronto home over $1 Million?",
        answer: "Purchases of $1,000,000 or more require a minimum 20% down payment as they are ineligible for government-backed mortgage default insurance. We offer specialized jumbo loan programs with preferred pricing for these high-value properties."
      },
      {
        question: "How do co-ownership and co-signing work in the GTA?",
        answer: "Many buyers partner with family members or friends to purchase in Toronto. We structure co-ownership agreements and guarantor/co-signor mortgages that protect all parties while maximizing borrowing capacity."
      }
    ]
  },
  ottawa: {
    name: 'Ottawa',
    province: 'Ontario',
    regulatoryBody: 'FSRA',
    license: 'FSRA #12918',
    heading: "Ottawa's Trusted Mortgage Brokerage",
    description: "Secure your home in Canada's capital with confidence. From public sector professionals to tech sector innovators, we provide customized mortgage solutions and market-leading rates across Ottawa.",
    marketOverview: "Ottawa's real estate market is characterized by stability and consistent demand, anchored by a strong public sector and a thriving technology hub. Average home prices average around $650,000, offering an attractive balance of urban lifestyle and value.",
    faqs: [
      {
        question: "Do you offer specialized mortgage programs for Ottawa public servants?",
        answer: "Yes! Public sector employees enjoy stable, predictable income that lenders love. We leverage your employment status to secure premium rate discounts and flexible underwriting terms with top-tier lenders."
      },
      {
        question: "How do I qualify for a mortgage if I work in Ottawa's tech sector?",
        answer: "Tech professionals often have complex compensation, including stock options, bonuses, or contract income. We work with specialized lenders who recognize these alternative compensation streams as qualifying income."
      },
      {
        question: "What should I know about buying in Ottawa's heritage districts?",
        answer: "Purchasing in historic areas like the Glebe or Rockcliffe Park requires understanding heritage guidelines and potential renovation restrictions. We ensure your appraisal and financing structure align with these unique property profiles."
      },
      {
        question: "Are there cash-back mortgage options available in Ottawa?",
        answer: "Yes, cash-back mortgages can help cover land transfer taxes, moving expenses, or immediate renovations. We analyze whether the slightly higher interest rate is worth the upfront cash payout for your situation."
      },
      {
        question: "How does buying in Kanata compare to Orleans from a lender's perspective?",
        answer: "Lenders view both suburbs favorably, but Kanata's high concentration of tech employers and Orleans' rapid transit expansion create slightly different local market metrics. We optimize your application based on neighbourhood-specific property values."
      }
    ]
  }
};

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const targetCityNormalized = params?.city?.toLowerCase();
  const meta = CITY_METADATA[targetCityNormalized];
  if (!meta) {
    return {
      title: 'Mortgage Broker | Kraft Mortgages',
      description: 'Canada’s premier mortgage brokerage.',
    };
  }
  return {
    title: `${meta.name} Mortgage Broker | Best Rates | Kraft Mortgages`,
    description: `Get the absolute lowest mortgage rates in ${meta.name}, ${meta.province}. Trusted mortgage broker with customized solutions.`,
  };
}

export async function generateStaticParams() {
  return [
    // BC
    { city: 'surrey' },
    { city: 'vancouver' },
    { city: 'burnaby' },
    { city: 'richmond' },
    { city: 'kelowna' },
    // Alberta
    { city: 'calgary' },
    { city: 'edmonton' },
    // Ontario
    { city: 'toronto' },
    { city: 'ottawa' },
  ];
}

export default async function CityBrokerageLandingPage({ params }: CityPageProps) {
  const targetCityNormalized = params?.city?.toLowerCase();

  if (!targetCityNormalized || !CITY_METADATA[targetCityNormalized]) {
    notFound();
  }

  const meta = CITY_METADATA[targetCityNormalized];

  return (
    <>
      <Navigation />
      <main className="min-h-screen mt-16 text-gray-100 bg-transparent">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-transparent">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 rounded-full text-gold-400 text-sm font-semibold mb-6 border border-gold-500/30">
              <MapPin className="w-4 h-4 text-gold-400" />
              {meta.name}, {meta.province}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight leading-tight">
              {meta.heading}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              {meta.description}
            </p>
            <Link
              href="/contact"
              className="inline-block bg-gold-500 text-black font-semibold py-4 px-8 rounded-xl hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20 text-lg"
            >
              Get Pre-Approved Today
            </Link>
          </div>
        </section>

        {/* Market Overview */}
        <section className="py-16 px-4 border-t border-slate-900">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-white">
              The {meta.name} Mortgage Market
            </h2>
            <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-800/60 shadow-xl backdrop-blur-sm">
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                {meta.marketOverview}
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Whether you are buying your first home, upgrading to a detached property, or building a high-yield real estate portfolio, having local market insights is essential. Kraft Mortgages brings over 18+ years of combined experience and access to over 40 top lenders to help you optimize your financing structure.
              </p>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-16 px-4 bg-slate-900/30 border-t border-slate-900">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-white">
              Our Mortgage Services in {meta.name}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800/80 hover:border-gold-500/40 transition-all shadow-xl">
                <Home className="w-10 h-10 text-gold-400 mb-4" />
                <h3 className="text-xl font-bold mb-3 text-white">First-Time Buyer Solutions</h3>
                <p className="text-gray-400 leading-relaxed">
                  Navigate the path to homeownership with confidence. We map out optimal down payment options, coordinate pre-approvals, and maximize provincial first-time home buyer incentives.
                </p>
              </div>
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800/80 hover:border-gold-500/40 transition-all shadow-xl">
                <TrendingUp className="w-10 h-10 text-gold-400 mb-4" />
                <h3 className="text-xl font-bold mb-3 text-white">Investment Portfolios</h3>
                <p className="text-gray-400 leading-relaxed">
                  Unlock high-leverage growth. We specialize in investment property mortgages, cash-out refinancing, and rental offsets that boost your borrowing capacity.
                </p>
              </div>
              <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800/80 hover:border-gold-500/40 transition-all shadow-xl">
                <Briefcase className="w-10 h-10 text-gold-400 mb-4" />
                <h3 className="text-xl font-bold mb-3 text-white">High-Net-Worth Programs</h3>
                <p className="text-gray-400 leading-relaxed">
                  Premium options for sophisticated buyers. We leverage relationships with private wealth divisions and major banks to build tailored structures that match your financial profile.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Local */}
        <section className="py-16 px-4 border-t border-slate-900">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">
              Why Choose a Local {meta.name} Mortgage Broker?
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
              Real estate moves fast, and local nuances dictate lender policies. A local broker understands the difference between regional strata assessments, provincial property transfer tax structures, and local economic drivers. That localized knowledge translates directly to better interest rates, faster approvals, and a stress-free closing experience.
            </p>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 px-4 bg-slate-900/30 border-t border-slate-900">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-white">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {meta.faqs.map((faq, idx) => (
                <div key={idx} className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800/60 shadow-lg">
                  <h3 className="font-bold text-lg mb-3 text-white flex gap-2">
                    <span className="text-gold-400">Q:</span> {faq.question}
                  </h3>
                  <p className="text-gray-300 leading-relaxed pl-6 border-l border-gold-500/30">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Regional Compliance Footer Details */}
        <section className="py-16 px-4 border-t border-slate-900 bg-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <span className="px-3 py-1 bg-emerald-950 border border-emerald-800 rounded-full text-xs text-emerald-400 font-bold tracking-wider uppercase inline-block mb-6">
              Regional Compliance Pipeline Active
            </span>
            <h2 className="text-3xl font-bold mb-6 text-white">
              Compliance &amp; Licensing Details
            </h2>
            <p className="text-gray-400 text-sm mb-8 max-w-2xl mx-auto">
              Kraft Mortgages Canada Inc. is a licensed mortgage brokerage firm committed to delivering cross-provincial financial strategies under direct regulatory oversight.
            </p>
            <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-900 text-left">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Jurisdiction Vector</div>
                <div className="text-sm font-semibold text-white">{meta.name} ({meta.province})</div>
              </div>
              <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-900 text-left">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">Regulatory Authority</div>
                <div className="text-sm font-semibold text-white">{meta.regulatoryBody} Framework</div>
              </div>
              <div className="p-4 bg-slate-900/30 rounded-xl border border-slate-900 text-left">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-semibold">License Identifier</div>
                <div className="text-sm font-semibold text-gold-400">{meta.license}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Call To Action */}
        <section className="py-20 px-4 border-t border-slate-900 bg-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white tracking-tight">
              Ready to Secure Your Mortgage in {meta.name}?
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto text-lg leading-relaxed">
              Contact our mortgage experts today. We compare 40+ lenders to find you the absolute lowest rates and best terms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contact"
                className="w-full sm:w-auto bg-gold-500 text-black font-semibold py-4 px-8 rounded-xl hover:bg-gold-400 transition-colors shadow-lg shadow-gold-500/20 text-lg"
              >
                Book a Consultation
              </Link>
              <a
                href="tel:+16045931550"
                className="w-full sm:w-auto bg-slate-900 border border-slate-800 font-semibold py-4 px-8 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-lg text-white"
              >
                <Phone className="w-5 h-5 text-gold-400" />
                Call +1 (604) 593-1550
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
