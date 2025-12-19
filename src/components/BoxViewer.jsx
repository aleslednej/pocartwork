import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { Suspense, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ProductBox } from './ProductBox';

function SceneBackground({ color }) {
  const { scene } = useThree();

  useEffect(() => {
    scene.background = new THREE.Color(color);
  }, [color, scene]);

  return null;
}

function Scene({ textures, autoRotate, dimensions, brandColors, backgroundColor, logos }) {
  return (
    <>
      <SceneBackground color={backgroundColor} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 10, 7.5]}
        intensity={1}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} />

      {/* Product Box */}
      <ProductBox
        textures={textures}
        autoRotate={autoRotate}
        dimensions={dimensions}
        brandColors={brandColors}
        logos={logos}
      />

      {/* Ground shadow */}
      <ContactShadows
        position={[0, -1.5, 0]}
        opacity={0.4}
        scale={10}
        blur={2}
        far={4}
      />

      {/* Environment for reflections (subtle) */}
      <Environment preset="city" />
    </>
  );
}

export const BoxViewer = forwardRef(function BoxViewer({
  textures,
  autoRotate,
  dimensions = [2, 2.8, 1],
  brandColors = null,
  backgroundColor = '#ffffff',
  logos = []
}, ref) {
  const controlsRef = useRef();

  useImperativeHandle(ref, () => ({
    resetCamera: () => {
      if (controlsRef.current) {
        controlsRef.current.reset();
      }
    },
  }));

  return (
    <div className="canvas-container">
      <Canvas
        shadows
        camera={{
          position: [4, 3, 5],
          fov: 45,
          near: 0.1,
          far: 100,
        }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <Scene
            textures={textures}
            autoRotate={autoRotate}
            dimensions={dimensions}
            brandColors={brandColors}
            backgroundColor={backgroundColor}
            logos={logos}
          />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.05}
          minDistance={3}
          maxDistance={15}
          maxPolarAngle={Math.PI / 1.5}
          enablePan={false}
        />
      </Canvas>
    </div>
  );
});
