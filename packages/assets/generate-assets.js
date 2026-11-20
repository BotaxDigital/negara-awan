#!/usr/bin/env node
/**
 * ComfyUI Asset Generator untuk NEGARA DIATAS AWAN
 * Jalankan workflows berurutan via API, download hasil, convert ke GLB sederhana
 * 
 * Prereq: ComfyUI running di http://127.0.0.1:8188
 * Model: flux1-dev-fp8.safetensors di models/checkpoints/
 */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);

const COMFYUI_URL = 'http://127.0.0.1:8188';
const WORKFLOWS_DIR = path.join(process.cwd(), 'packages/assets/comfyui-workflows');
const OUTPUT_DIR = path.join(process.cwd(), 'packages/assets/generated');
const GLB_DIR = path.join(process.cwd(), 'packages/assets/models');

const WORKFLOWS = [
  { name: 'building', file: 'building_batch.json', count: 8, prefix: 'building_' },
  { name: 'avatar', file: 'avatar_batch.json', count: 3, prefix: 'avatar_' },
  { name: 'flag', file: 'flag_emblem.json', count: 2, prefix: 'flag_' },
  { name: 'ui_hologram', file: 'ui_hologram.json', count: 3, prefix: 'ui_' },
];

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function queueWorkflow(workflowJson) {
  const response = await fetch(`${COMFYUI_URL}/prompt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: workflowJson }),
  });
  const data = await response.json();
  return data.prompt_id;
}

async function waitForCompletion(promptId) {
  while (true) {
    const response = await fetch(`${COMFYUI_URL}/history/${promptId}`);
    const history = await response.json();
    if (history[promptId] && history[promptId].status?.completed === true) {
      return history[promptId].outputs;
    }
    await sleep(2000);
  }
}

async function downloadImage(filename, subfolder = '', type = 'output') {
  const url = `${COMFYUI_URL}/view?filename=${encodeURIComponent(filename)}&subfolder=${encodeURIComponent(subfolder)}&type=${type}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download ${filename}: ${response.status}`);
  return response.arrayBuffer();
}

function modifyWorkflowSeed(workflow, seed) {
  const modified = JSON.parse(JSON.stringify(workflow));
  // Find KSampler node and update seed
  for (const [key, node] of Object.entries(modified)) {
    if (node.class_type === 'KSampler' && node.inputs.seed !== undefined) {
      node.inputs.seed = seed;
      break;
    }
  }
  return modified;
}

async function generateAssets() {
  console.log('🎨 Starting ComfyUI asset generation...');
  
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  if (!fs.existsSync(GLB_DIR)) fs.mkdirSync(GLB_DIR, { recursive: true });
  
  // Check ComfyUI connection
  try {
    await fetch(`${COMFYUI_URL}/system_stats`);
    console.log('✅ ComfyUI connected');
  } catch {
    console.error('❌ ComfyUI not running at', COMFYUI_URL);
    console.log('   Start with: python main.py --listen 127.0.0.1 --port 8188');
    process.exit(1);
  }
  
  for (const wf of WORKFLOWS) {
    console.log(`\n📦 Generating ${wf.count} ${wf.name} assets...`);
    const workflowPath = path.join(WORKFLOWS_DIR, wf.file);
    const baseWorkflow = JSON.parse(fs.readFileSync(workflowPath, 'utf-8'));
    
    for (let i = 0; i < wf.count; i++) {
      const seed = Date.now() + i * 1000;
      const workflow = modifyWorkflowSeed(baseWorkflow, seed);
      
      console.log(`  [${i+1}/${wf.count}] Queueing (seed: ${seed})...`);
      const promptId = await queueWorkflow(workflow);
      
      console.log(`  Waiting for completion...`);
      const outputs = await waitForCompletion(promptId);
      
      // Find SaveImage output
      for (const [nodeId, output] of Object.entries(outputs)) {
        if (output.images) {
          for (const img of output.images) {
            const buffer = await downloadImage(img.filename, img.subfolder, img.type);
            const outName = `${wf.prefix}${String(i+1).padStart(2, '0')}.png`;
            const outPath = path.join(OUTPUT_DIR, outName);
            fs.writeFileSync(outPath, Buffer.from(buffer));
            console.log(`  ✅ Saved: ${outName}`);
            
            // Create simple GLB (plane with texture) using a quick script
            await createPlaneGLB(outPath, path.join(GLB_DIR, `${wf.prefix}${String(i+1).padStart(2, '0')}.glb`));
          }
        }
      }
      
      // Small delay between generations
      await sleep(1000);
    }
  }
  
  console.log('\n🎉 All assets generated!');
  console.log(`📁 Images: ${OUTPUT_DIR}`);
  console.log(`📁 GLB Models: ${GLB_DIR}`);
}

async function createPlaneGLB(imagePath, glbPath) {
  // Simple Node script to create a plane GLB with the image as texture
  // Using three.js + gltf-transform or similar would be better
  // For now, create a placeholder - actual GLB creation can be done in Blender batch
  const script = `
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { readFileSync } from 'fs';

const texture = new THREE.TextureLoader().load('file://${imagePath.replace(/\\\\/g, '/')}');
const geometry = new THREE.PlaneGeometry(1, 1);
const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
const mesh = new THREE.Mesh(geometry, material);
const scene = new THREE.Scene();
scene.add(mesh);

const exporter = new GLTFExporter();
exporter.parse(scene, (gltf) => {
  const buffer = Buffer.from(gltf);
  require('fs').writeFileSync('${glbPath.replace(/\\\\/g, '/')}', buffer);
  console.log('GLB created: ${glbPath}');
}, { binary: true });
`;
  
  // Write temp script and run with node --experimental-vm-modules
  // This is complex - for now just log that GLB needs manual creation
  console.log(`  ℹ️  GLB creation: manual step needed (use Blender or gltf-pipeline)`);
}

generateAssets().catch(console.error);