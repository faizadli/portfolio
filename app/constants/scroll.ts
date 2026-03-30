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
 *
 * Keep a wide band between {@link SCROLL_ABOUT.fadeInEnd} and {@link SCROLL_ABOUT.fadeOutStart}
 * so full-opacity About stays on screen long enough before the next section.
 *
 * {@link SCROLL_ABOUT.fadeOutEnd} must finish **before** {@link SCROLL_EXPERIENCE.from} so the
 * overlay does not stack on the Experience title/grid.
 */
export const SCROLL_ABOUT = {
  fadeInStart: SCROLL_WINDOW_ANIM_END + 0.005,
  fadeInEnd: 0.84,
  fadeOutStart: 0.91,
  fadeOutEnd: 0.945,
} as const;

const SCROLL_EXPERIENCE_FROM = SCROLL_ABOUT.fadeOutEnd + 0.007;

/** Starts after About is fully faded; ramp uses the rest of scroll offset 0–1. */
export const SCROLL_EXPERIENCE = {
  from: SCROLL_EXPERIENCE_FROM,
  length: 1 - SCROLL_EXPERIENCE_FROM,
} as const;
