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
  { rotation: [0, Math.PI / 2, 0], position: (d) => [d[0] / 2 + 0.001, 0, 0] },    // right (+X)
  { rotation: [0, -Math.PI / 2, 0], position: (d) => [-d[0] / 2 - 0.001, 0, 0] },  // left (-X)
  { rotation: [-Math.PI / 2, 0, 0], position: (d) => [0, d[1] / 2 + 0.001, 0] },   // top (+Y)
  { rotation: [Math.PI / 2, 0, 0], position: (d) => [0, -d[1] / 2 - 0.001, 0] },   // bottom (-Y)
  { rotation: [0, 0, 0], position: (d) => [0, 0, d[2] / 2 + 0.001] },              // front (+Z)
  { rotation: [0, Math.PI, 0], position: (d) => [0, 0, -d[2] / 2 - 0.001] },       // back (-Z)
];

// Decal component for a single logo
function LogoDecal({ logoUrl, faceIndex, dimensions, scale = 0.5 }) {
  const texture = useTexture(logoUrl);
  const orientation = FACE_ORIENTATIONS[faceIndex];

  // Calculate decal size based on face dimensions and scale
  const faceSize = faceIndex < 2
    ? [dimensions[2], dimensions[1]] // left/right faces
    : faceIndex < 4
      ? [dimensions[0], dimensions[2]] // top/bottom faces
      : [dimensions[0], dimensions[1]]; // front/back faces

  const decalSize = Math.min(faceSize[0], faceSize[1]) * scale;

  return (
    <Decal
      position={orientation.position(dimensions)}
      rotation={orientation.rotation}
      scale={[decalSize, decalSize, 0.01]}
      map={texture}
      mapAnisotropy={16}
      depthTest={false}
      depthWrite={false}
      polygonOffset
      polygonOffsetFactor={-4}
    />
  );
}

export function ProductBox({
  textures,
  autoRotate = false,
  dimensions = [2, 3, 1],
  brandColors = null,
  logos = [], // Array of { faceIndex, url, scale } for logo decals
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

  return (
    <mesh ref={meshRef} material={materials} castShadow receiveShadow>
      <boxGeometry args={dimensions} />
      {/* Render logo decals */}
      {logos.map((logo, index) => (
        <LogoDecal
          key={`${logo.faceIndex}-${index}`}
          logoUrl={logo.url}
          faceIndex={logo.faceIndex}
          dimensions={dimensions}
          scale={logo.scale || 0.5}
        />
      ))}
    </mesh>
  );
}
