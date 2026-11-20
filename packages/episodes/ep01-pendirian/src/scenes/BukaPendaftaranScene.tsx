import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { ScriptLine } from '@negara-awan/core';
import { Camera } from '../components/Camera';
import { RegistrationForm } from '../components/RegistrationForm';
import { CommentStream } from '../components/CommentStream';

interface BukaPendaftaranSceneProps {
  startFrame: number;
  endFrame: number;
  line?: ScriptLine;
}

export const BukaPendaftaranScene: React.FC<BukaPendaftaranSceneProps> = ({ startFrame, endFrame, line }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  
  if (frame < startFrame || frame > endFrame) return null;

  return (
    <Camera
      position={[0, 50, 150]}
      target={[0, 30, 0]}
    >
      <group>
        {/* Background: gedung parlement */}
        <ParliamentBuilding />
        
        {/* Split screen: Form kiri, komentar kanan */}
        <RegistrationForm
          position={[-60, 20, 30]}
          scale={1.2}
          progress={progress}
          time={frame / 30}
        />
        <CommentStream
          position={[60, 20, 30]}
          scale={1.2}
          progress={progress}
          time={frame / 30}
        />
        
        {/* Timer 7 hari di atas */}
        <CountdownTimer
          position={[0, 80, 40]}
          daysRemaining={7 - progress * 7}
          scale={1.5}
        />
      </group>
    </Camera>
  );
};

const ParliamentBuilding: React.FC = () => (
  <group>
    {/* Base */}
    <mesh position={[0, 5, 0]} scale={[40, 10, 30]}>
      <boxGeometry />
      <meshStandardMaterial color="#1E3A5F" roughness={0.7} metalness={0.1} />
    </mesh>
    {/* Columns */}
    {[...Array(8)].map((_, i) => (
      <mesh key={i} position={[-30 + i * 8.5, 20, -12]} scale={[2, 30, 2]}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshStandardMaterial color="#7DD3FC" roughness={0.5} metalness={0.2} />
      </mesh>
    ))}
    {[...Array(8)].map((_, i) => (
      <mesh key={i + 8} position={[-30 + i * 8.5, 20, 12]} scale={[2, 30, 2]}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshStandardMaterial color="#7DD3FC" roughness={0.5} metalness={0.2} />
      </mesh>
    ))}
    {/* Dome */}
    <mesh position={[0, 40, 0]} scale={[25, 15, 25]} rotation={[-Math.PI / 2, 0, 0]}>
      <sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#1E3A5F" roughness={0.3} metalness={0.3} />
    </mesh>
  </group>
);

const CountdownTimer: React.FC<{ position: [number, number, number]; daysRemaining: number; scale: number }> = ({ position, daysRemaining, scale }) => (
  <group position={position} scale={scale}>
    <mesh position={[0, 0, 0]} scale={[15, 4, 1]}>
      <boxGeometry />
      <meshBasicMaterial color="#0F172A" opacity={0.9} transparent />
    </mesh>
    <mesh position={[0, 0, 0.6]}>
      <textGeometry
        text={`⏰ ${Math.ceil(daysRemaining)} HARI LAGI`}
        fontSize={2}
        fontWeight="bold"
      />
      <meshBasicMaterial color="#FDE047" />
    </mesh>
  </group>
);

// Mock textGeometry - nanti diganti dengan three-mesh-ui atau troika-three-text
const textGeometry = ({ text, fontSize, fontWeight }: any) => ({
  type: 'TextGeometry',
  text, fontSize, fontWeight
});