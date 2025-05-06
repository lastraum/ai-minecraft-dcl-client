# Voxel Models

This directory should contain the following model files for the Minecraft-like voxel world:

## Base Block Types
- `grass.glb` - Green grass block for the top layer of terrain
- `dirt.glb` - Brown dirt block for layers just below the surface
- `stone_dark.glb` - Gray stone block for deeper layers

## World Enhancement Block Types

The following block types have been added to implement biomes and more variety:

- `sand.glb` - Yellow/tan sand block for beaches
- `woodplanks.glb` - Wood planks for tree trunks
- `leaves.glb` - Green leaf block for tree foliage
- `wood_plank_light_red.glb` - Light reddish wood planks for cabin walls
- `wood_plank_dark.glb` - Dark wood planks for cabin floors and roofs
- `water.glb` - Transparent blue water block for lakes

## Special Properties

- Water blocks have transparency and no collision
- Other blocks have standard collision for physics and pointer interactions

## How to Create New Block Models

1. Start with one of the existing blocks as a template
2. Modify the materials/textures to match the new block type
3. Save as a new GLB file with the appropriate name
4. Keep the same dimensions and origin point as the existing blocks

## Optimization

These models should be optimized for Decentraland with a low triangle count (ideally less than 100 triangles per block) to ensure good performance when many blocks are rendered.

## Texturing

For best results, use simple textures with the Minecraft-style pixelated look. You can use texture atlases to reduce draw calls if you plan to expand to more block types in the future. 