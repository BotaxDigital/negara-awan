import React from 'react';
import { Canvas } from '@remotion/three';

interface LoreHologramProps {
  progress: number;
  negara: string;
  motto: string;
  ibukota: string;
  mataUang: string;
  konstitusi: Array<{ pasal: number; judul: string; isi: string }>;
  bendera: any;
  lambang: any;
}

export const LoreHologram: React.FC<LoreHologramProps> = ({
  progress,
  negara,
  motto,
  ibukota,
  mataUang,
  konstitusi,
  bendera,
  lambang,
}) => {
  const segments = [
    { id: 'negara', label: 'NAMA NEGARA', value: negara, delay: 0.0 },
    { id: 'motto', label: 'MOTTO', value: motto, delay: 0.1 },
    { id: 'ibukota', label: 'IBUKOTA', value: ibukota, delay: 0.2 },
    { id: 'mataUang', label: 'MATA UANG', value: mataUang, delay: 0.3 },
  ];

  return (
    <Canvas>
      <group position={[0, 30, 0]} scale={progress}>
        {/* Background panel */}
        <mesh position={[0, 0, -5]} scale={[80, 50, 1]}>
          <roundBoxGeometry args={[1, 1, 1, 2]} />
          <meshBasicMaterial 
            color="#0F172A" 
            transparent 
            opacity={0.8}
            side={2}
          />
        </mesh>
        
        {/* Grid lines */}
        <GridLines scale={[80, 50]} opacity={0.3} />
        
        {/* Data cards */}
        <group position={[-35, 15, 0]}>
          {segments.map((seg, i) => (
            <DataCard
              key={seg.id}
              position={[0, -i * 10, 0]}
              label={seg.label}
              value={seg.value}
              progress={Math.max(0, (progress - seg.delay) * 2)}
            />
          ))}
        </group>
        
        {/* Konstitusi scroll */}
        <ConstitutionScroll
          position={[35, 0, 0]}
          konstitusi={konstitusi}
          progress={Math.max(0, (progress - 0.4) * 2)}
        />
        
        {/* Bendera & Lambang */}
        <EmblemDisplay
          position={[0, -30, 0]}
          bendera={bendera}
          lambang={lambang}
          progress={Math.max(0, (progress - 0.6) * 2)}
        />
      </group>
    </Canvas>
  );
};

const DataCard: React.FC<{ position: [number, number, number]; label: string; value: string; progress: number }> = ({ position, label, value, progress }) => (
  <group position={position} scale={Math.min(1, Math.max(0, progress))}>
    <mesh position={[0, 2, 0.5]} scale={[30, 3, 1]}>
      <roundBoxGeometry args={[1, 1, 1, 0.5]} />
      <meshBasicMaterial color="#1E3A5F" transparent opacity={0.6} />
    </mesh>
    <mesh position={[0, 2, 1]}>
      <textGeometry text={label} fontSize={0.8} fontWeight="normal" />
      <meshBasicMaterial color="#7DD3FC" />
    </mesh>
    <mesh position={[0, -1, 1]}>
      <textGeometry text={value} fontSize={1.5} fontWeight="bold" />
      <meshBasicMaterial color="#FDE047" />
    </mesh>
  </group>
);

const ConstitutionScroll: React.FC<{ position: [number, number, number]; konstitusi: any[]; progress: number }> = ({ position, konstitusi, progress }) => (
  <group position={position} scale={progress}>
    <mesh position={[0, 0, 0]} scale={[30, 40, 1]}>
      <roundBoxGeometry args={[1, 1, 1, 1]} />
      <meshBasicMaterial color="#0F172A" transparent opacity={0.7} />
    </mesh>
    {konstitusi.map((k, i) => (
      <group key={k.pasal} position={[0, 15 - i * 12, 1]}>
        <mesh position={[-12, 3, 0]}>
          <textGeometry text={`PASAL ${k.pasal}`} fontSize={1} fontWeight="bold" />
          <meshBasicMaterial color="#FDE047" />
        </mesh>
        <mesh position={[-12, 0, 0]}>
          <textGeometry text={k.judul} fontSize={1.2} fontWeight="bold" />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        <mesh position={[-12, -3, 0]} scale={[25, 1, 1]}>
          <textGeometry text={k.isi} fontSize={0.9} fontWeight="normal" />
          <meshBasicMaterial color="#7DD3FC" />
        </mesh>
      </group>
    ))}
  </group>
);

const EmblemDisplay: React.FC<{ position: [number, number, number]; bendera: any; lambang: any; progress: number }> = ({ position, bendera, lambang, progress }) => (
  <group position={position} scale={progress}>
    <mesh position={[-20, 0, 0]} scale={[15, 10, 1]}>
      <planeGeometry />
      <meshBasicMaterial color="#1E3A5F" transparent opacity={0.5} />
    </mesh>
    <mesh position={[20, 0, 0]} scale={[15, 15, 1]}>
      <planeGeometry />
      <meshBasicMaterial color="#1E3A5F" transparent opacity={0.5} />
    </mesh>
  </group>
);

const GridLines: React.FC<{ scale: [number, number]; opacity: number }> = ({ scale, opacity }) => (
  <group>
    {[...Array(20)].map((_, i) => (
      <mesh key={i} position={[-scale[0]/2 + i * scale[0]/19, 0, 0]} scale={[0.05, scale[1], 0.05]}>
        <boxGeometry />
        <meshBasicMaterial color="#7DD3FC" transparent opacity={opacity} />
      </mesh>
    ))}
    {[...Array(14)].map((_, i) => (
      <mesh key={i} position={[0, -scale[1]/2 + i * scale[1]/13, 0]} scale={[scale[0], 0.05, 0.05]}>
        <boxGeometry />
        <meshBasicMaterial color="#7DD3FC" transparent opacity={opacity} />
      </mesh>
    ))}
  </group>
);

const roundBoxGeometry = ({ args }: any) => ({ type: 'RoundBoxGeometry', args });
const textGeometry = ({ text, fontSize, fontWeight }: any) => ({ type: 'TextGeometry', text, fontSize, fontWeight });