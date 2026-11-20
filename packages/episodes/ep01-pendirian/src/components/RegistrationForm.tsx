import React from 'react';
import { Canvas } from '@remotion/three';

interface RegistrationFormProps {
  position: [number, number, number];
  scale: number;
  progress: number;
  time: number;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ position, scale, progress, time }) => (
  <Canvas>
    <group position={position} scale={scale}>
      {/* Form background */}
      <mesh position={[0, 0, 0]} scale={[40, 50, 1]}>
        <roundBoxGeometry args={[1, 1, 1, 2]} />
        <meshBasicMaterial color="#0F172A" transparent opacity={0.9 * progress} />
      </mesh>
      
      {/* Border glow */}
      <mesh position={[0, 0, -0.5]} scale={[41, 51, 1]}>
        <roundBoxGeometry args={[1, 1, 1, 2]} />
        <meshBasicMaterial color="#7DD3FC" transparent opacity={0.3 * progress} side={2} />
      </mesh>
      
      {/* Title */}
      <mesh position={[0, 20, 1]}>
        <textGeometry text="📋 PENDAFTARAN KABINET PERTAMA" fontSize={1.5} fontWeight="bold" />
        <meshBasicMaterial color="#FDE047" transparent opacity={progress} />
      </mesh>
      
      {/* Form fields */}
      <FormField position={[0, 10, 1]} label="NAMA" value="Tulis nama kamu..." progress={progress} time={time} />
      <FormField position={[0, 0, 1]} label="JABATAN YANG DIINGINKAN" value="Contoh: Menteri Gravitasi" progress={progress * 0.8} time={time} />
      <FormField position={[0, -10, 1]} label="ALASAN (1 KALIMAT)" value="Contoh: Supaya orang tidak jatuh ke bumi saat tidur" progress={progress * 0.6} time={time} />
      
      {/* Submit button */}
      <SubmitButton position={[0, -22, 1]} progress={progress * 0.4} time={time} />
      
      {/* Format hint */}
      <mesh position={[0, -30, 1]}>
        <textGeometry text="Format: NAMA | JABATAN | ALASAN" fontSize={1} fontWeight="normal" />
        <meshBasicMaterial color="#7DD3FC" transparent opacity={progress * 0.5} />
      </mesh>
      
      {/* Animated typing cursor */}
      <TypingCursor position={[-15, 10, 1.5]} active={progress > 0.5} time={time} />
    </group>
  </Canvas>
);

const FormField: React.FC<{ position: [number, number, number]; label: string; value: string; progress: number; time: number }> = ({ position, label, value, progress, time }) => (
  <group position={position} scale={progress}>
    <mesh position={[-18, 2, 0]}>
      <textGeometry text={label} fontSize={1} fontWeight="bold" />
      <meshBasicMaterial color="#FDE047" />
    </mesh>
    <mesh position={[0, -2, 0]} scale={[35, 4, 1]}>
      <roundBoxGeometry args={[1, 1, 1, 0.5]} />
      <meshBasicMaterial color="#1E3A5F" transparent opacity={0.8} />
    </mesh>
    <mesh position={[0, -2, 0.6]}>
      <textGeometry text={value} fontSize={1} fontWeight="normal" />
      <meshBasicMaterial color="#FFFFFF" transparent opacity={0.7} />
    </mesh>
  </group>
);

const SubmitButton: React.FC<{ position: [number, number, number]; progress: number; time: number }> = ({ position, progress, time }) => (
  <group position={position} scale={progress}>
    <mesh position={[0, 0, 0]} scale={[20, 5, 1]}>
      <roundBoxGeometry args={[1, 1, 1, 1]} />
      <meshBasicMaterial 
        color="#FDE047" 
        transparent 
        opacity={0.9 * (0.8 + Math.sin(time * 3) * 0.2)} 
      />
    </mesh>
    <mesh position={[0, 0, 0.6]}>
      <textGeometry text="KIRIM KOMENTAR" fontSize={1.5} fontWeight="bold" />
      <meshBasicMaterial color="#0F172A" />
    </mesh>
  </group>
);

const TypingCursor: React.FC<{ position: [number, number, number]; active: boolean; time: number }> = ({ position, active, time }) => {
  if (!active) return null;
  return (
    <mesh position={position} scale={0.5}>
      <planeGeometry args={[0.2, 2]} />
      <meshBasicMaterial 
        color="#FDE047" 
        transparent 
        opacity={0.5 + Math.sin(time * 4) * 0.5}
      />
    </mesh>
  );
};

const roundBoxGeometry = ({ args }: any) => ({ type: 'RoundBoxGeometry', args });
const textGeometry = ({ text, fontSize, fontWeight }: any) => ({ type: 'TextGeometry', text, fontSize, fontWeight });