#!/usr/bin/env node
/**
 * Generate Placeholder GLB Assets (no ComfyUI needed)
 * Creates simple colored planes/boxes as GLB for testing render pipeline
 */

import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = path.join(process.cwd(), 'packages/assets/models');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const exporter = new GLTFExporter();

function createBuildingGLB(name, color, height = 10) {
  const scene = new THREE.Scene();
  
  // Building base
  const geometry = new THREE.BoxGeometry(4, height, 4);
  const material = new THREE.MeshStandardMaterial({ 
    color: new THREE.Color(color),
    roughness: 0.7,
    metalness: 0.1
  });
  const building = new THREE.Mesh(geometry, material);
  building.position.y = height / 2;
  scene.add(building);
  
  // Roof
  const roofGeom = new THREE.ConeGeometry(3, 3, 4);
  const roofMat = new THREE.MeshStandardMaterial({ 
    color: new THREE.Color(color).multiplyScalar(0.7),
    roughness: 0.5,
    metalness: 0.2
  });
  const roof = new THREE.Mesh(roofGeom, roofMat);
  roof.position.y = height + 1.5;
  roof.rotation.y = Math.PI / 4;
  scene.add(roof);
  
  // Windows (glowing)
  const windowGeom = new THREE.PlaneGeometry(0.8, 1.5);
  const windowMat = new THREE.MeshBasicMaterial({ 
    color: 0xFDE047,
    transparent: true,
    opacity: 0.9,
    side: THREE.DoubleSide
  });
  
  for (let floor = 0; floor < Math.floor(height / 3); floor++) {
    for (let side = 0; side < 4; side++) {
      const window = new THREE.Mesh(windowGeom, windowMat);
      const angle = (side / 4) * Math.PI * 2;
      window.position.set(
        Math.cos(angle) * 2.1,
        2 + floor * 3,
        Math.sin(angle) * 2.1
      );
      window.rotation.y = -angle;
      scene.add(window);
    }
  }
  
  // Light on top
  const lightGeom = new THREE.SphereGeometry(0.5, 8, 8);
  const lightMat = new THREE.MeshBasicMaterial({ color: 0xEF4444 });
  const light = new THREE.Mesh(lightGeom, lightMat);
  light.position.y = height + 4;
  scene.add(light);
  
  // Ground plane
  const groundGeom = new THREE.PlaneGeometry(20, 20);
  const groundMat = new THREE.MeshStandardMaterial({ 
    color: 0xFFFFFF,
    roughness: 0.9,
    metalness: 0
  });
  const ground = new THREE.Mesh(groundGeom, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.1;
  scene.add(ground);
  
  // Lighting
  scene.add(new THREE.AmbientLight(0xFFFFFF, 0.6));
  const dirLight = new THREE.DirectionalLight(0xFDE047, 0.8);
  dirLight.position.set(10, 20, 10);
  scene.add(dirLight);
  const hemiLight = new THREE.HemisphereLight(0x7DD3FC, 0x1E3A5F, 0.3);
  scene.add(hemiLight);
  
  return new Promise((resolve) => {
    exporter.parse(scene, (gltf) => {
      const buffer = Buffer.from(gltf);
      const outPath = path.join(OUTPUT_DIR, `${name}.glb`);
      fs.writeFileSync(outPath, buffer);
      console.log(`✅ Created: ${name}.glb`);
      resolve(outPath);
    }, { binary: true });
  });
}

function createAvatarGLB(name, color) {
  const scene = new THREE.Scene();
  
  // Body
  const bodyGeom = new THREE.CapsuleGeometry(0.5, 1.5, 4, 8);
  const bodyMat = new THREE.MeshStandardMaterial({ 
    color: new THREE.Color(color),
    roughness: 0.6,
    metalness: 0.1
  });
  const body = new THREE.Mesh(bodyGeom, bodyMat);
  body.position.y = 1.5;
  scene.add(body);
  
  // Head
  const headGeom = new THREE.SphereGeometry(0.5, 16, 16);
  const headMat = new THREE.MeshStandardMaterial({ 
    color: 0xFDBA74,
    roughness: 0.8,
    metalness: 0
  });
  const head = new THREE.Mesh(headGeom, headMat);
  head.position.y = 3.0;
  scene.add(head);
  
  // Eyes
  const eyeGeom = new THREE.SphereGeometry(0.08, 8, 8);
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x0F172A });
  const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
  leftEye.position.set(-0.15, 3.05, 0.45);
  scene.add(leftEye);
  const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
  rightEye.position.set(0.15, 3.05, 0.45);
  scene.add(rightEye);
  
  // Presidential sash
  const sashGeom = new THREE.PlaneGeometry(0.6, 1.8);
  const sashMat = new THREE.MeshBasicMaterial({ 
    color: 0xFDE047,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
  });
  const sash = new THREE.Mesh(sashGeom, sashMat);
  sash.position.set(0, 1.5, 0.55);
  scene.add(sash);
  
  // Ground
  const groundGeom = new THREE.PlaneGeometry(5, 5);
  const groundMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.9 });
  const ground = new THREE.Mesh(groundGeom, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.1;
  scene.add(ground);
  
  // Lighting
  scene.add(new THREE.AmbientLight(0xFFFFFF, 0.6));
  const dirLight = new THREE.DirectionalLight(0xFDE047, 0.8);
  dirLight.position.set(5, 10, 5);
  scene.add(dirLight);
  
  return new Promise((resolve) => {
    exporter.parse(scene, (gltf) => {
      const buffer = Buffer.from(gltf);
      const outPath = path.join(OUTPUT_DIR, `${name}.glb`);
      fs.writeFileSync(outPath, buffer);
      console.log(`✅ Created: ${name}.glb`);
      resolve(outPath);
    }, { binary: true });
  });
}

function createFlagGLB(name) {
  const scene = new THREE.Scene();
  
  // Pole
  const poleGeom = new THREE.CylinderGeometry(0.05, 0.05, 6, 8);
  const poleMat = new THREE.MeshStandardMaterial({ color: 0x7DD3FC, roughness: 0.3, metalness: 0.5 });
  const pole = new THREE.Mesh(poleGeom, poleMat);
  pole.position.y = 3;
  scene.add(pole);
  
  // Flag cloth (3 stripes)
  const flagGeom = new THREE.PlaneGeometry(3, 1);
  
  // Top stripe - blue
  const topMat = new THREE.MeshBasicMaterial({ color: 0x1E3A5F, side: THREE.DoubleSide });
  const top = new THREE.Mesh(flagGeom, topMat);
  top.position.set(1.5, 5.33, 0);
  top.rotation.y = -Math.PI / 2;
  scene.add(top);
  
  // Middle stripe - white
  const midMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });
  const mid = new THREE.Mesh(flagGeom, midMat);
  mid.position.set(1.5, 4.33, 0);
  mid.rotation.y = -Math.PI / 2;
  scene.add(mid);
  
  // Bottom stripe - yellow
  const botMat = new THREE.MeshBasicMaterial({ color: 0xFDE047, side: THREE.DoubleSide });
  const bot = new THREE.Mesh(flagGeom, botMat);
  bot.position.set(1.5, 3.33, 0);
  bot.rotation.y = -Math.PI / 2;
  scene.add(bot);
  
  // Center circle with 7 stars
  const circleGeom = new THREE.CircleGeometry(0.6, 32);
  const circleMat = new THREE.MeshBasicMaterial({ color: 0x0F172A, side: THREE.DoubleSide });
  const circle = new THREE.Mesh(circleGeom, circleMat);
  circle.position.set(1.5, 4.33, 0.01);
  circle.rotation.y = -Math.PI / 2;
  scene.add(circle);
  
  // Stars
  const starMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });
  for (let i = 0; i < 7; i++) {
    const angle = (i / 7) * Math.PI * 2;
    // Simple star as rotated square
    const starGeom = new THREE.PlaneGeometry(0.15, 0.15);
    const star = new THREE.Mesh(starGeom, starMat);
    star.position.set(
      1.5 + Math.cos(angle) * 0.35,
      4.33 + Math.sin(angle) * 0.35,
      0.02
    );
    star.rotation.y = -Math.PI / 2;
    star.rotation.z = angle + Math.PI / 4;
    scene.add(star);
  }
  
  return new Promise((resolve) => {
    exporter.parse(scene, (gltf) => {
      const buffer = Buffer.from(gltf);
      const outPath = path.join(OUTPUT_DIR, `${name}.glb`);
      fs.writeFileSync(outPath, buffer);
      console.log(`✅ Created: ${name}.glb`);
      resolve(outPath);
    }, { binary: true });
  });
}

function createUIHologramGLB(name) {
  const scene = new THREE.Scene();
  
  // Panel
  const panelGeom = new THREE.RoundedBoxGeometry(4, 2, 0.05, 4, 0.1);
  const panelMat = new THREE.MeshBasicMaterial({ 
    color: 0x1E3A5F,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
  });
  const panel = new THREE.Mesh(panelGeom, panelMat);
  scene.add(panel);
  
  // Grid lines
  const lineMat = new THREE.LineBasicMaterial({ color: 0x7DD3FC, transparent: true, opacity: 0.3 });
  const gridSize = 4;
  const divisions = 8;
  for (let i = 0; i <= divisions; i++) {
    const x = -gridSize/2 + i * gridSize/divisions;
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute([
      x, -1, 0.03, x, 1, 0.03
    ], 3));
    scene.add(new THREE.Line(geom, lineMat));
    
    const y = -1 + i * 2/divisions;
    const geom2 = new THREE.BufferGeometry();
    geom2.setAttribute('position', new THREE.Float32BufferAttribute([
      -2, y, 0.03, 2, y, 0.03
    ], 3));
    scene.add(new THREE.Line(geom2, lineMat));
  }
  
  // Data cards (glowing rectangles)
  const cardMat = new THREE.MeshBasicMaterial({ 
    color: 0x7DD3FC,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide
  });
  for (let i = 0; i < 4; i++) {
    const cardGeom = new THREE.PlaneGeometry(0.8, 0.4);
    const card = new THREE.Mesh(cardGeom, cardMat);
    card.position.set(-1.5 + i * 1, 0.5, 0.04);
    scene.add(card);
  }
  
  return new Promise((resolve) => {
    exporter.parse(scene, (gltf) => {
      const buffer = Buffer.from(gltf);
      const outPath = path.join(OUTPUT_DIR, `${name}.glb`);
      fs.writeFileSync(outPath, buffer);
      console.log(`✅ Created: ${name}.glb`);
      resolve(outPath);
    }, { binary: true });
  });
}

async function main() {
  console.log('🏗️ Generating placeholder GLB assets...\n');
  
  // Buildings (8 variants)
  const buildingColors = [0x1E3A5F, 0x0F172A, 0x334155, 0x1E293B, 0x1E3A5F, 0x0F172A, 0x334155, 0x1E293B];
  for (let i = 0; i < 8; i++) {
    await createBuildingGLB(`building_${String(i+1).padStart(2,'0')}`, buildingColors[i], 8 + i * 2);
  }
  
  // Avatars (3 variants)
  const avatarColors = [0x1E3A5F, 0x7DD3FC, 0xFDE047];
  for (let i = 0; i < 3; i++) {
    await createAvatarGLB(`avatar_${String(i+1).padStart(2,'0')}`, avatarColors[i]);
  }
  
  // Flag
  await createFlagGLB('flag_01');
  await createFlagGLB('flag_02'); // emblem variant
  
  // UI Holograms
  for (let i = 0; i < 3; i++) {
    await createUIHologramGLB(`ui_${String(i+1).padStart(2,'0')}`);
  }
  
  console.log('\n🎉 All placeholder GLB assets generated!');
  console.log(`📁 Location: ${OUTPUT_DIR}`);
}

main().catch(console.error);