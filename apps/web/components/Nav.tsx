"use client";
import Link from "next/link";
import { useState } from "react";
import { ProvinceSelect } from "@/components/ProvinceSelect";
import { Button } from "@/components/ui/button";
import { 
  Calculator, 
  Building, 
  MapPin, 
  Settings, 
  Menu, 
  X, 
  ChevronDown,
  Home,
  TrendingUp,
  DollarSign,
  FileText,
  BarChart3,
  Shield
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const calculators = [
    { name: "Payment Calculator", href: "/calculators/payment", icon: Calculator },
    { name: "Affordability", href: "/calculators/affordability", icon: Home },
    { name: "Renewal Optimizer", href: "/calculators/renewal", icon: TrendingUp },
    { name: "MLI Select", href: "/mli-select", icon: Shield },
    { name: "Construction Pro", href: "/calculators/construction-pro", icon: Building },
    { name: "Investment", href: "/calculators/investment", icon: DollarSign },
    { name: "Self-Employed", href: "/calculators/self-employed", icon: FileText },
  ];

  const provinces = [
    { name: "British Columbia", href: "/provinces/bc", short: "BC" },
    { name: "Alberta", href: "/provinces/ab", short: "AB" },
    { name: "Ontario", href: "/provinces/on", short: "ON" },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-6">
        {/* Calculators Dropdown */}
        <div className="relative">
          <button
            onMouseEnter={() => setActiveDropdown("calculators")}
            onMouseLeave={() => setActiveDropdown(null)}
            className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-gold-400 transition-colors"
          >
            <Calculator className="w-4 h-4" />
            Calculators
            <ChevronDown className="w-3 h-3" />
          </button>
          
          <AnimatePresence>
            {activeDropdown === "calculators" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                onMouseEnter={() => setActiveDropdown("calculators")}
                onMouseLeave={() => setActiveDropdown(null)}
                className="absolute top-full left-0 mt-2 w-64 bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden"
              >
                {calculators.map((calc) => (
                  <Link
                    key={calc.href}
                    href={calc.href as any}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-700 transition-colors group"
                  >
                    <calc.icon className="w-4 h-4 text-gold-500 group-hover:text-gold-400" />
                    <span className="text-sm font-medium text-gray-200 group-hover:text-gold-400">
                      {calc.name}
                    </span>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Provinces Dropdown */}
        <div className="relative">
          <button
            onMouseEnter={() => setActiveDropdown("provinces")}
            onMouseLeave={() => setActiveDropdown(null)}
            className="flex items-center gap-1 text-sm font-medium text-gray-300 hover:text-gold-400 transition-colors"
          >
            <MapPin className="w-4 h-4" />
            Provinces
            <ChevronDown className="w-3 h-3" />
          </button>
          
          <AnimatePresence>
            {activeDropdown === "provinces" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                onMouseEnter={() => setActiveDropdown("provinces")}
                onMouseLeave={() => setActiveDropdown(null)}
                className="absolute top-full left-0 mt-2 w-56 bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden"
              >
                {provinces.map((prov) => (
                  <Link
                    key={prov.href}
                    href={prov.href as any}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-700 transition-colors group"
                  >
                    <span className="text-sm font-medium text-gray-200 group-hover:text-gold-400">
                      {prov.name}
                    </span>
                    <span className="text-xs font-semibold text-gold-500 bg-gold-900/30 px-2 py-1 rounded">
                      {prov.short}
                    </span>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Link href="/learn" className="text-sm font-medium text-gray-300 hover:text-gold-400 transition-colors">
          Learn
        </Link>

        <Link href="/admin/analytics" className="text-sm font-medium text-gray-300 hover:text-gold-400 transition-colors flex items-center gap-1">
          <BarChart3 className="w-4 h-4" />
          Analytics
        </Link>

        <div className="flex items-center gap-2 ml-4">
          <ProvinceSelect />
          <Link href="/settings">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <Button variant="gradient" className="ml-2">
          Get Started
        </Button>
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-300"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-gray-800 border-t border-gray-700 shadow-xl"
          >
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Calculators</p>
                {calculators.map((calc) => (
                  <Link
                    key={calc.href}
                    href={calc.href as any}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <calc.icon className="w-4 h-4 text-gold-500" />
                    <span className="text-sm font-medium text-gray-200">{calc.name}</span>
                  </Link>
                ))}
              </div>
              
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Provinces</p>
                {provinces.map((prov) => (
                  <Link
                    key={prov.href}
                    href={prov.href as any}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-200">{prov.name}</span>
                    <span className="text-xs font-semibold text-gold-500 bg-gold-900/30 px-2 py-1 rounded">
                      {prov.short}
                    </span>
                  </Link>
                ))}
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <button className="w-full px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-lg transition-colors">
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
