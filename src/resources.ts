
// Debug settings
export const DEBUG = {
  ALWAYS_VISIBLE: true, // Set to true to make all voxels visible regardless of distance
  MAX_LAYERS: 1        // Maximum number of vertical layers to generate (for performance testing)
}

// Scene configuration
export const MAIN_SCENE_SIZE = 32 // 32x32 voxel grid for main scene (2x2 parcels)
export const CHUNK_SIZE = 4 // 4x4x4 chunks
export const VISIBILITY_THRESHOLD = 5 // Increased visibility threshold for larger scene

// Scene positions
export const SPAWN_POSITION = {x: 8, y: 0, z: 8} // Center of spawn parcel (-1,0)
export const MAIN_SCENE_POSITION = {x: 16, y: 30, z: 16}

// Timing configuration (in seconds)
export const TERRAIN_GENERATION_DELAY = 1 // Wait 1 second before generating terrain
export const PLAYER_TELEPORT_DELAY = 15 // Wait 5 seconds before teleporting player


