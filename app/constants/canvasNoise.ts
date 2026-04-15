import type { CSSProperties } from "react";

/**
 * Noise overlay applied to the main WebGL canvas in {@link app/components/common/CanvasLoader.tsx}.
 * Kept in one place so `/projects` can stack the same layer under the same `<Stars />` instance.
 */
export const CANVAS_NOISE_OVERLAY_STYLE: Pick<
  CSSProperties,
  "backgroundBlendMode" | "backgroundImage" | "backgroundRepeat" | "backgroundSize"
> = {
  backgroundBlendMode: "soft-light",
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E\")",
  backgroundRepeat: "repeat",
  backgroundSize: "100px",
};
