import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { ScriptLine } from '@negara-awan/core';
import { PresidenAvatar } from '../components/PresidenAvatar';
import { Monument } from '../components/Monument';
import { Camera } from '../components/Camera';

interface PresidenEntranceSceneProps {
  startFrame: number;
  endFrame: number;
  line?: ScriptLine;
}

export const PresidenEntranceScene: React.FC<PresidenEntranceSceneProps> = ({ startFrame, endFrame, line }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  
  if (frame < startFrame || frame > endFrame) return null;

  const walkProgress = interpolate(progress, [0, 0.8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const xPos = interpolate(walkProgress, [0, 1], [-80, 0]);

  return (
    <Camera
      position={[
        interpolate(progress, [0, 1], [-60, -20]),
        interpolate(progress, [0, 1], [30, 25]),
        interpolate(progress, [0, 1], [100, 60])
      ]}
      target={[xPos, 15, 0]}
    >
      <Monument position={[0, 0, 0]} scale={1} />
      <PresidenAvatar
        position={[xPos, 0, 0]}
        animation="walk"
        walkProgress={walkProgress}
      />
      {/* Confetti partikel */}
      <ConfettiBurst trigger={progress > 0.7} time={frame / 30} />
    </Camera>
  );
};

const ConfettiBurst: React.FC<{ trigger: boolean; time: number }> = ({ trigger, time }) => {
  if (!trigger) return null;
  const particles = React.useMemo(() => 
    Array.from({ length: 100 }, (_, i) => ({
      x: (Math.random() - 0.5) * 20,
      y: Math.random() * 50 + 20,
      z: (Math.random() - 0.5) * 20,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -Math.random() * 0.3 - 0.1,
      vz: (Math.random() - 0.5) * 0.5,
      color: ['#1E3A5F', '#7DD3FC', '#FDE047', '#FFFFFF'][Math.floor(Math.random() * 4)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.2,
    })), []
  );

  return (
    <group>
      {particles.map((p, i) => (
        <mesh key={i} 
          position={[
            p.x + p.vx * time * 60,
            p.y + p.vy * time * 60 - time * time * 0.5,
            p.z + p.vz * time * 60
          ]}
          rotation={[0, p.rotation + p.rotSpeed * time * 60, 0]}
          scale={0.5}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color={p.color} transparent opacity={Math.max(0, 1 - time * 0.1)} side={2} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};