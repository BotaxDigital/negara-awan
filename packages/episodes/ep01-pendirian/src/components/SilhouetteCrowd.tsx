import React from 'react';
import { Canvas } from '@remotion/three';

interface SilhouetteCrowdProps {
  count: number;
  progress: number;
  time: number;
}

export const SilhouetteCrowd: React.FC<SilhouetteCrowdProps> = ({ count, progress, time }) => {
  const crowd = React.useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      x: (Math.sin(i * 0.3) * 60) + (Math.random() - 0.5) * 10,
      z: (Math.cos(i * 0.3) * 60) + (Math.random() - 0.5) * 10,
      height: 3 + Math.random() * 2,
      width: 0.8 + Math.random() * 0.5,
      delay: Math.random() * 0.5,
      swayPhase: Math.random() * Math.PI * 2,
    })), [count]
  );

  const visibleCount = Math.floor(count * progress);

  return (
    <Canvas>
      <group>
        {crowd.slice(0, visibleCount).map((person, i) => (
          <SilhouettePerson
            key={i}
            position={[person.x, 0, person.z]}
            height={person.height}
            width={person.width}
            delay={person.delay}
            swayPhase={person.swayPhase}
            time={time}
            progress={progress}
          />
        ))}
      </group>
    </Canvas>
  );
};

const SilhouettePerson: React.FC<{
  position: [number, number, number];
  height: number;
  width: number;
  delay: number;
  swayPhase: number;
  time: number;
  progress: number;
}> = ({ position, height, width, delay, swayPhase, time, progress }) => {
  const appearProgress = Math.max(0, Math.min(1, (progress - delay) * 3));
  const sway = Math.sin(time * 0.5 + swayPhase) * 0.1 * appearProgress;
  
  if (appearProgress <= 0) return null;

  return (
    <group position={position} scale={appearProgress}>
      <group rotation={[0, 0, sway]}>
        {/* Body */}
        <mesh position={[0, height / 2, 0]} scale={[width, height, width * 0.5]}>
          <boxGeometry />
          <meshBasicMaterial color="#0F172A" />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, height + 0.5, 0]} scale={width * 0.8}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#0F172A" />
        </mesh>
        
        {/* Arms raised */}
        <mesh position={[-width * 1.2, height * 0.7, 0]} rotation={[0, 0, -Math.PI / 4]} scale={[width * 0.3, height * 0.8, width * 0.3]}>
          <cylinderGeometry args={[1, 0.5, 1, 8]} />
          <meshBasicMaterial color="#0F172A" />
        </mesh>
        <mesh position={[width * 1.2, height * 0.7, 0]} rotation={[0, 0, Math.PI / 4]} scale={[width * 0.3, height * 0.8, width * 0.3]}>
          <cylinderGeometry args={[1, 0.5, 1, 8]} />
          <meshBasicMaterial color="#0F172A" />
        </mesh>
      </group>
    </group>
  );
};