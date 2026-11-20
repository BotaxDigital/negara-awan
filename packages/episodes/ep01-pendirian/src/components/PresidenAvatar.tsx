import React from 'react';
import { Canvas } from '@remotion/three';

interface PresidenAvatarProps {
  position: [number, number, number];
  animation: 'idle' | 'walk' | 'oath';
  walkProgress?: number;
  rightArmProgress?: number;
  leftArmProgress?: number;
  glowIntensity?: number;
}

export const PresidenAvatar: React.FC<PresidenAvatarProps> = ({
  position,
  animation,
  walkProgress = 0,
  rightArmProgress = 0,
  leftArmProgress = 0,
  glowIntensity = 0,
}) => (
  <Canvas>
    <group position={position}>
      {/* Shadow */}
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[3, 1.5, 0.1]}>
        <circleGeometry args={[1, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.2} depthWrite={false} />
      </mesh>
      
      {/* Body */}
      <AvatarBody
        animation={animation}
        walkProgress={walkProgress}
        rightArmProgress={rightArmProgress}
        leftArmProgress={leftArmProgress}
        glowIntensity={glowIntensity}
      />
    </group>
  </Canvas>
);

const AvatarBody: React.FC<{
  animation: string;
  walkProgress: number;
  rightArmProgress: number;
  leftArmProgress: number;
  glowIntensity: number;
}> = ({ animation, walkProgress, rightArmProgress, leftArmProgress, glowIntensity }) => {
  // Walk cycle
  const legSwing = Math.sin(walkProgress * Math.PI * 4) * 0.8;
  const armSwing = Math.sin(walkProgress * Math.PI * 4 + Math.PI) * 0.5;
  const bodyBob = Math.abs(Math.sin(walkProgress * Math.PI * 4)) * 0.5;

  return (
    <group>
      {/* Legs */}
      <group position={[-1, -1.5 + bodyBob, 0]}>
        <mesh position={[0, -5, 0]} scale={[1, 10, 1]}>
          <cylinderGeometry args={[1, 0.8, 1, 8]} />
          <meshStandardMaterial color="#1E3A5F" roughness={0.6} metalness={0.1} />
        </mesh>
        <mesh position={[0, -11, 0]} scale={[1.2, 2, 1.2]}>
          <boxGeometry />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
      </group>
      <group position={[1, -1.5 - bodyBob, 0]}>
        <mesh position={[0, -5, 0]} scale={[1, 10, 1]}>
          <cylinderGeometry args={[1, 0.8, 1, 8]} />
          <meshStandardMaterial color="#1E3A5F" roughness={0.6} metalness={0.1} />
        </mesh>
        <mesh position={[0, -11, 0]} scale={[1.2, 2, 1.2]}>
          <boxGeometry />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
      </group>
      
      {/* Torso */}
      <mesh position={[0, 5 + bodyBob, 0]} scale={[4, 10, 2.5]}>
        <boxGeometry />
        <meshStandardMaterial color="#1E3A5F" roughness={0.6} metalness={0.1} />
      </mesh>
      
      {/* Presidential sash */}
      <mesh position={[0, 5 + bodyBob, 1.5]} scale={[4.2, 10.2, 0.1]}>
        <planeGeometry />
        <meshBasicMaterial color="#FDE047" transparent opacity={0.8} side={2} />
      </mesh>
      
      {/* Arms */}
      <group position={[-3.5, 8 + bodyBob, 0]} rotation={[0, 0, rightArmProgress * Math.PI / 2 + (animation === 'walk' ? armSwing : 0)]}>
        <mesh position={[0, -4, 0]} scale={[1, 8, 1]}>
          <cylinderGeometry args={[1, 0.8, 1, 8]} />
          <meshStandardMaterial color="#FDBA74" roughness={0.8} metalness={0} />
        </mesh>
        <mesh position={[0, -9, 0]} scale={[1.2, 2, 1.2]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#FDBA74" roughness={0.8} metalness={0} />
        </mesh>
      </group>
      <group position={[3.5, 8 + bodyBob, 0]} rotation={[0, 0, -leftArmProgress * Math.PI / 2 + (animation === 'walk' ? -armSwing : 0)]}>
        <mesh position={[0, -4, 0]} scale={[1, 8, 1]}>
          <cylinderGeometry args={[1, 0.8, 1, 8]} />
          <meshStandardMaterial color="#FDBA74" roughness={0.8} metalness={0} />
        </mesh>
        <mesh position={[0, -9, 0]} scale={[1.2, 2, 1.2]}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshStandardMaterial color="#FDBA74" roughness={0.8} metalness={0} />
        </mesh>
      </group>
      
      {/* Head */}
      <group position={[0, 13 + bodyBob, 0]}>
        <mesh scale={[2.5, 3, 2.5]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#FDBA74" roughness={0.8} metalness={0} />
        </mesh>
        
        {/* Eyes */}
        <mesh position={[-0.7, 0.3, 1.5]} scale={0.3}>
          <sphereGeometry />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
        <mesh position={[0.7, 0.3, 1.5]} scale={0.3}>
          <sphereGeometry />
          <meshStandardMaterial color="#0F172A" />
        </mesh>
        
        {/* Presidential badge on chest */}
        <mesh position={[0, -3, 1.8]} scale={1.5}>
          <starGeometry args={[1, 0.4, 5]} />
          <meshBasicMaterial color="#FDE047" />
        </mesh>
      </group>
      
      {/* Glow effect when oath */}
      {glowIntensity > 0 && (
        <group>
          <mesh position={[0, 5, 0]} scale={[6 + glowIntensity * 4, 16 + glowIntensity * 4, 4 + glowIntensity * 4]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshBasicMaterial 
              color="#FDE047" 
              transparent 
              opacity={0.1 * glowIntensity}
              depthWrite={false}
            />
          </mesh>
          <mesh position={[0, 13, 0]} scale={[3 + glowIntensity * 5, 3 + glowIntensity * 5, 3 + glowIntensity * 5]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshBasicMaterial 
              color="#FDE047" 
              transparent 
              opacity={0.15 * glowIntensity}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}
    </group>
  );
};

const circleGeometry = ({ args }: any) => ({ type: 'CircleGeometry', args });
const starGeometry = ({ args }: any) => ({ type: 'StarGeometry', args });