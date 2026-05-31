"use client";

import React, { HTMLAttributes } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface SpotlightProps extends Omit<HTMLMotionProps<"div">, "className"> {
  className?: string;
}

// Individual Spotlight element
const Spotlight: React.FC<SpotlightProps> = ({ className = "", ...props }) => {
  return (
    <motion.div
      className={cn("spotlight", className)}
      {...props}
    />
  );
};

interface SpotlightBackgroundProps extends HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

// SpotlightBackground container
const SpotlightBackground: React.FC<SpotlightBackgroundProps> = ({ children, className = "", ...props }) => {
  return (
    <div className={cn("spotlight-container bg-gray-950", className)} {...props}>
      <div className="spotlight-overlay">
        <Spotlight
          initial={{ x: "-50%", y: "-50%", rotate: "0deg" }}
          animate={{
            x: ["-50%", "-20%", "-80%", "-50%"],
            y: ["-50%", "-80%", "-20%", "-50%"],
            rotate: ["0deg", "20deg", "-20deg", "0deg"],
          }}
          transition={{
            duration: 6,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
          }}
          className="spotlight-left"
        />

        <Spotlight
          initial={{ x: "0%", y: "0%", rotate: "0deg" }}
          animate={{
            x: ["0%", "30%", "-30%", "0%"],
            y: ["0%", "40%", "5%", "0%"],
            rotate: ["-25deg", "0deg", "25deg", "-25deg"],
          }}
          transition={{
            duration: 7,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
            delay: 1,
          }}
          className="spotlight-mid"
        />

        <Spotlight
          initial={{ x: "0%", y: "0%", rotate: "10deg" }}
          animate={{
            x: ["0%", "-40%", "20%", "0%"],
            y: ["0%", "-30%", "30%", "0%"],
            rotate: ["10deg", "-15deg", "30deg", "10deg"],
          }}
          transition={{
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
            delay: 2,
          }}
          className="spotlight-right"
        />
      </div>

      <div className="spotlight-content relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export { SpotlightBackground, Spotlight };
export default SpotlightBackground;
