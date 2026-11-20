import { registerRoot } from 'remotion';
import React, { useMemo } from 'react';
import { Canvas } from '@remotion/three';
import { useCurrentFrame, interpolate } from 'remotion';
import * as THREE from 'three';

const DURATION_SEC = 180;
const FPS = 30;
const TOTAL_FRAMES = DURATION_SEC * FPS;

const Scene1Hook: React.FC<{ frame: number; progress: number }> = ({ frame, progress }) => (
  <Canvas>
    <group>
      {/* Sky gradient background */}
      <mesh position={[0, 0, -100]} scale={[300, 200, 1]}>
        <planeGeometry />
        <meshBasicMaterial color="#1E3A5F" transparent opacity={0.3} side={2} />
      </mesh>
      
      {/* Cloud city buildings */}
      {useMemo(() => 
        Array.from({ length: 30 }, (_, i) => {
          const angle = (i / 30) * Math.PI * 2;
          const radius = 80 + Math.sin(i * 1.7) * 20;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const height = 10 + Math.abs(Math.sin(i * 2.3)) * 40;
          return (
            <group key={i} position={[x, height / 2, z]}>
              <mesh scale={[4 + Math.sin(i) * 2, height, 4 + Math.sin(i) * 2]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={new THREE.Color().setHSL(0.58, 0.3, 0.2 + (i % 5) * 0.05)} roughness={0.7} metalness={0.1} />
              </mesh>
              <mesh position={[0, height / 2 + 2, 0]} scale={[3, 1, 3]}>
                <planeGeometry args={[1, 1, 10, 10]} />
                <meshBasicMaterial color="#FDE047" transparent opacity={0.3} side={2} />
              </mesh>
            </group>
          );
        }), []
      )}
      
      {/* Floating clouds */}
      {useMemo(() =>
        Array.from({ length: 20 }, (_, i) => (
          <group key={i} position={[
            Math.sin(i * 0.7 + frame * 0.01) * 150,
            80 + Math.cos(i * 0.5) * 30,
            Math.cos(i * 0.7 + frame * 0.01) * 150
          ]} scale={5 + Math.sin(i) * 3}>
            <mesh><sphereGeometry args={[1, 8, 8]} /><meshBasicMaterial color="#FFFFFF" transparent opacity={0.15} depthWrite={false} /></mesh>
            <mesh position={[2, 0, 0]} scale={[1.5, 1, 1.5]}><sphereGeometry args={[1, 8, 8]} /><meshBasicMaterial color="#FFFFFF" transparent opacity={0.15} depthWrite={false} /></mesh>
            <mesh position={[-1.5, 0.5, 1]} scale={[1, 0.8, 1]}><sphereGeometry args={[1, 8, 8]} /><meshBasicMaterial color="#FFFFFF" transparent opacity={0.15} depthWrite={false} /></mesh>
          </group>
        )), [frame]
      )}
      
      {/* Flag at center */}
      <group position={[0, 60, 0]} scale={interpolate(progress, [0.3, 0.8], [0, 1])} rotation={[0, interpolate(progress, [0.3, 1], [Math.PI, 0]), 0]}>
        <mesh position={[0, 30, 0]} scale={[0.3, 60, 0.3]}><cylinderGeometry args={[1, 1, 1, 8]} /><meshStandardMaterial color="#7DD3FC" roughness={0.3} metalness={0.5} /></mesh>
        <group position={[4, 55, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <mesh position={[0, 10, 0]} scale={[20, 6.67, 1]}><planeGeometry /><meshBasicMaterial color="#1E3A5F" side={2} /></mesh>
          <mesh position={[0, 0, 0]} scale={[20, 6.67, 1]}><planeGeometry /><meshBasicMaterial color="#FFFFFF" side={2} /></mesh>
          <mesh position={[0, -10, 0]} scale={[20, 6.67, 1]}><planeGeometry /><meshBasicMaterial color="#FDE047" side={2} /></mesh>
        </group>
      </group>
      
      {/* Ground plane */}
      <mesh position={[0, -5, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[300, 300, 1]}>
        <planeGeometry args={[1, 1, 50, 50]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.1} depthWrite={false} side={2} />
      </mesh>
      
      {/* Lighting */}
      <ambientLight color="#FFFFFF" intensity={0.6} />
      <directionalLight position={[100, 200, 100]} color="#FDE047" intensity={0.8} />
      <directionalLight position={[-100, 150, -100]} color="#7DD3FC" intensity={0.5} />
      <hemisphereLight skyColor="#7DD3FC" groundColor="#1E3A5F" intensity={0.3} />
    </group>
  </Canvas>
);

const Scene2Lore: React.FC<{ progress: number }> = ({ progress }) => (
  <Canvas>
    <group position={[0, 30, 0]} scale={progress}>
      <mesh position={[0, 0, -5]} scale={[80, 50, 1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#0F172A" transparent opacity={0.8} side={2} />
      </mesh>
      <mesh position={[0, 0, -4.9]} scale={[81, 51, 1]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#7DD3FC" transparent opacity={0.2} wireframe side={2} />
      </mesh>
      
      <group position={[-35, 15, 0]}>
        {['NAMA NEGARA', 'MOTTO', 'IBUKOTA', 'MATA UANG'].map((label, i) => (
          <group key={label} position={[0, -i * 10, 0]}>
            <mesh position={[0, 2, 0]} scale={[30, 3, 1]}><boxGeometry args={[1, 1, 1]} /><meshBasicMaterial color="#1E3A5F" transparent opacity={0.6} /></mesh>
            <mesh position={[0, 2, 0.6]} scale={[label.length * 0.8, 1, 1]}><planeGeometry /><meshBasicMaterial color="#7DD3FC" transparent opacity={0.9} side={2} /></mesh>
            <mesh position={[0, -1, 0.6]} scale={[15, 1.5, 1]}><planeGeometry /><meshBasicMaterial color="#FDE047" transparent opacity={0.9} side={2} /></mesh>
          </group>
        ))}
      </group>
      
      <group position={[35, 0, 0]}>
        <mesh scale={[30, 40, 1]}><boxGeometry args={[1, 1, 1]} /><meshBasicMaterial color="#0F172A" transparent opacity={0.7} /></mesh>
        {[
          { pasal: 1, judul: 'HAK TERBANG', isi: 'Setiap warga berhak terbang tanpa izin gravitasi bumi.' },
          { pasal: 2, judul: 'MUSYAWARAH DIGITAL', isi: 'Keputusan diambil musyawarah di kolom komentar.' },
          { pasal: 3, judul: 'AWAN MILIK ANGIN', isi: 'Tanah, udara, data tidak dimiliki siapapun.' }
        ].map((k, i) => (
          <group key={k.pasal} position={[0, 15 - i * 12, 1]}>
            <mesh position={[-12, 3, 0]} scale={[10, 1, 1]}><planeGeometry /><meshBasicMaterial color="#FDE047" side={2} /></mesh>
            <mesh position={[-12, 0, 0]} scale={[20, 1.2, 1]}><planeGeometry /><meshBasicMaterial color="#FFFFFF" side={2} /></mesh>
            <mesh position={[-12, -3, 0]} scale={[25, 1, 1]}><planeGeometry /><meshBasicMaterial color="#7DD3FC" side={2} /></mesh>
          </group>
        ))}
      </group>
      
      <group position={[0, -30, 0]}>
        <mesh position={[-20, 0, 0]} scale={[15, 10, 1]}><planeGeometry /><meshBasicMaterial color="#1E3A5F" transparent opacity={0.5} side={2} /></mesh>
        <mesh position={[20, 0, 0]} scale={[15, 15, 1]}><planeGeometry /><meshBasicMaterial color="#1E3A5F" transparent opacity={0.5} side={2} /></mesh>
      </group>
      
      <group>
        {[...Array(20)].map((_, i) => (
          <mesh key={i} position={[-40 + i * 4, 0, 0]} scale={[0.05, 50, 0.05]}><boxGeometry /><meshBasicMaterial color="#7DD3FC" transparent opacity={0.3} /></mesh>
        ))}
        {[...Array(14)].map((_, i) => (
          <mesh key={i} position={[0, -25 + i * 3.5, 0]} scale={[80, 0.05, 0.05]}><boxGeometry /><meshBasicMaterial color="#7DD3FC" transparent opacity={0.3} /></mesh>
        ))}
      </group>
    </group>
    
    <ambientLight color="#FFFFFF" intensity={0.5} />
    <directionalLight position={[50, 100, 50]} color="#FDE047" intensity={0.6} />
  </Canvas>
);

const Scene3Entrance: React.FC<{ frame: number; progress: number }> = ({ frame, progress }) => (
  <Canvas>
    <group>
      <group position={[0, 0, 0]}>
        <mesh position={[0, 2, 0]} scale={[30, 4, 30]}><boxGeometry /><meshStandardMaterial color="#1E3A5F" roughness={0.5} metalness={0.2} /></mesh>
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[0, 4 + i * 1.5, 0]} scale={[25 - i * 3, 1.5, 25 - i * 3]}><boxGeometry /><meshStandardMaterial color="#1E3A5F" roughness={0.5} metalness={0.2} /></mesh>
        ))}
        <mesh position={[0, 50, 0]} scale={[4, 80, 4]}><cylinderGeometry args={[1, 0.5, 1, 8]} /><meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.4} /></mesh>
        <mesh position={[0, 92, 0]} scale={[3, 8, 3]}><coneGeometry args={[1, 1, 8]} /><meshStandardMaterial color="#FDE047" roughness={0.2} metalness={0.6} /></mesh>
        {[...Array(7)].map((_, i) => (
          <mesh key={i} position={[0, 12 + i * 11, 0]} scale={[4.1, 0.2, 4.1]}><torusGeometry args={[1, 0.1, 8, 16]} /><meshBasicMaterial color="#7DD3FC" transparent opacity={0.6} /></mesh>
        ))}
        {[...Array(8)].map((_, i) => (
          <group key={i} position={[Math.cos(i * Math.PI / 4) * 20, 15, Math.sin(i * Math.PI / 4) * 20]}>
            <mesh position={[0, 15, 0]} scale={[2, 30, 2]}><cylinderGeometry args={[1, 1, 1, 8]} /><meshStandardMaterial color="#7DD3FC" roughness={0.4} metalness={0.3} /></mesh>
            <mesh position={[0, 32, 0]} scale={[2.5, 2.5, 2.5]}><sphereGeometry args={[1, 8, 8]} /><meshBasicMaterial color="#FDE047" /></mesh>
          </group>
        ))}
      </group>
      
      <group position={[interpolate(progress, [0, 0.8], [-80, 0]), 0, 0]}>
        <mesh position={[0, 5, 0]} scale={[4, 10, 2.5]}><boxGeometry /><meshStandardMaterial color="#1E3A5F" /></mesh>
        <mesh position={[0, 5, 1.5]} scale={[4.2, 10.2, 0.1]}><planeGeometry /><meshBasicMaterial color="#FDE047" transparent opacity={0.8} side={2} /></mesh>
        <mesh position={[0, 13, 0]} scale={[2.5, 3, 2.5]}><sphereGeometry args={[1, 16, 16]} /><meshStandardMaterial color="#FDBA74" /></mesh>
        <group position={[-1, -1.5, 0]}><mesh position={[0, -5, 0]} scale={[1, 10, 1]}><cylinderGeometry args={[1, 0.8, 1, 8]} /><meshStandardMaterial color="#1E3A5F" /></mesh></group>
        <group position={[1, -1.5, 0]}><mesh position={[0, -5, 0]} scale={[1, 10, 1]}><cylinderGeometry args={[1, 0.8, 1, 8]} /><meshStandardMaterial color="#1E3A5F" /></mesh></group>
      </group>
      
      {progress > 0.7 && useMemo(() => 
        Array.from({ length: 50 }, (_, i) => (
          <mesh key={i} position={[(Math.random() - 0.5) * 20, Math.random() * 50 + 20 - frame * 2, (Math.random() - 0.5) * 20]} rotation={[0, frame * 2 + i, 0]} scale={0.5}>
            <planeGeometry args={[1, 1]} /><meshBasicMaterial color={['#1E3A5F', '#7DD3FC', '#FDE047', '#FFFFFF'][i % 4]} transparent opacity={0.8} side={2} depthWrite={false} />
          </mesh>
        )), [frame]
      )}
      
      <ambientLight color="#FFFFFF" intensity={0.6} />
      <directionalLight position={[50, 100, 50]} color="#FDE047" intensity={0.8} />
    </Canvas>
  );
);

const Scene4Oath: React.FC<{ frame: number; progress: number }> = ({ frame, progress }) => (
  <Canvas>
    <group>
      <group position={[0, 0, 0]}>
        <mesh position={[0, 2, 0]} scale={[30, 4, 30]}><boxGeometry /><meshStandardMaterial color="#1E3A5F" roughness={0.5} metalness={0.2} /></mesh>
        <mesh position={[0, 50, 0]} scale={[4, 80, 4]}><cylinderGeometry args={[1, 0.5, 1, 8]} /><meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.4} /></mesh>
        <mesh position={[0, 92, 0]} scale={[3, 8, 3]}><coneGeometry args={[1, 1, 8]} /><meshStandardMaterial color="#FDE047" roughness={0.2} metalness={0.6} /></mesh>
      </group>
      
      <group position={[0, 0, 0]}>
        <mesh position={[0, 5, 0]} scale={[4, 10, 2.5]}><boxGeometry /><meshStandardMaterial color="#1E3A5F" /></mesh>
        <mesh position={[0, 5, 1.5]} scale={[4.2, 10.2, 0.1]}><planeGeometry /><meshBasicMaterial color="#FDE047" transparent opacity={0.8} side={2} /></mesh>
        <mesh position={[0, 13, 0]} scale={[2.5, 3, 2.5]}><sphereGeometry args={[1, 16, 16]} /><meshStandardMaterial color="#FDBA74" /></mesh>
        
        <group position={[-3.5, 8, 0]} rotation={[0, 0, interpolate(progress, [0.1, 0.4], [0, -Math.PI / 2])]}>
          <mesh position={[0, -4, 0]} scale={[1, 8, 1]}><cylinderGeometry args={[1, 0.8, 1, 8]} /><meshStandardMaterial color="#FDBA74" /></mesh>
          <mesh position={[0, -9, 0]} scale={[1.2, 2, 1.2]}><sphereGeometry args={[1, 8, 8]} /><meshStandardMaterial color="#FDBA74" /></mesh>
        </group>
        <group position={[3.5, 8, 0]} rotation={[0, 0, interpolate(progress, [0.2, 0.5], [0, Math.PI / 4])]}>
          <mesh position={[0, -4, 0]} scale={[1, 8, 1]}><cylinderGeometry args={[1, 0.8, 1, 8]} /><meshStandardMaterial color="#FDBA74" /></mesh>
        </group>
        
        {progress > 0.3 && <mesh position={[0, 5, 0]} scale={[6 + progress * 4, 16 + progress * 4, 4 + progress * 4]}><boxGeometry args={[1, 1, 1]} /><meshBasicMaterial color="#FDE047" transparent opacity={0.1 * progress} depthWrite={false} /></mesh>}
        {progress > 0.3 && <mesh position={[0, 13, 0]} scale={[3 + progress * 5, 3 + progress * 5, 3 + progress * 5]}><sphereGeometry args={[1, 16, 16]} /><meshBasicMaterial color="#FDE047" transparent opacity={0.15 * progress} depthWrite={false} /></mesh>}
      </group>
      
      <group position={[0, 22, 10]} rotation={[-0.2, 0, 0]}>
        <mesh scale={[8, 10, 1]}><boxGeometry /><meshStandardMaterial color="#0F172A" roughness={0.3} metalness={0.2} /></mesh>
        <mesh position={[0, 0, 0.6]} scale={[8.2, 10.2, 0.2]}><planeGeometry /><meshStandardMaterial color="#1E3A5F" roughness={0.4} metalness={0.3} /></mesh>
        <mesh position={[0, 0, 0.8]} scale={[8.4, 10.4, 0.1]}><planeGeometry /><meshBasicMaterial color="#FDE047" transparent opacity={0.8} side={2} /></mesh>
        
        <group rotation={[0, 0, -interpolate(progress, [0.2, 0.6], [0, Math.PI / 2])]}>
          <mesh position={[-4.1, 0, 0]} scale={[0.1, 9.5, 8]}><boxGeometry /><meshStandardMaterial color="#F0F9FF" roughness={0.9} /></mesh>
        </group>
        <group rotation={[0, 0, interpolate(progress, [0.2, 0.6], [0, Math.PI / 2])]}>
          <mesh position={[4.1, 0, 0]} scale={[0.1, 9.5, 8]}><boxGeometry /><meshStandardMaterial color="#F0F9FF" roughness={0.9} /></mesh>
        </group>
        
        {progress > 0.5 && useMemo(() =>
          Array.from({ length: 30 }, (_, i) => (
            <mesh key={i} position={[(Math.random() - 0.5) * 10, Math.sin(frame * 0.05 + i) * 10 + 10, (Math.random() - 0.5) * 5 + 2]} scale={0.3}>
              <sphereGeometry args={[1, 8, 8]} /><meshBasicMaterial color="#FDE047" transparent opacity={0.8} depthWrite={false} />
            </mesh>
          )), [frame]
        )}
      </group>
      
      <ambientLight color="#FFFFFF" intensity={0.5} />
      <directionalLight position={[50, 100, 50]} color="#FDE047" intensity={0.8} />
      <directionalLight position={[-50, 80, -50]} color="#7DD3FC" intensity={0.4} />
    </Canvas>
  );
);

const Scene5Register: React.FC<{ frame: number; progress: number }> = ({ frame, progress }) => (
  <Canvas>
    <group>
      <group position={[0, 5, 0]}>
        <mesh scale={[40, 10, 30]}><boxGeometry /><meshStandardMaterial color="#1E3A5F" roughness={0.7} metalness={0.1} /></mesh>
        {[...Array(8)].map((_, i) => (
          <mesh key={i} position={[-30 + i * 8.5, 20, -12]} scale={[2, 30, 2]}><cylinderGeometry args={[1, 1, 1, 8]} /><meshStandardMaterial color="#7DD3FC" roughness={0.5} metalness={0.2} /></mesh>
        ))}
        {[...Array(8)].map((_, i) => (
          <mesh key={i + 8} position={[-30 + i * 8.5, 20, 12]} scale={[2, 30, 2]}><cylinderGeometry args={[1, 1, 1, 8]} /><meshStandardMaterial color="#7DD3FC" roughness={0.5} metalness={0.2} /></mesh>
        ))}
        <mesh position={[0, 40, 0]} scale={[25, 15, 25]} rotation={[-Math.PI / 2, 0, 0]}><sphereGeometry args={[1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#1E3A5F" roughness={0.3} metalness={0.3} /></mesh>
      </group>
      
      <group position={[-60, 20, 30]} scale={progress}>
        <mesh scale={[40, 50, 1]}><boxGeometry /><meshBasicMaterial color="#0F172A" transparent opacity={0.9} /></mesh>
        <mesh position={[0, 20, 1]} scale={[30, 2, 1]}><planeGeometry /><meshBasicMaterial color="#FDE047" side={2} /></mesh>
        {[0, 10, 0].map((y, i) => (
          <group key={i} position={[0, 10 - i * 10, 1]}>
            <mesh position={[0, -2, 0]} scale={[35, 4, 1]}><boxGeometry /><meshBasicMaterial color="#1E3A5F" transparent opacity={0.8} /></mesh>
          </group>
        ))}
        <mesh position={[0, -22, 1]} scale={[20, 5, 1]}><boxGeometry /><meshBasicMaterial color="#FDE047" transparent opacity={0.9} /></mesh>
      </group>
      
      <group position={[60, 20, 30]} scale={progress}>
        <mesh scale={[40, 50, 1]}><boxGeometry /><meshBasicMaterial color="#0F172A" transparent opacity={0.9} /></mesh>
        <mesh position={[0, 20, 1]} scale={[30, 2, 1]}><planeGeometry /><meshBasicMaterial color="#7DD3FC" side={2} /></mesh>
        {[
          { nama: 'Budi', jabatan: 'Menteri Gravitasi', alasan: 'Supaya orang tidak jatuh ke bumi saat tidur' },
          { nama: 'Siti', jabatan: 'Gubernur Awan Barat', alasan: 'Awan barat butuh pengelola yang ngerti angin' },
          { nama: 'Ahmad', jabatan: 'Menteri Cuaca', alasan: 'Biar hujan hanya di weekend' },
        ].map((c, i) => (
          <group key={i} position={[0, 15 - i * 6, 0.5]}>
            <mesh scale={[36, 5, 1]}><boxGeometry /><meshBasicMaterial color="#1E3A5F" transparent opacity={0.7} /></mesh>
          </group>
        ))}
      </group>
      
      <group position={[0, 80, 40]} scale={1.5}>
        <mesh scale={[15, 4, 1]}><boxGeometry /><meshBasicMaterial color="#0F172A" transparent opacity={0.9} /></mesh>
      </group>
      
      <ambientLight color="#FFFFFF" intensity={0.5} />
      <directionalLight position={[50, 100, 50]} color="#FDE047" intensity={0.6} />
    </Canvas>
  );
);

const Scene6Teaser: React.FC<{ frame: number; progress: number }> = ({ frame, progress }) => (
  <Canvas>
    <group>
      {useMemo(() =>
        Array.from({ length: 50 }, (_, i) => (
          <group key={i} position={[Math.sin(i * 0.3) * 60 + (Math.random() - 0.5) * 10, Math.sin(frame * 0.3 + i) * 0.5, Math.cos(i * 0.3) * 60 + (Math.random() - 0.5) * 10]} scale={progress}>
            <mesh position={[0, 2, 0]} scale={[1, 4, 0.5]}><boxGeometry /><meshBasicMaterial color="#0F172A" /></mesh>
            <mesh position={[0, 4.5, 0]} scale={0.8}><sphereGeometry args={[1, 8, 8]} /><meshBasicMaterial color="#0F172A" /></mesh>
          </group>
        )), [frame, progress]
      )}
      
      {useMemo(() =>
        Array.from({ length: 10 }, (_, i) => (
          <group key={i} position={[Math.sin(i * 0.8) * 80, 0, Math.cos(i * 0.8) * 80]} scale={[1, progress, 1]}>
            <mesh scale={[6, 20 * progress, 6]}><boxGeometry /><meshStandardMaterial color="#1E3A5F" roughness={0.7} metalness={0.1} /></mesh>
            {progress > 0.8 && <mesh position={[0, 10 * progress + 1, 0]} scale={[6.6, 2, 6.6]}><boxGeometry /><meshStandardMaterial color="#1E3A5F" roughness={0.5} metalness={0.2} /></mesh>}
          </group>
        )), [progress]
      )}
      
      {progress > 0.6 && (
        <group position={[40, 50, -20]} scale={interpolate(progress, [0.6, 1], [0, 3])}>
          <mesh position={[0, Math.sin(frame * 4) * 2, 0]} rotation={[0, frame * 0.5, 0]}><torusGeometry args={[1, 0.3, 8, 16, Math.PI]} /><meshBasicMaterial color="#FDE047" /></mesh>
          <mesh position={[0, -3, 0]}><sphereGeometry args={[0.4, 8, 8]} /><meshBasicMaterial color="#FDE047" /></mesh>
        </group>
      )}
      
      <ambientLight color="#FFFFFF" intensity={0.5} />
      <directionalLight position={[50, 100, 50]} color="#FDE047" intensity={0.6} />
    </Canvas>
  );
);

const Scene7CTA: React.FC<{ progress: number }> = ({ progress }) => (
  <Canvas>
    <group>
      <mesh position={[0, 0, -1]} scale={[200, 120, 1]}><planeGeometry /><meshBasicMaterial color="#1E3A5F" transparent opacity={0.3} side={2} /></mesh>
      
      <group position={[0, 15, 0]} scale={interpolate(progress, [0, 0.3, 1], [0, 1.2, 1])} rotation={[0, progress * Math.PI * 0.5, 0]}>
        <mesh position={[0, 0, -1]} scale={[12, 12, 1]}><ringGeometry args={[0.8, 1, 64]} /><meshBasicMaterial color="#1E3A5F" side={2} /></mesh>
        {[...Array(7)].map((_, i) => (
          <mesh key={i} position={[Math.cos(i * Math.PI * 2 / 7) * 9, Math.sin(i * Math.PI * 2 / 7) * 9, 0]} scale={1.5}>
            <mesh position={[0, 0, 0]}><circleGeometry args={[1, 16]} /><meshBasicMaterial color="#FDE047" side={2} /></mesh>
          </mesh>
        ))}
        <mesh position={[0, 0, 0.5]} scale={[8, 10, 1]}><planeGeometry /><meshBasicMaterial color="#FFFFFF" side={2} /></mesh>
      </group>
      
      <group position={[0, -15, 0]} scale={interpolate(progress, [0.4, 0.7], [0, 1])}>
        <mesh scale={[12, 1.5, 1]}><planeGeometry /><meshBasicMaterial color="#0F172A" transparent opacity={0.8} side={2} /></mesh>
      </group>
      
      <group position={[0, -35, 0]} scale={interpolate(progress, [0.6, 0.9], [0, 1])}>
        <mesh position={[0, 0, 1]} scale={[20, 1, 1]}><planeGeometry /><meshBasicMaterial color="#7DD3FC" side={2} /></mesh>
        <mesh position={[0, -4, 1]} scale={[20, 1, 1]}><planeGeometry /><meshBasicMaterial color="#7DD3FC" side={2} /></mesh>
        <mesh position={[0, -8, 1]} scale={[20, 1, 1]}><planeGeometry /><meshBasicMaterial color="#7DD3FC" side={2} /></mesh>
        <mesh position={[0, -12, 1]} scale={[20, 1, 1]}><planeGeometry /><meshBasicMaterial color="#7DD3FC" side={2} /></mesh>
      </group>
      
      <group position={[0, -55, 0]} scale={interpolate(progress, [0.8, 1], [0, 1]) * (1 + Math.sin(progress * 20) * 0.1)}>
        <mesh scale={[20, 6, 1]}><boxGeometry /><meshBasicMaterial color="#FDE047" /></mesh>
        <mesh position={[0, 0, 0.6]} scale={[15, 1.5, 1]}><planeGeometry /><meshBasicMaterial color="#0F172A" side={2} /></mesh>
      </group>
    </Canvas>
  );
);

const Episode1Minimal: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const totalFrames = DURATION_SEC * fps;
  
  const scenes = [
    { id: 's01', start: 0, end: 450, component: Scene1Hook },
    { id: 's02', start: 450, end: 1350, component: Scene2Lore },
    { id: 's03', start: 1350, end: 1500, component: Scene3Entrance },
    { id: 's04', start: 1500, end: 2160, component: Scene4Oath },
    { id: 's05', start: 2160, end: 2700, component: Scene5Register },
    { id: 's06', start: 2700, end: 2970, component: Scene6Teaser },
    { id: 's07', start: 2970, end: 3240, component: Scene7CTA },
  ];
  
  return (
    <>
      {scenes.map((scene) => {
        const sceneProgress = interpolate(frame, [scene.start, scene.end], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        if (frame < scene.start || frame > scene.end) return null;
        return React.createElement(scene.component, { key: scene.id, frame, progress: sceneProgress });
      })}
    </>
  );
};

registerRoot({
  name: 'NegaraDiAtasAwanEp1',
  component: Episode1Minimal,
  durationInFrames: TOTAL_FRAMES,
  fps: FPS,
  width: 1920,
  height: 1080,
});