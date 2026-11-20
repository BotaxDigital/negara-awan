import React from 'react';
import { Canvas } from '@remotion/three';

interface BuildingGrowthProps {
  count: number;
  progress: number;
  time: number;
}

export const BuildingGrowth: React.FC<BuildingGrowthProps> = ({ count, progress, time }) => {
  const buildings = React.useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      x: (Math.sin(i * 0.8) * 80) + (Math.random() - 0.5) * 20,
      z: (Math.cos(i * 0.8) * 80) + (Math.random() - 0.5) * 20,
      targetHeight: 10 + Math.random() * 40,
      width: 6 + Math.random() * 10,
      depth: 6 + Math.random() * 10,
      color: ['#1E3A5F', '#0F172A', '#334155'][Math.floor(Math.random() * 3)],
      delay: Math.random() * 0.4,
      windowCount: Math.floor(5 + Math.random() * 15),
    })), [count]
  );

  return (
    <Canvas>
      <group>
        {buildings.map((b, i) => (
          <GrowingBuilding
            key={i}
            {...b}
            progress={progress}
            time={time}
          />
        ))}
      </group>
    </Canvas>
  );
};

const GrowingBuilding: React.FC<{
  x: number; z: number;
  targetHeight: number; width: number; depth: number;
  color: string; delay: number; windowCount: number;
  progress: number; time: number;
}> = ({ x, z, targetHeight, width, depth, color, delay, windowCount, progress, time }) => {
  const buildProgress = Math.max(0, Math.min(1, (progress - delay) * 2));
  const currentHeight = targetHeight * buildProgress;
  
  if (buildProgress <= 0) return null;

  // Easing
  const eased = 1 - Math.pow(1 - buildProgress, 3);
  const currentH = targetHeight * eased;

  return (
    <group position={[x, currentH / 2, z]}>
      {/* Main structure growing */}
      <mesh scale={[width, currentH, depth]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
      </mesh>
      
      {/* Roof appears at the end */}
      {buildProgress > 0.8 && (
        <mesh position={[0, currentH / 2 + 1, 0]} scale={[width * 1.1, 2, depth * 1.1]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
        </mesh>
      )}
      
      {/* Windows light up progressively */}
      {[...Array(windowCount)].map((_, i) => {
        const windowProgress = Math.max(0, Math.min(1, (buildProgress - 0.3) * 2));
        const lit = Math.random() > 0.5 && windowProgress > 0.5;
        return (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * width * 0.8,
              (Math.random() - 0.5) * currentH,
              depth / 2 + 0.1
            ]}
            scale={[1, 2, 0.1]}
          >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial 
              color={lit ? '#FDE047' : '#1E3A5F'} 
              transparent 
              opacity={lit ? 0.9 * windowProgress : 0.3 * windowProgress}
              side={2}
            />
          </mesh>
        );
      })}
      
      {/* Construction particles */}
      {buildProgress < 1 && (
        <ConstructionParticles height={currentH} width={width} depth={depth} time={time} />
      )}
    </group>
  );
};

const ConstructionParticles: React.FC<{ height: number; width: number; depth: number; time: number }> = ({ height, width, depth, time }) => {
  const particles = React.useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      x: (Math.random() - 0.5) * width,
      y: Math.random() * height,
      z: (Math.random() - 0.5) * depth,
      speed: 0.5 + Math.random() * 1,
      size: 0.1 + Math.random() * 0.3,
    })), []
  );

  return (
    <group>
      {particles.map((p, i) => (
        <mesh key={i} position={[
          p.x,
          p.y + Math.sin(time * 2 + i) * 0.5,
          p.z
        ]} scale={p.size}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#7DD3FC" transparent opacity={0.6} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};