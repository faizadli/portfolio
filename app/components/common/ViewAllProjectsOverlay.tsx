"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePortalStore } from "@stores";

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
    // Ensure portal close-control UI is not carried over to the /projects page.
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
      <div className="pointer-events-none fixed inset-0 z-30 flex items-end justify-center pb-6 md:pb-10">
        <button
          type="button"
          onClick={handleOpenProjects}
          className={`pointer-events-auto rounded-full border border-white/35 bg-black/55 px-4 py-2 font-[var(--font-vercetti)] text-xs tracking-wide text-white transition duration-500 hover:-translate-y-0.5 hover:border-white/80 hover:bg-black/70 ${
            isLeaving ? "scale-90 opacity-0" : "scale-100 opacity-100"
          }`}
        >
          LIHAT SEMUA PROJECTS
        </button>
      </div>
    </>
  );
};

export default ViewAllProjectsOverlay;
