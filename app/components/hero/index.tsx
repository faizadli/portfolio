'use client';

import { Text, useProgress } from "@react-three/drei";
import gsap from "gsap";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { heroTitleLayout } from "@/app/lib/canvasResponsive";
import { useCanvasCssWidth } from "@/app/hooks/useCanvasCssWidth";

import CloudContainer from "../models/Cloud";
import StarsContainer from "../models/Stars";
import WindowModel from "../models/WindowModel";
import TextWindow from "./TextWindow";

const Hero = () => {
  const titleRef = useRef<THREE.Mesh>(null);
  const { progress } = useProgress();
  const cssWidth = useCanvasCssWidth();
  const titleLayout = useMemo(() => heroTitleLayout(cssWidth), [cssWidth]);

  useEffect(() => {
    if (progress === 100 && titleRef.current) {
      const endY = titleLayout.position[1] - 2;
      gsap.fromTo(
        titleRef.current.position,
        {
          y: -10,
          duration: 1,
        },
        {
          y: endY,
          duration: 3,
        },
      );
    }
  }, [progress, titleLayout.position[1]]);

  const fontProps = {
    font: "./soria-font.ttf",
    fontSize: titleLayout.fontSize,
    maxWidth: titleLayout.maxWidth,
    anchorX: "center" as const,
    anchorY: "middle" as const,
    textAlign: "center" as const,
  };

  return (
    <>
      <Text position={titleLayout.position} {...fontProps} ref={titleRef}>
        Hi, I am Faiz Adli.
      </Text>
      <StarsContainer />
      <CloudContainer/>
      <group position={[0, -25, 5.69]}>
        <pointLight castShadow position={[1, 1, -2.5]} intensity={60} distance={10}/>
        <WindowModel receiveShadow/>
        <TextWindow/>
      </group>
    </>
  );
};

export default Hero;
