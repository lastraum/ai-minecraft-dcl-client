# Minecraft Voxel World for Decentraland

This is a basic Minecraft-like voxel world for Decentraland, built with SDK7.

## Setup

1. Make sure you have Node.js and npm installed
2. Install the Decentraland SDK: `npm install -g @dcl/sdk@latest`
3. Add the required models in the models directory:
   - `grass.glb` - For the surface layer
   - `dirt.glb` - For sub-surface layers
   - `stone.glb` - For deep layers

## Running the Scene

1. Open a terminal in this directory
2. Run `npm install` (if you haven't already)
3. Run `npm start`
4. Open your browser at `http://localhost:8000`

## Implementation Features

- **Block Types**: Different block types (grass, dirt, stone) based on depth
- **Procedural Terrain**: Uses a sine-based heightmap to generate terrain
- **Chunk Management**: Divides the world into 4x4x4 chunks for optimization
- **Visibility System**: Only renders voxels near the player (within 16m)

## Implementation Plan Progress

✅ Set up basic Decentraland scene
✅ Organize scene structure
✅ Implement terrain generation
✅ Create chunk management system
✅ Add visibility optimization
✅ Support multiple block types

## TODO

- Implement player interaction (add/remove blocks)
- Add physics and collision
- Add more block types and biomes

## Troubleshooting

- If you encounter model loading issues, make sure your .glb files are in the models directory
- If the scene is empty, check the browser console for error messages
- If performance is poor, try reducing the visibility threshold in index.ts 