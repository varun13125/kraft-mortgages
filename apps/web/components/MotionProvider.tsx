'use client';
import { MotionConfig } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Site-wide Framer Motion config. `reducedMotion="user"` makes every motion
 * component honour the OS "reduce motion" setting (transform/layout animations
 * are skipped, opacity fades are kept). CSS animations are handled separately
 * by the prefers-reduced-motion block in app/globals.css.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
