import * as THREE from "three";

/** Use triangles + compact title when canvas is phone-sized. */
export const COMPACT_EXPERIENCE_GRID_MAX_WIDTH = 640;

export function heroTitleLayout(cssWidth: number): {
  fontSize: number;
  position: [number, number, number];
  maxWidth: number;
} {
  if (cssWidth <= 360) {
    return { fontSize: 0.42, position: [0, 2.45, -10], maxWidth: 7.4 };
  }
  if (cssWidth <= 400) {
    return { fontSize: 0.48, position: [0, 2.32, -10], maxWidth: 8.2 };
  }
  if (cssWidth <= 480) {
    return { fontSize: 0.62, position: [0, 2.18, -10], maxWidth: 9.2 };
  }
  if (cssWidth <= 640) {
    return { fontSize: 0.88, position: [0, 2.08, -10], maxWidth: 10.5 };
  }
  if (cssWidth <= 900) {
    return { fontSize: 1.05, position: [0, 2.02, -10], maxWidth: 12.5 };
  }
  return { fontSize: 1.2, position: [0, 2, -10], maxWidth: 14 };
}

export function experienceTitleLayout(
  cssWidth: number,
  verticalNudge: number,
): {
  fontSize: number;
  letterSpacing: number;
  groupPosition: [number, number, number];
} {
  const y = 2 - verticalNudge;
  if (cssWidth <= 360) {
    return {
      fontSize: 0.26,
      letterSpacing: 0.21,
      groupPosition: [-1.02, y, -2],
    };
  }
  if (cssWidth <= 400) {
    return {
      fontSize: 0.28,
      letterSpacing: 0.26,
      groupPosition: [-1.2, y, -2],
    };
  }
  if (cssWidth <= 480) {
    return {
      fontSize: 0.32,
      letterSpacing: 0.34,
      groupPosition: [-1.5, y, -2],
    };
  }
  if (cssWidth <= 640) {
    return {
      fontSize: 0.36,
      letterSpacing: 0.4,
      groupPosition: [-1.75, y, -2],
    };
  }
  if (cssWidth <= 900) {
    return {
      fontSize: 0.38,
      letterSpacing: 0.58,
      groupPosition: [-2.85, y, -2],
    };
  }
  return {
    fontSize: 0.4,
    letterSpacing: 0.8,
    groupPosition: [-3.6, y, -2],
  };
}

export function experienceGridPositions(cssWidth: number): {
  work: THREE.Vector3;
  projects: THREE.Vector3;
} {
  if (cssWidth <= 360) {
    return {
      work: new THREE.Vector3(-0.52, 0, 0.12),
      projects: new THREE.Vector3(0.52, 0, 0),
    };
  }
  if (cssWidth <= 400) {
    return {
      work: new THREE.Vector3(-0.62, 0, 0.18),
      projects: new THREE.Vector3(0.62, 0, 0),
    };
  }
  if (cssWidth <= 480) {
    return {
      work: new THREE.Vector3(-0.82, 0, 0.28),
      projects: new THREE.Vector3(0.82, 0, 0),
    };
  }
  if (cssWidth <= 640) {
    return {
      work: new THREE.Vector3(-1, 0, 0.4),
      projects: new THREE.Vector3(1, 0, 0),
    };
  }
  return {
    work: new THREE.Vector3(-2, 0, 0),
    projects: new THREE.Vector3(2, 0, 0),
  };
}

export function gridTileTrianglePoints(
  id: "work" | "projects",
  cssWidth: number,
): [number, number, number][] {
  if (cssWidth <= 360) {
    if (id === "work") {
      return [
        [-0.72, 1.55, 0],
        [-0.72, -1.55, 0],
        [2.35, -1.55, 0],
      ];
    }
    return [
      [-2.35, 1.55, 0],
      [0.72, -1.55, 0],
      [0.72, 1.55, 0],
    ];
  }
  if (cssWidth <= 480) {
    if (id === "work") {
      return [
        [-0.88, 1.75, 0],
        [-0.88, -1.85, 0],
        [2.75, -1.85, 0],
      ];
    }
    return [
      [-2.85, 1.75, 0],
      [0.92, -1.85, 0],
      [0.92, 1.75, 0],
    ];
  }
  if (id === "work") {
    return [
      [-1, 2, 0],
      [-1, -2, 0],
      [3, -2, 0],
    ];
  }
  return [
    [-3, 2, 0],
    [1, -2, 0],
    [1, 2, 0],
  ];
}

export function gridTileTitleMobileLayout(
  id: "work" | "projects",
  cssWidth: number,
): { x: number; y: number } {
  if (cssWidth <= 360) {
    return id === "work" ? { x: 0.62, y: -1.42 } : { x: -0.62, y: 1.32 };
  }
  if (cssWidth <= 400) {
    return id === "work" ? { x: 0.78, y: -1.52 } : { x: -0.78, y: 1.42 };
  }
  if (cssWidth <= 480) {
    return id === "work" ? { x: 0.92, y: -1.62 } : { x: -0.92, y: 1.48 };
  }
  return id === "work" ? { x: 1, y: -1.7 } : { x: -1, y: 1.5 };
}

export function gridTileTitleFontSize(cssWidth: number): number {
  if (cssWidth <= 360) return 0.11;
  if (cssWidth <= 400) return 0.115;
  if (cssWidth <= 480) return 0.12;
  return 0.13;
}

export function gridTilePanelFontSize(cssWidth: number): number {
  if (cssWidth <= 360) return 0.52;
  if (cssWidth <= 480) return 0.6;
  if (cssWidth <= 640) return 0.64;
  return 0.7;
}

/** Label above each portal tile (WORK / PROJECTS). */
export function gridTileTitleTextPosition(
  cssWidth: number,
): [number, number, number] {
  if (cssWidth <= 360) return [0, -1.5, 0.3];
  if (cssWidth <= 480) return [0, -1.65, 0.34];
  return [0, -1.8, 0.4];
}
