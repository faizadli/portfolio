import { useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useEffect } from "react";
import { isMobile } from "react-device-detect";
import * as THREE from "three";
import { usePortalStore } from "@stores";
import { Wanderer } from "../../models/Wanderer";
import ProjectsCarousel from "./ProjectsCarousel";
import { TouchPanControls } from "./TouchPanControls";

const Projects = () => {
  const { camera } = useThree();
  const isActive = usePortalStore((state) => state.activePortalId === "projects");
  const data = useScroll();

  useEffect(() => {
    // Hide scrollbar when active.
    data.el.style.overflow = isActive ? 'hidden' : 'auto';
    if (isActive) {
      if (isMobile) {
        gsap.to(camera.position, { z: 11.5, y: -39, x: 1, duration: 1 });
        gsap.to(camera.rotation, { x: -Math.PI / 2, y: 0, z: 0, duration: 0.8 });
      } else {
        // Keep desktop framing deterministic when entering via deep-link return.
        gsap.to(camera.position, { z: 11.5, y: -39, x: 2, duration: 1 });
        gsap.to(camera.rotation, { x: -Math.PI / 2, y: 0, z: 0, duration: 0.8 });
      }
    }
  }, [isActive]);

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
