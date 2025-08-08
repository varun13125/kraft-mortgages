"use client";
import { motion } from "framer-motion";

export function GradientOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Animated Gradient Orb 1 */}
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          background: "radial-gradient(circle, hsla(217, 91%, 60%, 0.4) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        initial={{ top: "10%", left: "10%" }}
      />
      
      {/* Animated Gradient Orb 2 */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsla(189, 100%, 56%, 0.3) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        animate={{
          x: [0, -150, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        initial={{ top: "50%", right: "5%" }}
      />
      
      {/* Animated Gradient Orb 3 */}
      <motion.div
        className="absolute w-72 h-72 rounded-full"
        style={{
          background: "radial-gradient(circle, hsla(355, 100%, 93%, 0.5) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
        animate={{
          x: [0, 80, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        initial={{ bottom: "20%", left: "30%" }}
      />
      
      {/* Animated Gradient Orb 4 */}
      <motion.div
        className="absolute w-80 h-80 rounded-full"
        style={{
          background: "radial-gradient(circle, hsla(280, 100%, 70%, 0.3) 0%, transparent 70%)",
          filter: "blur(45px)",
        }}
        animate={{
          x: [0, -100, 0],
          y: [0, -80, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        initial={{ top: "60%", right: "40%" }}
      />
    </div>
  );
}