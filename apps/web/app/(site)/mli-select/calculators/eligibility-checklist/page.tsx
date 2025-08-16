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
    { id: "units", category: "Basic", requirement: "5+ Rental Units", description: "Property must have at least 5 rental units", checked: false, required: true },
    { id: "purpose", category: "Basic", requirement: "Rental Purpose", description: "Property must be for rental housing purposes", checked: false, required: true },
    { id: "location", category: "Basic", requirement: "Canadian Location", description: "Property must be located in Canada", checked: false, required: true },
    { id: "mortgage", category: "Basic", requirement: "CMHC Insured Mortgage", description: "Must obtain CMHC mortgage loan insurance", checked: false, required: true },
    
    // Affordability Requirements
    { id: "affordability", category: "Affordability", requirement: "Affordability Commitment", description: "Commit to affordable housing for minimum period", checked: false, required: true },
    { id: "income_limits", category: "Affordability", requirement: "Income Limits", description: "Tenant income limits based on median household income", checked: false, required: true },
    { id: "rent_limits", category: "Affordability", requirement: "Rent Limits", description: "Rent must not exceed 30% of median household income", checked: false, required: true },
    
    // Energy Efficiency
    { id: "energy_audit", category: "Energy", requirement: "Energy Audit", description: "Conduct energy audit or assessment", checked: false, required: false },
    { id: "energy_improve", category: "Energy", requirement: "Energy Improvements", description: "Implement energy efficiency improvements", checked: false, required: false },
    
    // Accessibility
    { id: "visitable", category: "Accessibility", requirement: "Visitable Units", description: "Units meet visitable design standards", checked: false, required: false },
    { id: "accessible", category: "Accessibility", requirement: "Accessible Units", description: "Some units fully accessible", checked: false, required: false },
    { id: "barrier_free", category: "Accessibility", requirement: "Barrier-Free Commons", description: "Common areas are barrier-free", checked: false, required: false },
    
    // Documentation
    { id: "business_plan", category: "Documentation", requirement: "Business Plan", description: "Submit detailed business plan", checked: false, required: true },
    { id: "financial_docs", category: "Documentation", requirement: "Financial Documents", description: "Provide financial statements and projections", checked: false, required: true },
    { id: "construction_docs", category: "Documentation", requirement: "Construction Documents", description: "Submit construction plans and specifications", checked: false, required: true },
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
  const totalPoints = Math.min(completedOptional * 10, 100); // Simplified scoring

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
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
                              className="mt-1 rounded border-gray-600 bg-gray-700 text-gold-400 focus:ring-gold-500/50 focus:ring-2"
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
                      <div className="text-2xl font-bold text-gold-400">{totalPoints}</div>
                      <div className="text-sm text-gray-400">Estimated Points</div>
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
    </div>
  );
}