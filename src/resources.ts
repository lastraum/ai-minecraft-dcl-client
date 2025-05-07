export let slug = 'lastslice-voxel-world'

// Debug settings
export const DEBUG = {
  ALWAYS_VISIBLE: true, // Set to true to make all voxels visible regardless of distance
  MAX_LAYERS: 0,        // Maximum number of vertical layers to generate (for performance testing)
  MAX_ENTITIES: 10000   // Maximum number of voxel entities to create at once
}

// Scene configuration
export const MAIN_SCENE_SIZE = 160 // 160x160 voxel grid for main scene (10x10 parcels)
export const CHUNK_SIZE = 4 // 4x4x4 chunks
export const VISIBILITY_THRESHOLD = 100 // Visibility threshold for voxels

// Chunk loading configuration
export const HORIZONTAL_VISIBILITY_THRESHOLD = 80 // Threshold for horizontal chunks
export const VERTICAL_VISIBILITY_THRESHOLD = 15 // Threshold for vertical chunks
export const HORIZONTAL_PRIORITY_FACTOR = 0.7 // Priority factor for horizontal loading

// Scene positions
export const SPAWN_POSITION = {x: 80, y: 0, z: 80} // Center of the 10x10 grid
export const MAIN_SCENE_POSITION = {x: 80, y: 80, z: 80} // Center of the 10x10 grid

// Timing configuration (in seconds)
export const TERRAIN_GENERATION_DELAY = 20 // Wait 20 seconds before generating terrain
export const PLAYER_TELEPORT_DELAY = 15 // Wait 15 seconds before teleporting player

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

// Model paths for block types
export const MODEL_PATHS = {
  'grass': 'models/grass.glb',
  'dirt': 'models/dirt.glb',
  'stone_dark': 'models/stone_dark.glb',
  'sand': 'models/sand.glb',
  'wood': 'models/woodplanks.glb',
  'leaves': 'models/leaves.glb',
  'wood_plank_light_red': 'models/wood_plank_light_red.glb',
  'wood_plank_dark': 'models/wood_plank_dark.glb',
  'water': 'models/water.glb'
}




// Define the voxel position interface with block type
export interface VoxelPosition {
    x: number
    y: number
    z: number
    type: BlockType
  }
  
  // Define block types
  export enum BlockType {
    GRASS = 'grass',
    DIRT = 'dirt',
    STONE_DARK = 'stone_dark',
    SAND = 'sand',
    WOOD = 'wood',
    LEAVES = 'leaves',
    WOOD_PLANK_LIGHT_RED = 'wood_plank_light_red',
    WOOD_PLANK_DARK = 'wood_plank_dark',
    WATER = 'water'
  }
  
  // Define biome settings interface for user customization
  export interface BiomeSettings {
    // Beach settings
    beachSize: number; // 0.0 to 1.0 - percentage of map for beach
    
    // Lake settings
    lakeEnabled: boolean;
    lakeSize: number; // 0.0 to 1.0 - size of the lake
    lakeDepth: number; // Water depth in blocks
    
    // Forest settings
    treeDensity: number; // 0.0 to 1.0 - probability of tree placement
    
    // Cabin settings
    cabinsEnabled: boolean;
    cabinDensity: number; // 0.0 to 1.0 - probability of cabin placement in suitable areas
    
    // Terrain settings
    terrainHeight: number; // Base height of terrain
    terrainVariation: number; // Variation factor for sine wave amplitude
  }
  
  // Default biome settings
  export const DEFAULT_BIOME_SETTINGS: BiomeSettings = {
    beachSize: 0.3,
    lakeEnabled: true,
    lakeSize: 0.2,
    lakeDepth: 6,
    treeDensity: 0.03,
    cabinsEnabled: true,
    cabinDensity: 0.7,
    terrainHeight: 8,
    terrainVariation: 4
  }