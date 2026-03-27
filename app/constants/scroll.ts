/**
 * Scroll `offset` is 0–1 (drei ScrollControls), same as `useScroll().offset`.
 *
 * {@link app/components/hero/TextWindow} — window rotation uses `range(0.65, 0.15)` → ends at 0.80.
 *
 * Experience title + grid start **after** the About overlay (see {@link app/components/about/AboutSection}).
 */
export const SCROLL_WINDOW_ANIM = { from: 0.65, length: 0.15 } as const;
export const SCROLL_WINDOW_ANIM_END =
  SCROLL_WINDOW_ANIM.from + SCROLL_WINDOW_ANIM.length;

/**
 * About must start **after** the window animation (`range(0.65, 0.15)` → ends at
 * {@link SCROLL_WINDOW_ANIM_END}), not during it.
 */
export const SCROLL_ABOUT = {
  fadeInStart: SCROLL_WINDOW_ANIM_END + 0.005,
  fadeInEnd: 0.87,
  fadeOutStart: 0.88,
  fadeOutEnd: 0.94,
} as const;

/**
 * Longer ramp so Experience eases in smoothly (avoid a 0→1 jump in a tiny scroll band).
 */
export const SCROLL_EXPERIENCE = { from: 0.9, length: 0.1 } as const;
