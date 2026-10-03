import React, { useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { QrMatrix } from './matrix';
import { ThreeTheme, ThreeModuleStyle } from '../types';

interface QrSceneProps {
  matrix: QrMatrix;
  theme: ThreeTheme;
  depth: number;
  moduleStyle: ThreeModuleStyle;
  accentColor: string;
  autoRotate: boolean;
  autoRotateSpeed: number;
  isTopView: boolean;
  onCanvasRef?: (canvas: HTMLCanvasElement) => void;
}

// Helper to determine if a module coordinate is part of a Finder Pattern center (3x3 core)
function isFinderCenter(r: number, c: number, size: number): boolean {
  // Top-Left Finder center: (2..4, 2..4)
  if (r >= 2 && r <= 4 && c >= 2 && c <= 4) return true;
  // Top-Right Finder center: (2..4, size-5..size-3)
  if (r >= 2 && r <= 4 && c >= size - 5 && c <= size - 3) return true;
  // Bottom-Left Finder center: (size-5..size-3, 2..4)
  if (r >= size - 5 && r <= size - 3 && c >= 2 && c <= 4) return true;
  return false;
}

const InstancedQrModules: React.FC<{
  matrix: QrMatrix;
  theme: ThreeTheme;
  depth: number;
  moduleStyle: ThreeModuleStyle;
  accentColor: string;
}> = ({ matrix, theme, depth, moduleStyle, accentColor }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const moduleColor = useMemo(() => new THREE.Color(theme.moduleColor), [theme.moduleColor]);
  const finderColor = useMemo(() => new THREE.Color(accentColor), [accentColor]);

  // Choose geometry based on style
  const geometry = useMemo(() => {
    switch (moduleStyle) {
      case 'cylinder':
        return new THREE.CylinderGeometry(0.42, 0.42, depth, 16);
      case 'rounded':
        return new THREE.BoxGeometry(0.86, depth, 0.86, 2, 2, 2);
      case 'cube':
      default:
        return new THREE.BoxGeometry(0.92, depth, 0.92);
    }
  }, [moduleStyle, depth]);

  useLayoutEffect(() => {
    if (!meshRef.current || matrix.totalDarkModules === 0) return;

    const size = matrix.size;
    const offset = (size - 1) / 2;
    let instanceIdx = 0;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (matrix.modules[r][c]) {
          const x = c - offset;
          const z = r - offset;
          const y = depth / 2 + 0.1; // sit directly on base plate

          tempObject.position.set(x, y, z);
          tempObject.scale.set(1, 1, 1);
          tempObject.updateMatrix();

          meshRef.current.setMatrixAt(instanceIdx, tempObject.matrix);

          // Apply accent color to finder centers for high-tech aesthetic
          if (isFinderCenter(r, c, size)) {
            meshRef.current.setColorAt(instanceIdx, finderColor);
          } else {
            meshRef.current.setColorAt(instanceIdx, moduleColor);
          }

          instanceIdx++;
        }
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [matrix, depth, moduleColor, finderColor, tempObject]);

  if (matrix.totalDarkModules === 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, undefined, matrix.totalDarkModules]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        roughness={theme.roughness}
        metalness={theme.metalness}
      />
    </instancedMesh>
  );
};

// Camera Controller for smoothly transitioning between Orbit and Scan-Safe Top View
const CameraDirector: React.FC<{
  isTopView: boolean;
  matrixSize: number;
  autoRotate: boolean;
  autoRotateSpeed: number;
}> = ({ isTopView, matrixSize, autoRotate, autoRotateSpeed }) => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const topDistance = Math.max(24, matrixSize * 1.6);
  const targetPos = useMemo(() => new THREE.Vector3(0, topDistance, 0.001), [topDistance]);

  useEffect(() => {
    if (isTopView && controlsRef.current) {
      camera.position.copy(targetPos);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  }, [isTopView, camera, targetPos]);

  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      maxPolarAngle={isTopView ? 0.01 : Math.PI / 2 - 0.05} // prevent going below ground
      minDistance={10}
      maxDistance={80}
      autoRotate={autoRotate && !isTopView}
      autoRotateSpeed={autoRotateSpeed}
    />
  );
};

export const QrScene: React.FC<QrSceneProps> = ({
  matrix,
  theme,
  depth,
  moduleStyle,
  accentColor,
  autoRotate,
  autoRotateSpeed,
  isTopView,
  onCanvasRef,
}) => {
  const plateSize = Math.max(matrix.size + 4, 10);

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        camera={{
          position: [matrix.size * 0.7, matrix.size * 1.1, matrix.size * 1.1],
          fov: 45,
          near: 0.1,
          far: 500,
        }}
        onCreated={({ gl }) => {
          if (onCanvasRef) {
            onCanvasRef(gl.domElement);
          }
        }}
      >
        {/* Background Color */}
        <color attach="background" args={[theme.bgColor]} />

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={theme.ambientIntensity} />
        <directionalLight
          position={[15, 25, 15]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-15, 15, -15]} intensity={0.4} color={accentColor} />

        {/* Camera and Controls */}
        <CameraDirector
          isTopView={isTopView}
          matrixSize={matrix.size}
          autoRotate={autoRotate}
          autoRotateSpeed={autoRotateSpeed}
        />

        {/* Main Base Plate (Smooth Quiet Zone Base) */}
        <mesh position={[0, 0, 0]} receiveShadow>
          <boxGeometry args={[plateSize, 0.2, plateSize]} />
          <meshStandardMaterial
            color={theme.groundColor}
            roughness={0.4}
            metalness={0.05}
          />
        </mesh>

        {/* Subtle Outer Frame Border Accent */}
        <mesh position={[0, -0.05, 0]}>
          <boxGeometry args={[plateSize + 0.6, 0.1, plateSize + 0.6]} />
          <meshStandardMaterial color={accentColor} metalness={0.3} roughness={0.3} />
        </mesh>

        {/* Decorative corner pedestals (strictly positioned outside the quiet zone) */}
        {[
          [-plateSize / 2 + 0.6, -plateSize / 2 + 0.6],
          [plateSize / 2 - 0.6, -plateSize / 2 + 0.6],
          [-plateSize / 2 + 0.6, plateSize / 2 - 0.6],
          [plateSize / 2 - 0.6, plateSize / 2 - 0.6],
        ].map(([cx, cz], i) => (
          <mesh key={i} position={[cx, 0.2, cz]}>
            <cylinderGeometry args={[0.3, 0.4, 0.3, 8]} />
            <meshStandardMaterial color={accentColor} metalness={0.5} roughness={0.2} />
          </mesh>
        ))}

        {/* Instanced QR Modules */}
        <InstancedQrModules
          matrix={matrix}
          theme={theme}
          depth={depth}
          moduleStyle={moduleStyle}
          accentColor={accentColor}
        />
      </Canvas>
    </div>
  );
};
