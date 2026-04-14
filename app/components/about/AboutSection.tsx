"use client";

import { useMemo } from "react";

import { SCROLL_ABOUT } from "@constants";
import { usePortalStore, useScrollStore } from "@stores";

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
  const portalOpen = usePortalStore((s) => !!s.activePortalId);
  const opacity = useMemo(() => {
    if (portalOpen) return 0;
    return aboutOpacity(scrollProgress);
  }, [scrollProgress, portalOpen]);

  if (portalOpen || opacity < 0.02) {
    return null;
  }

  return (
    <section
      className="pointer-events-none [&_*]:pointer-events-none fixed inset-0 z-[5] flex items-center justify-center px-4 py-8 sm:px-8 sm:py-12 md:px-16 lg:px-24 xl:px-32"
      style={{ opacity }}
      aria-hidden={opacity < 0.1}
    >
      <div className="flex w-full max-w-6xl flex-col items-center justify-center gap-8 sm:gap-10 md:flex-row md:items-center md:gap-14 lg:gap-20">
        <div className="w-full max-w-md shrink-0 text-center text-white drop-shadow md:w-auto md:text-left">
          <h2 className="font-serif text-3xl tracking-wide sm:text-4xl md:text-5xl">About me</h2>
          <p className="mt-3 font-sans text-xs leading-relaxed text-white/90 sm:mt-4 sm:text-sm md:text-base">
            Frontend engineer by profession, creative at heart. I craft interactive web
            experiences with attention to motion, performance, and detail.
          </p>
        </div>

        <div
          className="relative w-full max-w-[min(100%,520px)] shrink-0 overflow-visible bg-transparent min-h-[220px] sm:min-h-[300px] md:min-h-[400px] md:max-w-[min(100%,540px)]"
          style={{
            height: "min(58vh, min(520px, 100dvh - 12rem))",
          }}
        >
          <Lanyard />
        </div>
      </div>
    </section>
  );
}
