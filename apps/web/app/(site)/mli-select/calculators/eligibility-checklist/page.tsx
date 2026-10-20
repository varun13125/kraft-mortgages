"use client";
import { useState } from "react";
import Card from "@/components/mli/Card";

type ChecklistItem = {
  id: string;
  category: string;
  requirement: string;
  description: string;
  checked: boolean;
  required: boolean;
};

export default function EligibilityChecklistPage() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    // Basic Eligibility
    { id: "units", category: "Basic", requirement: "5+ Rental Units", description: "Minimum 5 residential units (retirement homes: 50+ units/beds)", checked: false, required: true },
    { id: "purpose", category: "Basic", requirement: "Rental Purpose", description: "Standard rental, SRO, supportive or retirement housing (student housing: energy & accessibility only)", checked: false, required: true },
    { id: "nonres", category: "Basic", requirement: "Non-Residential ≤ 30%", description: "Non-residential space must not exceed 30% of gross floor area or 30% of lending value", checked: false, required: true },
    { id: "mortgage", category: "Basic", requirement: "CMHC Insured Mortgage", description: "Financing through a CMHC Approved Lender with mortgage loan insurance", checked: false, required: true },
    { id: "points", category: "Basic", requirement: "Minimum 50 Points", description: "Any combination of affordability, energy efficiency and accessibility commitments totalling 50+ points", checked: false, required: true },
    // Affordability (optional outcome)
    { id: "affordability", category: "Affordability", requirement: "Affordable Units", description: "New: 10% / 15% / 25% of units; existing: 40% / 60% / 80% of units (50 / 70 / 100 points)", checked: false, required: false },
    { id: "rent_limits", category: "Affordability", requirement: "Rent Limits", description: "Affordable-unit rents at or below 30% of the market's median renter income", checked: false, required: false },
    { id: "affordability_term", category: "Affordability", requirement: "10+ Year Commitment", description: "Maintain affordability for at least 10 years (20+ years earns 30 bonus points); annual compliance reporting", checked: false, required: false },
    // Energy Efficiency (optional outcome)
    { id: "energy_audit", category: "Energy", requirement: "Energy Model / Audit", description: "New: modelled vs NECB/NBC Tier 1; existing: baseline energy audit", checked: false, required: false },
    { id: "energy_improve", category: "Energy", requirement: "Energy Target", description: "New: 25% / 50% / 60% better than NECB Tier 1; existing: 15% / 25% / 40% reduction (20 / 35 / 50 points)", checked: false, required: false },
    // Accessibility (optional outcome)
    { id: "visitable", category: "Accessibility", requirement: "100% Visitable Units", description: "Prerequisite for accessibility points: all units visitable per CSA B651:23", checked: false, required: false },
    { id: "barrier_free", category: "Accessibility", requirement: "Barrier-Free Commons", description: "Prerequisite: common areas barrier-free per CSA B651:23", checked: false, required: false },
    { id: "accessible", category: "Accessibility", requirement: "Accessible / Universal Units", description: "15% accessible or universal-design units, or RHFAC v4.0 60–79% (20 pts); higher thresholds or RHFAC Gold (30 pts)", checked: false, required: false },
    // Borrower & Documentation
    { id: "experience", category: "Documentation", requirement: "Management Experience", description: "5+ years managing similar multi-unit rentals, or a professional property management contract", checked: false, required: true },
    { id: "net_worth", category: "Documentation", requirement: "Net Worth", description: "Borrower net worth of at least 25% of the loan amount (minimum $100,000)", checked: false, required: true },
    { id: "financial_docs", category: "Documentation", requirement: "Financial Documents", description: "Financial statements, rent roll / pro forma and operating projections", checked: false, required: true },
    { id: "construction_docs", category: "Documentation", requirement: "Construction Documents", description: "New construction only: plans, specifications, budget and permits", checked: false, required: false },
  ]);

  const toggleItem = (id: string) => {
    setChecklist(prev => prev.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const categories = Array.from(new Set(checklist.map(item => item.category)));
  const requiredItems = checklist.filter(item => item.required);
  const optionalItems = checklist.filter(item => !item.required);
  const completedRequired = requiredItems.filter(item => item.checked).length;
  const completedOptional = optionalItems.filter(item => item.checked).length;
  const readinessScore = Math.min(completedOptional * 10, 100); // Readiness score (not official MLI points)

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-300 border border-gold-500/30 mb-6">
            CMHC • MLI Select
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-100 mb-6">
            Eligibility Checklist
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Interactive checklist to verify MLI Select eligibility requirements and estimate your qualification.
          </p>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Checklist */}
            <div className="lg:col-span-2">
              <Card title="Eligibility Requirements">
                <div className="space-y-6">
                  {categories.map(category => (
                    <div key={category}>
                      <h3 className="text-lg font-semibold text-gray-100 mb-3 border-b border-gray-600 pb-2">
                        {category}
                      </h3>
                      <div className="space-y-3">
                        {checklist.filter(item => item.category === category).map(item => (
                          <label key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-700/30 border border-gray-600/50 hover:bg-gray-700/50 transition-colors cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={() => toggleItem(item.id)}
                              className="mt-1 rounded border-gray-600 bg-gray-700 text-gold-300 focus:ring-gold-500/50 focus:ring-2"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-100">{item.requirement}</span>
                                {item.required && (
                                  <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full border border-red-500/30">
                                    Required
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Results */}
            <div className="space-y-6">
              <Card title="Eligibility Status">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Required Items</span>
                      <span className="text-gray-100">{completedRequired}/{requiredItems.length}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(completedRequired / requiredItems.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Optional Items</span>
                      <span className="text-gray-100">{completedOptional}/{optionalItems.length}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gold-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(completedOptional / optionalItems.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="border-t border-gray-600 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gold-300">{readinessScore}</div>
                      <div className="text-sm text-gray-400">Readiness Score</div>
                    </div>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-gray-700/30 border border-gray-600/50">
                    {completedRequired === requiredItems.length ? (
                      <div className="text-green-400 font-semibold">✓ Eligible for MLI Select</div>
                    ) : (
                      <div className="text-red-400 font-semibold">⚠ Missing Required Items</div>
                    )}
                  </div>
                </div>
              </Card>

              <Card title="Next Steps">
                <div className="space-y-3 text-sm">
                  {completedRequired < requiredItems.length ? (
                    <div className="text-red-400">
                      <p className="font-semibold mb-2">Complete Required Items:</p>
                      <ul className="space-y-1">
                        {requiredItems.filter(item => !item.checked).slice(0, 3).map(item => (
                          <li key={item.id} className="text-gray-300">• {item.requirement}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-green-400 font-semibold">Ready to Apply!</p>
                      <p className="text-gray-300">Consider completing optional items to increase your points and improve terms.</p>
                      <button className="w-full mt-3 px-4 py-2 bg-gold-500 text-gray-900 rounded-lg hover:bg-gold-400 transition-colors font-semibold">
                        Contact MLI Specialist
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}