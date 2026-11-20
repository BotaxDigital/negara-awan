import React from 'react';
import { Canvas } from '@remotion/three';
import * as THREE from 'three';

interface FlagProps {
  position: [number, number, number];
  scale: number;
  rotation: number;
}

// Custom StarGeometry for React Three Fiber
const StarGeometry = (props: any) => {
  const geometry = React.useMemo(() => {
    const shape = new THREE.Shape();
    const outerRadius = props.args?.[0] || 1;
    const innerRadius = props.args?.[1] || 0.4;
    const points = props.args?.[2] || 5;
    
    for (let i = 0; i < points * 2; i++) {
      const angle = (i / (points * 2)) * Math.PI * 2;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, [props.args]);
  
  return <primitive object={geometry} />;
};

export const Flag: React.FC<FlagProps> = ({ position, scale, rotation }) => (
  <Canvas>
    <group position={position} scale={scale} rotation={[0, rotation, 0]}>
      {/* Flag pole */}
      <mesh position={[0, 30, 0]} scale={[0.3, 60, 0.3]}>
        <cylinderGeometry args={[1, 1, 1, 8]} />
        <meshStandardMaterial color="#7DD3FC" roughness={0.3} metalness={0.5} />
      </mesh>
      
      {/* Flag cloth - three stripes */}
      <group position={[4, 55, 0]} rotation={[0, 0, -Math.PI / 2]}>
        {/* Top stripe - biru langit */}
        <mesh position={[0, 10, 0]} scale={[20, 6.67, 1]}>
          <planeGeometry args={[1, 1, 10, 10]} />
          <meshBasicMaterial color="#1E3A5F" side={2} />
        </mesh>
        {/* Middle stripe - putih awan */}
        <mesh position={[0, 0, 0]} scale={[20, 6.67, 1]}>
          <planeGeometry args={[1, 1, 10, 10]} />
          <meshBasicMaterial color="#FFFFFF" side={2} />
        </mesh>
        {/* Bottom stripe - kuning matahari */}
        <mesh position={[0, -10, 0]} scale={[20, 6.67, 1]}>
          <planeGeometry args={[1, 1, 10, 10]} />
          <meshBasicMaterial color="#FDE047" side={2} />
        </mesh>
        
        {/* Center circle with 7 stars */}
        <group position={[0, 0, 0.5]}>
          <mesh scale={[8, 8, 1]}>
            <circleGeometry args={[1, 32]} />
            <meshBasicMaterial color="#0F172A" side={2} />
          </mesh>
          {[...Array(7)].map((_, i) => (
            <mesh key={i} position={[
              Math.cos(i * Math.PI * 2 / 7) * 4.5,
              Math.sin(i * Math.PI * 2 / 7) * 4.5,
              0.6
            ]} scale={0.8}>
              <StarGeometry args={[1, 0.4, 5]} />
              <meshBasicMaterial color="#FFFFFF" side={2} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  </Canvas>
);