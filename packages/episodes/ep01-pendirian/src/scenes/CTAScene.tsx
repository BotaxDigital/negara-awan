import React from 'react';
import { useCurrentFrame, interpolate } from 'remotion';
import { ScriptLine } from '@negara-awan/core';
import { Camera } from '../components/Camera';
import { LogoNegara } from '../components/LogoNegara';

interface CTASceneProps {
  startFrame: number;
  endFrame: number;
  line?: ScriptLine;
}

export const CTAScene: React.FC<CTASceneProps> = ({ startFrame, endFrame, line }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [startFrame, endFrame], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  
  if (frame < startFrame || frame > endFrame) return null;

  const logoScale = interpolate(progress, [0, 0.3, 1], [0, 1.2, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const textOpacity = interpolate(progress, [0.4, 0.7], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const handleOpacity = interpolate(progress, [0.6, 0.9], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const buttonPulse = progress > 0.8 ? (1 + Math.sin(frame * 0.3) * 0.1) : 1;

  return (
    <Camera position={[0, 0, 100]} target={[0, 0, 0]}>
      <group>
        {/* Background gradient */}
        <BackgroundGradient />
        
        {/* Logo negara */}
        <LogoNegara
          position={[0, 15, 0]}
          scale={logoScale}
          rotation={[0, progress * Math.PI * 0.5, 0]}
        />
        
        {/* Tagline */}
        <TaglineText
          position={[0, -15, 0]}
          opacity={textOpacity}
          scale={textOpacity}
        >
          NEGARA DIATAS AWAN — Merdeka dari Gravitasi
        </TaglineText>
        
        {/* Social handles */}
        <SocialHandles
          position={[0, -35, 0]}
          opacity={handleOpacity}
        />
        
        {/* Comment button */}
        <CommentButton
          position={[0, -55, 0]}
          scale={buttonPulse * handleOpacity}
          opacity={handleOpacity}
        />
      </group>
    </Camera>
  );
};

const BackgroundGradient: React.FC = () => (
  <mesh position={[0, 0, -1]} scale={[200, 120, 1]}>
    <planeGeometry />
    <meshBasicMaterial
      transparent
      opacity={1}
      depthWrite={false}
      // Gradient via vertex colors
      vertexColors={true}
    />
  </mesh>
);

const TaglineText: React.FC<{ position: [number, number, number]; opacity: number; scale: number; children: string }> = ({ position, opacity, scale, children }) => (
  <group position={position} scale={scale}>
    <mesh position={[0, 0, 1]} scale={[children.length * 0.3, 2, 1]}>
      <planeGeometry />
      <meshBasicMaterial color="#0F172A" opacity={0.8 * opacity} transparent />
    </mesh>
    <mesh position={[0, 0, 1.1]}>
      <textGeometry text={children} fontSize={1.5} fontWeight="normal" />
      <meshBasicMaterial color="#1E3A5F" opacity={opacity} transparent />
    </mesh>
  </group>
);

const SocialHandles: React.FC<{ position: [number, number, number]; opacity: number }> = ({ position, opacity }) => (
  <group position={position} scale={0.8}>
    {['YouTube', 'Instagram', 'Facebook', 'TikTok'].map((platform, i) => (
      <group key={platform} position={[0, -i * 5, 0]}>
        <mesh position={[-15, 0, 1]}>
          <textGeometry text={`@negaradiatasawan (${platform})`} fontSize={1.2} fontWeight="normal" />
          <meshBasicMaterial color="#7DD3FC" opacity={opacity} transparent />
        </mesh>
      </group>
    ))}
  </group>
);

const CommentButton: React.FC<{ position: [number, number, number]; scale: number; opacity: number }> = ({ position, scale, opacity }) => (
  <group position={position} scale={scale}>
    <mesh position={[0, 0, 0]} scale={[20, 6, 1]}>
      <roundBoxGeometry args={[1, 1, 1, 0.5]} />
      <meshBasicMaterial color="#FDE047" opacity={opacity} transparent />
    </mesh>
    <mesh position={[0, 0, 0.6]}>
      <textGeometry text="KOMENTAR SEKARANG" fontSize={1.5} fontWeight="bold" />
      <meshBasicMaterial color="#0F172A" opacity={opacity} transparent />
    </mesh>
  </group>
);

// Mock roundBoxGeometry
const roundBoxGeometry = ({ args }: any) => ({ type: 'RoundBoxGeometry', args });