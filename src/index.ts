import { engine } from '@dcl/sdk/ecs'
import { createVoxelSystem } from './systems/voxel-system'
import { createTerrainGenerator } from './terrain/terrain-generator'
import { initChunkManager } from './systems/chunk-manager'

// Scene configuration
const SCENE_SIZE = 16 // 16x16x16 voxel grid
const CHUNK_SIZE = 4 // 4x4x4 chunks
const VISIBILITY_THRESHOLD = 16 // 16m visibility threshold

export function main() {
  // Initialize managers and systems
  const terrainGenerator = createTerrainGenerator(SCENE_SIZE)
  const chunkManager = initChunkManager(CHUNK_SIZE)

  // Generate the terrain
  console.log('Generating terrain...')
  const voxelPositions = terrainGenerator.generateTerrain()
  console.log(`Generated ${voxelPositions.length} voxels`)

  // Set up the voxel system
  createVoxelSystem(engine, voxelPositions, chunkManager, VISIBILITY_THRESHOLD)

  // Log that scene setup is complete
  console.log('Minecraft voxel world initialized successfully!')
}