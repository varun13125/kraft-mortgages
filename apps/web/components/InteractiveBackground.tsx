"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export function InteractiveBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
      }
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Animated Gradient Orbs that follow mouse */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full opacity-20"
        style={{
          background: `radial-gradient(circle, 
            rgba(100, 181, 246, 0.4) 0%, 
            rgba(30, 58, 95, 0.2) 30%, 
            transparent 70%)`,
          filter: "blur(60px)",
        }}
        animate={{
          x: mousePosition.x * 100 - 400,
          y: mousePosition.y * 100 - 400,
          scale: isHovering ? 1.2 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 30,
        }}
        initial={{ x: -400, y: -400 }}
      />
      
      {/* Secondary gradient that moves opposite to mouse */}
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full opacity-15"
        style={{
          background: `radial-gradient(circle, 
            rgba(74, 124, 158, 0.3) 0%, 
            rgba(51, 65, 85, 0.1) 40%, 
            transparent 70%)`,
          filter: "blur(80px)",
        }}
        animate={{
          x: window.innerWidth - mousePosition.x * 150 - 300,
          y: window.innerHeight - mousePosition.y * 150 - 300,
          scale: isHovering ? 0.8 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 30,
          damping: 40,
        }}
        initial={{ x: window.innerWidth - 300, y: window.innerHeight - 300 }}
      />

      {/* Morphing shapes */}
      <motion.div
        className="absolute w-96 h-96"
        style={{
          background: `linear-gradient(45deg, 
            rgba(100, 181, 246, 0.1), 
            rgba(30, 58, 95, 0.05))`,
          borderRadius: "60% 40% 30% 70%/60% 30% 70% 40%",
          filter: "blur(40px)",
        }}
        animate={{
          x: mousePosition.x * 50,
          y: mousePosition.y * 50,
          rotate: isHovering ? 180 : 0,
        }}
        transition={{
          rotate: { duration: 2 },
          x: { type: "spring", stiffness: 100 },
          y: { type: "spring", stiffness: 100 },
        }}
        initial={{ x: "20%", y: "20%" }}
      />

      {/* Floating particles */}
      {Array.from({ length: 20 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-brand-300/20 rounded-full"
          animate={{
            x: [0, Math.random() * 100, 0],
            y: [0, Math.random() * 100, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Grid overlay with subtle animation */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(100, 181, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 181, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Spotlight effect that follows mouse */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "600px",
          height: "600px",
          background: `radial-gradient(circle, 
            rgba(100, 181, 246, 0.08) 0%, 
            transparent 50%)`,
          filter: "blur(100px)",
        }}
        animate={{
          x: mousePosition.x * window.innerWidth - 300,
          y: mousePosition.y * window.innerHeight - 300,
          opacity: isHovering ? 0.6 : 0.3,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 30,
        }}
      />
    </div>
  );
}