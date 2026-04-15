import { Text, useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { SCROLL_EXPERIENCE } from "@constants";
import { useCanvasCssWidth } from "@/app/hooks/useCanvasCssWidth";
import {
  experienceGridPositions,
  experienceTitleLayout,
} from "@/app/lib/canvasResponsive";
import { usePortalStore } from "@stores";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import GridTile from "./GridTile";
import Projects from "./projects";
import Work from "./work";

/** Ease 0–1 scroll progress for softer fade / motion (short scroll band feels less abrupt). */
function easeExperienceProgress(t: number): number {
  const x = THREE.MathUtils.clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

/** Extra downward offset so title + tiles sit slightly lower (less cramped to the top). */
const EXPERIENCE_VERTICAL_NUDGE = 0.55;

const Experience = () => {
  const titleRef = useRef<THREE.Group>(null);
  const groupRef = useRef<THREE.Group>(null);
  const smoothProgressRef = useRef(0);
  const data = useScroll();
  const cssWidth = useCanvasCssWidth();
  const isActive = usePortalStore((state) => !!state.activePortalId);
  const titleLayout = useMemo(
    () => experienceTitleLayout(cssWidth, EXPERIENCE_VERTICAL_NUDGE),
    [cssWidth],
  );
  const gridPos = useMemo(() => experienceGridPositions(cssWidth), [cssWidth]);

  const fontProps = {
    font: "./soria-font.ttf",
    fontSize: titleLayout.fontSize,
    color: "white",
  };

  useFrame((sate, delta) => {
    const raw = data.range(SCROLL_EXPERIENCE.from, SCROLL_EXPERIENCE.length);
    const target = easeExperienceProgress(raw);
    smoothProgressRef.current = THREE.MathUtils.damp(
      smoothProgressRef.current,
      target,
      5,
      delta,
    );
    const d = smoothProgressRef.current;

    if (groupRef.current && !isActive) {
      groupRef.current.position.y = THREE.MathUtils.lerp(
        -30,
        -1 - EXPERIENCE_VERTICAL_NUDGE,
        d,
      );
      groupRef.current.visible = d > 0.002;
    }

    if (titleRef.current) {
      titleRef.current.children.forEach((text, i) => {
        const y =  Math.max(Math.min((1 - d) * (10 - i), 10), 0.5);
        text.position.y = THREE.MathUtils.damp(text.position.y, y, 7, delta);
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        (text as any).fillOpacity = d;
      });
    }
  });

  const getTitle = () => {
    const title = "experience".toUpperCase();
    const diff = titleLayout.letterSpacing;
    return title.split("").map((char, i) => {
      return (
        <Text key={i} {...fontProps} position={[i * diff, 2, 1]}>
          {char}
        </Text>
      );
    });
  };

  return (
    <group position={[0, -41.5, 12]} rotation={[-Math.PI / 2, 0 ,-Math.PI / 2]}>
      {/* <mesh receiveShadow position={[-5, 0, 0.1]}>
        <planeGeometry args={[10, 5, 1]} />
        <shadowMaterial opacity={0.1} />
      </mesh> */}
      <group rotation={[0, 0, Math.PI / 2]}>
        <group ref={titleRef} position={titleLayout.groupPosition}>
          {getTitle()}
        </group>

        <group position={[0, -1 - EXPERIENCE_VERTICAL_NUDGE, 0]} ref={groupRef}>
          <GridTile
            title="WORK AND EDUCATION"
            id="work"
            color="#b9c6d6"
            textAlign="left"
            position={gridPos.work}
          >
            <Work/>
          </GridTile>
          <GridTile
            title="PROJECTS"
            id="projects"
            color="#bdd1e3"
            textAlign="right"
            position={gridPos.projects}
          >
            <Projects/>
          </GridTile>
        </group>
      </group>
    </group>
  );
};

export default Experience;