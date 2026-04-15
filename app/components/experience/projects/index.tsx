import { useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef } from "react";
import type { MutableRefObject } from "react";
import { isMobile } from "react-device-detect";
import * as THREE from "three";
import { usePortalStore, useScrollStore } from "@stores";
import { Wanderer } from "../../models/Wanderer";
import ProjectsCarousel from "./ProjectsCarousel";
import { TouchPanControls } from "./TouchPanControls";

type ScrollWithTarget = ReturnType<typeof useScroll> & {
  scroll: MutableRefObject<number>;
};

const Projects = () => {
  const { camera } = useThree();
  const isActive = usePortalStore((state) => state.activePortalId === "projects");
  const data = useScroll() as ScrollWithTarget;
  const wasPortalActiveRef = useRef(false);

  useEffect(() => {
    if (!isActive) return;
    data.el.style.overflow = "hidden";
    wasPortalActiveRef.current = true;
    if (isMobile) {
      gsap.to(camera.position, { z: 11.5, y: -39, x: 1, duration: 1 });
      gsap.to(camera.rotation, { x: -Math.PI / 2, y: 0, z: 0, duration: 0.8 });
    } else {
      gsap.to(camera.position, { z: 11.5, y: -39, x: 2, duration: 1 });
      gsap.to(camera.rotation, { x: -Math.PI / 2, y: 0, z: 0, duration: 0.8 });
    }
  }, [isActive, data.el]);

  // Run scroll restore in useLayoutEffect so scrollTop + drei sync happen before paint / next rAF.
  useLayoutEffect(() => {
    if (isActive) return;
    if (!wasPortalActiveRef.current) return;
    wasPortalActiveRef.current = false;
    data.el.style.overflow = "auto";
    const maxScrollTop = Math.max(0, data.el.scrollHeight - data.el.clientHeight);
    if (maxScrollTop <= 0) return;
    data.el.scrollTop = maxScrollTop;
    data.el.scrollTo?.({ top: maxScrollTop, behavior: "instant" });
    const ratio = THREE.MathUtils.clamp(
      maxScrollTop > 0 ? data.el.scrollTop / maxScrollTop : 0,
      0,
      1,
    );
    data.scroll.current = ratio;
    data.offset = ratio;
    // Short belt: keep drei target aligned with DOM; camera stays on damp (same as direct exit).
    useScrollStore.getState().requestSnapCameraToScroll(8);
  }, [isActive, data.el]);

  useFrame((state, delta) => {
    if (isActive) {
      if (!isMobile) {
        camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, -(state.pointer.x * Math.PI) / 4, 0.03);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, 11.5 - state.pointer.y, 7, delta);
      }
    }
  });

  return (
    <group>
      <Wanderer rotation={new THREE.Euler(0, Math.PI / 6, 0)} scale={new THREE.Vector3(1.5, 1.5, 1.5)} position={new THREE.Vector3(0, -1, -1)}/>
      <ProjectsCarousel />
      { isActive && isMobile && <TouchPanControls /> }
    </group>
  );
};

export default Projects;
