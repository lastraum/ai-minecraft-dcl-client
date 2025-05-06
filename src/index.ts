import { engine, Transform, Entity, MeshRenderer, Material, MeshCollider, TextShape } from '@dcl/sdk/ecs'
import { Vector3, Quaternion, Color4 } from '@dcl/sdk/math'
import { createVoxelSystem } from './systems/voxel-system'
import { createTerrainGenerator } from './terrain/terrain-generator'
import { initChunkManager } from './systems/chunk-manager'
import { movePlayerTo } from '~system/RestrictedActions'

// Scene configuration
const MAIN_SCENE_SIZE = 32 // 32x32 voxel grid for main scene (2x2 parcels)
const CHUNK_SIZE = 4 // 4x4x4 chunks
const VISIBILITY_THRESHOLD = 5 // Increased visibility threshold for larger scene

// Scene positions
const SPAWN_POSITION = Vector3.create(8, 0, 8) // Center of spawn parcel (-1,0)
const MAIN_SCENE_POSITION = {x: 16, y: 30, z: 16}

// Timing configuration (in seconds)
const TERRAIN_GENERATION_DELAY = 1 // Wait 1 second before generating terrain
const PLAYER_TELEPORT_DELAY = 15 // Wait 5 seconds before teleporting player

// Track timing for delays
let terrainGenerationTimer = 0
let playerTeleportTimer = 0
let isTerrainGenerationReady = false
let isPlayerTeleported = false

// Track initialization state
let hasStartedTerrainGeneration = false
let hasCompletedInitialization = false

// Store managers at module level
let terrainGeneratorInstance: any
let chunkManagerInstance: any

export function main() {
  console.log('Initializing Minecraft voxel world...')
  
  // Phase 1: Initial setup
  setupScene()
  
  // Add system for handling timed events
  engine.addSystem(timerSystem)
}

// Setup the initial scene elements
function setupScene() {
  console.log('Step 1: Setting up scene')
  
  // Initialize managers
  terrainGeneratorInstance = createTerrainGenerator(MAIN_SCENE_SIZE)
  chunkManagerInstance = initChunkManager(CHUNK_SIZE)
  
  // Create a simple flat ground for the spawn area
  createSpawnAreaGround()
}

// Create a simple flat ground in the spawn parcel
function createSpawnAreaGround() {
  console.log('Creating spawn area ground')
  
  // Create a ground platform entity
//   const groundEntity = engine.addEntity()
//   Transform.create(groundEntity, {
//     position: Vector3.create(-8, 0, -8), // Center of spawn parcel
//     scale: Vector3.create(16, 0.1, 16),  // 16x16 meter platform
//   })
  
//   // Add mesh, material and collider
//   MeshRenderer.setPlane(groundEntity)
//   Material.setPbrMaterial(groundEntity, {
//     albedoColor: { r: 0.2, g: 0.8, b: 0.2, a: 1.0 }, // Green color
//   })
//   MeshCollider.setPlane(groundEntity)
  
  // Add a sign to inform the player
  createInformationSign()
}

// Create an information sign to guide the player
function createInformationSign() {
  // Create sign entity
  const signEntity = engine.addEntity()
  
  // Position it in the spawn area (-1,0 parcel)
  Transform.create(signEntity, {
    position: Vector3.create(8, 1.5, 8), // Center of spawn parcel
    rotation: Quaternion.fromEulerDegrees(0, 90, 0) // Face the player toward +X
  })
  
  // Add text to the sign
  TextShape.create(signEntity, {
    text: 'Welcome to Minecraft World!\nLoading terrain...\nYou will be teleported shortly.',
    fontSize: 2,
    textColor: Color4.create(1, 1, 1, 1), // White text
    outlineColor: Color4.create(0, 0, 0, 1), // Black outline
    outlineWidth: 0.1,
    width: 10,
    height: 5,
    textWrapping: true
  })
}

// Timer system to handle delayed initialization
function timerSystem(dt: number): void {
  // Skip if initialization is complete and player is teleported
  if (hasCompletedInitialization && isPlayerTeleported) return
  
  // Step 2: Start terrain generation after delay
  if (!hasStartedTerrainGeneration) {
    terrainGenerationTimer += dt
    if (terrainGenerationTimer >= TERRAIN_GENERATION_DELAY) {
      startTerrainGeneration()
      hasStartedTerrainGeneration = true
      // Start counting for player teleport immediately after terrain generation starts
      playerTeleportTimer = 0
      hasCompletedInitialization = true
    }
  }
  
  // Step 3: Teleport player after fixed delay (no model loading check)
  if (hasStartedTerrainGeneration && !isPlayerTeleported) {
    playerTeleportTimer += dt
    if (playerTeleportTimer >= PLAYER_TELEPORT_DELAY) {
      teleportPlayerToMainScene()
      isPlayerTeleported = true
    }
  }
}

// Start the terrain generation process
function startTerrainGeneration() {
  console.log('Step 2: Starting terrain generation...')
  
  // Generate the terrain
  const voxelPositions = terrainGeneratorInstance.generateTerrain()
  console.log(`Generated ${voxelPositions.length} voxels`)

  // Set up the voxel system (without model loading system)
  console.log('Setting up voxel rendering system')
  createVoxelSystem(engine, voxelPositions, chunkManagerInstance, VISIBILITY_THRESHOLD)

  // Mark terrain generation as started
  console.log('Minecraft voxel world terrain generation started!')
}

// Teleport the player to the main scene area
function teleportPlayerToMainScene() {
  console.log('Step 3: Teleporting player to main scene')
  
  // Use Decentraland's movePlayerTo function to teleport the player
  movePlayerTo({
    newRelativePosition: MAIN_SCENE_POSITION
  })
  
  console.log('Player teleported to main scene')
}

// Declare global namespace for window to store our variables
declare global {
  interface Window {
    terrainGenerator: any
    chunkManager: any
  }
}