import { Entity } from "@dcl/sdk/ecs"

//npm run deploy -- --target-content https://worlds-content-server.decentraland.org

export let slug = 'lastslice-voxel-world'

// Debug settings
export const DEBUG = {
  ALWAYS_VISIBLE: false, // Set to true to make all voxels visible regardless of distance
  MAX_LAYERS: 0,        // Maximum number of vertical layers to generate (for performance testing)
  MAX_ENTITIES: 50000   // Maximum number of voxel entities to create at once
}

// Scene configuration
export const MAIN_SCENE_SIZE = 160 // 160x160 voxel grid for main scene (10x10 parcels)
export const CHUNK_SIZE = 4 // 4x4x4 chunks
export const VISIBILITY_THRESHOLD = 100 // Visibility threshold for voxels

// Chunk loading configuration
export const HORIZONTAL_VISIBILITY_THRESHOLD = 100 // Threshold for horizontal chunks
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
  TERRAIN_VARIATION_STEP: 1,
  
  // Cave settings range
  CAVE_DENSITY_MIN: 0.01,
  CAVE_DENSITY_MAX: 0.1,
  CAVE_DENSITY_STEP: 0.01,
  
  CAVE_SIZE_MIN: 1,
  CAVE_SIZE_MAX: 10,
  CAVE_SIZE_STEP: 1,
  
  CAVE_DEPTH_MIN: 1,
  CAVE_DEPTH_MAX: 10,
  CAVE_DEPTH_STEP: 1,
  
  // Hills settings range
  HILL_FREQUENCY_MIN: 0.01,
  HILL_FREQUENCY_MAX: 0.1,
  HILL_FREQUENCY_STEP: 0.01,
  
  HILL_HEIGHT_MIN: 2,
  HILL_HEIGHT_MAX: 15,
  HILL_HEIGHT_STEP: 1,
  
  HILL_STEEPNESS_MIN: 0.1,
  HILL_STEEPNESS_MAX: 2.0,
  HILL_STEEPNESS_STEP: 0.1,
  
  // Vegetation settings range
  FLOWER_DENSITY_MIN: 0,
  FLOWER_DENSITY_MAX: 0.2,
  FLOWER_DENSITY_STEP: 0.01,
  
  GRASS_DENSITY_MIN: 0,
  GRASS_DENSITY_MAX: 0.6,
  GRASS_DENSITY_STEP: 0.05,
  
  BUSH_DENSITY_MIN: 0,
  BUSH_DENSITY_MAX: 0.3,
  BUSH_DENSITY_STEP: 0.01,
  
  // Ore settings range
  ORE_RARITY_MIN: 0.01,
  ORE_RARITY_MAX: 0.2,
  ORE_RARITY_STEP: 0.01,
  
  ORE_VARIETY_MIN: 1,
  ORE_VARIETY_MAX: 5,
  ORE_VARIETY_STEP: 1
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
  WATER = 'water',
  
  // New block types for biomes
  SNOW = 'snow',
  ICE = 'ice',
  FLOWER_RED = 'flower_red',
  FLOWER_YELLOW = 'flower_yellow',
  BUSH = 'bush',
  TALL_GRASS = 'tall_grass',
  
  // Ore types
  COAL_ORE = 'coal_ore',
  IRON_ORE = 'iron_ore',
  GOLD_ORE = 'gold_ore',
  DIAMOND_ORE = 'diamond_ore',
  EMERALD_ORE = 'emerald_ore'
}

// Model paths for block types
export const MODEL_PATHS: Record<BlockType, string> = {
  [BlockType.GRASS]: 'models/grass.glb',
  [BlockType.DIRT]: 'models/dirt.glb',
  [BlockType.STONE_DARK]: 'models/stone_dark.glb',
  [BlockType.SAND]: 'models/sand.glb',
  [BlockType.WOOD]: 'models/woodplanks.glb',
  [BlockType.LEAVES]: 'models/leaves.glb',
  [BlockType.WOOD_PLANK_LIGHT_RED]: 'models/wood_plank_light_red.glb',
  [BlockType.WOOD_PLANK_DARK]: 'models/wood_plank_dark.glb',
  [BlockType.WATER]: 'models/water.glb',
  
  // New block types
  [BlockType.SNOW]: 'models/dirt_snow.glb',
  [BlockType.ICE]: 'models/ice.glb',
  [BlockType.FLOWER_RED]: 'models/flower_red.glb',
  [BlockType.FLOWER_YELLOW]: 'models/flower_yellow.glb',
  [BlockType.BUSH]: 'models/vegetation.glb',
  [BlockType.TALL_GRASS]: 'models/grass_long.glb',
  
  // Ore types
  [BlockType.COAL_ORE]: 'models/stone_coal.glb',
  [BlockType.IRON_ORE]: 'models/stone_iron.glb',
  [BlockType.GOLD_ORE]: 'models/stone_gold.glb',
  [BlockType.DIAMOND_ORE]: 'models/stone_diamond.glb',
  [BlockType.EMERALD_ORE]: 'models/stone_emerald.glb'
}

// Define the voxel position interface with block type
export interface VoxelPosition {
    x: number
    y: number
    z: number
    type: BlockType
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
    
    // Cave settings
    cavesEnabled: boolean;
    caveDensity: number; // 0.0 to 1.0 - frequency of cave generation
    caveSize: number; // Size of cave systems
    caveDepth: number; // How deep caves can go
    
    // Hills/Mountains settings
    hillsEnabled: boolean;
    hillFrequency: number; // How many hills per area
    hillHeight: number; // How tall hills can get
    hillSteepness: number; // How steep the hills are
    
    // Biome type
    biomeType: string; // 'forest', 'desert', 'snow', 'plains'
    
    // Vegetation settings
    flowerDensity: number; // Density of flowers
    grassDensity: number; // Density of grass
    bushDensity: number; // Density of bushes
    
    // Ore/Resources settings
    oreRarity: number; // Rarity of ore blocks
    oreVariety: number; // Variety of ore types
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
    terrainVariation: 4,
    
    // Default cave settings
    cavesEnabled: true,
    caveDensity: 0.05,
    caveSize: 5,
    caveDepth: 8,
    
    // Default hills settings
    hillsEnabled: true,
    hillFrequency: 0.05,
    hillHeight: 8,
    hillSteepness: 1.0,
    
    // Default biome type
    biomeType: 'forest',
    
    // Default vegetation settings
    flowerDensity: 0.1,
    grassDensity: 0.3,
    bushDensity: 0.1,
    
    // Default ore settings
    oreRarity: 0.05,
    oreVariety: 3
  }

  // Define the grid cell interface
  export interface GridCell {
    position: VoxelPosition
    entity: Entity | null
    visibleFaces: {
      top: boolean
      bottom: boolean
      north: boolean
      south: boolean
      east: boolean
      west: boolean
    }
  }
  
  // Constants for face visibility checks
  export const DIRECTIONS = [
    { x: 0, y: 1, z: 0, face: 'top' },    // top
    { x: 0, y: -1, z: 0, face: 'bottom' }, // bottom
    { x: 0, y: 0, z: 1, face: 'north' },   // north
    { x: 0, y: 0, z: -1, face: 'south' },  // south
    { x: 1, y: 0, z: 0, face: 'east' },    // east
    { x: -1, y: 0, z: 0, face: 'west' }    // west
  ]
  
  // Debug interface
  export interface DebugSettings {
    ALWAYS_VISIBLE: boolean
    MAX_LAYERS?: number
    MAX_ENTITIES?: number
  }