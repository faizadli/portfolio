"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PROJECTS } from "@constants";

const ProjectsPage = () => {
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
    <main className="min-h-screen bg-[#0a0a0a] px-5 py-10 text-[#ededed] md:px-10">
      <div
        className={`pointer-events-none fixed inset-0 z-30 bg-black transition-opacity ${
          useCinematicIntro ? "duration-700" : "duration-300"
        } ${introHidden ? "opacity-0" : "opacity-100"}`}
      />
      <div
        className={`mx-auto w-full max-w-6xl transition-all duration-700 ${
          entered && !isLeaving ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <div className="mb-8 flex items-center justify-between gap-4">
          <h1 className="font-[var(--font-soria)] text-3xl md:text-5xl">
            All Side Projects
          </h1>
          <button
            type="button"
            onClick={handleBackToProjectsPortal}
            className="rounded-full border border-white/25 px-4 py-2 text-sm transition hover:-translate-y-0.5 hover:border-white/70"
          >
            Kembali ke Side Projects
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {PROJECTS.map((project, index) => (
            <article
              key={`${project.title}-${project.date}`}
              className={`rounded-2xl border border-white/15 bg-white/5 p-5 transition-all duration-500 ${
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
