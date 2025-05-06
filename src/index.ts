import { engine } from '@dcl/sdk/ecs'
import { createVoxelSystem } from './systems/voxel-system'
import { createTerrainGenerator } from './terrain/terrain-generator'
import { initChunkManager } from './systems/chunk-manager'
import { createSpawnPlane, removeSpawnPlane } from './systems/spawn-plane-system'
import { initModelLoadingSystem } from './systems/model-loading-system'

// Scene configuration
const SCENE_SIZE = 16 // 16x16x16 voxel grid
const CHUNK_SIZE = 4 // 4x4x4 chunks
const VISIBILITY_THRESHOLD = 16 // 16m visibility threshold

// Timing configuration (in seconds)
const SPAWN_PLANE_SETUP_DELAY = 0 // Wait 0 second for spawn plane to load
const TERRAIN_GENERATION_DELAY = 5 // Wait 5 seconds before generating terrain

// Track timing for delays
let spawnPlaneTimer = 0
let terrainGenerationTimer = 0
let isSpawnPlaneReady = false
let isTerrainGenerationReady = false

// Track initialization state
let hasStartedTerrainGeneration = false
let hasCompletedInitialization = false

// Store managers at module level
let terrainGeneratorInstance: any
let chunkManagerInstance: any

export function main() {
  console.log('Initializing Minecraft voxel world...')
  
  // Step 1: Create the spawn plane for player to stand on during loading
  console.log('Step 1: Creating spawn plane')
  createSpawnPlane()
  
  // Step 2: Wait for spawn plane to be fully loaded - handled by timer system
  console.log('Step 2: Waiting for spawn plane to be loaded')
  
  // Add system for handling timed events
  engine.addSystem(timerSystem)
}

// Timer system to handle delayed initialization
function timerSystem(dt: number): void {
  // Skip if initialization is complete
  if (hasCompletedInitialization) return
  
  // Step 2: Wait for spawn plane to be ready
  if (!isSpawnPlaneReady) {
    spawnPlaneTimer += dt
    if (spawnPlaneTimer >= SPAWN_PLANE_SETUP_DELAY) {
      isSpawnPlaneReady = true
      console.log('Spawn plane ready')
    }
  }
  
  // Step 3-4: Start terrain generation preparation
  if (isSpawnPlaneReady && !hasStartedTerrainGeneration) {
    console.log('Step 3: Setting up managers')
    hasStartedTerrainGeneration = true
    
    // Prepare managers but don't generate terrain yet
    terrainGeneratorInstance = createTerrainGenerator(SCENE_SIZE)
    chunkManagerInstance = initChunkManager(CHUNK_SIZE)
    
    console.log('Step 4: Waiting before terrain generation')
    // Terrain generation will begin after another delay
  }
  
  // Step 5-6: Generate terrain and complete initialization after delay
  if (hasStartedTerrainGeneration && !isTerrainGenerationReady) {
    terrainGenerationTimer += dt
    if (terrainGenerationTimer >= TERRAIN_GENERATION_DELAY) {
      isTerrainGenerationReady = true
      completeInitialization()
    }
  }
}

// Function to complete initialization by generating terrain and setting up systems
function completeInitialization() {
  // Initialize the model loading system
  initModelLoadingSystem(() => {
    // This will be called when all models are loaded (or after timeout)
    // Remove the spawn plane when everything is loaded
    removeSpawnPlane()
    console.log('Scene fully loaded, spawn plane removed')
  })
  
  // Generate the terrain
  console.log('Step 5: Generating terrain...')
  const voxelPositions = terrainGeneratorInstance.generateTerrain()
  console.log(`Generated ${voxelPositions.length} voxels`)

  // Set up the voxel system
  console.log('Step 6: Setting up voxel rendering system')
  createVoxelSystem(engine, voxelPositions, chunkManagerInstance, VISIBILITY_THRESHOLD)

  // Mark initialization as complete
  hasCompletedInitialization = true
  
  // Log that scene setup is complete
  console.log('Minecraft voxel world initialized successfully!')
}

// Declare global namespace for window to store our variables
declare global {
  interface Window {
    terrainGenerator: any
    chunkManager: any
  }
}