"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PROJECTS } from "@constants";

import type { Project } from "@/app/types/projects";

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M19 12H5M5 12l6 6M5 12l6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 17L17 7M7 7h10v10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const MONTH_ORDER: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

function sortKey(dateStr: string): number {
  const parts = dateStr.trim().split(/\s+/);
  if (parts.length < 2) return 0;
  const mon = MONTH_ORDER[parts[0].slice(0, 3)] ?? 0;
  const year = parseInt(parts[1] ?? "0", 10) || 0;
  return year * 12 + mon;
}

function primaryLink(project: Project): string | undefined {
  return project.url ?? project.urls?.[0]?.url;
}

function linkKind(url: string | undefined): "github" | "youtube" | "web" {
  if (!url) return "web";
  if (url.includes("github.com")) return "github";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  return "web";
}

function LinkKindIcon({ url, className }: { url: string | undefined; className?: string }) {
  const k = linkKind(url);
  if (k === "github") return <GitHubIcon className={className ?? "text-white/80"} />;
  if (k === "youtube") return <YouTubeIcon className={className ?? "text-red-300"} />;
  return <ExternalLinkIcon className={className ?? "text-white/70"} />;
}

function DotsVerticalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="5" r="1.75" />
      <circle cx="12" cy="12" r="1.75" />
      <circle cx="12" cy="19" r="1.75" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M11 19a8 8 0 100-16 8 8 0 000 16zm9 2l-4.35-4.35"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function hashHue(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = str.charCodeAt(i) + ((h << 5) - h);
  }
  return Math.abs(h) % 360;
}

function categoryBadge(kind: Project["kind"]): { label: string; className: string } {
  if (kind === "certificate") {
    return {
      label: "Certificate",
      className: "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-200/90",
    };
  }
  return { label: "Project", className: "bg-sky-100 text-sky-800 ring-1 ring-sky-200/80" };
}

const PROJECTS_PAGE_SIZE = 10;

function ProjectCardThumbnail({
  title,
  primaryUrl,
  displayIndex,
  image,
}: {
  title: string;
  primaryUrl: string | undefined;
  displayIndex: number;
  image?: string;
}) {
  const hue = hashHue(title);
  const hue2 = (hue + 48) % 360;
  const letter = title.trim().charAt(0).toUpperCase() || "?";
  const idx = String(displayIndex + 1).padStart(2, "0");

  return (
    <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-neutral-200">
      {image ? (
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          unoptimized
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background: `linear-gradient(125deg, hsl(${hue}, 58%, 38%) 0%, hsl(${hue2}, 50%, 22%) 55%, hsl(${(hue + 120) % 360}, 40%, 18%) 100%)`,
          }}
        />
      )}
      <div
        className="absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: "22px 22px",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-[var(--font-soria)] text-[clamp(3.25rem,16vw,5.5rem)] leading-none text-white/[0.22]">
        {letter}
      </span>
      <span className="pointer-events-none absolute left-3 top-3 font-[var(--font-soria)] text-2xl text-white/25 sm:left-4 sm:top-4 sm:text-3xl">
        {idx}
      </span>
      <div className="absolute bottom-3 right-3 flex items-center gap-2 sm:bottom-4 sm:right-4">
        <div className="rounded-lg border border-white/20 bg-black/20 p-2 text-white backdrop-blur-md">
          <LinkKindIcon url={primaryUrl} className="text-white" />
        </div>
      </div>
    </div>
  );
}

type ProjectCardProps = {
  project: Project;
  displayIndex: number;
  entered: boolean;
  transitionDelayMs: number;
};

function ProjectCard({ project, displayIndex, entered, transitionDelayMs }: ProjectCardProps) {
  const primary = primaryLink(project);
  const badge = categoryBadge(project.kind);
  const ctaLabel = project.kind === "certificate" ? "View certificate" : "View project";

  return (
    <article
      className={`group/card relative flex h-full select-text flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all duration-500 ease-out hover:-translate-y-0.5 hover:border-neutral-300 hover:shadow-md ${
        entered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
      style={{ transitionDelay: `${transitionDelayMs}ms` }}
    >
      <ProjectCardThumbnail
        title={project.title}
        primaryUrl={primary}
        displayIndex={displayIndex}
        image={project.image}
      />

      <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="min-w-0 font-[var(--font-soria)] text-lg font-semibold leading-snug tracking-tight text-neutral-900 sm:text-xl">
            {project.title}
          </h2>
          {primary && (
            <a
              href={primary}
              target="_blank"
              rel="noreferrer"
              className="-m-1 shrink-0 rounded-lg p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50"
              aria-label={`Open ${project.title}`}
            >
              <DotsVerticalIcon />
            </a>
          )}
        </div>

        <time
          className="mt-1.5 block font-sans text-sm text-neutral-500"
          dateTime={project.date}
        >
          {project.kind === "certificate" && project.issuer
            ? `${project.issuer} · ${project.date}`
            : `Last updated · ${project.date}`}
        </time>

        <p className="mt-3 line-clamp-2 flex-1 font-sans text-sm leading-relaxed text-neutral-600 sm:line-clamp-3">
          {project.subtext}
        </p>

        <div className="mt-4 flex flex-col gap-3 border-t border-neutral-100 pt-4 sm:mt-5 sm:flex-row sm:items-center sm:justify-between">
          <span
            className={`inline-flex w-fit rounded-full px-3 py-1 font-sans text-xs font-semibold ${badge.className}`}
          >
            {badge.label}
          </span>
          <div className="flex flex-wrap gap-2">
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-2 font-sans text-xs font-semibold text-white shadow-sm transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/30 focus-visible:ring-offset-2"
              >
                {ctaLabel}
                <ExternalLinkIcon className="h-3.5 w-3.5 opacity-80" />
              </a>
            )}
            {project.urls?.map((item) => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 font-sans text-xs font-semibold text-neutral-800 transition hover:border-neutral-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/40 focus-visible:ring-offset-2"
              >
                {item.text}
                <ExternalLinkIcon className="h-3.5 w-3.5 text-neutral-500" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

const ProjectsPage = () => {
  const [entered, setEntered] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [useCinematicIntro, setUseCinematicIntro] = useState(false);
  const [introHidden, setIntroHidden] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const listAnchorRef = useRef<HTMLDivElement>(null);
  const skipPageScrollRef = useRef(true);
  const router = useRouter();

  const sortedProjects = useMemo(
    () => [...PROJECTS].sort((a, b) => sortKey(b.date) - sortKey(a.date)),
    [],
  );

  const filteredProjects = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sortedProjects;
    return sortedProjects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.subtext.toLowerCase().includes(q) ||
        (p.issuer?.toLowerCase().includes(q) ?? false) ||
        p.date.toLowerCase().includes(q),
    );
  }, [sortedProjects, searchQuery]);

  const totalPages = useMemo(() => {
    const n = filteredProjects.length;
    if (n === 0) return 0;
    return Math.ceil(n / PROJECTS_PAGE_SIZE);
  }, [filteredProjects.length]);

  const paginatedProjects = useMemo(() => {
    const start = (page - 1) * PROJECTS_PAGE_SIZE;
    return filteredProjects.slice(start, start + PROJECTS_PAGE_SIZE);
  }, [filteredProjects, page]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (totalPages === 0) return;
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  useEffect(() => {
    if (skipPageScrollRef.current) {
      skipPageScrollRef.current = false;
      return;
    }
    listAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

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
    <main className="relative min-h-screen overflow-x-hidden bg-white px-5 py-12 text-neutral-900 selection:bg-violet-100 selection:text-violet-950 md:px-10 md:py-16 lg:px-12 lg:py-20">
      <div
        className={`pointer-events-none fixed inset-0 z-30 bg-white transition-opacity ${
          useCinematicIntro ? "duration-700" : "duration-300"
        } ${introHidden ? "opacity-0" : "opacity-100"}`}
      />
      <div
        className={`relative z-10 mx-auto w-full max-w-7xl transition-all duration-700 ease-out 2xl:max-w-[88rem] ${
          entered && !isLeaving ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
        }`}
      >
        <header className="mb-10 md:mb-12 lg:mb-14">
          <div className="mb-6 flex items-end gap-4">
            <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-neutral-400 to-transparent md:max-w-[160px]" />
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
          </div>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <div className="max-w-2xl">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <p className="font-[var(--font-vercetti)] text-[10px] uppercase tracking-[0.28em] text-neutral-500">
                  Portfolio
                </p>
                <span
                  className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-0.5 font-[var(--font-vercetti)] text-[10px] uppercase tracking-[0.14em] text-neutral-600"
                  aria-hidden
                >
                  {searchQuery.trim()
                    ? `${filteredProjects.length} matches`
                    : `${PROJECTS.length} projects & certificates`}
                </span>
              </div>
              <h1 className="font-[var(--font-soria)] text-[clamp(2rem,5vw,3.5rem)] leading-[1.08] tracking-tight text-neutral-900">
                Projects and Certificates
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-neutral-600 md:text-base md:leading-relaxed">
                Projects, certificates, and experiments — sorted with newest first.
              </p>
            </div>
            <button
              type="button"
              onClick={handleBackToProjectsPortal}
              className="group inline-flex shrink-0 items-center justify-center gap-2.5 self-start rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-3 text-sm font-medium text-neutral-800 shadow-sm transition duration-300 hover:border-neutral-300 hover:bg-white hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white lg:self-auto"
            >
              <ArrowLeftIcon className="text-neutral-500 transition group-hover:-translate-x-0.5 group-hover:text-neutral-800" />
              Back
            </button>
          </div>

          <div className="mt-8 md:mt-10">
            <label htmlFor="project-search" className="sr-only">
              Search projects and certificates
            </label>
            <div className="relative w-full max-w-md">
              <input
                id="project-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects and certificates…"
                autoComplete="off"
                className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 py-3 pl-11 pr-12 font-sans text-sm text-neutral-900 shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-200"
              />
              <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-neutral-400" />
              <button
                type="button"
                className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-xl bg-neutral-900 text-white transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                aria-label="Search"
                onClick={() => {
                  document.getElementById("project-search")?.focus();
                }}
              >
                <SearchIcon className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
        </header>

        <div ref={listAnchorRef} className="scroll-mt-24">
          <div
            className="mb-6 flex items-center gap-4"
            aria-hidden
          >
            <span className="shrink-0 font-[var(--font-vercetti)] text-[10px] uppercase tracking-[0.24em] text-neutral-400">
              Entries
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-neutral-300 via-neutral-200 to-transparent" />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 md:gap-7">
            {filteredProjects.length === 0 ? (
              <p className="col-span-full py-12 text-center font-sans text-sm text-neutral-500">
                No projects or certificates match &ldquo;{searchQuery.trim()}&rdquo;.
              </p>
            ) : (
              paginatedProjects.map((project, index) => {
                const globalIndex = (page - 1) * PROJECTS_PAGE_SIZE + index;
                return (
                  <ProjectCard
                    key={`${project.title}-${project.date}`}
                    project={project}
                    displayIndex={globalIndex}
                    entered={entered}
                    transitionDelayMs={(useCinematicIntro ? 230 : 100) + index * 40}
                  />
                );
              })
            )}
          </div>

          {totalPages > 1 ? (
            <nav
              className="mt-10 flex flex-col items-stretch justify-between gap-4 border-t border-neutral-200 pt-8 sm:flex-row sm:items-center"
              aria-label={`Projects and certificates pagination, page ${page} of ${totalPages}`}
            >
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 font-sans text-sm font-medium text-neutral-800 shadow-sm transition hover:border-neutral-300 hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-40 sm:justify-start"
              >
                <ChevronLeftIcon />
                Previous
              </button>

              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setPage(num)}
                    aria-current={num === page ? "page" : undefined}
                    className={`min-h-10 min-w-10 rounded-lg font-sans text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 ${
                      num === page
                        ? "bg-neutral-900 text-white"
                        : "border border-transparent text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 font-sans text-sm font-medium text-neutral-800 shadow-sm transition hover:border-neutral-300 hover:bg-neutral-50 disabled:pointer-events-none disabled:opacity-40 sm:justify-end"
              >
                Next
                <ChevronRightIcon />
              </button>
            </nav>
          ) : null}
        </div>
      </div>
    </main>
  );
};

export default ProjectsPage;
