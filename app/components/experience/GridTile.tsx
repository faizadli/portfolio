import { Edges, MeshPortalMaterial, Text, TextProps, useScroll } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import {
  COMPACT_EXPERIENCE_GRID_MAX_WIDTH,
  gridTilePanelFontSize,
  gridTileTitleFontSize,
  gridTileTitleMobileLayout,
  gridTileTitleTextPosition,
  gridTileTrianglePoints,
} from '@/app/lib/canvasResponsive';
import { usePortalStore } from '@stores';
import gsap from "gsap";
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { TriangleGeometry } from './Triangle';

interface GridTileProps {
  id: "work" | "projects";
  title: string;
  textAlign: TextProps['textAlign'];
  children: React.ReactNode;
  color: string;
  position: THREE.Vector3;
}

// TODO: Rename this
const GridTile = (props: GridTileProps) => {
  const titleRef = useRef<THREE.Group>(null);
  const gridRef = useRef<THREE.Group>(null);
  const hoverBoxRef = useRef<THREE.Mesh>(null);
  const portalRef = useRef(null);
  const { title, textAlign, children, color, position, id } = props;
  const { camera } = useThree();
  const cssWidth = useThree((s) => s.size.width);
  const compactGrid = cssWidth <= COMPACT_EXPERIENCE_GRID_MAX_WIDTH;
  const setActivePortal = usePortalStore((state) => state.setActivePortal);
  const isActive = usePortalStore((state) => state.activePortalId === id);
  const activePortalId = usePortalStore((state) => state.activePortalId);
  const data = useScroll();

  useEffect(() => {
    if (!compactGrid || !titleRef.current) return;
    const isWork = id === 'work';
    const pos = gridTileTitleMobileLayout(id, cssWidth);
    const fs = gridTileTitleFontSize(cssWidth);
    gsap.to(titleRef.current, {
      fontSize: fs,
      maxWidth: 4,
      color: isWork ? '#FFF' : '#888',
      letterSpacing: 0.4,
    });
    gsap.to(titleRef.current.position, {
      x: pos.x,
      y: pos.y,
      duration: 0.5,
    });
  }, [compactGrid, cssWidth, id]);

  useFrame(() => {
    const d = data.range(0.95, 0.05);
    if (compactGrid && titleRef.current) {
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      (titleRef.current as any).fillOpacity = d;
    }
  });

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      exitPortal(true);
    }
  };

  const ensureCloseControl = () => {
    if (document.querySelector('.close')) return;
    const div = document.createElement('div');
    div.className = 'fixed close';
    div.style.transform = 'rotateX(90deg)';
    div.onclick = () => exitPortal(true);
    document.body.appendChild(div);

    gsap.fromTo(
      div,
      {
        scale: 0,
        rotate: '-180deg',
      },
      {
        opacity: 1,
        zIndex: 10,
        transform: 'rotateX(0deg)',
        scale: 1,
        duration: 1,
      },
    );
  };

  const portalInto = (e: React.MouseEvent) => {
    if (isActive || activePortalId) return;
    e.stopPropagation();
    setActivePortal(id);
    document.body.style.cursor = 'auto';
    ensureCloseControl();
    document.body.addEventListener('keydown', handleEscape);
    gsap.to(portalRef.current, {
      blend: 1,
      duration: 0.5,
    });
  };

  useEffect(() => {
    if (!isActive) return;
    // Keep portal visuals in sync when activated programmatically (e.g. deep-link return).
    ensureCloseControl();
    document.body.removeEventListener('keydown', handleEscape);
    document.body.addEventListener('keydown', handleEscape);
    gsap.to(portalRef.current, {
      blend: 1,
      duration: 0.5,
    });
  }, [isActive]);

  const exitPortal = (force = false) => {
    if (!force && !activePortalId) return;
    setActivePortal(null)

    if (id === "projects") {
      const maxScrollTop = Math.max(0, data.el.scrollHeight - data.el.clientHeight);
      const targetScrollTop = maxScrollTop;
      // Keep users at the very end of the experience zone after closing side-project portal.
      data.el.scrollTop = targetScrollTop;
      window.setTimeout(() => {
        data.el.scrollTop = targetScrollTop;
      }, 80);
      window.setTimeout(() => {
        data.el.scrollTop = targetScrollTop;
      }, 200);
    }

    gsap.to(camera.position, {
      x: 0,
      duration: 1,
    });

    gsap.to(camera.rotation, {
      x: -Math.PI / 2,
      y: 0,
      duration: 1,
    });

    gsap.to(portalRef.current, {
      blend: 0,
      duration: 1,
    });

    // Remove the div from the dom
    gsap.to(document.querySelector('.close'), {
      scale: 0,
      duration: 0.5,
      onComplete: () => {
        document.querySelectorAll('.close').forEach((el) => {
          el.remove();
        });
      }
    })
    document.body.removeEventListener('keydown', handleEscape);
  }

  const fontProps: Partial<TextProps> = {
    font: "./soria-font.ttf",
    maxWidth: 2,
    anchorX: 'center',
    anchorY: 'bottom',
    fontSize: gridTilePanelFontSize(cssWidth),
    color: 'white',
    textAlign: textAlign,
    fillOpacity: 0,
  };

  const onPointerOver = () => {
    if (isActive || compactGrid) return;
    document.body.style.cursor = 'pointer';
    gsap.to(titleRef.current, {
      fillOpacity: 1
    });
    if (gridRef.current && hoverBoxRef.current) {
      gsap.to(gridRef.current.position, { z: 0.5, duration: 0.4});
      gsap.to(hoverBoxRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.4 });
    }
  };

  const onPointerOut = () => {
    if (compactGrid) return;
    document.body.style.cursor = 'auto';
    gsap.to(titleRef.current, {
      fillOpacity: 0
    });
    if (gridRef.current && hoverBoxRef.current) {
      gsap.to(gridRef.current.position, { z: 0, duration: 0.4});
      gsap.to(hoverBoxRef.current.scale, { x: 0, y: 0, z: 0, duration: 0.4 });
    }
  };

  const getGeometry = () => {
    if (!compactGrid) {
      return <planeGeometry args={[4, 4, 1]} />
    }

    const points = gridTileTrianglePoints(id, cssWidth);
    return <primitive object={TriangleGeometry({ points })} attach="geometry" />
  };

  return (
    <mesh ref={gridRef}
      position={position}
      onClick={portalInto}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}>
      { getGeometry() }
      <group>
        <mesh position={[0, 0, -0.01]} ref={hoverBoxRef} scale={[0, 0, 0]}>
          <boxGeometry args={[4, 4, 0.5]}/>
          <meshPhysicalMaterial
            color="#444"
            transparent={true}
            opacity={0.3}
          />
          <Edges color="white" lineWidth={3}/>
        </mesh>
        <Text
          position={gridTileTitleTextPosition(cssWidth)}
          {...fontProps}
          ref={titleRef}
        >
          {title}
        </Text>
      </group>
      <MeshPortalMaterial ref={portalRef} blend={0} resolution={0} blur={0}>
        <color attach="background" args={[color]} />
        {children}
      </MeshPortalMaterial>
    </mesh>
  );
}

export default GridTile;