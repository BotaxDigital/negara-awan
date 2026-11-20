#!/usr/bin/env python3
"""
Blender Render Script — NEGARA DIATAS AWAN Episode 1
Jalankan di Blender: blender --background --python render_episode1.py
Atau: Buka Blender → Scripting → Paste → Run
"""

import bpy
import os
import math
from mathutils import Vector, Euler

# ============================================
# KONFIGURASI
# ============================================

PROJECT_DIR = r"C:\Users\saidk\Documents\negara-awan"
AUDIO_DIR = os.path.join(PROJECT_DIR, "packages", "assets", "audio")
OUTPUT_PATH = os.path.join(PROJECT_DIR, "packages", "episodes", "assets", "video", "ep01-pendirian.mp4")

# Scene timing (frames @ 30fps)
SCENES = [
    {"id": "s01_hook", "start": 0, "end": 120, "voice": "vo_s01_hook.wav"},
    {"id": "s02_lore", "start": 120, "end": 660, "voice": "vo_s02_lore_intro.wav"},
    {"id": "s03_entrance", "start": 660, "end": 780, "voice": "vo_s03_presiden_entrance.wav"},
    {"id": "s04_oath", "start": 780, "end": 1140, "voice": "vo_s04_sumpah.wav"},
    {"id": "s05_register", "start": 1140, "end": 1590, "voice": "vo_s05_buka_pendaftaran.wav"},
    {"id": "s06_teaser", "start": 1590, "end": 1860, "voice": "vo_s06_teaser_ep2.wav"},
    {"id": "s07_cta", "start": 1860, "end": 2160, "voice": "vo_s07_cta.wav"},
]

TOTAL_FRAMES = 2160  # 72 detik @ 30fps untuk test, ganti 5400 untuk 3 menit
FPS = 30
RESOLUTION_X = 1920
RESOLUTION_Y = 1080

# Warna negara (RGB 0-1)
COLORS = {
    "sky": (0.12, 0.23, 0.37),      # #1E3A5F
    "cloud": (0.49, 0.83, 0.99),    # #7DD3FC
    "sun": (0.99, 0.88, 0.28),      # #FDE047
    "dark": (0.06, 0.09, 0.16),     # #0F172A
    "skin": (0.99, 0.73, 0.46),     # #FDBA74
    "white": (1.0, 1.0, 1.0),
    "green": (0.13, 0.77, 0.37),    # #22C55E
}

# ============================================
# UTILITAS
# ============================================

def clear_scene():
    """Hapus semua object, material, mesh"""
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    for block in bpy.data.meshes:
        if block.users == 0:
            bpy.data.meshes.remove(block)
    for block in bpy.data.materials:
        if block.users == 0:
            bpy.data.materials.remove(block)

def create_material(name, color, emission=0.0, roughness=0.5, metalness=0.0, alpha=1.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    
    output = nodes.new('ShaderNodeOutputMaterial')
    principled = nodes.new('ShaderNodeBsdfPrincipled')
    principled.inputs['Base Color'].default_value = (*color, 1)
    principled.inputs['Roughness'].default_value = roughness
    principled.inputs['Metallic'].default_value = metalness
    principled.inputs['Alpha'].default_value = alpha
    
    if emission > 0:
        emission_node = nodes.new('ShaderNodeEmission')
        emission_node.inputs['Color'].default_value = (*color, 1)
        emission_node.inputs['Strength'].default_value = emission
        links.new(emission_node.outputs['Emission'], output.inputs['Surface'])
    else:
        links.new(principled.outputs['BSDF'], output.inputs['Surface'])
    
    if alpha < 1.0:
        mat.blend_method = 'BLENDED'
        mat.shadow_method = 'HASHED'
    
    return mat

def add_keyframe(obj, prop, frame, value):
    setattr(obj, prop, value)
    obj.keyframe_insert(data_path=prop, frame=frame)

# ============================================
# SETUP SCENE
# ============================================

def setup_scene():
    clear_scene()
    
    scene = bpy.context.scene
    scene.frame_start = 0
    scene.frame_end = TOTAL_FRAMES
    scene.render.fps = FPS
    scene.render.resolution_x = RESOLUTION_X
    scene.render.resolution_y = RESOLUTION_Y
    scene.render.resolution_percentage = 100
    scene.render.filepath = OUTPUT_PATH
    scene.render.image_settings.file_format = 'FFMPEG'
    scene.render.ffmpeg.format = 'MPEG4'
    scene.render.ffmpeg.codec = 'H264'
    scene.render.ffmpeg.constant_rate_factor = 'MEDIUM'
    scene.render.ffmpeg.audio_codec = 'AAC'
    scene.render.ffmpeg.audio_bitrate = 128
    
    # Viewport shading
    for area in bpy.context.screen.areas:
        if area.type == 'VIEW_3D':
            for space in area.spaces:
                if space.type == 'VIEW_3D':
                    space.shading.type = 'RENDERED'
                    space.shading.use_scene_lights = True
                    space.shading.use_scene_world = True

# ============================================
# WORLD & LIGHTING
# ============================================

def setup_world():
    world = bpy.data.worlds.new("World")
    bpy.context.scene.world = world
    world.use_nodes = True
    nodes = world.node_tree.nodes
    links = world.node_tree.links
    nodes.clear()
    
    bg = nodes.new('ShaderNodeBackground')
    bg.inputs['Color'].default_value = (*COLORS["sky"], 1)
    bg.inputs['Strength'].default_value = 0.5
    
    output = nodes.new('ShaderNodeOutputWorld')
    links.new(bg.outputs['Background'], output.inputs['Surface'])

def setup_lighting():
    # Sun light
    sun_data = bpy.data.lights.new("Sun", 'SUN')
    sun_data.energy = 3.0
    sun_data.color = COLORS["sun"]
    sun_obj = bpy.data.objects.new("Sun", sun_data)
    sun_obj.rotation_euler = Euler((math.radians(-45), math.radians(30), 0))
    bpy.context.collection.objects.link(sun_obj)
    
    # Fill light
    fill_data = bpy.data.lights.new("Fill", 'AREA')
    fill_data.energy = 100
    fill_data.color = COLORS["cloud"]
    fill_data.size = 50
    fill_obj = bpy.data.objects.new("Fill", fill_data)
    fill_obj.location = (-20, 20, 20)
    bpy.context.collection.objects.link(fill_obj)
    
    # Rim light
    rim_data = bpy.data.lights.new("Rim", 'SPOT')
    rim_data.energy = 200
    rim_data.color = COLORS["sun"]
    rim_obj = bpy.data.objects.new("Rim", rim_data)
    rim_obj.location = (0, -30, 40)
    rim_obj.rotation_euler = Euler((math.radians(-60), 0, 0))
    bpy.context.collection.objects.link(rim_obj)

# ============================================
# CAMERA
# ============================================

def setup_camera():
    cam_data = bpy.data.cameras.new("Camera")
    cam_data.lens = 35
    cam_data.sensor_width = 36
    cam_obj = bpy.data.objects.new("Camera", cam_data)
    bpy.context.collection.objects.link(cam_obj)
    bpy.context.scene.camera = cam_obj
    return cam_obj

# ============================================
# PROCEDURAL ASSETS
# ============================================

def create_ground():
    """Ground plane - cloud"""
    bpy.ops.mesh.primitive_plane_add(size=200, location=(0, 0, -0.1))
    ground = bpy.context.object
    ground.name = "Ground"
    mat = create_material("GroundMat", COLORS["white"], roughness=0.9, alpha=0.15)
    ground.data.materials.append(mat)
    return ground

def create_cloud_city(center_x=0, center_y=0, count=30):
    """Procedural cloud city buildings"""
    buildings = []
    for i in range(count):
        angle = (i / count) * 2 * math.pi
        radius = 80 + math.sin(i * 1.7) * 20
        x = center_x + math.cos(angle) * radius
        y = center_y + math.sin(angle) * radius
        height = 10 + abs(math.sin(i * 2.3)) * 40
        
        # Building base
        bpy.ops.mesh.primitive_cube_add(size=1, location=(x, y, height/2))
        building = bpy.context.object
        building.name = f"Building_{i}"
        building.scale = (3 + math.sin(i) * 1.5, 3 + math.sin(i) * 1.5, height)
        
        # Material
        hue = 0.58
        sat = 0.3
        val = 0.2 + (i % 5) * 0.05
        rgb = colorsys_hsv_to_rgb(hue, sat, val)
        mat = create_material(f"BuildingMat_{i}", rgb, roughness=0.7, metalness=0.1)
        building.data.materials.append(mat)
        
        # Glowing windows plane
        bpy.ops.mesh.primitive_plane_add(size=1, location=(x, y, height/2 + 2))
        windows = bpy.context.object
        windows.name = f"Windows_{i}"
        windows.scale = (3, 1, 3)
        windows.rotation_euler = (0, 0, 0)
        win_mat = create_material(f"WindowMat_{i}", COLORS["sun"], emission=5.0, alpha=0.3)
        windows.data.materials.append(win_mat)
        windows.parent = building
        
        buildings.append(building)
    return buildings

def create_floating_clouds(count=20):
    """Floating cloud particles"""
    clouds = []
    for i in range(count):
        # Cloud as 3 spheres
        cloud_group = bpy.data.objects.new(f"Cloud_{i}", None)
        bpy.context.collection.objects.link(cloud_group)
        
        for j in range(3):
            bpy.ops.mesh.primitive_uv_sphere_add(radius=5 + math.sin(i+j) * 3, 
                location=(math.sin(i*0.7) * 150, math.cos(i*0.5) * 30 + 80, math.cos(i*0.7) * 150))
            sphere = bpy.context.object
            sphere.name = f"CloudPart_{i}_{j}"
            sphere.scale = (1.5, 1, 1.5)
            mat = create_material(f"CloudMat_{i}_{j}", COLORS["white"], alpha=0.15)
            sphere.data.materials.append(mat)
            sphere.parent = cloud_group
        
        clouds.append(cloud_group)
    return clouds

def create_flag():
    """Flag pole + 3 stripes"""
    flag_group = bpy.data.objects.new("Flag", None)
    bpy.context.collection.objects.link(flag_group)
    
    # Pole
    bpy.ops.mesh.primitive_cylinder_add(radius=0.3, depth=60, location=(0, 0, 30))
    pole = bpy.context.object
    pole.name = "FlagPole"
    mat = create_material("PoleMat", COLORS["cloud"], roughness=0.3, metalness=0.5)
    pole.data.materials.append(mat)
    pole.parent = flag_group
    
    # Flag cloth - 3 stripes
    cloth_group = bpy.data.objects.new("FlagCloth", None)
    bpy.context.collection.objects.link(cloth_group)
    cloth_group.parent = flag_group
    cloth_group.location = (4, 0, 55)
    cloth_group.rotation_euler = (0, 0, -math.pi/2)
    
    stripes = [
        (COLORS["sky"], (0, 10, 0)),
        (COLORS["white"], (0, 0, 0)),
        (COLORS["sun"], (0, -10, 0)),
    ]
    
    for color, pos in stripes:
        bpy.ops.mesh.primitive_plane_add(size=1, location=pos)
        stripe = bpy.context.object
        stripe.scale = (20, 6.67, 1)
        mat = create_material(f"StripeMat_{color}", color)
        stripe.data.materials.append(mat)
        stripe.parent = cloth_group
    
    # Center circle + stars
    bpy.ops.mesh.primitive_circle_add(radius=8, location=(0, 0, 0.5))
    circle = bpy.context.object
    circle.scale = (1, 1, 1)
    mat = create_material("CircleMat", COLORS["dark"])
    circle.data.materials.append(mat)
    circle.parent = cloth_group
    
    return flag_group

def create_monument():
    """Central monument with obelisk"""
    mon_group = bpy.data.objects.new("Monument", None)
    bpy.context.collection.objects.link(mon_group)
    
    # Base platform
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 2, 0))
    base = bpy.context.object
    base.scale = (30, 4, 30)
    mat = create_material("MonumentMat", COLORS["sky"], roughness=0.5, metalness=0.2)
    base.data.materials.append(mat)
    base.parent = mon_group
    
    # Steps
    for i in range(5):
        bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 4 + i*1.5, 0))
        step = bpy.context.object
        step.scale = (25 - i*3, 1.5, 25 - i*3)
        step.data.materials.append(mat)
        step.parent = mon_group
    
    # Obelisk
    bpy.ops.mesh.primitive_cylinder_add(radius=1, depth=1, location=(0, 50, 0))
    obelisk = bpy.context.object
    obelisk.scale = (4, 80, 4)
    mat2 = create_material("ObeliskMat", COLORS["dark"], roughness=0.3, metalness=0.4)
    obelisk.data.materials.append(mat2)
    obelisk.parent = mon_group
    
    # Tip
    bpy.ops.mesh.primitive_cone_add(radius1=3, depth=8, location=(0, 92, 0))
    tip = bpy.context.object
    mat3 = create_material("TipMat", COLORS["sun"], roughness=0.2, metalness=0.6)
    tip.data.materials.append(mat3)
    tip.parent = mon_group
    
    # Glowing lines
    for i in range(7):
        bpy.ops.mesh.primitive_torus_add(location=(0, 12 + i*11, 0), major_radius=4.1, minor_radius=0.1)
        ring = bpy.context.object
        mat4 = create_material(f"RingMat_{i}", COLORS["cloud"], emission=2.0)
        ring.data.materials.append(mat4)
        ring.parent = mon_group
    
    # Pillars
    for i in range(8):
        angle = i * math.pi / 4
        bpy.ops.mesh.primitive_cylinder_add(radius=1, depth=1, 
            location=(math.cos(angle)*20, 15, math.sin(angle)*20))
        pillar = bpy.context.object
        pillar.scale = (2, 30, 2)
        mat5 = create_material(f"PillarMat_{i}", COLORS["cloud"], roughness=0.4, metalness=0.3)
        pillar.data.materials.append(mat5)
        pillar.parent = mon_group
        
        # Top sphere
        bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=(math.cos(angle)*20, 32, math.sin(angle)*20))
        top = bpy.context.object
        top.scale = (2.5, 2.5, 2.5)
        mat6 = create_material(f"TopMat_{i}", COLORS["sun"])
        top.data.materials.append(mat6)
        top.parent = mon_group
    
    return mon_group

def create_president():
    """Low-poly president character"""
    pres_group = bpy.data.objects.new("President", None)
    bpy.context.collection.objects.link(pres_group)
    
    # Body
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 5, 0))
    body = bpy.context.object
    body.scale = (4, 10, 2.5)
    mat = create_material("PresBodyMat", COLORS["sky"], roughness=0.6, metalness=0.1)
    body.data.materials.append(mat)
    body.parent = pres_group
    
    # Sash
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 5, 1.5))
    sash = bpy.context.object
    sash.scale = (4.2, 10.2, 0.1)
    mat2 = create_material("SashMat", COLORS["sun"], alpha=0.8)
    sash.data.materials.append(mat2)
    sash.parent = pres_group
    
    # Head
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=(0, 13, 0))
    head = bpy.context.object
    head.scale = (2.5, 3, 2.5)
    mat3 = create_material("HeadMat", COLORS["skin"], roughness=0.8)
    head.data.materials.append(mat3)
    head.parent = pres_group
    
    # Eyes
    for eye_x in [-0.7, 0.7]:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.1, location=(eye_x, 13.3, 1.5))
        eye = bpy.context.object
        eye.scale = (0.3, 0.3, 0.3)
        mat4 = create_material("EyeMat", COLORS["dark"])
        eye.data.materials.append(mat4)
        eye.parent = pres_group
    
    # Legs
    for leg_x in [-1, 1]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.5, depth=1, location=(leg_x, -1.5, 0))
        leg = bpy.context.object
        leg.scale = (1, 10, 1)
        mat5 = create_material("LegMat", COLORS["sky"], roughness=0.6, metalness=0.1)
        leg.data.materials.append(mat5)
        leg.parent = pres_group
        
        # Foot
        bpy.ops.mesh.primitive_cube_add(size=1, location=(leg_x, -11, 0))
        foot = bpy.context.object
        foot.scale = (1.2, 2, 1.2)
        mat6 = create_material("FootMat", COLORS["dark"])
        foot.data.materials.append(mat6)
        foot.parent = pres_group
    
    # Arms
    for arm_x, rot_z in [(-3.5, 0), (3.5, 0)]:
        bpy.ops.mesh.primitive_cylinder_add(radius=0.5, depth=1, location=(arm_x, 8, 0))
        arm = bpy.context.object
        arm.scale = (1, 8, 1)
        mat7 = create_material("ArmMat", COLORS["skin"], roughness=0.8)
        arm.data.materials.append(mat7)
        arm.parent = pres_group
        
        # Hand
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.5, location=(arm_x, -9, 0))
        hand = bpy.context.object
        hand.scale = (1.2, 2, 1.2)
        mat8 = create_material("HandMat", COLORS["skin"], roughness=0.8)
        hand.data.materials.append(mat8)
        hand.parent = pres_group
    
    # Badge
    bpy.ops.mesh.primitive_circle_add(vertices=5, radius=1, location=(0, 10, 1.8))
    badge = bpy.context.object
    mat9 = create_material("BadgeMat", COLORS["sun"])
    badge.data.materials.append(mat9)
    badge.parent = pres_group
    
    return pres_group

def create_parliament():
    """Parliament building"""
    parl_group = bpy.data.objects.new("Parliament", None)
    bpy.context.collection.objects.link(parl_group)
    
    # Base
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 5, 0))
    base = bpy.context.object
    base.scale = (40, 10, 30)
    mat = create_material("ParlMat", COLORS["sky"], roughness=0.7, metalness=0.1)
    base.data.materials.append(mat)
    base.parent = parl_group
    
    # Columns
    for i in range(8):
        for z in [-12, 12]:
            bpy.ops.mesh.primitive_cylinder_add(radius=1, depth=1, location=(-30 + i*8.5, 20, z))
            col = bpy.context.object
            col.scale = (2, 30, 2)
            col_mat = create_material(f"ColMat_{i}_{z}", COLORS["cloud"], roughness=0.5, metalness=0.2)
            col.data.materials.append(col_mat)
            col.parent = parl_group
    
    # Dome
    bpy.ops.mesh.primitive_uv_sphere_add(radius=1, location=(0, 40, 0))
    dome = bpy.context.object
    dome.scale = (25, 15, 25)
    dome_mat = create_material("DomeMat", COLORS["sky"], roughness=0.3, metalness=0.3)
    dome.data.materials.append(dome_mat)
    dome.parent = parl_group
    
    return parl_group

def create_registration_form():
    """UI form panel"""
    form_group = bpy.data.objects.new("RegForm", None)
    bpy.context.collection.objects.link(form_group)
    form_group.location = (-60, 20, 30)
    
    # Panel
    bpy.ops.mesh.primitive_cube_add(size=1)
    panel = bpy.context.object
    panel.scale = (40, 50, 1)
    mat = create_material("FormPanelMat", COLORS["dark"], alpha=0.9)
    panel.data.materials.append(mat)
    panel.parent = form_group
    
    # Title bar
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 20, 1))
    title = bpy.context.object
    title.scale = (30, 2, 1)
    mat2 = create_material("TitleMat", COLORS["sun"])
    title.data.materials.append(mat2)
    title.parent = form_group
    
    # Fields
    for i, y in enumerate([10, 0, -10]):
        bpy.ops.mesh.primitive_cube_add(size=1, location=(0, y, 1))
        field = bpy.context.object
        field.scale = (35, 4, 1)
        mat3 = create_material(f"FieldMat_{i}", COLORS["sky"], alpha=0.8)
        field.data.materials.append(mat3)
        field.parent = form_group
    
    # Submit button
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -22, 1))
    btn = bpy.context.object
    btn.scale = (20, 5, 1)
    mat4 = create_material("BtnMat", COLORS["sun"])
    btn.data.materials.append(mat4)
    btn.parent = form_group
    
    return form_group

def create_comment_stream():
    """Comment stream panel"""
    stream_group = bpy.data.objects.new("CommentStream", None)
    bpy.context.collection.objects.link(stream_group)
    stream_group.location = (60, 20, 30)
    
    bpy.ops.mesh.primitive_cube_add(size=1)
    panel = bpy.context.object
    panel.scale = (40, 50, 1)
    mat = create_material("StreamPanelMat", COLORS["dark"], alpha=0.9)
    panel.data.materials.append(mat)
    panel.parent = stream_group
    
    # Comment cards
    for i, y in enumerate([15, 9, 3]):
        bpy.ops.mesh.primitive_cube_add(size=1, location=(0, y, 0.5))
        card = bpy.context.object
        card.scale = (36, 5, 1)
        mat2 = create_material(f"CardMat_{i}", COLORS["sky"], alpha=0.7)
        card.data.materials.append(mat2)
        card.parent = stream_group
    
    return stream_group

def create_countdown_timer():
    timer_group = bpy.data.objects.new("CountdownTimer", None)
    bpy.context.collection.objects.link(timer_group)
    timer_group.location = (0, 80, 40)
    timer_group.scale = (1.5, 1.5, 1.5)
    
    bpy.ops.mesh.primitive_cube_add(size=1)
    timer = bpy.context.object
    timer.scale = (15, 4, 1)
    mat = create_material("TimerMat", COLORS["dark"], alpha=0.9)
    timer.data.materials.append(mat)
    timer.parent = timer_group
    
    return timer_group

def create_silhouette_crowd(count=50):
    crowd_group = bpy.data.objects.new("SilhouetteCrowd", None)
    bpy.context.collection.objects.link(crowd_group)
    
    for i in range(count):
        angle = i * 0.3
        x = math.sin(angle) * 60 + (i % 7 - 3) * 5
        z = math.cos(angle) * 60 + (i % 5 - 2) * 5
        
        person = bpy.data.objects.new(f"Person_{i}", None)
        bpy.context.collection.objects.link(person)
        person.location = (x, 0, z)
        person.parent = crowd_group
        
        # Body
        bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 2, 0))
        body = bpy.context.object
        body.scale = (1, 4, 0.5)
        mat = create_material("CrowdMat", COLORS["dark"])
        body.data.materials.append(mat)
        body.parent = person
        
        # Head
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.5, location=(0, 4.5, 0))
        head = bpy.context.object
        head.scale = (0.8, 0.8, 0.8)
        head.data.materials.append(mat)
        head.parent = person
        
        # Arms raised
        for arm_x in [-1.2, 1.2]:
            bpy.ops.mesh.primitive_cylinder_add(radius=0.15, depth=1, location=(arm_x, 3, 0))
            arm = bpy.context.object
            arm.rotation_euler = (0, 0, math.pi/4 if arm_x < 0 else -math.pi/4)
            arm.scale = (0.3, 3.2, 0.3)
            arm.data.materials.append(mat)
            arm.parent = person
    
    return crowd_group

def create_growing_buildings(count=10):
    buildings_group = bpy.data.objects.new("GrowingBuildings", None)
    bpy.context.collection.objects.link(buildings_group)
    
    for i in range(count):
        angle = i * 0.8
        x = math.sin(angle) * 80
        z = math.cos(angle) * 80
        
        bpy.ops.mesh.primitive_cube_add(size=1, location=(x, 0, z))
        building = bpy.context.object
        building.scale = (6, 0.1, 6)  # Start flat
        building.parent = buildings_group
        
        mat = create_material(f"GrowMat_{i}", 
            [COLORS["sky"], COLORS["dark"], (0.2, 0.26, 0.33)][i % 3], 
            roughness=0.7, metalness=0.1)
        building.data.materials.append(mat)
        
        # Store target height for animation
        building["target_height"] = 10 + (i % 5) * 8
    
    return buildings_group

def create_question_mark():
    q_group = bpy.data.objects.new("QuestionMark", None)
    bpy.context.collection.objects.link(q_group)
    q_group.location = (40, 50, -20)
    
    # Curve part
    bpy.ops.mesh.primitive_torus_add(location=(0, 0, 0), major_radius=1, minor_radius=0.3)
    curve = bpy.context.object
    mat = create_material("QMarkMat", COLORS["sun"])
    curve.data.materials.append(mat)
    curve.parent = q_group
    
    # Dot
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.4, location=(0, -3, 0))
    dot = bpy.context.object
    dot.data.materials.append(mat)
    dot.parent = q_group
    
    return q_group

def create_logo():
    logo_group = bpy.data.objects.new("Logo", None)
    bpy.context.collection.objects.link(logo_group)
    
    # Ring
    bpy.ops.mesh.primitive_torus_add(location=(0, 0, -1), major_radius=12, minor_radius=0.2)
    ring = bpy.context.object
    mat = create_material("RingMat", COLORS["sky"])
    ring.data.materials.append(mat)
    ring.parent = logo_group
    
    # 7 stars
    for i in range(7):
        angle = i * 2 * math.pi / 7
        bpy.ops.mesh.primitive_circle_add(vertices=5, radius=1, location=(math.cos(angle)*9, math.sin(angle)*9, 0))
        star = bpy.context.object
        star.scale = (1.5, 1.5, 1.5)
        star_mat = create_material(f"StarMat_{i}", COLORS["sun"])
        star.data.materials.append(star_mat)
        star.parent = logo_group
    
    # Center cloud mountain (simplified plane)
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, 0, 0.5))
    center = bpy.context.object
    center.scale = (8, 10, 1)
    center_mat = create_material("CenterMat", COLORS["white"])
    center.data.materials.append(center_mat)
    center.parent = logo_group
    
    return logo_group

# ============================================
# ANIMATION HELPERS
# ============================================

def animate_camera(cam_obj):
    """Camera animation for each scene"""
    # Scene 1: Wide aerial → dolly to monument
    cam_obj.location = (0, 200, 300)
    cam_obj.rotation_euler = (math.radians(-60), 0, 0)
    cam_obj.keyframe_insert("location", frame=0)
    cam_obj.keyframe_insert("rotation_euler", frame=0)
    
    cam_obj.location = (0, 100, 150)
    cam_obj.rotation_euler = (math.radians(-45), 0, 0)
    cam_obj.keyframe_insert("location", frame=450)
    cam_obj.keyframe_insert("rotation_euler", frame=450)
    
    # Scene 2: Static on UI
    cam_obj.location = (0, 80, 120)
    cam_obj.rotation_euler = (math.radians(-30), 0, 0)
    cam_obj.keyframe_insert("location", frame=450)
    cam_obj.keyframe_insert("rotation_euler", frame=450)
    cam_obj.keyframe_insert("location", frame=1350)
    cam_obj.keyframe_insert("rotation_euler", frame=1350)
    
    # Scene 3: Low angle to podium
    cam_obj.location = (-60, 30, 100)
    cam_obj.rotation_euler = (math.radians(-15), 0, 0)
    cam_obj.keyframe_insert("location", frame=1350)
    cam_obj.keyframe_insert("rotation_euler", frame=1350)
    
    cam_obj.location = (-20, 25, 60)
    cam_obj.rotation_euler = (math.radians(-10), 0, 0)
    cam_obj.keyframe_insert("location", frame=1500)
    cam_obj.keyframe_insert("rotation_euler", frame=1500)
    
    # Scene 4: Medium close-up → wide
    cam_obj.location = (-30, 35, 50)
    cam_obj.rotation_euler = (math.radians(-20), 0, 0)
    cam_obj.keyframe_insert("location", frame=1500)
    cam_obj.keyframe_insert("rotation_euler", frame=1500)
    
    cam_obj.location = (-10, 40, 40)
    cam_obj.keyframe_insert("location", frame=1800)
    
    cam_obj.location = (-40, 30, 70)
    cam_obj.keyframe_insert("location", frame=2160)
    
    # Scene 5: Split screen view
    cam_obj.location = (0, 50, 150)
    cam_obj.rotation_euler = (math.radians(-15), 0, 0)
    cam_obj.keyframe_insert("location", frame=2160)
    cam_obj.keyframe_insert("rotation_euler", frame=2160)
    cam_obj.keyframe_insert("location", frame=2700)
    cam_obj.keyframe_insert("rotation_euler", frame=2700)
    
    # Scene 6: Fast cuts
    cam_obj.location = (-80, 60, 100)
    cam_obj.keyframe_insert("location", frame=2700)
    cam_obj.location = (80, 60, -50)
    cam_obj.keyframe_insert("location", frame=2970)
    
    # Scene 7: Centered static
    cam_obj.location = (0, 0, 100)
    cam_obj.rotation_euler = (0, 0, 0)
    cam_obj.keyframe_insert("location", frame=2970)
    cam_obj.keyframe_insert("rotation_euler", frame=2970)
    cam_obj.keyframe_insert("location", frame=3240)
    cam_obj.keyframe_insert("rotation_euler", frame=3240)

def animate_president(pres_obj, scene_obj):
    """President walking to podium"""
    # Find president meshes
    body = None
    head = None
    for child in pres_obj.children_recursive:
        if "Body" in child.name:
            body = child
        elif "Head" in child.name:
            head = child
    
    if not body:
        return
    
    # Walk cycle
    for frame in range(1350, 1500):
        progress = (frame - 1350) / 150
        x = -80 + progress * 80
        bob = abs(math.sin(progress * 4 * math.pi)) * 0.5
        swing = math.sin(progress * 4 * math.pi) * 0.5
        
        pres_obj.location.x = x
        pres_obj.location.z = 0
        body.location.z = 5 + bob
        pres_obj.keyframe_insert("location", frame=frame)
        body.keyframe_insert("location", frame=frame)
    
    # Oath animation
    for frame in range(1500, 2160):
        progress = (frame - 1500) / 660
        if progress < 0.4:
            # Right arm up
            pass  # Arm animation would need bone rigging

def animate_flag(flag_obj, start_frame, end_frame):
    """Flag raising"""
    cloth = None
    for child in flag_obj.children_recursive:
        if child.name == "FlagCloth":
            cloth = child
            break
    
    if cloth:
        cloth.scale = (0, 0, 0)
        cloth.keyframe_insert("scale", frame=start_frame)
        cloth.scale = (1, 1, 1)
        cloth.keyframe_insert("scale", frame=start_frame + 60)

def animate_buildings_grow(buildings_group, start_frame, end_frame):
    """Buildings grow from ground"""
    duration = end_frame - start_frame
    for building in buildings_group.children:
        target_h = building.get("target_height", 20)
        building.scale.z = 0.1
        building.keyframe_insert("scale", frame=start_frame)
        building.scale.z = target_h
        building.keyframe_insert("scale", frame=end_frame)

def animate_clouds(clouds, total_frames):
    """Clouds floating"""
    for i, cloud in enumerate(clouds):
        for frame in range(0, total_frames, 30):
            t = frame / 30
            x = math.sin(i * 0.7 + t * 0.1) * 150
            y = 80 + math.cos(i * 0.5) * 30 + math.sin(t * 0.05 + i) * 30
            z = math.cos(i * 0.7 + t * 0.1) * 150
            cloud.location = (x, y, z)
            cloud.keyframe_insert("location", frame=frame)

def animate_silhouette_crowd(crowd_group, start_frame, end_frame):
    """Crowd appears and sways"""
    duration = end_frame - start_frame
    for i, person in enumerate(crowd_group.children):
        delay = i * 2
        person.scale = (0, 0, 0)
        person.keyframe_insert("scale", frame=start_frame + delay)
        person.scale = (1, 1, 1)
        person.keyframe_insert("scale", frame=start_frame + delay + 30)

def animate_question_mark(q_obj, start_frame, end_frame):
    """Question mark bounce"""
    for frame in range(start_frame, end_frame):
        t = (frame - start_frame) / 30
        if t > 0.6:
            q_obj.location.y = 50 + math.sin(t * 4) * 2
            q_obj.rotation_euler.z = t * 0.5
            q_obj.keyframe_insert("location", frame=frame)
            q_obj.keyframe_insert("rotation_euler", frame=frame)
        q_obj.scale = (max(0, (t - 0.6) * 7.5),) * 3
        q_obj.keyframe_insert("scale", frame=frame)

def animate_cta_elements(logo_obj, start_frame, end_frame):
    """CTA logo zoom, text fade, button pulse"""
    duration = end_frame - start_frame
    
    # Logo zoom + rotate
    logo_obj.scale = (0, 0, 0)
    logo_obj.keyframe_insert("scale", frame=start_frame)
    logo_obj.scale = (1.2, 1.2, 1.2)
    logo_obj.keyframe_insert("scale", frame=start_frame + duration // 3)
    logo_obj.scale = (1, 1, 1)
    logo_obj.keyframe_insert("scale", frame=end_frame)
    
    logo_obj.rotation_euler.z = 0
    logo_obj.keyframe_insert("rotation_euler", frame=start_frame)
    logo_obj.rotation_euler.z = math.pi * 0.5
    logo_obj.keyframe_insert("rotation_euler", frame=end_frame)

# ============================================
# AUDIO SETUP
# ============================================

def setup_audio():
    """Add voiceover audio strips to VSE"""
    # Create VSE sequence editor
    if not bpy.context.scene.sequence_editor:
        bpy.context.scene.sequence_editor_create()
    
    vse = bpy.context.scene.sequence_editor
    
    for scene_info in SCENES:
        voice_file = os.path.join(AUDIO_DIR, scene_info["voice"])
        if os.path.exists(voice_file):
            start_frame = scene_info["start"]
            strip = vse.sequences.new_sound(
                name=f"VO_{scene_info['id']}",
                filepath=voice_file,
                channel=1,
                frame_start=start_frame
            )
            print(f"Added audio: {scene_info['voice']} at frame {start_frame}")

# ============================================
# MAIN
# ============================================

import colorsys

def colorsys_hsv_to_rgb(h, s, v):
    return colorsys.hsv_to_rgb(h, s, v)

def main():
    print("🎬 Starting NEGARA DIATAS AWAN Episode 1 render...")
    
    setup_scene()
    setup_world()
    setup_lighting()
    cam = setup_camera()
    
    print("🏗️ Creating assets...")
    
    # Create all assets
    ground = create_ground()
    buildings = create_cloud_city()
    clouds = create_floating_clouds()
    flag = create_flag()
    monument = create_monument()
    president = create_president()
    parliament = create_parliament()
    reg_form = create_registration_form()
    comment_stream = create_comment_stream()
    countdown = create_countdown_timer()
    crowd = create_silhouette_crowd()
    growing_buildings = create_growing_buildings()
    q_mark = create_question_mark()
    logo = create_logo()
    
    print("🎥 Animating...")
    
    # Animations
    animate_camera(cam)
    animate_flag(flag, 0, 450)
    animate_buildings_grow(growing_buildings, 2700, 2970)
    animate_clouds(clouds, TOTAL_FRAMES)
    animate_silhouette_crowd(crowd, 2700, 2970)
    animate_question_mark(q_mark, 2700, 2970)
    animate_cta_elements(logo, 2970, 3240)
    
    # President entrance
    animate_president(president, monument)
    
    # Scene visibility (hide/show based on frame)
    # This would need driver or Python frame_change handler
    
    print("🔊 Setting up audio...")
    setup_audio()
    
    print(f"🎬 Rendering to {OUTPUT_PATH}...")
    bpy.ops.render.render(animation=True, write_still=False)
    
    print("✅ Render complete!")

if __name__ == "__main__":
    main()