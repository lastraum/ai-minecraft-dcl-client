import { engine, Transform, Entity, MeshRenderer, Material, MeshCollider, TextShape, InputAction, PointerEventType } from '@dcl/sdk/ecs'
import { Vector3, Quaternion, Color4 } from '@dcl/sdk/math'
import { createVoxelSystem } from './systems/voxel-system'
import { createTerrainGenerator, BiomeSettings, DEFAULT_BIOME_SETTINGS } from './terrain/terrain-generator'
import { movePlayerTo } from '~system/RestrictedActions'
import { MAIN_SCENE_SIZE, DEBUG, TERRAIN_GENERATION_DELAY, PLAYER_TELEPORT_DELAY, VISIBILITY_THRESHOLD, SPAWN_POSITION, MAIN_SCENE_POSITION, BIOME_CUSTOMIZATION_ENABLED, BIOME_CONFIG, SPAWN_PARCEL_X_OFFSET } from './resources'
import { setupUi } from './ui/ui' 
import { toggleSplashScreen } from './ui/splashScreen'
import { setOnApplySettings, toggleBiomeSettings } from './ui/biomeSettings'
import * as utils from '@dcl-sdk/utils'
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
let voxelSystemInstance: any

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
  
  // Initialize terrain generator with random settings
  terrainGeneratorInstance = createTerrainGenerator(MAIN_SCENE_SIZE, DEBUG.MAX_LAYERS, currentBiomeSettings)
  
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
      hasCompletedInitialization = true
    }
  }
  
  // Step 3: Teleport player after fixed delay (no model loading check)
  if (!isPlayerTeleported) {
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

  // Set up the voxel system with grid and face visibility optimization
  console.log('Setting up optimized voxel rendering system')
  voxelSystemInstance = createVoxelSystem(
    engine, 
    voxelPositions, 
    VISIBILITY_THRESHOLD,
    DEBUG.MAX_ENTITIES,
    DEBUG,
    SPAWN_PARCEL_X_OFFSET
  )
  
  // Preload voxels around the teleport location
  // This ensures that when the player teleports, there will already be voxels visible
  const centerX = MAIN_SCENE_POSITION.x
  const centerY = 0 // Start at y=0 to load everything from the ground up
  const centerZ = MAIN_SCENE_POSITION.z
  const preloadRadius = 30 // Preload a larger area than the visibility threshold
  
  console.log(`Preloading voxels around teleport location (${centerX}, ${centerY}, ${centerZ})`)
  voxelSystemInstance.preloadAroundLocation(centerX, centerY, centerZ, preloadRadius)

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
  
  // Create a new terrain generator with the new settings
  terrainGeneratorInstance = createTerrainGenerator(MAIN_SCENE_SIZE, DEBUG.MAX_LAYERS, settings)
  
  // Generate new terrain
  const voxelPositions = terrainGeneratorInstance.generateTerrain()
  console.log(`Regenerated ${voxelPositions.length} voxels with custom settings`)
  
  // Create new voxel system
  voxelSystemInstance = createVoxelSystem(
    engine, 
    voxelPositions, 
    VISIBILITY_THRESHOLD,
    DEBUG.MAX_ENTITIES,
    DEBUG,
    SPAWN_PARCEL_X_OFFSET
  )
  
  console.log('Terrain regeneration complete!')
}

// Clean up existing voxels
function cleanupExistingVoxels() {
  if (voxelSystemInstance) {
    // If we have active entities from the previous voxel system, remove them
    voxelSystemInstance.activeEntities.forEach((entity: Entity) => {
      engine.removeEntity(entity)
    })
  }
}

// Teleport the player to the main scene area
function teleportPlayerToMainScene() {
  console.log('Step 3: Teleporting player to main scene')

  // Calculate a safe height for the teleport pad
  // Base terrain height (12) + variation (8) + tree height (7) + safety margin (5) = 32
  // This ensures we're above the tallest possible terrain features
  const safeHeight = 32

  // Create a larger landing pad that stays longer
  let teleportpad = engine.addEntity()
  Transform.create(teleportpad, {
    position: Vector3.create(96, safeHeight, 80),
    rotation: Quaternion.fromEulerDegrees(90, 0, 0),
    scale: Vector3.create(100, 100, 1) // Larger pad to ensure player doesn't miss it
  })
  
  MeshRenderer.setPlane(teleportpad) // Make it visible so players can see where they're landing
  Material.setPbrMaterial(teleportpad, {
    albedoColor: { r: 0.2, g: 0.8, b: 0.8, a: 0.7 } // Transparent blue
  })
  MeshCollider.setPlane(teleportpad)

  // Teleport the player to the safe height
  movePlayerTo({
    newRelativePosition: {
      x: MAIN_SCENE_POSITION.x,
      y: safeHeight + 2, // Place player slightly above the pad
      z: MAIN_SCENE_POSITION.z
    }
  })
  
  console.log('Player teleported to main scene')
  toggleSplashScreen()
  
  // After teleporting, trigger one more preload around the player position
  // to ensure nearest voxels are loaded before removing the teleport pad
  utils.timers.setTimeout(() => {
    // The player may have moved, so get current position for accurate preloading
    const playerTransform = Transform.getMutableOrNull(engine.PlayerEntity)
    if (playerTransform) {
      console.log('Preloading voxels around player\'s current position')
      voxelSystemInstance.preloadAroundLocation(
        playerTransform.position.x,
        playerTransform.position.y - 10, // Preload below the player
        playerTransform.position.z,
        20 // Smaller radius for more focused loading
      )
    }
    
    // Set a timer to remove the teleport pad after sufficient time
    utils.timers.setTimeout(() => {
      console.log('Removing teleport pad')
      engine.removeEntity(teleportpad)
    }, 30000) // 15 more seconds after preloading
  }, 5000) // Wait 5 seconds after teleport before preloading
  
  // Show biome settings hint
  if (BIOME_CUSTOMIZATION_ENABLED) {
    console.log('Press B to customize biome settings')
    // Show a UI hint for biome settings (optional)
  }
}