"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Calculator, TrendingUp, Home, Building, DollarSign, FileText, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, any> = {
  "Mortgage Payment": Calculator,
  "Affordability": Home,
  "Renewal Optimizer": TrendingUp,
  "Construction Pro": Building,
  "Investment": DollarSign,
  "Self-Employed": FileText,
};

interface HolographicCardProps {
  title: string;
  href: string;
  description?: string;
  className?: string;
}

export function HolographicCard({ title, href, description, className }: HolographicCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const Icon = iconMap[title] || Calculator;

  // Mouse tracking
  const mouseX = useSpring(0, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(0, { stiffness: 300, damping: 30 });

  // Transform values
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);
  const scale = useSpring(1, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseXPercent = (e.clientX - centerX) / (rect.width / 2);
    const mouseYPercent = (e.clientY - centerY) / (rect.height / 2);

    mouseX.set(mouseXPercent);
    mouseY.set(mouseYPercent);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    scale.set(1.05);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    scale.set(1);
  };

  return (
    <Link href={href}>
      <motion.div
        ref={ref}
        className={cn(
          "relative group cursor-pointer perspective-1000",
          className
        )}
        style={{ 
          scale,
          perspective: 1000,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="relative w-full h-full p-8 rounded-2xl preserve-3d"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
        >
          {/* Main card with glassmorphism */}
          <div className="relative w-full h-full glass border border-slate-200/30 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50/20 via-slate-100/10 to-slate-200/20">
            
            {/* Holographic rainbow gradient overlay */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-all duration-500"
              style={{
                background: `linear-gradient(
                  ${45 + (mouseX.get() * 30)}deg,
                  transparent 30%,
                  rgba(255, 0, 150, 0.1) 40%,
                  rgba(0, 255, 255, 0.1) 50%,
                  rgba(255, 255, 0, 0.1) 60%,
                  transparent 70%
                )`,
                filter: "blur(1px)",
              }}
              animate={{
                background: isHovered ? [
                  "linear-gradient(45deg, transparent 30%, rgba(255, 0, 150, 0.1) 40%, rgba(0, 255, 255, 0.1) 50%, rgba(255, 255, 0, 0.1) 60%, transparent 70%)",
                  "linear-gradient(90deg, transparent 30%, rgba(0, 255, 255, 0.1) 40%, rgba(255, 255, 0, 0.1) 50%, rgba(255, 0, 150, 0.1) 60%, transparent 70%)",
                  "linear-gradient(135deg, transparent 30%, rgba(255, 255, 0, 0.1) 40%, rgba(255, 0, 150, 0.1) 50%, rgba(0, 255, 255, 0.1) 60%, transparent 70%)"
                ] : undefined
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              animate={{
                boxShadow: isHovered ? [
                  "0 0 20px rgba(100, 181, 246, 0.3)",
                  "0 0 40px rgba(100, 181, 246, 0.5)",
                  "0 0 20px rgba(100, 181, 246, 0.3)"
                ] : "0 0 0px rgba(100, 181, 246, 0)"
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Floating particles */}
            {isHovered && Array.from({ length: 8 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-brand-300/60 rounded-full"
                initial={{ 
                  x: Math.random() * 100 + "%", 
                  y: "100%",
                  opacity: 0 
                }}
                animate={{ 
                  y: "-20px",
                  opacity: [0, 1, 0],
                  x: (Math.random() - 0.5) * 100 + "%"
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                }}
              />
            ))}

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col">
              {/* Header with icon */}
              <div className="flex items-start justify-between mb-6">
                <motion.div
                  className="relative p-4 rounded-xl bg-gradient-to-br from-slate-100/50 to-slate-200/30 backdrop-blur-sm"
                  whileHover={{ scale: 1.1, rotateY: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon className="w-8 h-8 text-brand-500" />
                  
                  {/* Icon glow */}
                  <motion.div
                    className="absolute inset-0 rounded-xl"
                    animate={{
                      boxShadow: isHovered ? 
                        "0 0 20px rgba(100, 181, 246, 0.4)" : 
                        "0 0 0px rgba(100, 181, 246, 0)"
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Sparkles */}
                  <motion.div
                    className="absolute -top-1 -right-1"
                    animate={isHovered ? {
                      rotate: [0, 360],
                      scale: [0.8, 1.2, 0.8]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Sparkles className="w-4 h-4 text-brand-300" />
                  </motion.div>
                </motion.div>

                <motion.div
                  animate={{
                    x: isHovered ? 0 : 10,
                    opacity: isHovered ? 1 : 0.5
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <ArrowRight className="w-6 h-6 text-brand-400" />
                </motion.div>
              </div>

              {/* Title and description */}
              <div className="flex-1">
                <motion.h3
                  className="text-2xl font-bold mb-3 bg-gradient-to-r from-slate-700 to-slate-500 bg-clip-text text-transparent"
                  animate={{
                    backgroundPosition: isHovered ? "200% center" : "0% center"
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {title}
                </motion.h3>
                
                <p className="text-slate-600 text-base leading-relaxed">
                  {description || "Advanced mortgage calculations with real-time insights"}
                </p>
              </div>

              {/* Bottom accent */}
              <motion.div
                className="mt-6 h-1 bg-gradient-to-r from-brand-300 to-brand-500 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ originX: 0 }}
              />
            </div>

            {/* Holographic edge light */}
            <motion.div
              className="absolute inset-0 rounded-2xl"
              style={{
                background: `linear-gradient(90deg, 
                  transparent 0%, 
                  rgba(100, 181, 246, 0.1) 50%, 
                  transparent 100%)`,
                transform: `translateX(${mouseX.get() * 100}px)`,
              }}
              animate={{
                opacity: isHovered ? 0.6 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* 3D depth layers */}
          <div 
            className="absolute inset-0 bg-slate-200/10 rounded-2xl blur-sm"
            style={{ 
              transform: "translateZ(-10px)",
              zIndex: -1
            }}
          />
          <div 
            className="absolute inset-0 bg-slate-300/5 rounded-2xl blur-md"
            style={{ 
              transform: "translateZ(-20px)",
              zIndex: -2
            }}
          />
        </motion.div>
      </motion.div>
    </Link>
  );
}