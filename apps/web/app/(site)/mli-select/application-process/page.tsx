"use client";
import { motion } from "framer-motion";
import { CheckCircle, Clock, FileText, Users, Building, Award, ArrowRight, Calendar } from "lucide-react";
import Navigation from "@/components/Navigation";
import Breadcrumb from "@/components/Breadcrumb";

export default function ApplicationProcessPage() {
  const steps = [
    {
      number: "01",
      title: "Initial Consultation",
      duration: "1-2 weeks",
      description: "Project assessment and optimization strategy",
      tasks: [
        "Project review and feasibility analysis",
        "Point scoring optimization strategy",
        "Preliminary tier assessment",
        "Timeline and budget discussion"
      ]
    },
    {
      number: "02", 
      title: "Documentation Preparation",
      duration: "2-3 weeks",
      description: "Comprehensive application package assembly",
      tasks: [
        "Architectural plans and specifications",
        "Energy efficiency assessments",
        "Affordability commitment letters", 
        "Accessibility compliance reports",
        "Financial projections and analysis"
      ]
    },
    {
      number: "03",
      title: "CMHC Submission",
      duration: "1 week",
      description: "Formal application submission to CMHC",
      tasks: [
        "Complete application package review",
        "CMHC portal submission",
        "Application fee payment",
        "Submission confirmation and tracking"
      ]
    },
    {
      number: "04",
      title: "CMHC Review & Approval",
      duration: "4-6 weeks",
      description: "CMHC assessment and decision",
      tasks: [
        "Initial application review",
        "Technical assessment and scoring",
        "Underwriting and risk analysis",
        "Conditional approval or requests for additional information"
      ]
    },
    {
      number: "05",
      title: "Final Approval & Funding",
      duration: "2-3 weeks",
      description: "Condition satisfaction and mortgage funding",
      tasks: [
        "Satisfy any outstanding conditions",
        "Final documentation review",
        "Insurance commitment issuance",
        "Mortgage funding and disbursement"
      ]
    }
  ];

  const documents = [
    {
      category: "Architectural & Design",
      icon: Building,
      items: [
        "Complete architectural plans and elevations",
        "Site plan and landscaping details",
        "Unit layouts and specifications", 
        "Building envelope and structural details",
        "Mechanical, electrical, and plumbing plans"
      ]
    },
    {
      category: "Energy Efficiency",
      icon: Award,
      items: [
        "Energy modeling and performance analysis",
        "ENERGY STAR certification documentation",
        "Building envelope performance reports",
        "HVAC system specifications and efficiency ratings",
        "Renewable energy system details (if applicable)"
      ]
    },
    {
      category: "Affordability & Accessibility",
      icon: Users,
      items: [
        "Affordability commitment letters and strategies",
        "Rent roll projections and market analysis",
        "Universal design compliance reports",
        "Accessibility feature specifications",
        "Barrier-free design certifications"
      ]
    },
    {
      category: "Financial Documentation",
      icon: FileText,
      items: [
        "Detailed project pro forma and cash flow analysis",
        "Construction budget and cost breakdown",
        "Financing terms and lender commitments",
        "Developer financial statements and experience",
        "Market analysis and comparable properties"
      ]
    }
  ];

  return (
    <>
      <Navigation />
      <main className="min-h-screen mt-16">
        {/* Breadcrumb */}
        <div className="px-4 py-6">
          <div className="max-w-6xl mx-auto">
            <Breadcrumb items={[
              { label: "MLI Select", href: "/mli-select" },
              { label: "Application Process" }
            ]} />
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-6">
                CMHC • MLI Select
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-gray-100 mb-6">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Application</span> Process
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Step-by-step from pre-application to funding, with comprehensive documentation checklist and timeline guidance.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Process Timeline */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                Application <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Timeline</span>
              </h2>
              <p className="text-lg text-gray-400">
                Typical process takes 10-15 weeks from initial consultation to funding
              </p>
            </motion.div>

            <div className="space-y-8">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  {/* Connection Line */}
                  {i < steps.length - 1 && (
                    <div className="absolute left-8 top-20 w-0.5 h-16 bg-gradient-to-b from-gold-500/50 to-transparent"></div>
                  )}
                  
                  <div className="flex gap-6">
                    {/* Step Number */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-full flex items-center justify-center border-2 border-gold-500/30">
                        <span className="text-xl font-bold text-gold-400">{step.number}</span>
                      </div>
                    </div>
                    
                    {/* Step Content */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 flex-grow">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-100 mb-2">{step.title}</h3>
                          <p className="text-gray-400">{step.description}</p>
                        </div>
                        <div className="flex items-center gap-2 text-gold-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">{step.duration}</span>
                        </div>
                      </div>
                      
                      <div className="grid gap-2 md:grid-cols-2">
                        {step.tasks.map((task, j) => (
                          <div key={j} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span className="text-sm text-gray-400">{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Documentation Checklist */}
        <section className="py-20 px-4 bg-gradient-to-br from-gray-900/50 to-gray-800/30">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                Documentation <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Checklist</span>
              </h2>
              <p className="text-lg text-gray-400">
                Comprehensive list of required documents for your MLI Select application
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-2">
              {documents.map((category, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-xl flex items-center justify-center border border-gold-500/30">
                      <category.icon className="w-6 h-6 text-gold-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-100">{category.category}</h3>
                  </div>
                  
                  <ul className="space-y-3">
                    {category.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-400">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Success Tips */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
                <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">Success</span> Tips
              </h2>
              <p className="text-lg text-gray-400">
                Key strategies to ensure a smooth application process
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Start Early",
                  description: "Begin the consultation process during design phase to optimize scoring before finalizing plans."
                },
                {
                  title: "Complete Documentation", 
                  description: "Ensure all required documents are complete and accurate before submission to avoid delays."
                },
                {
                  title: "Expert Guidance",
                  description: "Work with MLI Select specialists who understand the nuances of scoring and application requirements."
                }
              ].map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-6 text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-gold-500/20 to-amber-500/20 rounded-full flex items-center justify-center border border-gold-500/30 mx-auto mb-4">
                    <span className="text-2xl font-bold text-gold-400">{i + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-3">{tip.title}</h3>
                  <p className="text-gray-400 text-sm">{tip.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-br from-gold-900/20 to-amber-900/20 border-t border-gold-500/20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
                Ready to Start Your <span className="bg-gradient-to-r from-gold-400 to-amber-500 bg-clip-text text-transparent">MLI Select Application?</span>
              </h2>
              <p className="text-xl mb-8 text-gray-400">
                Our experienced team will guide you through every step of the process.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://r.mtg-app.com/varun-chaudhry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-gray-900 font-semibold rounded-lg hover:from-gold-400 hover:to-gold-500 transition-all transform hover:scale-105"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Schedule Consultation
                </a>
                <a 
                  href="tel:604-593-1550" 
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-gold-500/50 text-gold-400 rounded-lg hover:bg-gold-500/10 transition-colors"
                >
                  Call 604-593-1550
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
}