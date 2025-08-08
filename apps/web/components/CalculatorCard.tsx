"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, Home, Building, DollarSign, FileText, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = {
  "Mortgage Payment": Calculator,
  "Affordability": Home,
  "Renewal Optimizer": TrendingUp,
  "Construction Pro": Building,
  "Investment": DollarSign,
  "Self-Employed": FileText,
};

export function CalculatorCard({ title, href, description }: { title: string; href: string; description?: string }) {
  const Icon = iconMap[title] || Calculator;
  
  return (
    <Link href={href as any}>
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Card className="relative overflow-hidden group cursor-pointer bg-gradient-to-br from-white/80 via-brand-50/50 to-brand-100/40 backdrop-blur-sm border-brand-200/50 hover:border-brand-400 transition-all duration-300 hover:shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-400/10 via-transparent to-brand-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardContent className="p-6 relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className={cn(
                "p-3 rounded-xl bg-gradient-to-br from-brand-100 to-brand-200",
                "group-hover:from-brand-200 group-hover:to-brand-300 transition-all duration-300"
              )}>
                <Icon className="w-6 h-6 text-brand-600" />
              </div>
              <ArrowRight className="w-5 h-5 text-brand-400 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">
              {title}
            </h3>
            
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Calculate and optimize your mortgage</p>
            )}
            
            <div className="mt-4 flex items-center text-sm font-medium text-brand-600 group-hover:text-brand-700">
              Open tool
              <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </Card>
      </motion.div>
    </Link>
  );
}
