import { registerRoot } from 'remotion';
import React, { useMemo } from 'react';
import { ThreeCanvas as Canvas } from '@remotion/three';
import { useCurrentFrame, interpolate } from 'remotion';
import { extend } from '@react-three/fiber';
import * as THREE from 'three';

extend(THREE);

const DURATION_SEC = 10;
const FPS = 30;
const TOTAL_FRAMES = DURATION_SEC * FPS;

const TestScene: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = frame / TOTAL_FRAMES;
  
  const cube = useMemo(() => {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ color: 0x1E3A5F, roughness: 0.5, metalness: 0.2 });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  }, []);
  
  const flagPole = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(0.1, 0.1, 6, 8);
    const material = new THREE.MeshStandardMaterial({ color: 0x7DD3FC });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 3, 0);
    return mesh;
  }, []);
  
  const flagStripe1 = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(4, 1.33);
    const material = new THREE.MeshBasicMaterial({ color: 0x1E3A5F, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 2, 0);
    return mesh;
  }, []);
  
  const flagStripe2 = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(4, 1.33);
    const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    return mesh;
  }, []);
  
  const flagStripe3 = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(4, 1.33);
    const material = new THREE.MeshBasicMaterial({ color: 0xFDE047, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -2, 0);
    return mesh;
  }, []);
  
  const ground = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(20, 20);
    const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.1, depthWrite: false, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -1;
    return mesh;
  }, []);
  
  return (
    <Canvas>
      <group>
        <primitive object={cube} position={[0, 0, 0]} rotation={[progress * Math.PI * 2, progress * Math.PI, 0]} />
        <primitive object={flagPole} />
        <group position={[1, 5, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <primitive object={flagStripe1} />
          <primitive object={flagStripe2} />
          <primitive object={flagStripe3} />
        </group>
        <primitive object={ground} />
        <ambientLight color="#FFFFFF" intensity={0.6} />
        <directionalLight position={[10, 20, 10]} color="#FDE047" intensity={0.8} />
        <directionalLight position={[-10, 15, -10]} color="#7DD3FC" intensity={0.5} />
      </group>
    </Canvas>
  );
};

registerRoot({
  name: 'TestRender',
  component: TestScene,
  durationInFrames: 10 * 30,
  fps: 30,
  width: 1920,
  height: 1080,
});