"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePortalStore } from "@stores";

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14m0 0l-6-6m6 6l-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ViewAllProjectsOverlay = () => {
  const isProjectsActive = usePortalStore((state) => state.activePortalId === "projects");
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    router.prefetch("/projects");
  }, [router]);

  if (!isProjectsActive) return null;

  const handleOpenProjects = () => {
    if (isLeaving) return;
    setIsLeaving(true);
    window.sessionStorage.setItem("projects-transition", "1");
    document.querySelectorAll(".close").forEach((el) => el.remove());
    document.body.style.cursor = "auto";
    window.setTimeout(() => {
      router.push("/projects");
    }, 460);
  };

  return (
    <>
      <div
        className={`pointer-events-none fixed inset-0 z-20 bg-black/60 backdrop-blur-[3px] transition-opacity duration-500 ${
          isLeaving ? "opacity-100" : "opacity-0"
        }`}
      />
      {/*
        Placement: not tucked at the bottom — top on small screens (clear hierarchy),
        vertically centered on the right on md+ (thumb-friendly, frames the carousel).
      */}
      <div className="pointer-events-none fixed inset-0 z-30 flex items-start justify-center px-4 pt-[max(5.5rem,14vh)] md:items-center md:justify-end md:px-8 md:pt-0">
        <div className="pointer-events-auto w-full max-w-sm md:max-w-none md:w-auto">
          <button
            type="button"
            onClick={handleOpenProjects}
            className={`group relative w-full overflow-hidden rounded-2xl border border-white/25 bg-gradient-to-br from-white/[0.14] via-white/[0.06] to-white/[0.02] px-6 py-4 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_12px_40px_-8px_rgba(139,92,246,0.35),0_24px_64px_-20px_rgba(0,0,0,0.5)] backdrop-blur-md transition duration-500 before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-br before:from-violet-400/15 before:via-transparent before:to-fuchsia-500/10 before:opacity-80 hover:border-white/45 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset,0_16px_48px_-6px_rgba(167,139,250,0.45),0_28px_72px_-16px_rgba(0,0,0,0.45)] hover:before:opacity-100 md:min-w-[220px] ${
              isLeaving ? "translate-y-2 scale-95 opacity-0" : "translate-y-0 scale-100 opacity-100"
            }`}
          >
            <span className="relative mb-1 block font-[var(--font-vercetti)] text-[10px] uppercase tracking-[0.32em] text-white/55">
              Archive
            </span>
            <span className="relative flex items-center justify-between gap-3">
              <span className="font-[var(--font-soria)] text-xl leading-tight tracking-tight text-white sm:text-2xl">
                View all
                <span className="mt-0.5 block font-sans text-xs font-normal tracking-normal text-white/70">
                  Full projects & certificates page
                </span>
              </span>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition duration-300 group-hover:border-white/40 group-hover:bg-white/20 group-hover:text-white">
                <ArrowRightIcon className="transition duration-300 group-hover:translate-x-0.5" />
              </span>
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default ViewAllProjectsOverlay;
