"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PROJECTS } from "@constants";

import HomeStarfieldBackdrop from "@/app/components/common/HomeStarfieldBackdrop";
import { useThemeStore } from "@stores";

const ProjectsPage = () => {
  const pageBg = useThemeStore((s) => s.theme.color);
  const [entered, setEntered] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [useCinematicIntro, setUseCinematicIntro] = useState(false);
  const [introHidden, setIntroHidden] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fromPortal = window.sessionStorage.getItem("projects-transition") === "1";
    window.sessionStorage.removeItem("projects-transition");
    setUseCinematicIntro(fromPortal);

    const rafId = window.requestAnimationFrame(() => {
      if (fromPortal) {
        window.setTimeout(() => setEntered(true), 230);
      } else {
        setEntered(true);
      }
      window.setTimeout(() => setIntroHidden(true), 20);
    });

    return () => window.cancelAnimationFrame(rafId);
  }, []);

  const handleBackToProjectsPortal = () => {
    if (isLeaving) return;
    setIsLeaving(true);
    window.setTimeout(() => {
      router.push("/?open=projects");
    }, 340);
  };

  return (
    <main
      className="relative min-h-screen overflow-x-hidden px-5 py-10 text-[#ededed] md:px-10"
      style={{ backgroundColor: pageBg }}
    >
      <HomeStarfieldBackdrop />

      <div
        className={`pointer-events-none fixed inset-0 z-30 bg-black transition-opacity ${
          useCinematicIntro ? "duration-700" : "duration-300"
        } ${introHidden ? "opacity-0" : "opacity-100"}`}
      />
      <div
        className={`relative z-10 mx-auto w-full max-w-6xl transition-all duration-700 ${
          entered && !isLeaving ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-1 font-[var(--font-vercetti)] text-xs uppercase tracking-[0.2em] text-white/45">
              Portfolio
            </p>
            <h1 className="font-[var(--font-soria)] text-3xl tracking-tight text-white md:text-5xl">
              All Side Projects
            </h1>
          </div>
          <button
            type="button"
            onClick={handleBackToProjectsPortal}
            className="shrink-0 self-start rounded-full border border-white/20 bg-white/[0.06] px-4 py-2.5 text-sm text-white/90 shadow-sm backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-white/45 hover:bg-white/[0.1] sm:self-auto"
          >
            Kembali ke Side Projects
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          {PROJECTS.map((project, index) => (
            <article
              key={`${project.title}-${project.date}`}
              className={`group rounded-2xl border border-white/[0.12] bg-white/[0.04] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] backdrop-blur-[2px] transition-all duration-500 hover:border-white/25 hover:bg-white/[0.07] ${
                entered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
              style={{
                transitionDelay: `${(useCinematicIntro ? 230 : 120) + index * 45}ms`,
              }}
            >
              <p className="mb-2 font-[var(--font-vercetti)] text-xs uppercase tracking-[0.12em] text-white/65">
                {project.date}
              </p>
              <h2 className="mb-3 font-[var(--font-soria)] text-2xl leading-tight">
                {project.title}
              </h2>
              <p className="mb-5 text-sm leading-relaxed text-white/85">
                {project.subtext}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/25 px-4 py-2 text-xs font-semibold tracking-wide transition hover:border-white/80 hover:bg-white/10"
                  >
                    View Project
                  </a>
                )}

                {project.urls?.map((item) => (
                  <a
                    key={item.url}
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/25 px-4 py-2 text-xs font-semibold tracking-wide transition hover:border-white/80 hover:bg-white/10"
                  >
                    {item.text}
                  </a>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default ProjectsPage;
