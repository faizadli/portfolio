"use client";

import { useMemo } from "react";

import { SCROLL_ABOUT } from "@constants";
import { useScrollStore } from "@stores";

import Lanyard from "./Lanyard";

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function aboutOpacity(scrollProgress: number): number {
  const fadeIn = smoothstep(
    SCROLL_ABOUT.fadeInStart,
    SCROLL_ABOUT.fadeInEnd,
    scrollProgress,
  );
  const fadeOut =
    1 -
    smoothstep(
      SCROLL_ABOUT.fadeOutStart,
      SCROLL_ABOUT.fadeOutEnd,
      scrollProgress,
    );
  return fadeIn * fadeOut;
}

export default function AboutSection() {
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  const opacity = useMemo(() => aboutOpacity(scrollProgress), [scrollProgress]);

  if (opacity < 0.02) {
    return null;
  }

  return (
    <section
      className="pointer-events-none fixed inset-0 z-[5] flex flex-col items-center justify-center gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between md:gap-12 md:px-16"
      style={{ opacity }}
      aria-hidden={opacity < 0.1}
    >
      <div className="max-w-md shrink-0 text-center text-white drop-shadow md:text-left">
        <h2 className="font-serif text-4xl tracking-wide md:text-5xl">About me</h2>
        <p className="mt-4 font-sans text-sm leading-relaxed text-white/90 md:text-base">
          Frontend engineer by profession, creative at heart. I craft interactive web
          experiences with attention to motion, performance, and detail.
        </p>
      </div>

      <div
        className="relative w-full max-w-[min(100%,520px)] shrink-0 overflow-visible bg-transparent md:max-w-[min(100%,540px)]"
        style={{
          height: "min(62vh, 600px)",
          minHeight: 400,
        }}
      >
        <Lanyard />
      </div>
    </section>
  );
}
