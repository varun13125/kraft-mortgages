"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedCardProps {
  title?: ReactNode;
  children: ReactNode;
  delay?: number;
  icon?: ReactNode;
  gradient?: string;
  glow?: boolean;
}

export default function AnimatedCard({ 
  title, 
  children, 
  delay = 0, 
  icon, 
  gradient = "from-gray-800/50 to-gray-900/50",
  glow = false 
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
      className="relative group"
    >
      {/* Glow Effect */}
      {glow && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-gold-500 to-amber-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      )}
      
      {/* Card Container */}
      <div className={`relative bg-gradient-to-br ${gradient} backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden`}>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, gold 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        {/* Shimmer Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 translate-x-full group-hover:translate-x-0 transition-transform duration-1000" 
               style={{
                 background: 'linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.1), transparent)',
                 transform: 'skewX(-20deg)'
               }}
          ></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 p-6">
          {title && (
            <div className="mb-6 pb-4 border-b border-gray-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {icon && (
                    <motion.div
                      initial={{ rotate: -180, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ delay: delay + 0.2, type: "spring" }}
                      className="w-12 h-12 bg-gradient-to-br from-gold-500/20 to-amber-600/20 rounded-xl flex items-center justify-center border border-gold-500/30 shadow-lg"
                    >
                      {icon}
                    </motion.div>
                  )}
                  <h3 className="text-xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                    {typeof title === 'string' ? title : title}
                  </h3>
                </div>
              </div>
            </div>
          )}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
          >
            {children}
          </motion.div>
        </div>
        
        {/* Corner Accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gold-500/10 to-transparent rounded-bl-full"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-gold-500/10 to-transparent rounded-tr-full"></div>
      </div>
    </motion.div>
  );
}