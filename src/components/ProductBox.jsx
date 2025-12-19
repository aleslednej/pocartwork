import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
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

export function ProductBox({ textures, autoRotate = false, dimensions = [2, 3, 1], brandColors = null }) {
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
    </mesh>
  );
}
