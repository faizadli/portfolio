import { useThree } from "@react-three/fiber";

/** Current canvas width in CSS pixels — use for 3D layout breakpoints (e.g. down to 320px). */
export function useCanvasCssWidth(): number {
  return useThree((s) => s.size.width);
}
