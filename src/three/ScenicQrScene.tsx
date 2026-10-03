import React, { useRef, useLayoutEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { QrMatrix } from './matrix';
import {
  generateScenicVoxels,
  ScenicThemeId,
  SCENIC_THEMES,
  VoxelData,
} from './voxelGenerator';

interface ScenicQrSceneProps {
  matrix: QrMatrix;
  themeId: ScenicThemeId;
  morphT: number; // 0 = 2D Flat Scan Mode, 1 = 3D Scenic Diorama
  autoRotate: boolean;
  autoRotateSpeed: number;
  onCanvasRef?: (canvas: HTMLCanvasElement) => void;
}

/**
 * Instanced Voxel Mesh with real-time morphing between 2D Scan and 3D Scenic states
 */
const InstancedScenicVoxels: React.FC<{
  voxels: VoxelData[];
  morphT: number;
}> = ({ voxels, morphT }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const tempObj = useMemo(() => new THREE.Object3D(), []);

  // Shared Box Geometry for all voxels
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

  useLayoutEffect(() => {
    if (!meshRef.current || voxels.length === 0) return;

    const count = voxels.length;
    const t = Math.max(0, Math.min(1, morphT));

    // Reusable vectors for smooth interpolation
    const currentPos = new THREE.Vector3();
    const currentScale = new THREE.Vector3();

    for (let i = 0; i < count; i++) {
      const v = voxels[i];

      // Lerp position
      currentPos.lerpVectors(v.flatPos, v.scenicPos, t);

      // Lerp scale
      currentScale.lerpVectors(v.flatScale, v.scenicScale, t);

      tempObj.position.copy(currentPos);
      tempObj.scale.copy(currentScale);
      tempObj.updateMatrix();

      meshRef.current.setMatrixAt(i, tempObj.matrix);
      meshRef.current.setColorAt(i, v.color);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [voxels, morphT, tempObj]);

  if (voxels.length === 0) return null;

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, undefined, voxels.length]}
      castShadow={morphT > 0.1}
      receiveShadow={morphT > 0.1}
    >
      <meshStandardMaterial
        roughness={morphT < 0.1 ? 0.9 : 0.35}
        metalness={morphT < 0.1 ? 0.0 : 0.1}
      />
    </instancedMesh>
  );
};

/**
 * Camera Controller morphing smoothly between Top-Down Scan and 45-degree Scenic Orbit
 */
const CameraMorphDirector: React.FC<{
  morphT: number;
  matrixSize: number;
  autoRotate: boolean;
  autoRotateSpeed: number;
}> = ({ morphT, matrixSize, autoRotate, autoRotateSpeed }) => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const topDistance = Math.max(22, matrixSize * 1.55);
  const scenicPos = useMemo(
    () => new THREE.Vector3(matrixSize * 0.72, matrixSize * 0.95, matrixSize * 1.05),
    [matrixSize]
  );
  const topPos = useMemo(
    () => new THREE.Vector3(0, topDistance, 0.001),
    [topDistance]
  );

  useFrame(() => {
    if (!controlsRef.current) return;

    const t = Math.max(0, Math.min(1, morphT));
    const isScanMode = t < 0.02;

    if (isScanMode) {
      // Lock precisely to top-down scan orientation
      camera.position.lerp(topPos, 0.15);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.minPolarAngle = 0.001;
      controlsRef.current.maxPolarAngle = 0.01;
    } else {
      // Allow full scenic orbit
      controlsRef.current.minPolarAngle = 0.1;
      controlsRef.current.maxPolarAngle = Math.PI / 2 - 0.05; // don't go below ground
      if (t < 0.98) {
        const targetPos = new THREE.Vector3().lerpVectors(topPos, scenicPos, t);
        camera.position.lerp(targetPos, 0.1);
      }
    }

    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      minDistance={8}
      maxDistance={90}
      autoRotate={autoRotate && morphT > 0.5}
      autoRotateSpeed={autoRotateSpeed}
    />
  );
};

export const ScenicQrScene: React.FC<ScenicQrSceneProps> = ({
  matrix,
  themeId,
  morphT,
  autoRotate,
  autoRotateSpeed,
  onCanvasRef,
}) => {
  const theme = SCENIC_THEMES[themeId] || SCENIC_THEMES['shinto-alpine'];
  const voxels = useMemo(
    () => generateScenicVoxels(matrix, themeId),
    [matrix, themeId]
  );

  const plateSize = Math.max(matrix.size + 4.5, 12);
  const isScanMode = morphT < 0.05;

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        camera={{
          position: [0, Math.max(22, matrix.size * 1.55), 0.001],
          fov: 42,
          near: 0.1,
          far: 600,
        }}
        onCreated={({ gl }) => {
          if (onCanvasRef) {
            onCanvasRef(gl.domElement);
          }
        }}
      >
        {/* Background Color */}
        <color
          attach="background"
          args={[isScanMode ? theme.palette.ground : theme.palette.sky]}
        />

        {/* Ambient Fog in Scenic Mode */}
        {morphT > 0.2 && <fog attach="fog" args={[theme.palette.fog, 25, 120]} />}

        {/* Dynamic Lighting tuned to morph state */}
        <ambientLight intensity={isScanMode ? 1.4 : 0.85} />
        <directionalLight
          position={isScanMode ? [0, 50, 0] : [20, 35, 20]}
          intensity={isScanMode ? 1.2 : 1.5}
          castShadow={morphT > 0.1}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        {morphT > 0.2 && (
          <pointLight
            position={[-20, 20, -20]}
            intensity={0.6}
            color={theme.palette.accent}
          />
        )}

        {/* Camera Morph & Orbit Director */}
        <CameraMorphDirector
          morphT={morphT}
          matrixSize={matrix.size}
          autoRotate={autoRotate}
          autoRotateSpeed={autoRotateSpeed}
        />

        {/* Main Ground Plate (Smooth Quiet Zone Base) */}
        <mesh position={[0, -0.05, 0]} receiveShadow={morphT > 0.1}>
          <boxGeometry args={[plateSize, 0.15, plateSize]} />
          <meshStandardMaterial
            color={theme.palette.ground}
            roughness={0.5}
            metalness={0.0}
          />
        </mesh>

        {/* Instanced Voxel Terrain */}
        <InstancedScenicVoxels
          voxels={voxels}
          morphT={morphT}
        />
      </Canvas>
    </div>
  );
};
