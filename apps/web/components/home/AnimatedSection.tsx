'use client';
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

/**
 * Lets a Server-Component page keep its framer-motion entrance animations by
 * wrapping sections in this small client island. Only the wrapper is client-side;
 * the children stay server-rendered.
 */
export function AnimatedSection({
  children,
  className,
  delay = 0,
  variant = 'fade-up',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: 'fade-up' | 'fade' | 'scale';
}) {
  const initial =
    variant === 'fade'
      ? { opacity: 0 }
      : variant === 'scale'
        ? { opacity: 0, scale: 0.9 }
        : { opacity: 0, y: 20 };
  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay }}
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
