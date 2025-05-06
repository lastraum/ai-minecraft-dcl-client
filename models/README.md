# Voxel Models

This directory should contain the following model files for the Minecraft-like voxel world:

- `grass.glb` - Green grass block for the top layer of terrain
- `dirt.glb` - Brown dirt block for layers just below the surface
- `stone.glb` - Gray stone block for deeper layers

Each model should be a 1x1x1 meter cube that will be used to render each voxel in the Minecraft-like world.

## Optimization

These models should be optimized for Decentraland with a low triangle count (ideally less than 100 triangles per block) to ensure good performance when many blocks are rendered.

## Texturing

For best results, use simple textures with the Minecraft-style pixelated look. You can use texture atlases to reduce draw calls if you plan to expand to more block types in the future. 