import { engine, Transform, Entity, MeshRenderer, Material, MeshCollider, TextShape, InputAction, PointerEventType } from '@dcl/sdk/ecs'
import { Vector3, Quaternion, Color4 } from '@dcl/sdk/math'
import { createVoxelSystem } from './systems/voxel-system'
import { createTerrainGenerator } from './terrain/terrain-generator'
import { BiomeSettings, DEFAULT_BIOME_SETTINGS } from './resources'
import { movePlayerTo } from '~system/RestrictedActions'
import { MAIN_SCENE_SIZE, DEBUG, TERRAIN_GENERATION_DELAY, PLAYER_TELEPORT_DELAY, VISIBILITY_THRESHOLD, SPAWN_POSITION, MAIN_SCENE_POSITION, BIOME_CUSTOMIZATION_ENABLED, BIOME_CONFIG } from './resources'
import { setupUi } from './ui/ui' 
import { toggleSplashScreen } from './ui/splashScreen'
import { LOADING_BIOME_TIMER, updateLoadingBiomeTimer, showLoadingBiomeUI, chooseLoadingPhrase } from './ui/loadingBiomeUI'
import * as utils from '@dcl-sdk/utils'
import { initializeBiomeSettings, subscribeToBiomeSettings, getBiomeSettings, updateBiomeSettings } from './state/biomeState'
import { show } from './ui/splashScreen'
// Track timing for delays
let terrainGenerationTimer = 0
let playerTeleportTimer = 0
let isTerrainGenerationReady = false
let isPlayerTeleported = false

// Track initialization state
let hasStartedTerrainGeneration = false
let hasCompletedInitialization = false

// Store managers at module level
let terrainGeneratorInstance: any = null
let voxelSystemInstance: any = null

// Store current biome settings
let currentBiomeSettings: BiomeSettings = {...DEFAULT_BIOME_SETTINGS}

// Track entities for cleanup during regeneration
let voxelEntities: Entity[] = []

// Store teleport pad entity reference
let teleportPadEntity: Entity | null = null
let teleportPadRemovalTimer = 0

export function main() {
  console.log('Initializing Minecraft voxel world...')
  
  // Initialize biome settings with random values
  initializeBiomeSettings()
  
  // Get the initial biome settings for later use
  currentBiomeSettings = getBiomeSettings()
  console.log('Initial biome settings:', JSON.stringify(currentBiomeSettings))
  
  setupUi()
  
  // Phase 1: Initial setup is disabled until UI is ready
  // setupScene()
  
  // Add system for handling timed events
  // engine.addSystem(timerSystem)
}

// Setup the initial scene elements
export function setupScene() {
  console.log('Step 1: Setting up scene')

  engine.addSystem(timerSystem)
  
  // Use the current biome settings from state manager
  currentBiomeSettings = getBiomeSettings()
  console.log('Using biome settings:', JSON.stringify(currentBiomeSettings))
  
  // Initialize terrain generator with current settings
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
  // createInformationSign()
}
// Timer system to handle delayed initialization
function timerSystem(dt: number): void {

  if(show){
    if(LOADING_BIOME_TIMER <= 0){
      chooseLoadingPhrase()
    }else{
      updateLoadingBiomeTimer(dt)
    }
  }

  // Skip if initialization is complete and player is teleported
  if (hasCompletedInitialization && isPlayerTeleported) {
    // Handle teleport pad removal even after initialization is complete
    if (teleportPadRemovalTimer > 0 && teleportPadEntity) {
      teleportPadRemovalTimer -= dt;
      if (teleportPadRemovalTimer <= 0) {
        console.log('Removing teleport pad');
        engine.removeEntity(teleportPadEntity);
        teleportPadEntity = null;
          toggleSplashScreen()
      }
    }
    return;
  }
  
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
  try {
    voxelSystemInstance = createVoxelSystem(
      engine, 
      voxelPositions, 
      VISIBILITY_THRESHOLD,
      DEBUG.MAX_ENTITIES,
      DEBUG
    )
    
    if (!voxelSystemInstance) {
      throw new Error('Voxel system creation returned null')
    }
    
    console.log('Voxel system created successfully')
    console.log('Grid size:', voxelSystemInstance.grid.size)
    console.log('Active entities:', voxelSystemInstance.activeEntities.length)
    
    // Preload voxels around the teleport location
    // This ensures that when the player teleports, there will already be voxels visible
    const centerX = MAIN_SCENE_POSITION.x
    const centerY = 0 // Start at y=0 to load everything from the ground up
    const centerZ = MAIN_SCENE_POSITION.z
    const preloadRadius = 80 // Cover the majority of the 10x10 grid
    
    console.log(`Preloading voxels around teleport location (${centerX}, ${centerY}, ${centerZ})`)
    const preloadedCount = voxelSystemInstance.preloadAroundLocation(centerX, centerY, centerZ, preloadRadius)
    console.log(`Successfully preloaded ${preloadedCount} voxels`)
    
    // Mark terrain generation as started
    console.log('Minecraft voxel world terrain generation started!')
  } catch (error) {
    console.error('Error during terrain generation:', error)
    // Reset the voxel system instance if there was an error
    voxelSystemInstance = null
  }
}

// Function to regenerate terrain with custom biome settings
function regenerateTerrainWithSettings(settings: BiomeSettings) {
  console.log('Regenerating terrain with custom settings')
  console.log('New Settings:', JSON.stringify(settings))
  
  // Store current settings
  currentBiomeSettings = {...settings}
  
  // Update the biome state
  updateBiomeSettings(settings)
  
  // Clean up existing voxels
  cleanupExistingVoxels()
  
  // Create a new terrain generator with the new settings
  terrainGeneratorInstance = createTerrainGenerator(MAIN_SCENE_SIZE, DEBUG.MAX_LAYERS, settings)
  
  // Generate new terrain
  const voxelPositions = terrainGeneratorInstance.generateTerrain()
  console.log(`Regenerated ${voxelPositions.length} voxels with custom settings`)
  
  try {
    // Create new voxel system
    voxelSystemInstance = createVoxelSystem(
      engine, 
      voxelPositions, 
      VISIBILITY_THRESHOLD,
      DEBUG.MAX_ENTITIES,
      DEBUG
    )
    
    if (!voxelSystemInstance) {
      throw new Error('Voxel system creation returned null')
    }
    
    console.log('Terrain regeneration complete!')
  } catch (error) {
    console.error('Error during terrain regeneration:', error)
    voxelSystemInstance = null
  }
}

// Clean up existing voxels
function cleanupExistingVoxels() {
  if (voxelSystemInstance && voxelSystemInstance.activeEntities) {
    // If we have active entities from the previous voxel system, remove them
    voxelSystemInstance.activeEntities.forEach((entity: Entity) => {
      engine.removeEntity(entity)
    })
  }
  // Reset the voxel system instance
  voxelSystemInstance = null
}

// Teleport the player to the main scene area
function teleportPlayerToMainScene() {
  console.log('Step 3: Teleporting player to main scene')

  // Find the tallest non-water voxel in the terrain
  let highestPoint = 0;
  
  if (voxelSystemInstance && voxelSystemInstance.grid) {
    // Scan the area around the teleport position
    const scanRadius = 5; // Scan a small area around the teleport point
    const centerX = Math.floor(MAIN_SCENE_POSITION.x);
    const centerZ = Math.floor(MAIN_SCENE_POSITION.z);
    
    // Loop through the area to find the highest non-water point
    for (let x = centerX - scanRadius; x <= centerX + scanRadius; x++) {
      for (let z = centerZ - scanRadius; z <= centerZ + scanRadius; z++) {
        // Scan from top to bottom to find the first solid block
        for (let y = 50; y >= 0; y--) { // Start from a reasonably high point
          const voxel = voxelSystemInstance.grid.get(x, y, z);
          if (voxel && voxel.type !== 'water') {
            if (y > highestPoint) {
              highestPoint = y;
            }
            break; // Found highest point at this x,z coordinate
          }
        }
      }
    }
    
    console.log(`Found highest non-water point at y=${highestPoint}`);
  } else {
    console.log('Voxel system not ready, using default height');
    // Default to a safe height if we can't determine terrain height
    highestPoint = 15;
  }

  // Add a safety margin to ensure we're above the terrain
  const teleportHeight = highestPoint + 10;

  // Create a landing pad at the appropriate height
  teleportPadEntity = engine.addEntity()
  Transform.create(teleportPadEntity, {
    position: Vector3.create(
      MAIN_SCENE_POSITION.x, 
      teleportHeight, 
      MAIN_SCENE_POSITION.z
    ),
    rotation: Quaternion.fromEulerDegrees(90, 0, 0),
    scale: Vector3.create(5, 5, 1) // Cover the entire 10x10 grid
  })
  
  MeshRenderer.setPlane(teleportPadEntity) // Make it visible so players can see where they're landing
  Material.setPbrMaterial(teleportPadEntity, {
    albedoColor: { r: 0.2, g: 0.8, b: 0.8, a: 0.7 } // Transparent blue
  })
  MeshCollider.setPlane(teleportPadEntity)

  // Teleport the player to above the highest point
  movePlayerTo({
    newRelativePosition: {
      x: MAIN_SCENE_POSITION.x,
      y: teleportHeight + 2, // Place player slightly above the pad
      z: MAIN_SCENE_POSITION.z
    }
  })
  
  console.log(`Player teleported to main scene at height ${teleportHeight + 2}`);
  
  // Start the timer to remove the teleport pad after 20 seconds
  teleportPadRemovalTimer = 50 // 50 seconds
  
  // After teleporting, trigger one more preload around the player position
  // to ensure nearest voxels are loaded before removing the teleport pad
  utils.timers.setTimeout(() => {
    // Check if voxel system is still valid
    if (!voxelSystemInstance) {
      console.error('Voxel system not available for preloading')
      return
    }

    // The player may have moved, so get current position for accurate preloading
    const playerTransform = Transform.getMutableOrNull(engine.PlayerEntity)
    if (!playerTransform) {
      console.error('Player transform not found for preloading')
      return
    }

    console.log('Preloading voxels around player\'s current position')
    try {
      const preloadedCount = voxelSystemInstance.preloadAroundLocation(
        playerTransform.position.x,
        playerTransform.position.y - 10, // Preload below the player
        playerTransform.position.z,
        50 // Larger radius for better coverage
      )
      console.log(`Successfully preloaded ${preloadedCount} voxels around player`)
    } catch (error) {
      console.error('Error preloading voxels around player:', error)
    }
  }, 5000) // Wait 5 seconds after teleport before preloading
  
  // Show biome settings hint
  if (BIOME_CUSTOMIZATION_ENABLED) {
    console.log('Press B to customize biome settings')
    // Show a UI hint for biome settings (optional)
  }
}