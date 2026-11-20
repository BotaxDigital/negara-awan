import React from 'react';
import { Canvas } from '@remotion/three';

interface ConstitutionBookProps {
  position: [number, number, number];
  rotation: [number, number, number];
  openProgress: number;
  glow: number;
}

export const ConstitutionBook: React.FC<ConstitutionBookProps> = ({
  position,
  rotation,
  openProgress,
  glow,
}) => (
  <Canvas>
    <group position={position} rotation={rotation}>
      {/* Book base */}
      <mesh position={[0, 0, 0]} scale={[8, 10, 1]}>
        <roundBoxGeometry args={[1, 1, 1, 0.3]} />
        <meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.2} />
      </mesh>
      
      {/* Cover */}
      <mesh position={[0, 0, 0.6]} scale={[8.2, 10.2, 0.2]}>
        <roundBoxGeometry args={[1, 1, 1, 0.3]} />
        <meshStandardMaterial color="#1E3A5F" roughness={0.4} metalness={0.3} />
      </mesh>
      
      {/* Gold trim */}
      <mesh position={[0, 0, 0.8]} scale={[8.4, 10.4, 0.1]}>
        <roundBoxGeometry args={[1, 1, 1, 0.3]} />
        <meshBasicMaterial color="#FDE047" transparent opacity={0.8} side={2} />
      </mesh>
      
      {/* Pages - left */}
      <group rotation={[0, 0, -openProgress * Math.PI / 2]}>
        <mesh position={[-4.1, 0, 0]} scale={[0.1, 9.5, 8]}>
          <boxGeometry />
          <meshStandardMaterial color="#F0F9FF" roughness={0.9} metalness={0} />
        </mesh>
        {/* Text lines on pages */}
        {[...Array(10)].map((_, i) => (
          <mesh key={i} position={[-4.2, 3.5 - i * 0.7, 0]} scale={[0.1, 0.3, 6]}>
            <boxGeometry />
            <meshBasicMaterial color="#1E3A5F" transparent opacity={0.6} />
          </mesh>
        ))}
      </group>
      
      {/* Pages - right */}
      <group position={[0, 0, 0]} rotation={[0, 0, openProgress * Math.PI / 2]}>
        <mesh position={[4.1, 0, 0]} scale={[0.1, 9.5, 8]}>
          <boxGeometry />
          <meshStandardMaterial color="#F0F9FF" roughness={0.9} metalness={0} />
        </mesh>
        {[...Array(10)].map((_, i) => (
          <mesh key={i} position={[4.2, 3.5 - i * 0.7, 0]} scale={[0.1, 0.3, 6]}>
            <boxGeometry />
            <meshBasicMaterial color="#1E3A5F" transparent opacity={0.6} />
          </mesh>
        ))}
      </group>
      
      {/* Holographic text floating above when open */}
      {openProgress > 0.5 && (
        <group position={[0, 8, 2]} scale={openProgress}>
          <HolographicText lines={[
            "PASAL 1: HAK TERBANG",
            "PASAL 2: MUSYAWARAH DIGITAL",
            "PASAL 3: AWAN MILIK ANGIN",
          ]} glow={glow} />
        </group>
      )}
      
      {/* Glow particles */}
      {glow > 0 && <BookGlow glow={glow} />}
    </group>
  </Canvas>
);

const HolographicText: React.FC<{ lines: string[]; glow: number }> = ({ lines, glow }) => (
  <group>
    {lines.map((line, i) => (
      <mesh key={i} position={[0, -i * 2, 0]} scale={[1, 1, 1]}>
        <planeGeometry args={[20, 1.5]} />
        <meshBasicMaterial 
          color="#7DD3FC" 
          transparent 
          opacity={0.7 * glow}
          depthWrite={false}
          side={2}
        />
      </mesh>
    ))}
  </group>
);

const BookGlow: React.FC<{ glow: number }> = ({ glow }) => {
  const particles = React.useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      x: (Math.random() - 0.5) * 15,
      y: (Math.random() - 0.5) * 15,
      z: (Math.random() - 0.5) * 5 + 2,
      speed: 0.5 + Math.random() * 1,
      size: 0.1 + Math.random() * 0.3,
    })), []
  );

  return (
    <group>
      {particles.map((p, i) => (
        <mesh key={i} position={[
          p.x,
          p.y + Math.sin(Date.now() * 0.001 * p.speed) * 2,
          p.z
        ]} scale={p.size * glow}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshBasicMaterial color="#FDE047" transparent opacity={0.8 * glow} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};

const roundBoxGeometry = ({ args }: any) => ({ type: 'RoundBoxGeometry', args });