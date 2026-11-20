import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { ScriptLine } from '@negara-awan/core';
import { LoreHologram } from '../components/LoreHologram';
import { Camera } from '../components/Camera';

interface LoreIntroSceneProps {
  startFrame: number;
  endFrame: number;
  line?: ScriptLine;
  lore: any;
}

export const LoreIntroScene: React.FC<LoreIntroSceneProps> = ({ startFrame, endFrame, line, lore }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  
  if (frame < startFrame || frame > endFrame) return null;

  return (
    <Camera
      position={[0, 80, 120]}
      target={[0, 50, 0]}
    >
      <group>
        {/* Background: kota awan statis */}
        <CloudCitySilhouette />
        
        {/* Hologram UI di tengah */}
        <LoreHologram
          progress={progress}
          negara={lore?.namaNegara || 'NEGARA DIATAS AWAN'}
          motto={lore?.motto || 'Merdeka dari Gravitasi'}
          ibukota={lore?.ibukota || 'Stratos'}
          mataUang={lore?.mataUang || 'Nimbus'}
          konstitusi={lore?.konstitusi || []}
          bendera={lore?.bendera}
          lambang={lore?.lambang}
        />
      </group>
    </Camera>
  );
};

const CloudCitySilhouette: React.FC = () => (
  <group>
    {[...Array(20)].map((_, i) => (
      <mesh key={i} position={[
        Math.sin(i * 0.8) * 150,
        Math.cos(i * 0.5) * 30 + 20,
        Math.cos(i * 0.8) * 150
      ]} scale={[2 + Math.sin(i) * 1.5, 10 + Math.cos(i) * 8, 2 + Math.sin(i) * 1.5]}>
        <cylinderGeometry args={[1, 0.5, 1, 6]} />
        <meshBasicMaterial color="#1E3A5F" opacity={0.3} transparent depthWrite={false} />
      </mesh>
    ))}
  </group>
);