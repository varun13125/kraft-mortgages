"use client";
import { useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "neumorphic";
  size?: "sm" | "md" | "lg" | "xl";
  onClick?: () => void;
  disabled?: boolean;
}

export function MagneticButton({
  children,
  className,
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const x = useSpring(0, { stiffness: 300, damping: 30 });
  const y = useSpring(0, { stiffness: 300, damping: 30 });
  const scale = useSpring(1, { stiffness: 400, damping: 40 });
  const rotate = useSpring(0, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current || disabled) return;
    
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const distance = Math.sqrt(mouseX ** 2 + mouseY ** 2);
    const maxDistance = 150;
    
    if (distance < maxDistance) {
      const intensity = Math.max(0, 1 - distance / maxDistance);
      x.set(mouseX * intensity * 0.3);
      y.set(mouseY * intensity * 0.3);
      rotate.set((mouseX * intensity * 0.05));
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    scale.set(1.05);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
    scale.set(1);
    rotate.set(0);
  };

  const handleMouseDown = () => {
    setIsPressed(true);
    scale.set(0.95);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    scale.set(isHovered ? 1.05 : 1);
  };

  const getVariantStyles = () => {
    const baseStyles = "relative overflow-hidden font-medium transition-all duration-300 cursor-pointer";
    
    switch (variant) {
      case "primary":
        return cn(baseStyles, "bg-gradient-to-r from-brand-400 to-brand-500 text-white shadow-lg hover:shadow-2xl");
      case "secondary":
        return cn(baseStyles, "glass text-slate-700 border hover:border-brand-300");
      case "ghost":
        return cn(baseStyles, "bg-transparent text-slate-600 hover:bg-slate-100/50");
      case "neumorphic":
        return cn(baseStyles, "neumorphic text-slate-700");
      default:
        return baseStyles;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "px-4 py-2 text-sm rounded-lg";
      case "md":
        return "px-6 py-3 text-base rounded-xl";
      case "lg":
        return "px-8 py-4 text-lg rounded-xl";
      case "xl":
        return "px-10 py-5 text-xl rounded-2xl";
      default:
        return "px-6 py-3 text-base rounded-xl";
    }
  };

  return (
    <motion.button
      ref={ref}
      className={cn(
        getVariantStyles(),
        getSizeStyles(),
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      style={{ x, y, scale, rotate }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.98 }}
    >
      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={isPressed ? { scale: 2, opacity: 0.3 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-brand-300/50 to-brand-500/50 rounded-xl blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.6 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        animate={isHovered ? { x: "100%" } : { x: "-100%" }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}