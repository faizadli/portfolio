"use client";

import { AdaptiveDpr, Preload } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";

import { CANVAS_NOISE_OVERLAY_STYLE } from "@constants";

import { useThemeStore } from "@stores";

import StarsContainer from "../models/Stars";

/**
 * Same stack as the home canvas: theme fill + SVG noise on the canvas element (see
 * {@link app/components/common/CanvasLoader.tsx}) + drei {@link StarsContainer}.
 */
const HomeStarfieldBackdrop = () => {
  const backgroundColor = useThemeStore((s) => s.theme.color);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
      <Canvas
        className="absolute inset-0 h-full w-full"
        dpr={[1, 2]}
        shadows={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          backgroundColor,
          ...CANVAS_NOISE_OVERLAY_STYLE,
        }}
      >
        <color attach="background" args={[backgroundColor]} />
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <StarsContainer />
          <Preload all />
        </Suspense>
        <AdaptiveDpr pixelated />
      </Canvas>
    </div>
  );
};

export default HomeStarfieldBackdrop;
