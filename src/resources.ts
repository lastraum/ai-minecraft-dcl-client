export let slug = 'lastslice-voxel-world'

// Debug settings
export const DEBUG = {
  ALWAYS_VISIBLE: true, // Set to true to make all voxels visible regardless of distance
  MAX_LAYERS: 0        // Maximum number of vertical layers to generate (for performance testing)
}

// Scene configuration
export const MAIN_SCENE_SIZE = 160 // 160x160 voxel grid for main scene (10x10 parcels)
export const CHUNK_SIZE = 4 // 4x4x4 chunks
export const VISIBILITY_THRESHOLD = 20 // Increased visibility threshold for larger scene

// Scene positions
export const SPAWN_POSITION = {x: 8, y: 0, z: 8} // Center of spawn parcel (-1,0)
export const MAIN_SCENE_POSITION = {x: 80, y: 80, z: 80} // Center of the 10x10 grid

// Timing configuration (in seconds)
export const TERRAIN_GENERATION_DELAY = 15 // Wait 1 second before generating terrain
export const PLAYER_TELEPORT_DELAY = 30 // Wait 5 seconds before teleporting player

// Biome Settings Configuration
export const BIOME_CONFIG = {
  // Beach settings range
  BEACH_SIZE_MIN: 0,
  BEACH_SIZE_MAX: 0.5,
  BEACH_SIZE_STEP: 0.01,
  
  // Lake settings range
  LAKE_SIZE_MIN: 0.1,
  LAKE_SIZE_MAX: 0.4,
  LAKE_SIZE_STEP: 0.01,
  
  LAKE_DEPTH_MIN: 1,
  LAKE_DEPTH_MAX: 10,
  LAKE_DEPTH_STEP: 1,
  
  // Tree density range
  TREE_DENSITY_MIN: 0.01,
  TREE_DENSITY_MAX: 0.1,
  TREE_DENSITY_STEP: 0.01,
  
  // Cabin density range
  CABIN_DENSITY_MIN: 0.1,
  CABIN_DENSITY_MAX: 1.0,
  CABIN_DENSITY_STEP: 0.01,
  
  // Terrain height range
  TERRAIN_HEIGHT_MIN: 5,
  TERRAIN_HEIGHT_MAX: 12,
  TERRAIN_HEIGHT_STEP: 1,
  
  // Terrain variation range
  TERRAIN_VARIATION_MIN: 1,
  TERRAIN_VARIATION_MAX: 8,
  TERRAIN_VARIATION_STEP: 1
}

// UI Settings
export const UI_CONFIG = {
  BIOME_SETTINGS_PANEL_WIDTH: 400,
  BIOME_SETTINGS_PANEL_HEIGHT: "auto",
  BIOME_SETTINGS_MARGIN_TOP: 50,
  BIOME_SETTINGS_MARGIN_RIGHT: 50,
  BIOME_SETTINGS_PADDING: 20,
  
  // Element sizes
  HEADER_HEIGHT: 30,
  CONTROL_HEIGHT: 20,
  BUTTON_HEIGHT: 30,
  
  // Font sizes
  HEADER_FONT_SIZE: 18,
  LABEL_FONT_SIZE: 14,
  BUTTON_FONT_SIZE: 14,
  
  // Colors
  PANEL_BACKGROUND: { r: 0.2, g: 0.2, b: 0.2, a: 0.9 }
}

// Key to enable/disable biome customization feature
export const BIOME_CUSTOMIZATION_ENABLED = true


