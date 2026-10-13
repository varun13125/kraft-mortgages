'use client';
import type { MouseEvent } from 'react';

/**
 * "Skip to main content" link — the first focusable element on every page
 * (rendered first in <body> by app/layout.tsx). Visually hidden until focused.
 *
 * Pages mark their main region with id="main-content". Many pages (calculators,
 * MLI, admin) are owned by other areas and only have a plain <main>, so on click
 * we fall back to the first <main>, then the first <h1>, and move focus there
 * (tabindex=-1 so non-interactive targets can take focus). Without JS the plain
 * #main-content hash link still works on pages that set the id.
 */
export function SkipToContent() {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const target =
      document.getElementById('main-content') ||
      document.querySelector<HTMLElement>('main') ||
      document.querySelector<HTMLElement>('h1');
    if (!target) return; // let the browser follow the hash
    e.preventDefault();
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: 'start' });
  };

  return (
    <a
      href="#main-content"
      onClick={onClick}
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-gold-500 focus:text-gray-900 focus:font-semibold focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
    >
      Skip to main content
    </a>
  );
}
