import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { ScriptLine } from '@negara-awan/core';
import { PresidenAvatar } from '../components/PresidenAvatar';
import { Monument } from '../components/Monument';
import { ConstitutionBook } from '../components/ConstitutionBook';
import { Camera } from '../components/Camera';

interface SumpahSceneProps {
  startFrame: number;
  endFrame: number;
  line?: ScriptLine;
}

export const SumpahScene: React.FC<SumpahSceneProps> = ({ startFrame, endFrame, line }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  
  if (frame < startFrame || frame > endFrame) return null;

  // Animasi tangan naik
  const rightArmProgress = interpolate(progress, [0.1, 0.4], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const leftArmProgress = interpolate(progress, [0.2, 0.5], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const glowIntensity = interpolate(progress, [0.3, 0.7], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <Camera
      position={[
        interpolate(progress, [0, 0.5, 1], [-30, -10, -40]),
        interpolate(progress, [0, 0.5, 1], [35, 40, 30]),
        interpolate(progress, [0, 0.5, 1], [50, 40, 70])
      ]}
      target={[0, 25, 0]}
    >
      <Monument position={[0, 0, 0]} scale={1} />
      <PresidenAvatar
        position={[0, 0, 0]}
        animation="oath"
        rightArmProgress={rightArmProgress}
        leftArmProgress={leftArmProgress}
        glowIntensity={glowIntensity}
      />
      <ConstitutionBook
        position={[0, 22, 10]}
        rotation={[-0.2, 0, 0]}
        openProgress={leftArmProgress}
        glow={glowIntensity}
      />
      {/* Partikel cahaya naik dari buku */}
      <LightParticles intensity={glowIntensity} time={frame / 30} />
    </Camera>
  );
};

const LightParticles: React.FC<{ intensity: number; time: number }> = ({ intensity, time }) => {
  if (intensity <= 0) return null;
  const particles = React.useMemo(() => 
    Array.from({ length: 80 }, (_, i) => ({
      angle: (i / 80) * Math.PI * 2,
      radius: 2 + Math.random() * 5,
      height: Math.random() * 40,
      speed: 0.5 + Math.random() * 1.5,
      size: 0.2 + Math.random() * 0.5,
      color: ['#FDE047', '#7DD3FC', '#FFFFFF'][Math.floor(Math.random() * 3)],
    })), []
  );

  return (
    <group>
      {particles.map((p, i) => (
        <mesh key={i} 
          position={[
            Math.cos(p.angle + time * p.speed * 0.5) * p.radius,
            (time * p.speed * 10 + p.height) % 50,
            Math.sin(p.angle + time * p.speed * 0.5) * p.radius
          ]}
          scale={p.size * intensity}
        >
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color={p.color} transparent opacity={0.8 * intensity} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};