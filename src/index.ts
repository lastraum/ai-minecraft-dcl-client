import { engine, Transform, Entity, MeshRenderer, Material, MeshCollider, TextShape, InputAction, PointerEventType } from '@dcl/sdk/ecs'
import { Vector3, Quaternion, Color4 } from '@dcl/sdk/math'
import { createVoxelSystem } from './systems/voxel-system'
import { createTerrainGenerator, BiomeSettings, DEFAULT_BIOME_SETTINGS } from './terrain/terrain-generator'
import { initChunkManager } from './systems/chunk-manager'
import { movePlayerTo } from '~system/RestrictedActions'
import { CHUNK_SIZE, MAIN_SCENE_SIZE, DEBUG, TERRAIN_GENERATION_DELAY, PLAYER_TELEPORT_DELAY, VISIBILITY_THRESHOLD, SPAWN_POSITION, MAIN_SCENE_POSITION, BIOME_CUSTOMIZATION_ENABLED, BIOME_CONFIG } from './resources'
import { setupUi } from './ui/ui' 
import { toggleSplashScreen } from './ui/splashScreen'
import { setOnApplySettings, toggleBiomeSettings } from './ui/biomeSettings'

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

// Store current biome settings
let currentBiomeSettings: BiomeSettings = {...DEFAULT_BIOME_SETTINGS}

// Track entities for cleanup during regeneration
let voxelEntities: Entity[] = []

export function main() {
  console.log('Initializing Minecraft voxel world...')
  
  setupUi()
  
  // Setup biome settings callback
  if (BIOME_CUSTOMIZATION_ENABLED) {
    setOnApplySettings(regenerateTerrainWithSettings)
  }
  
  // Phase 1: Initial setup
  setupScene()
  
  // Add system for handling timed events
  engine.addSystem(timerSystem)
}

// Generate random biome settings within the defined ranges
function generateRandomBiomeSettings(): BiomeSettings {
  // Helper function to get random number in range
  const randomInRange = (min: number, max: number): number => {
    return min + Math.random() * (max - min)
  }
  
  // Create random settings within the defined ranges
  return {
    beachSize: randomInRange(BIOME_CONFIG.BEACH_SIZE_MIN, BIOME_CONFIG.BEACH_SIZE_MAX),
    lakeEnabled: Math.random() > 0.3, // 70% chance of having a lake
    lakeSize: randomInRange(BIOME_CONFIG.LAKE_SIZE_MIN, BIOME_CONFIG.LAKE_SIZE_MAX),
    lakeDepth: Math.floor(randomInRange(BIOME_CONFIG.LAKE_DEPTH_MIN, BIOME_CONFIG.LAKE_DEPTH_MAX)),
    treeDensity: randomInRange(BIOME_CONFIG.TREE_DENSITY_MIN, BIOME_CONFIG.TREE_DENSITY_MAX),
    cabinsEnabled: Math.random() > 0.5, // 50% chance of having cabins
    cabinDensity: randomInRange(BIOME_CONFIG.CABIN_DENSITY_MIN, BIOME_CONFIG.CABIN_DENSITY_MAX),
    terrainHeight: Math.floor(randomInRange(BIOME_CONFIG.TERRAIN_HEIGHT_MIN, BIOME_CONFIG.TERRAIN_HEIGHT_MAX)),
    terrainVariation: Math.floor(randomInRange(BIOME_CONFIG.TERRAIN_VARIATION_MIN, BIOME_CONFIG.TERRAIN_VARIATION_MAX))
  }
}

// Setup the initial scene elements
function setupScene() {
  console.log('Step 1: Setting up scene')
  
  // Generate random biome settings
  currentBiomeSettings = generateRandomBiomeSettings()
  console.log('Generated random biome settings:', JSON.stringify(currentBiomeSettings))
  
  // Initialize managers with random settings
  terrainGeneratorInstance = createTerrainGenerator(MAIN_SCENE_SIZE, DEBUG.MAX_LAYERS, currentBiomeSettings)
  chunkManagerInstance = initChunkManager(CHUNK_SIZE)
  
  // Create a simple flat ground for the spawn area
  createSpawnAreaGround()
}

// Create a simple flat ground in the spawn parcel
function createSpawnAreaGround() {
  console.log('Creating spawn area ground')
  
  // Create a ground platform entity
  const groundEntity = engine.addEntity()
  Transform.create(groundEntity, {
    position: Vector3.create(8,0,8), // Center of spawn parcel
    scale: Vector3.create(16, 16, 1),  // 16x16 meter platform
    rotation: Quaternion.fromEulerDegrees(90, 0, 0)
  })
  
  // Add mesh, material and collider
  MeshRenderer.setPlane(groundEntity)
  Material.setPbrMaterial(groundEntity, {
    albedoColor: { r: 0.2, g: 0.8, b: 0.2, a: 1.0 }, // Green color
  })
  
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
  
  // Generate the terrain using the random settings
  const voxelPositions = terrainGeneratorInstance.generateTerrain()
  console.log(`Generated ${voxelPositions.length} voxels with the following settings:`)
  console.log(JSON.stringify(currentBiomeSettings))

  // Set up the voxel system (without model loading system)
  console.log('Setting up voxel rendering system')
  createVoxelSystem(engine, voxelPositions, chunkManagerInstance, VISIBILITY_THRESHOLD, DEBUG)

  // Mark terrain generation as started
  console.log('Minecraft voxel world terrain generation started!')
}

// Function to regenerate terrain with custom biome settings
function regenerateTerrainWithSettings(settings: BiomeSettings) {
  console.log('Regenerating terrain with custom settings')
  console.log('New Settings:', JSON.stringify(settings))
  
  // Store current settings
  currentBiomeSettings = {...settings}
  
  // Clean up existing voxels
  cleanupExistingVoxels()
  
  // Reset chunk manager
  chunkManagerInstance = initChunkManager(CHUNK_SIZE)
  
  // Create a new terrain generator with the new settings
  terrainGeneratorInstance = createTerrainGenerator(MAIN_SCENE_SIZE, DEBUG.MAX_LAYERS, settings)
  
  // Generate new terrain
  const voxelPositions = terrainGeneratorInstance.generateTerrain()
  console.log(`Regenerated ${voxelPositions.length} voxels with custom settings`)
  
  // Create new voxel system
  createVoxelSystem(engine, voxelPositions, chunkManagerInstance, VISIBILITY_THRESHOLD, DEBUG)
  
  console.log('Terrain regeneration complete!')
}

// Clean up existing voxels
function cleanupExistingVoxels() {
  // Get all voxel entities from chunk manager
  const chunks = chunkManagerInstance.getChunks()
  for (const chunkKey in chunks) {
    const chunk = chunks[chunkKey]
    // Remove all entities in this chunk
    for (const entity of chunk.entities) {
      engine.removeEntity(entity)
    }
    // Clear the chunk's entity list
    chunk.entities = []
  }
}

// Teleport the player to the main scene area
function teleportPlayerToMainScene() {
  console.log('Step 3: Teleporting player to main scene')
  
  // Use Decentraland's movePlayerTo function to teleport the player
  movePlayerTo({
    newRelativePosition: MAIN_SCENE_POSITION
  })
  
  console.log('Player teleported to main scene')
  toggleSplashScreen()
  
  // Show biome settings hint
  if (BIOME_CUSTOMIZATION_ENABLED) {
    console.log('Press B to customize biome settings')
    // Show a UI hint for biome settings (optional)
  }
}