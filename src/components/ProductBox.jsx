import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Decal, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Face colors mapping: [right, left, top, bottom, front, back]
const DEFAULT_FACE_COLORS = [
  '#dfd8ec', // right - primary
  '#dfd8ec', // left - primary
  '#bfa2cd', // top - secondary
  '#bfa2cd', // bottom - secondary
  '#dfd8ec', // front - primary
  '#dfd8ec', // back - primary
];

// Face positions and rotations for decals
// BoxGeometry faces: [+X, -X, +Y, -Y, +Z, -Z] = [right, left, top, bottom, front, back]
const FACE_ORIENTATIONS = [
  { rotation: [0, Math.PI / 2, 0], axis: ['z', 'y'], sign: [1, 1] },    // right (+X)
  { rotation: [0, -Math.PI / 2, 0], axis: ['z', 'y'], sign: [-1, 1] },  // left (-X)
  { rotation: [-Math.PI / 2, 0, 0], axis: ['x', 'z'], sign: [1, -1] },  // top (+Y)
  { rotation: [Math.PI / 2, 0, 0], axis: ['x', 'z'], sign: [1, 1] },    // bottom (-Y)
  { rotation: [0, 0, 0], axis: ['x', 'y'], sign: [1, 1] },              // front (+Z)
  { rotation: [0, Math.PI, 0], axis: ['x', 'y'], sign: [-1, 1] },       // back (-Z)
];

// Get base position for face center
function getFaceBasePosition(faceIndex, dimensions) {
  const offset = 0.002; // Small offset to prevent z-fighting
  switch (faceIndex) {
    case 0: return [dimensions[0] / 2 + offset, 0, 0]; // right (+X)
    case 1: return [-dimensions[0] / 2 - offset, 0, 0]; // left (-X)
    case 2: return [0, dimensions[1] / 2 + offset, 0]; // top (+Y)
    case 3: return [0, -dimensions[1] / 2 - offset, 0]; // bottom (-Y)
    case 4: return [0, 0, dimensions[2] / 2 + offset]; // front (+Z)
    case 5: return [0, 0, -dimensions[2] / 2 - offset]; // back (-Z)
    default: return [0, 0, 0];
  }
}

// Get face size for calculating offset limits
function getFaceSize(faceIndex, dimensions) {
  switch (faceIndex) {
    case 0: case 1: return [dimensions[2], dimensions[1]]; // left/right faces (depth x height)
    case 2: case 3: return [dimensions[0], dimensions[2]]; // top/bottom faces (width x depth)
    case 4: case 5: return [dimensions[0], dimensions[1]]; // front/back faces (width x height)
    default: return [1, 1];
  }
}

// Apply position offset based on face orientation
function applyOffset(basePos, faceIndex, offset, dimensions) {
  const orientation = FACE_ORIENTATIONS[faceIndex];
  const faceSize = getFaceSize(faceIndex, dimensions);

  const axisMap = { x: 0, y: 1, z: 2 };
  const pos = [...basePos];

  // Apply X offset (horizontal on the face)
  const xAxis = axisMap[orientation.axis[0]];
  pos[xAxis] += offset.x * faceSize[0] * orientation.sign[0];

  // Apply Y offset (vertical on the face)
  const yAxis = axisMap[orientation.axis[1]];
  pos[yAxis] += offset.y * faceSize[1] * orientation.sign[1];

  return pos;
}

// Decal component for a single logo
function LogoDecal({ logoUrl, faceIndex, dimensions, scale = 0.3, position = { x: 0, y: 0 }, zIndex = 0 }) {
  const texture = useTexture(logoUrl);
  const orientation = FACE_ORIENTATIONS[faceIndex];
  const faceSize = getFaceSize(faceIndex, dimensions);

  // Calculate decal size based on face dimensions and scale
  const decalSize = Math.min(faceSize[0], faceSize[1]) * scale;

  // Calculate position with offset
  const basePos = getFaceBasePosition(faceIndex, dimensions);
  const finalPos = applyOffset(basePos, faceIndex, position, dimensions);

  // Z-index offset for layering (lower number = further from surface)
  const polygonOffset = -4 - (zIndex * 0.5);

  return (
    <Decal
      position={finalPos}
      rotation={orientation.rotation}
      scale={[decalSize, decalSize, 0.01]}
      map={texture}
      mapAnisotropy={16}
      depthTest={false}
      depthWrite={false}
      polygonOffset
      polygonOffsetFactor={polygonOffset}
    />
  );
}

export function ProductBox({
  textures,
  autoRotate = false,
  dimensions = [2, 3, 1],
  brandColors = null,
  logos = [], // Array of { faceIndex, url, scale, position: {x, y}, zIndex }
}) {
  const meshRef = useRef();

  // Create materials with brand colors or textures
  const materials = useMemo(() => {
    const loader = new THREE.TextureLoader();

    // Build face colors from brand or defaults
    const faceColors = brandColors
      ? [
          brandColors.primary,   // right
          brandColors.primary,   // left
          brandColors.secondary, // top
          brandColors.secondary, // bottom
          brandColors.primary,   // front
          brandColors.primary,   // back
        ]
      : DEFAULT_FACE_COLORS;

    return (textures || []).map((dataUrl, i) => {
      if (dataUrl) {
        // Has texture - use it
        const texture = loader.load(dataUrl);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        return new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.4,
          metalness: 0.05,
        });
      } else {
        // No texture - use brand color
        return new THREE.MeshStandardMaterial({
          color: faceColors[i] || faceColors[0],
          roughness: 0.5,
          metalness: 0.1,
        });
      }
    });
  }, [textures, brandColors]);

  // Auto-rotation animation
  useFrame((state, delta) => {
    if (autoRotate && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  // Sort logos by zIndex for proper layering
  const sortedLogos = useMemo(() =>
    [...logos].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0)),
    [logos]
  );

  return (
    <mesh ref={meshRef} material={materials} castShadow receiveShadow>
      <boxGeometry args={dimensions} />
      {/* Render logo decals sorted by z-index */}
      {sortedLogos.map((logo, index) => (
        <LogoDecal
          key={`${logo.faceIndex}-${logo.zIndex}-${index}`}
          logoUrl={logo.url}
          faceIndex={logo.faceIndex}
          dimensions={dimensions}
          scale={logo.scale || 0.3}
          position={logo.position || { x: 0, y: 0 }}
          zIndex={logo.zIndex || 0}
        />
      ))}
    </mesh>
  );
}
