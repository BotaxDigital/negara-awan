#!/usr/bin/env python3
"""
Blender Script: Batch Convert Images to GLB Planes
Jalankan di Blender: blender --background --python batch_images_to_glb.py
Atau: Copy paste ke Blender Scripting tab -> Run
"""

import bpy
import os
import glob
from pathlib import Path

# ============================================
# KONFIGURASI
# ============================================
IMAGES_DIR = r"C:\Users\saidk\Documents\negara-awan\packages\assets\generated"
GLB_OUTPUT_DIR = r"C:\Users\saidk\Documents\negara-awan\packages\assets\models"

# Asset categories dan skala plane mereka
ASSET_SPECS = {
    'building_': {'scale': (2, 10, 2), 'name_prefix': 'building'},
    'avatar_': {'scale': (1, 2, 0.5), 'name_prefix': 'avatar'},
    'flag_': {'scale': (3, 2, 0.1), 'name_prefix': 'flag'},
    'ui_': {'scale': (4, 2, 0.1), 'name_prefix': 'ui_hologram'},
}

def clear_scene():
    """Hapus semua object di scene"""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()

def create_plane_with_texture(image_path, scale, name):
    """Buat plane dengan texture image"""
    # Buat plane
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, 0))
    plane = bpy.context.active_object
    plane.name = name
    plane.scale = scale
    
    # Buat material
    mat = bpy.data.materials.new(name=f"{name}_mat")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    
    # Clear default nodes
    nodes.clear()
    
    # Add nodes
    output = nodes.new('ShaderNodeOutputMaterial')
    bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    tex_image = nodes.new('ShaderNodeTexImage')
    tex_coord = nodes.new('ShaderNodeTexCoord')
    mapping = nodes.new('ShaderNodeMapping')
    
    # Load image
    img = bpy.data.images.load(image_path)
    tex_image.image = img
    tex_image.interpolation = 'Linear'
    
    # Configure BSDF for emission (hologram look) or standard
    if 'ui_' in name or 'hologram' in name:
        # Emission for hologram
        emission = nodes.new('ShaderNodeEmission')
        emission.inputs['Strength'].default_value = 1.5
        links.new(tex_image.outputs['Color'], emission.inputs['Color'])
        links.new(tex_image.outputs['Alpha'], emission.inputs['Strength'])
        links.new(emission.outputs['Emission'], output.inputs['Surface'])
        # Set blend mode
        mat.blend_method = 'BLENDED'
        mat.shadow_method = 'NONE'
        mat.use_backface_culling = False
    else:
        # Standard PBR
        bsdf.inputs['Base Color'].default_value = (1, 1, 1, 1)
        bsdf.inputs['Alpha'].default_value = 1.0
        links.new(tex_image.outputs['Color'], bsdf.inputs['Base Color'])
        links.new(tex_image.outputs['Alpha'], bsdf.inputs['Alpha'])
        links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])
        mat.blend_method = 'BLENDED'
        mat.shadow_method = 'HASHED'
    
    # Connect texture coordinates
    links.new(tex_coord.outputs['UV'], mapping.inputs['Vector'])
    links.new(mapping.outputs['Vector'], tex_image.inputs['Vector'])
    
    # Assign material
    if plane.data.materials:
        plane.data.materials[0] = mat
    else:
        plane.data.materials.append(mat)
    
    # Set origin to bottom center
    bpy.ops.object.origin_set(type='ORIGIN_CENTER_OF_MASS', center='BOUNDS')
    plane.location.z = scale[1] / 2  # Move up so bottom is at 0
    
    return plane

def export_glb(output_path):
    """Export scene as GLB"""
    bpy.ops.export_scene.gltf(
        filepath=output_path,
        export_format='GLB',
        export_apply=True,
        export_yup=True,
        export_draco_mesh_compression_enable=False,
        export_tangents=False,
        export_animations=False,
    )

def main():
    print("🎨 Starting batch image to GLB conversion...")
    
    if not os.path.exists(IMAGES_DIR):
        print(f"❌ Images directory not found: {IMAGES_DIR}")
        return
    
    if not os.path.exists(GLB_OUTPUT_DIR):
        os.makedirs(GLB_OUTPUT_DIR)
    
    image_files = glob.glob(os.path.join(IMAGES_DIR, "*.png"))
    print(f"📁 Found {len(image_files)} images")
    
    for image_path in image_files:
        filename = os.path.basename(image_path)
        name_no_ext = os.path.splitext(filename)[0]
        
        # Determine asset type from prefix
        asset_type = None
        for prefix in ASSET_SPECS:
            if filename.startswith(prefix):
                asset_type = prefix
                break
        
        if not asset_type:
            print(f"⚠️  Unknown prefix for {filename}, skipping")
            continue
        
        spec = ASSET_SPECS[asset_type]
        glb_name = f"{spec['name_prefix']}_{name_no_ext}.glb"
        glb_path = os.path.join(GLB_OUTPUT_DIR, glb_name)
        
        print(f"🔄 Processing {filename} -> {glb_name}")
        
        clear_scene()
        create_plane_with_texture(image_path, spec['scale'], name_no_ext)
        export_glb(glb_path)
        
        print(f"✅ Exported: {glb_name}")
    
    print("\n🎉 Batch conversion complete!")
    print(f"📁 GLB files in: {GLB_OUTPUT_DIR}")

if __name__ == "__main__":
    main()