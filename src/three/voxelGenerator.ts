import * as THREE from 'three';
import { QrMatrix } from './matrix';
import { isFinderPattern } from '../lib/qrRenderer';

export interface VoxelData {
  // Flat scan state (t = 0)
  flatPos: THREE.Vector3;
  flatScale: THREE.Vector3;

  // Scenic 3D state (t = 1)
  scenicPos: THREE.Vector3;
  scenicScale: THREE.Vector3;

  // Visuals
  color: THREE.Color;
  isFinder: boolean;
  isDecorative: boolean; // Decorative periphery elements hidden in scan mode
}

export type ScenicThemeId = 'shinto-alpine' | 'mithila-grove' | 'floating-isle' | 'classic-blocks';

export interface ScenicThemeConfig {
  id: ScenicThemeId;
  name: string;
  subtitle: string;
  description: string;
  palette: {
    ground: string;
    terrain: string[];
    canopy: string[];
    accent: string;
    highlight: string;
    sky: string;
    fog: string;
  };
}

export const SCENIC_THEMES: Record<ScenicThemeId, ScenicThemeConfig> = {
  'shinto-alpine': {
    id: 'shinto-alpine',
    name: 'Anime Alpine & Shinto Pass',
    subtitle: 'Misty pine terraces, snow-capped peaks & vermilion torii gates',
    description: 'Crisp alpine terraced greenery leading up to vermilion shrines under snow-capped peaks.',
    palette: {
      ground: '#E8F0F2',
      terrain: ['#284B3D', '#325C4B', '#41735D', '#648E7A'],
      canopy: ['#F4F8FA', '#FFFFFF'], // Snow caps
      accent: '#C53030', // Torii Vermilion
      highlight: '#D99B26', // Sun gold
      sky: '#D3E2E8',
      fog: '#E0ECF0',
    },
  },
  'mithila-grove': {
    id: 'mithila-grove',
    name: 'Mithila Sacred Grove',
    subtitle: 'Terracotta stepped plinths, kadamba tree canopies & golden kalash',
    description: 'Sacred folk grove with terracotta brickwork, verdant kadamba foliage, and glowing kalash finials.',
    palette: {
      ground: '#F6F1E8', // Rice paper
      terrain: ['#1A3644', '#2D5A3E', '#A62B2B'], // Indigo, Leaf, Sindoor
      canopy: ['#3A7250', '#4E8C66', '#D99B26'], // Lush grove & haldi accents
      accent: '#D99B26', // Haldi Turmeric
      highlight: '#A62B2B', // Sacred Sindoor
      sky: '#EFE7DA',
      fog: '#F3EDE2',
    },
  },
  'floating-isle': {
    id: 'floating-isle',
    name: 'Floating Voxel Isle',
    subtitle: 'Cascading floating basalt isles & glowing crystal pillars',
    description: 'Suspended celestial islands with tiered stone platforms and glowing ethereal crystals.',
    palette: {
      ground: '#182430',
      terrain: ['#253746', '#2E4456', '#3C5B72'],
      canopy: ['#4DA2A9', '#5CE1E6'], // Luminous crystals
      accent: '#5CE1E6', // Glowing cyan
      highlight: '#D99B26', // Star dust
      sky: '#0E1722',
      fog: '#131F2D',
    },
  },
  'classic-blocks': {
    id: 'classic-blocks',
    name: 'Classic Blocks',
    subtitle: 'High-contrast geometric architectural cubes',
    description: 'Clean architectural cubes engineered for maximum optical legibility and contrast.',
    palette: {
      ground: '#FFFFFF',
      terrain: ['#1A3644', '#1A3644'], // Deep indigo
      canopy: ['#1A3644'],
      accent: '#A62B2B', // Sindoor accent
      highlight: '#D99B26',
      sky: '#F6F1E8',
      fog: '#EFEAE0',
    },
  },
};

/**
 * Cluster flood-fill to find connected module components
 */
function findModuleClusters(modules: boolean[][], size: number): number[][] {
  const clusterMap: number[][] = Array.from({ length: size }, () => Array(size).fill(-1));
  let currentClusterId = 0;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (modules[r][c] && clusterMap[r][c] === -1) {
        // Start BFS
        const queue: [number, number][] = [[r, c]];
        clusterMap[r][c] = currentClusterId;

        while (queue.length > 0) {
          const [currR, currC] = queue.shift()!;
          const neighbors: [number, number][] = [
            [currR - 1, currC],
            [currR + 1, currC],
            [currR, currC - 1],
            [currR, currC + 1],
          ];

          for (const [nr, nc] of neighbors) {
            if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
              if (modules[nr][nc] && clusterMap[nr][nc] === -1) {
                clusterMap[nr][nc] = currentClusterId;
                queue.push([nr, nc]);
              }
            }
          }
        }
        currentClusterId++;
      }
    }
  }

  return clusterMap;
}

/**
 * Generates procedural voxel diorama data with strict budget capping
 */
export function generateScenicVoxels(
  matrix: QrMatrix,
  themeId: ScenicThemeId
): VoxelData[] {
  if (matrix.size === 0 || matrix.totalDarkModules === 0) return [];

  const theme = SCENIC_THEMES[themeId] || SCENIC_THEMES['shinto-alpine'];
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const MAX_VOXELS = isMobile ? 15000 : 40000;

  const size = matrix.size;
  const offset = (size - 1) / 2;
  const clusters = findModuleClusters(matrix.modules, size);

  // Compute cluster sizes
  const clusterSizes: Record<number, number> = {};
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const cid = clusters[r][c];
      if (cid !== -1) {
        clusterSizes[cid] = (clusterSizes[cid] || 0) + 1;
      }
    }
  }

  const voxels: VoxelData[] = [];

  // Deterministic pseudo-random seed helper
  const pseudoRand = (seed: number) => {
    const x = Math.sin(seed * 9999) * 10000;
    return x - Math.floor(x);
  };

  // 1. Generate QR Data & Finder Voxels
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!matrix.modules[r][c]) continue;
      if (voxels.length >= MAX_VOXELS - 500) break; // stay within budget

      const x = c - offset;
      const z = r - offset;
      const isFinder = isFinderPattern(r, c, size);
      const isCenter =
        (r >= 2 && r <= 4 && c >= 2 && c <= 4) ||
        (r >= 2 && r <= 4 && c >= size - 5 && c <= size - 3) ||
        (r >= size - 5 && r <= size - 3 && c >= 2 && c <= 4);

      const clusterId = clusters[r][c];
      const clusterSize = clusterSizes[clusterId] || 1;

      // Height logic based on cluster density and landmark roles
      let columnHeight = 1;
      if (isCenter) {
        // Center landmark shrines rise high
        columnHeight = themeId === 'classic-blocks' ? 3 : 5;
      } else if (isFinder) {
        // Finder outer walls form stepped parapets
        columnHeight = themeId === 'classic-blocks' ? 2 : 3;
      } else if (clusterSize >= 8) {
        columnHeight = 4 + Math.floor(pseudoRand(r * 31 + c) * 3); // 4-6 tiers
      } else if (clusterSize >= 4) {
        columnHeight = 2 + Math.floor(pseudoRand(r * 17 + c) * 2); // 2-3 tiers
      } else {
        columnHeight = 1 + Math.floor(pseudoRand(r * 13 + c) * 2); // 1-2 tiers
      }

      // Generate voxel stack for this column
      for (let yLevel = 0; yLevel < columnHeight; yLevel++) {
        if (voxels.length >= MAX_VOXELS - 200) break;

        // Choose color per tier
        let hexColor = theme.palette.terrain[0];

        if (isCenter) {
          if (yLevel === columnHeight - 1) {
            hexColor = theme.palette.highlight; // Golden finial / sun beacon top
          } else {
            hexColor = theme.palette.accent; // Torii / Sindoor red column
          }
        } else if (isFinder) {
          hexColor = yLevel === columnHeight - 1 ? theme.palette.accent : theme.palette.terrain[0];
        } else if (yLevel === columnHeight - 1 && columnHeight >= 4) {
          // Canopy foliage or snow cap topper
          const canopyIdx = Math.floor(pseudoRand(r * 41 + c + yLevel) * theme.palette.canopy.length);
          hexColor = theme.palette.canopy[canopyIdx];
        } else {
          const terrainIdx = Math.min(yLevel, theme.palette.terrain.length - 1);
          hexColor = theme.palette.terrain[terrainIdx];
        }

        // At t = 0 (Scan Mode), only the base module (yLevel = 0) is visible, flattened planar
        const flatPos = new THREE.Vector3(x, 0.05, z);
        const flatScale = yLevel === 0
          ? new THREE.Vector3(0.96, 0.05, 0.96)
          : new THREE.Vector3(0, 0, 0); // extra vertical voxels collapse completely to 0!

        // At t = 1 (Scenic Mode), voxels stack vertically
        const scenicY = yLevel * 0.92 + 0.46;
        const scenicPos = new THREE.Vector3(x, scenicY, z);
        const scenicScale = new THREE.Vector3(0.94, 0.92, 0.94);

        voxels.push({
          flatPos,
          flatScale,
          scenicPos,
          scenicScale,
          color: new THREE.Color(hexColor),
          isFinder,
          isDecorative: false,
        });
      }
    }
  }

  // 2. Generate Scenic Environment Periphery (strictly outside the QR quiet zone)
  // Adds floating stepping stones, pine trees, and lotus lanterns around the border in Scenic mode
  if (themeId !== 'classic-blocks') {
    const marginDist = offset + 3.5;
    const peripheryStep = 2.5;

    for (let px = -marginDist; px <= marginDist; px += peripheryStep) {
      for (let pz = -marginDist; pz <= marginDist; pz += peripheryStep) {
        if (voxels.length >= MAX_VOXELS - 50) break;

        // Skip inside quiet zone
        if (Math.abs(px) < offset + 1.8 && Math.abs(pz) < offset + 1.8) continue;

        const randVal = pseudoRand(Math.floor(px * 13 + pz * 7));
        if (randVal > 0.4) {
          // Add decorative tree / stone / crystal
          const isTree = randVal > 0.7;
          const decoHeight = isTree ? 3 : 1;

          for (let dy = 0; dy < decoHeight; dy++) {
            const decoColor = dy === decoHeight - 1 && isTree
              ? theme.palette.canopy[0]
              : theme.palette.terrain[0];

            voxels.push({
              flatPos: new THREE.Vector3(px, -10, pz), // Hidden far below in scan mode
              flatScale: new THREE.Vector3(0, 0, 0),
              scenicPos: new THREE.Vector3(px, dy * 0.9 + 0.4, pz),
              scenicScale: new THREE.Vector3(0.85, 0.85, 0.85),
              color: new THREE.Color(decoColor),
              isFinder: false,
              isDecorative: true,
            });
          }
        }
      }
    }
  }

  return voxels;
}
