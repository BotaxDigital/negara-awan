import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { ScriptLine } from '@negara-awan/core';
import { Camera } from '../components/Camera';
import { SilhouetteCrowd } from '../components/SilhouetteCrowd';
import { BuildingGrowth } from '../components/BuildingGrowth';

interface TeaserSceneProps {
  startFrame: number;
  endFrame: number;
  line?: ScriptLine;
}

export const TeaserScene: React.FC<TeaserSceneProps> = ({ startFrame, endFrame, line }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  
  if (frame < startFrame || frame > endFrame) return null;

  return (
    <Camera
      position={[
        interpolate(progress, [0, 1], [-80, 80]),
        60,
        interpolate(progress, [0, 1], [100, -50])
      ]}
      target={[0, 30, 0]}
    >
      <group>
        <SilhouetteCrowd count={50} progress={progress} time={frame / 30} />
        <BuildingGrowth count={10} progress={progress} time={frame / 30} />
        {/* Tanda tanya di atas Gubernur Awan Timur */}
        <QuestionMark
          position={[40, 50, -20]}
          scale={interpolate(progress, [0.6, 1], [0, 3])}
          bounce={progress > 0.6}
          time={frame / 30}
        />
      </group>
    </Camera>
  );
};

const QuestionMark: React.FC<{ position: [number, number, number]; scale: number; bounce: boolean; time: number }> = ({ position, scale, bounce, time }) => (
  <group position={position} scale={scale}>
    <mesh
      position={[0, bounce ? Math.sin(time * 4) * 2 : 0, 0]}
      rotation={[0, time * 0.5, 0]}
    >
      <torusGeometry args={[1, 0.3, 8, 16, Math.PI]} />
      <meshBasicMaterial color="#FDE047" />
    </mesh>
    <mesh position={[0, -3, 0]}>
      <sphereGeometry args={[0.4, 8, 8]} />
      <meshBasicMaterial color="#FDE047" />
    </mesh>
  </group>
);