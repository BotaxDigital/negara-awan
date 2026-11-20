import React from 'react';
import { Canvas } from '@remotion/three';

interface MonumentProps {
  position: [number, number, number];
  scale: number;
}

export const Monument: React.FC<MonumentProps> = ({ position, scale }) => (
  <Canvas>
    <group position={position} scale={scale}>
      {/* Base platform */}
      <mesh position={[0, 2, 0]} scale={[30, 4, 30]}>
        <boxGeometry />
        <meshStandardMaterial color="#1E3A5F" roughness={0.5} metalness={0.2} />
      </mesh>
      
      {/* Steps */}
      {[...Array(5)].map((_, i) => (
        <mesh key={i} position={[0, 4 + i * 1.5, 0]} scale={[25 - i * 3, 1.5, 25 - i * 3]}>
          <boxGeometry />
          <meshStandardMaterial color="#1E3A5F" roughness={0.5} metalness={0.2} />
        </mesh>
      ))}
      
      {/* Central obelisk */}
      <mesh position={[0, 50, 0]} scale={[4, 80, 4]}>
        <cylinderGeometry args={[1, 0.5, 1, 8]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.4} />
      </mesh>
      
      {/* Obelisk tip */}
      <mesh position={[0, 92, 0]} scale={[3, 8, 3]}>
        <coneGeometry args={[1, 1, 8]} />
        <meshStandardMaterial color="#FDE047" roughness={0.2} metalness={0.6} />
      </mesh>
      
      {/* Glowing lines on obelisk */}
      {[...Array(7)].map((_, i) => (
        <mesh key={i} position={[0, 12 + i * 11, 0]} scale={[4.1, 0.2, 4.1]}>
          <torusGeometry args={[1, 0.1, 8, 16]} />
          <meshBasicMaterial color="#7DD3FC" transparent opacity={0.6} />
        </mesh>
      ))}
      
      {/* Pillars around */}
      {[...Array(8)].map((_, i) => (
        <group key={i} position={[
          Math.cos(i * Math.PI / 4) * 20,
          15,
          Math.sin(i * Math.PI / 4) * 20
        ]}>
          <mesh position={[0, 15, 0]} scale={[2, 30, 2]}>
            <cylinderGeometry args={[1, 1, 1, 8]} />
            <meshStandardMaterial color="#7DD3FC" roughness={0.4} metalness={0.3} />
          </mesh>
          <mesh position={[0, 32, 0]} scale={[2.5, 2.5, 2.5]}>
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial color="#FDE047" />
          </mesh>
        </group>
      ))}
      
      {/* Floating particles around monument */}
      <MonumentParticles time={0} />
    </group>
  </Canvas>
);

const MonumentParticles: React.FC<{ time: number }> = ({ time }) => {
  const particles = React.useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      angle: (i / 50) * Math.PI * 2,
      radius: 25 + Math.random() * 10,
      height: Math.random() * 100,
      speed: 0.2 + Math.random() * 0.3,
      size: 0.2 + Math.random() * 0.5,
    })), []
  );

  return (
    <group>
      {particles.map((p, i) => (
        <mesh key={i} position={[
          Math.cos(p.angle + time * p.speed) * p.radius,
          p.height,
          Math.sin(p.angle + time * p.speed) * p.radius
        ]} scale={p.size}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#7DD3FC" transparent opacity={0.5} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

const coneGeometry = ({ args }: any) => ({ type: 'ConeGeometry', args });
const torusGeometry = ({ args }: any) => ({ type: 'TorusGeometry', args });
const sphereGeometry = ({ args }: any) => ({ type: 'SphereGeometry', args });