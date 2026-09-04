/**
 * Sizes a full-viewport canvas to the device pixel ratio and scales its
 * context so drawing code can work in CSS pixels. Three separate canvas
 * effects each carried an identical copy of this.
 *
 * @returns the scaled 2D context, or null if one can't be acquired.
 */
export function fitCanvasToViewport(
  canvas: HTMLCanvasElement
): CanvasRenderingContext2D | null {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;

  // Reset before scaling — resize fires repeatedly, and scale() compounds.
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  return ctx;
}
