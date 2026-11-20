import React from 'react';
import { Canvas } from '@remotion/three';
import * as THREE from 'three';

interface LogoNegaraProps {
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
}

// Custom StarGeometry
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

// Cloud Mountain Geometry
const CloudMountainGeometry = (props: any) => {
  const geometry = React.useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-4, -5);
    shape.lineTo(4, -5);
    shape.lineTo(4, -1);
    shape.bezierCurveTo(4, 1, 2, 3, 0, 4);
    shape.bezierCurveTo(-2, 3, -4, 1, -4, -1);
    shape.lineTo(-4, -5);
    return new THREE.ShapeGeometry(shape);
  }, []);
  
  return <primitive object={geometry} />;
};

export const LogoNegara: React.FC<LogoNegaraProps> = ({ position, scale, rotation }) => (
  <Canvas>
    <group position={position} scale={scale} rotation={rotation}>
      {/* Outer ring */}
      <mesh position={[0, 0, -1]} scale={[12, 12, 1]}>
        <ringGeometry args={[0.8, 1, 64]} />
        <meshBasicMaterial color="#1E3A5F" side={2} />
      </mesh>
      
      {/* 7 stars ring */}
      {[...Array(7)].map((_, i) => (
        <mesh key={i} position={[
          Math.cos(i * Math.PI * 2 / 7) * 9,
          Math.sin(i * Math.PI * 2 / 7) * 9,
          0
        ]} scale={1.5}>
          <StarGeometry args={[1, 0.4, 5]} />
          <meshBasicMaterial color="#FDE047" side={2} />
        </mesh>
      ))}
      
      {/* Center: cloud mountain silhouette */}
      <group position={[0, 0, 0.5]}>
        <mesh scale={[8, 10, 1]}>
          <CloudMountainGeometry />
          <meshBasicMaterial color="#FFFFFF" side={2} />
        </mesh>
      </group>
      
      {/* Country name below - simplified as rectangle */}
      <mesh position={[0, -14, 1]} scale={[12, 1.5, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#1E3A5F" transparent opacity={0.8} side={2} />
      </mesh>
      
      {/* Motto - simplified */}
      <mesh position={[0, -18, 1]} scale={[10, 1, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#7DD3FC" transparent opacity={0.8} side={2} />
      </mesh>
    </group>
  </Canvas>
);