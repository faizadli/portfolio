"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  Suspense,
} from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import {
  useGLTF,
  useTexture,
  Environment,
  Lightformer,
  Preload,
} from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RigidBodyProps,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import type { MeshLineGeometry as MeshLineGeometryType } from "meshline";
import type { RapierRigidBody } from "@react-three/rapier";
import * as THREE from "three";

extend({ MeshLineGeometry, MeshLineMaterial });

/** No solid scene background — shows the main portfolio canvas through empty pixels (same look in light/dark). */
function TransparentClear() {
  const { gl, scene } = useThree();
  useLayoutEffect(() => {
    gl.setClearColor(0x000000, 0);
    scene.background = null;
  }, [gl, scene]);
  return null;
}

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
}

export default function Lanyard({
  /** Slightly higher Y + a bit farther + wider FOV = bottom of card stays in frame. */
  position = [0, 2.85, 26],
  gravity = [0, -40, 0],
  fov = 20,
  transparent: _transparent = true,
}: LanyardProps) {
  void _transparent;

  return (
    <div className="relative z-0 isolate h-full w-full min-h-0 min-w-0 bg-transparent">
      <Canvas
        className="!absolute inset-0 block h-full w-full touch-none"
        style={{ background: "transparent" }}
        camera={{ position, fov, near: 0.1, far: 500 }}
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.SRGBColorSpace;
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1;
          gl.setClearColor(0x000000, 0);
        }}
        gl={{
          antialias: true,
          alpha: true,
          premultipliedAlpha: false,
          powerPreference: "high-performance",
          depth: true,
          stencil: false,
        }}
        dpr={[1, 2]}
      >
        <TransparentClear />
        <ambientLight intensity={Math.PI * 1.1} />
        <Suspense fallback={null}>
          <Physics gravity={gravity} timeStep={1 / 60}>
            <Band />
          </Physics>
          <Environment blur={0.75}>
            <Lightformer
              intensity={1.5}
              color="white"
              position={[0, -1, 5]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={2}
              color="white"
              position={[-1, -1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={2}
              color="white"
              position={[1, 1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={6}
              color="white"
              position={[-10, 0, 14]}
              rotation={[0, Math.PI / 2, Math.PI / 3]}
              scale={[100, 10, 1]}
            />
          </Environment>
          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
}

function Band({ maxSpeed = 50, minSpeed = 0 }: BandProps) {
  const band = useRef<THREE.Mesh | null>(null);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps: Partial<RigidBodyProps> = {
    type: "dynamic",
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4,
  };

  const { nodes, materials } = useGLTF(
    "/assets/lanyard/card.glb",
  ) as unknown as {
    nodes: {
      card: THREE.Mesh;
      clip: THREE.Mesh;
      clamp: THREE.Mesh;
    };
    materials: {
      base: THREE.MeshStandardMaterial & { map?: THREE.Texture };
      metal: THREE.MeshStandardMaterial;
    };
  };
  const texture = useTexture("/assets/lanyard/lanyard.png");
  const lineTexture = useMemo(() => {
    const t = texture.clone();
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.colorSpace = THREE.SRGBColorSpace;
    t.flipY = false;
    return t;
  }, [texture]);
  const [curve] = useState(() => {
    const c = new THREE.CatmullRomCurve3([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    c.curveType = "chordal";
    return c;
  });
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  const [isSmall, setIsSmall] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 1024;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = (): void => {
      setIsSmall(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return (): void => window.removeEventListener("resize", handleResize);
  }, []);

  const bandMaterial = useMemo(() => {
    const m = new MeshLineMaterial({
      color: "white",
      resolution: new THREE.Vector2(1000, isSmall ? 2000 : 1000),
      useMap: 1,
      map: lineTexture,
      repeat: new THREE.Vector2(-4, 1),
      lineWidth: 1.25,
    });
    m.depthTest = false;
    return m;
  }, [isSmall, lineTexture]);

  useEffect(() => {
    return () => {
      bandMaterial.dispose();
    };
  }, [bandMaterial]);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.75, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => {
        document.body.style.cursor = "auto";
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== "boolean") {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (fixed.current) {
      type LerpRigidBody = RapierRigidBody & { lerped?: THREE.Vector3 };
      [j1, j2].forEach((ref) => {
        const cur = ref.current as LerpRigidBody;
        if (!cur) return;
        if (!cur.lerped)
          cur.lerped = new THREE.Vector3().copy(cur.translation());
        const clampedDistance = Math.max(
          0.1,
          Math.min(1, cur.lerped.distanceTo(cur.translation())),
        );
        cur.lerped.lerp(
          cur.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)),
        );
      });
      curve.points[0].copy(j3.current!.translation());
      curve.points[1].copy((j2.current as LerpRigidBody).lerped!);
      curve.points[2].copy((j1.current as LerpRigidBody).lerped!);
      curve.points[3].copy(fixed.current!.translation());
      const ml = band.current?.geometry as unknown as MeshLineGeometryType;
      ml.setPoints(curve.getPoints(32));
      ang.copy(card.current!.angvel());
      rot.copy(card.current!.rotation());
      card.current!.setAngvel(
        { x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z },
        true,
      );
    }
  });

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody
          ref={fixed}
          {...segmentProps}
          type={"fixed" as RigidBodyProps["type"]}
        />
        <RigidBody
          position={[0.5, 0, 0]}
          ref={j1}
          {...segmentProps}
          type={"dynamic" as RigidBodyProps["type"]}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[1, 0, 0]}
          ref={j2}
          {...segmentProps}
          type={"dynamic" as RigidBodyProps["type"]}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[1.5, 0, 0]}
          ref={j3}
          {...segmentProps}
          type={"dynamic" as RigidBodyProps["type"]}
        >
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={
            dragged
              ? ("kinematicPosition" as RigidBodyProps["type"])
              : ("dynamic" as RigidBodyProps["type"])
          }
        >
          <CuboidCollider args={[1.2, 1.6875, 0.015]} />
          <group
            scale={4.2}
            position={[0, -3.3, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: ThreeEvent<PointerEvent>) => {
              (e.target as Element).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
              (e.target as Element).setPointerCapture(e.pointerId);
              drag(
                new THREE.Vector3()
                  .copy(e.point)
                  .sub(vec.copy(card.current!.translation())),
              );
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={materials.base.map}
                map-anisotropy={16}
                clearcoat={1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
                transparent={false}
                opacity={1}
                depthWrite
                depthTest
              />
            </mesh>
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <primitive object={bandMaterial} attach="material" />
      </mesh>
    </>
  );
}

useGLTF.preload("/assets/lanyard/card.glb");
