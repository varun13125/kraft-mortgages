"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ElegantShapeProps {
    className?: string;
    delay?: number;
    width?: number;
    height?: number;
    rotate?: number;
    gradient?: string;
}

function ElegantShape({
    className,
    delay = 0,
    width = 400,
    height = 100,
    rotate = 0,
    gradient = "from-white/[0.08]",
}: ElegantShapeProps) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: -150,
                rotate: rotate - 15,
            }}
            animate={{
                opacity: 1,
                y: 0,
                rotate: rotate,
            }}
            transition={{
                duration: 2.4,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
                opacity: { duration: 1.2 },
            }}
            className={cn("absolute", className)}
        >
            <motion.div
                animate={{
                    y: [0, 25, -15, 0],
                    x: [0, 15, -15, 0],
                    rotate: [0, 5, -5, 0],
                }}
                transition={{
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                style={{
                    width,
                    height,
                }}
                className="relative"
            >
                <div
                    className={cn(
                        "absolute inset-0 rounded-full",
                        "bg-gradient-to-r to-transparent",
                        gradient,
                        "backdrop-blur-[2px] border border-white/[0.10]",
                        "shadow-[0_8px_32px_0_rgba(212,175,55,0.05)]",
                        "after:absolute after:inset-0 after:rounded-full",
                        "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"
                    )}
                />
            </motion.div>
        </motion.div>
    );
}

interface HeroGeometricProps {
    children?: React.ReactNode;
    className?: string;
}

function HeroGeometric({
    children,
    className = "",
}: HeroGeometricProps) {
    return (
        <div className={cn("relative w-full flex items-center justify-center overflow-hidden bg-transparent", className)}>
            {/* Ambient Base Radial Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold-950/[0.15] via-transparent to-amber-950/[0.15] blur-3xl" />

            {/* Geometric Shapes Layer */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <ElegantShape
                    delay={0.3}
                    width={600}
                    height={140}
                    rotate={12}
                    gradient="from-gold-500/[0.10]"
                    className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
                />

                <ElegantShape
                    delay={0.5}
                    width={500}
                    height={120}
                    rotate={-15}
                    gradient="from-amber-500/[0.10]"
                    className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
                />

                <ElegantShape
                    delay={0.4}
                    width={300}
                    height={80}
                    rotate={-8}
                    gradient="from-gold-600/[0.08]"
                    className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
                />

                <ElegantShape
                    delay={0.6}
                    width={200}
                    height={60}
                    rotate={20}
                    gradient="from-amber-600/[0.12]"
                    className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
                />

                <ElegantShape
                    delay={0.7}
                    width={150}
                    height={40}
                    rotate={-25}
                    gradient="from-gold-400/[0.08]"
                    className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
                />
            </div>

            {/* Content Wrapper */}
            <div className="relative z-10 w-full">
                {children}
            </div>

            {/* Fade Transitions */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />
        </div>
    );
}

export { ElegantShape, HeroGeometric };
