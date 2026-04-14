import { Box, Edges, Line, Text, TextProps } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { usePortalStore } from "@stores";
import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { WORK_TIMELINE } from "@constants";
import { WorkTimelinePoint } from "@types";

const reusableLeft = new THREE.Vector3(-0.3, 0, -0.1);
const reusableRight = new THREE.Vector3(0.3, 0, -0.1);

/**
 * First/last timeline entries use `position: 'right'` (text grows to the right).
 * On narrow viewports that clips; stack centered labels under the node instead.
 */
const NARROW_STACKED_LABELS_MAX_CSS_WIDTH = 640;

/**
 * Soft shadow only (no hard stroke — thin fonts stay clean).
 * Troika uses blurred outline as outer glow / drop shadow.
 */
const TIMELINE_TEXT_SHADOW: Pick<
  TextProps,
  | "outlineWidth"
  | "outlineColor"
  | "outlineOpacity"
  | "outlineBlur"
  | "outlineOffsetX"
  | "outlineOffsetY"
> = {
  outlineWidth: 0.0025,
  outlineColor: "#000000",
  outlineOpacity: 0.32,
  outlineBlur: 0.02,
  outlineOffsetX: 0.002,
  outlineOffsetY: -0.006,
};

/** XY plane, facing +Z; corners rounded with quadratic curves. */
function createRoundedRectShapeGeometry(
  width: number,
  height: number,
  radius: number,
): THREE.ShapeGeometry {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  const w = width;
  const h = height;
  const r = Math.min(radius, w / 2 - 0.002, h / 2 - 0.002, 0.22);
  shape.moveTo(x + r, y + h);
  shape.lineTo(x + w - r, y + h);
  shape.quadraticCurveTo(x + w, y + h, x + w, y + h - r);
  shape.lineTo(x + w, y + r);
  shape.quadraticCurveTo(x + w, y, x + w - r, y);
  shape.lineTo(x + r, y);
  shape.quadraticCurveTo(x, y, x, y + r);
  shape.lineTo(x, y + h - r);
  shape.quadraticCurveTo(x, y + h, x + r, y + h);
  return new THREE.ShapeGeometry(shape);
}

/** Smoother than binary mobile/desktop so narrow desktop windows match phones. */
function timelinePointScale(cssWidth: number, stacked: boolean): number {
  const base = THREE.MathUtils.clamp(
    THREE.MathUtils.mapLinear(cssWidth, 320, 1200, 0.33, 0.6),
    0.31,
    0.62,
  );
  if (stacked) {
    return THREE.MathUtils.clamp(
      base * (cssWidth <= 400 ? 0.92 : 0.96),
      0.29,
      0.58,
    );
  }
  return base;
}

/** Labels sit to the left or right of the timeline node; nudged on narrow viewports. */
function labelAnchorOffset(
  position: WorkTimelinePoint["position"],
  cssWidth: number,
): THREE.Vector3 {
  const v =
    position === "left"
      ? reusableLeft.clone()
      : position === "right"
        ? reusableRight.clone()
        : new THREE.Vector3();
  const narrow = THREE.MathUtils.clamp(1 - (cssWidth - 320) / 760, 0, 1);
  if (position === "right") v.x -= 0.34 * narrow;
  if (position === "left") v.x += 0.26 * narrow;
  return v;
}

const TimelinePoint = ({ point, diff }: { point: WorkTimelinePoint; diff: number }) => {
  const cssWidth = useThree((s) => s.size.width);
  const stacked = cssWidth <= NARROW_STACKED_LABELS_MAX_CSS_WIDTH;

  const pointScale = useMemo(
    () => timelinePointScale(cssWidth, stacked),
    [cssWidth, stacked],
  );

  const labelPosition = useMemo(() => {
    if (stacked) {
      const shiftLeft = THREE.MathUtils.mapLinear(
        cssWidth,
        320,
        640,
        -0.2,
        0,
      );
      // Keep label block below the timeline node so year doesn't collide with the square point.
      return new THREE.Vector3(shiftLeft, -0.24, -0.08);
    }
    return labelAnchorOffset(point.position, cssWidth);
  }, [stacked, cssWidth, point.position]);

  const sideAnchor = point.position === "left" ? "right" : "left";

  const textProps: Partial<TextProps> = useMemo(
    () => ({
      font: "./Vercetti-Regular.woff",
      color: "#f7f7f2",
      anchorX: stacked ? "center" : sideAnchor,
      textAlign: stacked ? "center" : undefined,
      fillOpacity: 2 - 2 * diff,
      ...TIMELINE_TEXT_SHADOW,
    }),
    [stacked, sideAnchor, diff],
  );

  const yearFontSize = stacked
    ? cssWidth <= 380
      ? 0.2
      : cssWidth <= 480
        ? 0.22
        : 0.24
    : cssWidth <= 700
      ? 0.2
      : 0.22;
  const titleFontSize = stacked
    ? cssWidth <= 380
      ? 0.32
      : cssWidth <= 480
        ? 0.34
        : 0.36
    : cssWidth <= 700
      ? 0.34
      : cssWidth <= 980
        ? 0.36
        : 0.4;
  const subtitleFontSize = stacked
    ? cssWidth <= 480
      ? 0.12
      : 0.13
    : cssWidth <= 900
      ? 0.12
      : 0.14;

  const titleMaxWidth = stacked
    ? cssWidth <= 360
      ? 2.28
      : cssWidth <= 400
        ? 2.38
        : cssWidth <= 480
          ? 2.58
          : 2.78
    : cssWidth <= 400
      ? 2.2
      : cssWidth <= 560
        ? 2.3
        : cssWidth <= 860
          ? 2.45
          : 2.65;

  const titleProps = useMemo(
    () => ({
      ...textProps,
      font: "./soria-font.ttf",
      fontSize: titleFontSize,
      maxWidth: titleMaxWidth,
      lineHeight: 1.05,
    }),
    [textProps, titleFontSize, titleMaxWidth],
  );

  const estimatedTitleLines = useMemo(() => {
    const charsPerLine = stacked
      ? cssWidth <= 380
        ? 14
        : cssWidth <= 480
          ? 16
          : 18
      : cssWidth <= 900
        ? 18
        : 22;
    return Math.max(1, Math.ceil(point.title.length / charsPerLine));
  }, [stacked, cssWidth, point.title]);

  const subtitleMaxWidth = stacked ? titleMaxWidth - 0.2 : titleMaxWidth;

  const estimatedSubtitleLines = useMemo(() => {
    const charsPerLine = stacked
      ? cssWidth <= 380
        ? 24
        : cssWidth <= 480
          ? 28
          : 30
      : cssWidth <= 900
        ? 28
        : 34;
    return Math.max(1, Math.ceil((point.subtitle ?? "").length / charsPerLine));
  }, [stacked, cssWidth, point.subtitle]);

  const backdropSize = useMemo(() => {
    if (!stacked) return [0, 0] as const;
    const w =
      cssWidth <= 360 ? 2.95 : cssWidth <= 400 ? 3.05 : cssWidth <= 480 ? 3.2 : 3.35;
    // Fit-content style height: tighter base + modest growth per wrapped line.
    const baseH = cssWidth <= 360 ? 1.56 : cssWidth <= 480 ? 1.66 : 1.78;
    const extraTitleH = (estimatedTitleLines - 1) * 0.23;
    const extraSubtitleH = (estimatedSubtitleLines - 1) * 0.15;
    const h = baseH + extraTitleH + extraSubtitleH;
    return [w, h] as const;
  }, [stacked, cssWidth, estimatedTitleLines, estimatedSubtitleLines]);

  const cardGeometry = useMemo(() => {
    if (!stacked) return null;
    const [w, h] = backdropSize;
    const cornerRadius = Math.min(0.16, w * 0.048, h * 0.14);
    return createRoundedRectShapeGeometry(w, h, cornerRadius);
  }, [stacked, backdropSize]);

  useEffect(() => {
    return () => {
      cardGeometry?.dispose();
    };
  }, [cardGeometry]);

  /** Same easing as fade: slide from below into place (sync with fillOpacity). */
  const reveal = THREE.MathUtils.clamp(1 - diff, 0, 1);
  const eased = reveal * reveal * (3 - 2 * reveal);
  const slideY = stacked ? THREE.MathUtils.lerp(-0.14, 0, eased) : 0;
  const cardOpacity = stacked ? 0.42 * eased : 0;

  const yearShiftX = stacked ? 0 : -diff / 2;
  const yearShiftY = stacked ? -0.02 : 0.01;
  const titleGroupY = stacked ? -0.66 : -0.58;
  const subtitleBaseGap = stacked ? 0.34 : 0.36;
  const subtitlePerExtraLine = stacked ? 0.19 : 0.22;
  const subtitleShiftY =
    -(subtitleBaseGap + (estimatedTitleLines - 1) * subtitlePerExtraLine) - diff;
  const cardTopY = 0.42;
  const cardCenterY = stacked ? cardTopY - backdropSize[1] / 2 : -0.52;

  return (
    <group position={point.point} scale={pointScale}>
      <Box
        args={[0.2, 0.2, 0.2]}
        position={[0, 0, -0.1]}
        scale={[1 - diff, 1 - diff, 1 - diff]}
      >
        <meshBasicMaterial color="white" wireframe />
        <Edges color="white" lineWidth={1.5} />
      </Box>
      <group>
        <group position={labelPosition}>
          <group position={[0, slideY, 0]}>
            {stacked && cardGeometry && (
              <mesh
                geometry={cardGeometry}
                position={[0, cardCenterY, -0.025]}
                renderOrder={-2}
              >
                <meshBasicMaterial
                  color="#08080c"
                  transparent
                  opacity={cardOpacity}
                  depthWrite={false}
                  depthTest
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}
            <Text
              {...textProps}
              fontSize={yearFontSize}
              position={[yearShiftX, yearShiftY, 0]}
              maxWidth={stacked ? titleMaxWidth : undefined}
            >
              {point.year}
            </Text>
            <group position={[0, titleGroupY, 0]}>
              <Text
                {...titleProps}
                fontSize={titleFontSize}
                maxWidth={titleMaxWidth}
                position={[0, -diff / 2, 0]}
              >
                {point.title}
              </Text>
              <Text
                {...textProps}
                fontSize={subtitleFontSize}
                lineHeight={1.1}
                position={[0, subtitleShiftY, 0]}
                maxWidth={subtitleMaxWidth}
              >
                {point.subtitle}
              </Text>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

const Timeline = ({ progress }: { progress: number }) => {
  const { camera } = useThree();
  const cssWidth = useThree((s) => s.size.width);
  const isActive = usePortalStore((state) => state.activePortalId === 'work');
  const timeline = useMemo(() => WORK_TIMELINE, []);

  const cameraXLead = useMemo(() => {
    const base = THREE.MathUtils.clamp(
      THREE.MathUtils.mapLinear(cssWidth, 320, 1100, -1.05, -2),
      -2,
      -1.02,
    );
    if (cssWidth <= NARROW_STACKED_LABELS_MAX_CSS_WIDTH) {
      return base + THREE.MathUtils.mapLinear(cssWidth, 320, 640, 0.32, 0);
    }
    return base;
  }, [cssWidth]);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(timeline.map(p => p.point), false), [timeline]);
  const curvePoints = useMemo(() => curve.getPoints(500), [curve]);
  const visibleCurvePoints = useMemo(() => curvePoints.slice(0, Math.max(1, Math.ceil(progress * curvePoints.length))), [curvePoints, progress]);
  const visibleTimelinePoints = useMemo(() => timeline.slice(0, Math.max(1, Math.round(progress * (timeline.length - 1) + 1))), [timeline, progress]);

  const [visibleDashedCurvePoints, setVisibleDashedCurvePoints] = useState<THREE.Vector3[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useFrame((_, delta) => {
    if (!isActive) return;

    const position = curve.getPoint(progress);
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      cameraXLead + position.x,
      4,
      delta,
    );
    camera.position.y = THREE.MathUtils.damp(camera.position.y, -39 + position.z, 4, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 13 - position.y, 4, delta);
  });

  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    const tl = gsap.timeline();
    if (groupRef.current) {
      tl.to(groupRef.current.scale, {
        x: isActive ? 1 : 0,
        y: isActive ? 1 : 0,
        z: isActive ? 1 : 0,
        duration: 1,
        delay: isActive ? 0.4 : 0,
      });
      tl.to(groupRef.current.position, {
        y: isActive ? 0 : -2,
        duration: 1,
        delay: isActive ? 0.4 : 0,
      }, 0);
    }

    if (isActive) {
      let i = 0;
      clearInterval(intervalRef.current!);
      setTimeout(() => {
        intervalRef.current = setInterval(() => {
          const p = i++ / 100;
          setVisibleDashedCurvePoints(curvePoints.slice(0, Math.max(1, Math.ceil(p * curvePoints.length))));
          if (i > 100 && intervalRef.current) clearInterval(intervalRef.current);
        }, 10);
      }, 1000);
    } else {
      setVisibleDashedCurvePoints([]);
      clearInterval(intervalRef.current!);
    }

    return () => clearInterval(intervalRef.current!);
  }, [isActive]);

  return (
    <group position={[0, -0.1, -0.1]}>
      <Line points={visibleCurvePoints} color="white" lineWidth={3} />
      {visibleDashedCurvePoints.length > 0 && (
        <Line
          points={visibleDashedCurvePoints}
          color="white"
          lineWidth={0.5}
          dashed
          dashSize={0.25}
          gapSize={0.25}
        />
      )}
      <group ref={groupRef}>
        {visibleTimelinePoints.map((point, i) => {
          const diff = Math.min(2 * Math.max(i - (progress * (timeline.length - 1)), 0), 1);
          return <TimelinePoint point={point} key={i} diff={diff} />;
        })}
      </group>
    </group>
  );
};

export default Timeline;
