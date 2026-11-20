import React from 'react';
import { Canvas } from '@remotion/three';

interface CommentStreamProps {
  position: [number, number, number];
  scale: number;
  progress: number;
  time: number;
}

export const CommentStream: React.FC<CommentStreamProps> = ({ position, scale, progress, time }) => {
  // Mock comments data
  const comments = React.useMemo(() => [
    { nama: 'Budi', jabatan: 'Menteri Gravitasi', alasan: 'Supaya orang tidak jatuh ke bumi saat tidur', likes: 245 },
    { nama: 'Siti', jabatan: 'Gubernur Awan Barat', alasan: 'Awan barat butuh pengelola yang ngerti angin', likes: 189 },
    { nama: 'Ahmad', jabatan: 'Menteri Cuaca', alasan: 'Biar hujan hanya di weekend', likes: 312 },
    { nama: 'Dewi', jabatan: 'Kepala Biro Mimpi', alasan: 'Mimpi warga harus tercatat dan dilindungi', likes: 156 },
    { nama: 'Raka', jabatan: 'Menteri Bandwidth', alasan: 'Internet gratis untuk semua warga awan', likes: 423 },
    { nama: 'Maya', jabatan: 'Gubernur Stratos Selatan', alasan: 'Selatan butuh lebih banyak matahari', likes: 98 },
    { nama: 'Joko', jabatan: 'Menteri Humor', alasan: 'Negara tanpa lucu itu kering', likes: 267 },
    { nama: 'Lina', jabatan: 'Kepala Arsip Awan', alasan: 'Setiap awan punya cerita, jangan dihapus', likes: 134 },
  ], []);

  return (
    <Canvas>
      <group position={position} scale={scale}>
        {/* Panel background */}
        <mesh position={[0, 0, 0]} scale={[40, 50, 1]}>
          <roundBoxGeometry args={[1, 1, 1, 2]} />
          <meshBasicMaterial color="#0F172A" transparent opacity={0.9 * progress} />
        </mesh>
        
        {/* Title */}
        <mesh position={[0, 20, 1]}>
          <textGeometry text="💬 KOMENTAR MASUK REAL-TIME" fontSize={1.5} fontWeight="bold" />
          <meshBasicMaterial color="#7DD3FC" transparent opacity={progress} />
        </mesh>
        
        {/* Comment list */}
        <group position={[0, 15, 0.5]}>
          {comments.map((comment, i) => (
            <CommentCard
              key={i}
              position={[0, -i * 6, 0]}
              comment={comment}
              progress={progress * Math.max(0, 1 - i * 0.1)}
              delay={i * 0.15}
              time={time}
            />
          ))}
        </group>
        
        {/* Scroll indicator */}
        <mesh position={[0, -25, 1]} scale={progress}>
          <textGeometry text="▼ Scroll ke bawah ▼" fontSize={1} fontWeight="normal" />
          <meshBasicMaterial color="#7DD3FC" transparent opacity={0.5 + Math.sin(time * 2) * 0.3} />
        </mesh>
      </group>
    </Canvas>
  );
};

const CommentCard: React.FC<{ 
  position: [number, number, number]; 
  comment: any; 
  progress: number; 
  delay: number; 
  time: number 
}> = ({ position, comment, progress, delay, time }) => {
  const cardProgress = Math.max(0, Math.min(1, (progress - delay) * 2));
  if (cardProgress <= 0) return null;
  
  return (
    <group position={position} scale={cardProgress}>
      <mesh position={[0, 0, 0]} scale={[36, 5, 1]}>
        <roundBoxGeometry args={[1, 1, 1, 1]} />
        <meshBasicMaterial color="#1E3A5F" transparent opacity={0.7} />
      </mesh>
      
      <mesh position={[-16, 1.5, 0.6]}>
        <textGeometry text={comment.nama} fontSize={1} fontWeight="bold" />
        <meshBasicMaterial color="#FDE047" />
      </mesh>
      
      <mesh position={[-16, -0.5, 0.6]}>
        <textGeometry text={`🎯 ${comment.jabatan}`} fontSize={0.9} fontWeight="normal" />
        <meshBasicMaterial color="#7DD3FC" />
      </mesh>
      
      <mesh position={[-16, -2.5, 0.6]} scale={[1, 1, 1]}>
        <textGeometry text={`💭 "${comment.alasan}"`} fontSize={0.8} fontWeight="normal" />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.8} />
      </mesh>
      
      <mesh position={[15, -2, 0.6]}>
        <textGeometry text={`❤️ ${comment.likes}`} fontSize={0.8} fontWeight="normal" />
        <meshBasicMaterial color="#EF4444" />
      </mesh>
    </group>
  );
};

const roundBoxGeometry = ({ args }: any) => ({ type: 'RoundBoxGeometry', args });
const textGeometry = ({ text, fontSize, fontWeight }: any) => ({ type: 'TextGeometry', text, fontSize, fontWeight });