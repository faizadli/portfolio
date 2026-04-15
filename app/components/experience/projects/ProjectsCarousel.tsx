import { useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import ProjectTile from "./ProjectTile";

import { PROJECTS } from "@constants";
import { usePortalStore } from "@stores";

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

const ProjectsCarousel = () => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const isActive = usePortalStore((state) => state.activePortalId === "projects");

  useEffect(() => {
    if (!isActive) setActiveId(null);
  }, [isActive]);

  const onClick = (id: number) => {
    if (!isMobile) return;
    setActiveId(id === activeId ? null : id);
  };

  const latestProjects = useMemo(
    () => [...PROJECTS].sort((a, b) => sortKey(b.date) - sortKey(a.date)).slice(0, 9),
    [],
  );

  const tiles = useMemo(() => {
    const fov = Math.PI;
    const distance = 13;
    const count = latestProjects.length;

    return latestProjects.map((project, i) => {
      const angle = (fov / count) * i;
      const z = -distance * Math.sin(angle);
      const x = -distance * Math.cos(angle);
      const rotY = Math.PI / 2 - angle;

      return (
        <ProjectTile
          key={`${project.title}-${project.date}`}
          project={project}
          index={i}
          position={[x, 1, z]}
          rotation={[0, rotY, 0]}
          activeId={activeId}
          onClick={() => onClick(i)}
        />
      );
    });
  }, [activeId, latestProjects]);

  return (
    <group rotation={[0, -Math.PI / 12, 0]}>
      {tiles}
    </group>
  );
};

export default ProjectsCarousel;