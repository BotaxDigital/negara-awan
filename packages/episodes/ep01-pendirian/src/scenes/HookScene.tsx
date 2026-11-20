import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { ScriptLine } from '@negara-awan/core';
import { CloudCity } from '../components/CloudCity';
import { Flag } from '../components/Flag';
import { Camera } from '../components/Camera';

interface HookSceneProps {
  startFrame: number;
  endFrame: number;
  line?: ScriptLine;
}

export const HookScene: React.FC<HookSceneProps> = ({ startFrame, endFrame, line }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  
  if (frame < startFrame || frame > endFrame) return null;

  return (
    <Camera
      position={[
        interpolate(progress, [0, 0.3, 1], [0, 50, 0]),
        interpolate(progress, [0, 0.3, 1], [200, 100, 50]),
        interpolate(progress, [0, 0.3, 1], [300, 150, 80])
      ]}
      target={[0, 50, 0]}
    >
      <CloudCity 
        time={frame / 30} 
        buildingCount={interpolate(progress, [0, 0.5, 1], [0, 15, 30])}
        cloudDensity={interpolate(progress, [0, 1], [0.3, 1])}
      />
      <Flag
        position={[0, 120, 0]}
        scale={interpolate(progress, [0.4, 0.8], [0, 1])}
        rotation={interpolate(progress, [0.4, 1], [Math.PI, 0])}
      />
      {/* Partikel awan naik */}
      <CloudParticles count={200} time={frame / 30} intensity={progress} />
    </Camera>
  );
};

// Simple cloud particle system
const CloudParticles: React.FC<{ count: number; time: number; intensity: number }> = ({ count, time, intensity }) => {
  const particles = React.useMemo(() => 
    Array.from({ length: count }, (_, i) => ({
      x: (Math.sin(i * 13.7) * 200) + Math.sin(time * 0.5 + i) * 20,
      y: (Math.cos(i * 7.3) * 150) + (time * 10 + i * 2) % 300 - 150,
      z: (Math.sin(i * 19.1) * 100) + Math.cos(time * 0.3 + i) * 15,
      size: 0.5 + Math.random() * 1.5,
      opacity: 0.1 + Math.random() * 0.3,
    })), [count]
  );

  return (
    <group>
      {particles.map((p, i) => (
        <mesh key={i} position={[p.x, p.y + time * 20, p.z]} scale={p.size * intensity}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={p.opacity * intensity}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};