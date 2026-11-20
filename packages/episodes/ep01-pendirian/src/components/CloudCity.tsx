import React from 'react';
import { Canvas, useFrame } from '@remotion/three';
import * as THREE from 'three';

interface CloudCityProps {
  time: number;
  buildingCount: number;
  cloudDensity: number;
}

export const CloudCity: React.FC<CloudCityProps> = ({ time, buildingCount, cloudDensity }) => {
  const buildingsRef = React.useMemo(() => 
    Array.from({ length: Math.max(1, Math.floor(buildingCount)) }, (_, i) => ({
      x: (Math.sin(i * 1.7) * 200) + (Math.random() - 0.5) * 20,
      z: (Math.cos(i * 1.7) * 200) + (Math.random() - 0.5) * 20,
      height: 10 + Math.random() * 50,
      width: 5 + Math.random() * 15,
      depth: 5 + Math.random() * 15,
      color: new THREE.Color().setHSL(0.58, 0.3, 0.2 + Math.random() * 0.2),
      windows: Array.from({ length: Math.floor(10 + Math.random() * 20) }, () => ({
        x: (Math.random() - 0.5) * 0.8,
        y: Math.random(),
        z: (Math.random() - 0.5) * 0.8,
        lit: Math.random() > 0.3,
      })),
    })), [buildingCount]
  );

  const cloudsRef = React.useMemo(() =>
    Array.from({ length: Math.floor(30 * cloudDensity) }, (_, i) => ({
      x: (Math.sin(i * 0.7) * 300) + Math.sin(time * 0.1 + i) * 50,
      y: 50 + Math.cos(i * 0.5) * 100 + Math.sin(time * 0.05 + i) * 30,
      z: (Math.cos(i * 0.7) * 300) + Math.cos(time * 0.1 + i) * 50,
      scale: 5 + Math.random() * 20,
      opacity: 0.1 + Math.random() * 0.3 * cloudDensity,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.001,
    })), [cloudDensity]
  );

  return (
    <Canvas>
      <group>
        {/* Buildings */}
        {buildingsRef.map((b, i) => (
          <Building key={i} {...b} time={time} />
        ))}
        
        {/* Clouds */}
        {cloudsRef.map((c, i) => (
          <Cloud key={i} {...c} time={time} />
        ))}
        
        {/* Ground plane - awan tipis */}
        <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[500, 500, 1]}>
          <planeGeometry args={[1, 1, 50, 50]} />
          <meshBasicMaterial 
            color="#FFFFFF" 
            transparent 
            opacity={0.1 * cloudDensity}
            depthWrite={false}
            side={2}
          />
        </mesh>
        
        {/* Lighting */}
        <ambientLight color="#FFFFFF" intensity={0.6} />
        <directionalLight position={[100, 200, 100]} color="#FDE047" intensity={0.8} />
        <directionalLight position={[-100, 150, -100]} color="#7DD3FC" intensity={0.5} />
        <hemisphereLight skyColor="#7DD3FC" groundColor="#1E3A5F" intensity={0.3} />
      </group>
    </Canvas>
  );
};

const Building: React.FC<{
  x: number; y: number; z: number;
  height: number; width: number; depth: number;
  color: THREE.Color;
  windows: Array<{ x: number; y: number; z: number; lit: boolean }>;
  time: number;
}> = ({ x, y, z, height, width, depth, color, windows, time }) => (
  <group position={[x, height / 2, z]}>
    {/* Main structure */}
    <mesh scale={[width, height, depth]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
    </mesh>
    
    {/* Roof */}
    <mesh position={[0, height / 2 + 1, 0]} scale={[width * 1.1, 2, depth * 1.1]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color.clone().multiplyScalar(0.7)} roughness={0.5} metalness={0.2} />
    </mesh>
    
    {/* Windows */}
    {windows.map((w, i) => (
      <mesh
        key={i}
        position={[w.x * width, (w.y - 0.5) * height, (depth / 2 + 0.1) * w.z]}
        scale={[1, 2, 0.1]}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial 
          color={w.lit ? '#FDE047' : '#1E3A5F'} 
          transparent 
          opacity={w.lit ? 0.9 : 0.3}
          side={2}
        />
      </mesh>
    ))}
    
    {/* Blinking light on top */}
    <mesh position={[0, height / 2 + 3, 0]} scale={0.5}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial 
        color="#EF4444" 
        transparent 
        opacity={0.5 + Math.sin(time * 2) * 0.5}
      />
    </mesh>
  </group>
);

const Cloud: React.FC<{
  x: number; y: number; z: number;
  scale: number; opacity: number; rotation: number; rotSpeed: number;
  time: number;
}> = ({ x, y, z, scale, opacity, rotation, rotSpeed, time }) => (
  <group 
    position={[x, y + Math.sin(time * 0.1) * 5, z]} 
    rotation={[0, rotation + rotSpeed * time * 60, 0]}
    scale={scale}
  >
    {[...Array(5)].map((_, i) => (
      <mesh key={i} position={[
        Math.sin(i * 1.3) * 3,
        Math.cos(i * 1.3) * 1,
        Math.sin(i * 0.7) * 3
      ]} scale={[2 + Math.sin(i) * 1, 1 + Math.cos(i) * 0.5, 2 + Math.sin(i) * 1]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={opacity} depthWrite={false} />
      </mesh>
    ))}
  </group>
);