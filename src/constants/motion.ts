/**
 * Shared motion primitives. The site uses one easing curve everywhere;
 * it lived as a copy-pasted `const EASE` in nine components before this.
 */
export const EASE = [0.25, 0.46, 0.45, 0.94] as const;

/** Standard "fade up into place" entrance, delayed by `delay` seconds. */
export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE },
});

/** Standard scroll-triggered section-header entrance. */
export const revealOnScroll = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.9, delay, ease: EASE },
});
