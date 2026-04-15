'use client';

import { useScroll } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { isMobile } from "react-device-detect";
import { useEffect } from "react";
import type { MutableRefObject } from "react";
import * as THREE from "three";

import { usePortalStore, useScrollStore } from "@stores";

/** Drei's internal scroll state — `scroll.current` is the damp target fed by DOM `onScroll`. */
type ScrollWithTarget = ReturnType<typeof useScroll> & {
  scroll: MutableRefObject<number>;
};

const ScrollWrapper = (props: { children: React.ReactNode | React.ReactNode[] }) => {
  const { camera } = useThree();
  const data = useScroll() as ScrollWithTarget;
  const isActive = usePortalStore((state) => !!state.activePortalId);
  const setActivePortal = usePortalStore((state) => state.setActivePortal);
  const setScrollProgress = useScrollStore((state) => state.setScrollProgress);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("open") !== "projects") return;

    let cancelled = false;
    const runWhenReady = () => {
      if (cancelled) return;
      const maxScrollTop = Math.max(0, data.el.scrollHeight - data.el.clientHeight);
      if (maxScrollTop < 1) {
        requestAnimationFrame(runWhenReady);
        return;
      }
      data.el.scrollTop = maxScrollTop;
      const maxST = Math.max(0, data.el.scrollHeight - data.el.clientHeight);
      const ratio = maxST > 0 ? THREE.MathUtils.clamp(data.el.scrollTop / maxST, 0, 1) : 0;
      data.scroll.current = ratio;
      data.offset = ratio;
      useScrollStore.getState().requestSnapCameraToScroll(8);
      window.setTimeout(() => {
        if (cancelled) return;
        setActivePortal("projects");
        window.history.replaceState(window.history.state, "", "/");
      }, 120);
    };
    queueMicrotask(() => requestAnimationFrame(runWhenReady));

    return () => {
      cancelled = true;
    };
  }, [data, setActivePortal]);

  // Priority -1 runs after ScrollControls (0). Sync `offset` + `scroll.current` from DOM before
  // `data.range()`. If `scroll.current` stays 0 while scrollTop is at the bottom, damp pulls offset
  // toward Hero even though the scrollbar is at the end.
  useFrame((state, delta) => {
    if (!data) return;

    let snapThisFrame = false;
    if (!isActive) {
      const snapLeft = useScrollStore.getState().snapCameraToScrollFrames;
      snapThisFrame = snapLeft > 0;
      if (snapThisFrame) {
        const maxST = Math.max(0, data.el.scrollHeight - data.el.clientHeight);
        const ratio =
          maxST > 0 ? THREE.MathUtils.clamp(data.el.scrollTop / maxST, 0, 1) : 0;
        data.scroll.current = ratio;
        data.offset = ratio;
        useScrollStore.setState({ snapCameraToScrollFrames: snapLeft - 1 });
      }
    }

    const a = data.range(0, 0.3);
    const b = data.range(0.3, 0.5);
    const d = data.range(0.85, 0.18);

    if (!isActive) {
      // Snap frames only fix drei `offset` / `scroll.current` vs DOM — keep camera on damp + lerp
      // so exit matches “buka side project lalu X” (no long instant snap segment).
      camera.rotation.x = THREE.MathUtils.damp(camera.rotation.x, -0.5 * Math.PI * a, 5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, -37 * b, 7, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, 5 + 10 * d, 7, delta);

      setScrollProgress(data.range(0, 1));
    }

    if (!isMobile && !isActive) {
      const yawTarget = -(state.pointer.x * Math.PI) / 90;
      camera.rotation.y = THREE.MathUtils.lerp(camera.rotation.y, yawTarget, 0.05);
    }
  }, -1);

  const children = Array.isArray(props.children) ? props.children : [props.children];

  return (
    <>
      {children.map((child, index) => (
        <group key={index}>{child}</group>
      ))}
    </>
  );
};

export default ScrollWrapper;
