import { BiomeSettings, DEFAULT_BIOME_SETTINGS, BIOME_CONFIG } from '../resources';

// Subscribers that will be notified when settings change
type SettingsChangeCallback = (settings: BiomeSettings) => void;
const subscribers: SettingsChangeCallback[] = [];

// Current settings state
let currentSettings: BiomeSettings = {...DEFAULT_BIOME_SETTINGS};

// User-defined range limits (start with defaults from BIOME_CONFIG)
interface RangeConfig {
  min: number;
  max: number;
}

interface BiomeRanges {
  beachSize: RangeConfig;
  lakeSize: RangeConfig;
  lakeDepth: RangeConfig;
  treeDensity: RangeConfig;
  cabinDensity: RangeConfig;
  terrainHeight: RangeConfig;
  terrainVariation: RangeConfig;
  caveDensity: RangeConfig;
  caveSize: RangeConfig;
  caveDepth: RangeConfig;
  hillFrequency: RangeConfig;
  hillHeight: RangeConfig;
  hillSteepness: RangeConfig;
  flowerDensity: RangeConfig;
  grassDensity: RangeConfig;
  bushDensity: RangeConfig;
  oreRarity: RangeConfig;
  oreVariety: RangeConfig;
}

// Initialize with default ranges from BIOME_CONFIG
export let customRanges: BiomeRanges = {
  beachSize: { min: BIOME_CONFIG.BEACH_SIZE_MIN, max: BIOME_CONFIG.BEACH_SIZE_MAX },
  lakeSize: { min: BIOME_CONFIG.LAKE_SIZE_MIN, max: BIOME_CONFIG.LAKE_SIZE_MAX },
  lakeDepth: { min: BIOME_CONFIG.LAKE_DEPTH_MIN, max: BIOME_CONFIG.LAKE_DEPTH_MAX },
  treeDensity: { min: BIOME_CONFIG.TREE_DENSITY_MIN, max: BIOME_CONFIG.TREE_DENSITY_MAX },
  cabinDensity: { min: BIOME_CONFIG.CABIN_DENSITY_MIN, max: BIOME_CONFIG.CABIN_DENSITY_MAX },
  terrainHeight: { min: BIOME_CONFIG.TERRAIN_HEIGHT_MIN, max: BIOME_CONFIG.TERRAIN_HEIGHT_MAX },
  terrainVariation: { min: BIOME_CONFIG.TERRAIN_VARIATION_MIN, max: BIOME_CONFIG.TERRAIN_VARIATION_MAX },
  caveDensity: { min: BIOME_CONFIG.CAVE_DENSITY_MIN, max: BIOME_CONFIG.CAVE_DENSITY_MAX },
  caveSize: { min: BIOME_CONFIG.CAVE_SIZE_MIN, max: BIOME_CONFIG.CAVE_SIZE_MAX },
  caveDepth: { min: BIOME_CONFIG.CAVE_DEPTH_MIN, max: BIOME_CONFIG.CAVE_DEPTH_MAX },
  hillFrequency: { min: BIOME_CONFIG.HILL_FREQUENCY_MIN, max: BIOME_CONFIG.HILL_FREQUENCY_MAX },
  hillHeight: { min: BIOME_CONFIG.HILL_HEIGHT_MIN, max: BIOME_CONFIG.HILL_HEIGHT_MAX },
  hillSteepness: { min: BIOME_CONFIG.HILL_STEEPNESS_MIN, max: BIOME_CONFIG.HILL_STEEPNESS_MAX },
  flowerDensity: { min: BIOME_CONFIG.FLOWER_DENSITY_MIN, max: BIOME_CONFIG.FLOWER_DENSITY_MAX },
  grassDensity: { min: BIOME_CONFIG.GRASS_DENSITY_MIN, max: BIOME_CONFIG.GRASS_DENSITY_MAX },
  bushDensity: { min: BIOME_CONFIG.BUSH_DENSITY_MIN, max: BIOME_CONFIG.BUSH_DENSITY_MAX },
  oreRarity: { min: BIOME_CONFIG.ORE_RARITY_MIN, max: BIOME_CONFIG.ORE_RARITY_MAX },
  oreVariety: { min: BIOME_CONFIG.ORE_VARIETY_MIN, max: BIOME_CONFIG.ORE_VARIETY_MAX }
};

/**
 * Update a specific range configuration
 */
export function updateRange<K extends keyof BiomeRanges>(
  setting: K, 
  min: number, 
  max: number
): void {
  if (min > max) {
    console.log(`[ERROR] Invalid range for ${String(setting)}: min (${min}) > max (${max})`);
    return;
  }
  
  customRanges[setting] = { min, max };
  console.log(`Updated range for ${String(setting)}: ${min} to ${max}`);
}

/**
 * Get the current custom range for a setting
 */
export function getRange<K extends keyof BiomeRanges>(setting: K): RangeConfig {
  return { ...customRanges[setting] };
}

/**
 * Get all custom ranges
 */
export function getAllRanges(): BiomeRanges {
  return { ...customRanges };
}

/**
 * Helper function to get random number in range
 */
function randomInRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Generates random biome settings within the defined custom ranges
 */
export function generateRandomBiomeSettings(): BiomeSettings {
  // Create random settings using custom ranges
  return {
    beachSize: randomInRange(customRanges.beachSize.min, customRanges.beachSize.max),
    lakeEnabled: Math.random() > 0.3, // 70% chance of having a lake
    lakeSize: randomInRange(customRanges.lakeSize.min, customRanges.lakeSize.max),
    lakeDepth: Math.floor(randomInRange(customRanges.lakeDepth.min, customRanges.lakeDepth.max)),
    treeDensity: randomInRange(customRanges.treeDensity.min, customRanges.treeDensity.max),
    cabinsEnabled: Math.random() > 0.5, // 50% chance of having cabins
    cabinDensity: randomInRange(customRanges.cabinDensity.min, customRanges.cabinDensity.max),
    terrainHeight: Math.floor(randomInRange(customRanges.terrainHeight.min, customRanges.terrainHeight.max)),
    terrainVariation: Math.floor(randomInRange(customRanges.terrainVariation.min, customRanges.terrainVariation.max)),
    
    // Cave settings
    cavesEnabled: Math.random() > 0.4, // 60% chance of having caves
    caveDensity: randomInRange(customRanges.caveDensity.min, customRanges.caveDensity.max),
    caveSize: Math.floor(randomInRange(customRanges.caveSize.min, customRanges.caveSize.max)),
    caveDepth: Math.floor(randomInRange(customRanges.caveDepth.min, customRanges.caveDepth.max)),
    
    // Hills settings
    hillsEnabled: Math.random() > 0.3, // 70% chance of having hills
    hillFrequency: randomInRange(customRanges.hillFrequency.min, customRanges.hillFrequency.max),
    hillHeight: Math.floor(randomInRange(customRanges.hillHeight.min, customRanges.hillHeight.max)),
    hillSteepness: randomInRange(customRanges.hillSteepness.min, customRanges.hillSteepness.max),
    
    // Biome type - randomly select from available types
    biomeType: ['forest', 'desert', 'snow', 'plains'][Math.floor(Math.random() * 4)],
    
    // Vegetation settings
    flowerDensity: randomInRange(customRanges.flowerDensity.min, customRanges.flowerDensity.max),
    grassDensity: randomInRange(customRanges.grassDensity.min, customRanges.grassDensity.max),
    bushDensity: randomInRange(customRanges.bushDensity.min, customRanges.bushDensity.max),
    
    // Ore settings
    oreRarity: randomInRange(customRanges.oreRarity.min, customRanges.oreRarity.max),
    oreVariety: Math.floor(randomInRange(customRanges.oreVariety.min, customRanges.oreVariety.max))
  };
}

/**
 * Initialize biome settings with random values
 */
export function initializeBiomeSettings(): void {
  currentSettings = generateRandomBiomeSettings();
  notifySubscribers();
}

/**
 * Get the current biome settings
 */
export function getBiomeSettings(): BiomeSettings {
  return { ...currentSettings };
}

/**
 * Update a specific biome setting
 */
export function updateBiomeSetting<K extends keyof BiomeSettings>(key: K, value: BiomeSettings[K]): void {
  currentSettings = {
    ...currentSettings,
    [key]: value
  };
  notifySubscribers();
}

/**
 * Update multiple biome settings at once
 */
export function updateBiomeSettings(newSettings: Partial<BiomeSettings>): void {
  currentSettings = {
    ...currentSettings,
    ...newSettings
  };
  notifySubscribers();
}

/**
 * Reset biome settings to defaults
 */
export function resetBiomeSettings(): void {
  currentSettings = { ...DEFAULT_BIOME_SETTINGS };
  notifySubscribers();
}

/**
 * Reset ranges to default configuration
 */
export function resetRangesToDefaults(): void {
  customRanges = {
    beachSize: { min: BIOME_CONFIG.BEACH_SIZE_MIN, max: BIOME_CONFIG.BEACH_SIZE_MAX },
    lakeSize: { min: BIOME_CONFIG.LAKE_SIZE_MIN, max: BIOME_CONFIG.LAKE_SIZE_MAX },
    lakeDepth: { min: BIOME_CONFIG.LAKE_DEPTH_MIN, max: BIOME_CONFIG.LAKE_DEPTH_MAX },
    treeDensity: { min: BIOME_CONFIG.TREE_DENSITY_MIN, max: BIOME_CONFIG.TREE_DENSITY_MAX },
    cabinDensity: { min: BIOME_CONFIG.CABIN_DENSITY_MIN, max: BIOME_CONFIG.CABIN_DENSITY_MAX },
    terrainHeight: { min: BIOME_CONFIG.TERRAIN_HEIGHT_MIN, max: BIOME_CONFIG.TERRAIN_HEIGHT_MAX },
    terrainVariation: { min: BIOME_CONFIG.TERRAIN_VARIATION_MIN, max: BIOME_CONFIG.TERRAIN_VARIATION_MAX },
    caveDensity: { min: BIOME_CONFIG.CAVE_DENSITY_MIN, max: BIOME_CONFIG.CAVE_DENSITY_MAX },
    caveSize: { min: BIOME_CONFIG.CAVE_SIZE_MIN, max: BIOME_CONFIG.CAVE_SIZE_MAX },
    caveDepth: { min: BIOME_CONFIG.CAVE_DEPTH_MIN, max: BIOME_CONFIG.CAVE_DEPTH_MAX },
    hillFrequency: { min: BIOME_CONFIG.HILL_FREQUENCY_MIN, max: BIOME_CONFIG.HILL_FREQUENCY_MAX },
    hillHeight: { min: BIOME_CONFIG.HILL_HEIGHT_MIN, max: BIOME_CONFIG.HILL_HEIGHT_MAX },
    hillSteepness: { min: BIOME_CONFIG.HILL_STEEPNESS_MIN, max: BIOME_CONFIG.HILL_STEEPNESS_MAX },
    flowerDensity: { min: BIOME_CONFIG.FLOWER_DENSITY_MIN, max: BIOME_CONFIG.FLOWER_DENSITY_MAX },
    grassDensity: { min: BIOME_CONFIG.GRASS_DENSITY_MIN, max: BIOME_CONFIG.GRASS_DENSITY_MAX },
    bushDensity: { min: BIOME_CONFIG.BUSH_DENSITY_MIN, max: BIOME_CONFIG.BUSH_DENSITY_MAX },
    oreRarity: { min: BIOME_CONFIG.ORE_RARITY_MIN, max: BIOME_CONFIG.ORE_RARITY_MAX },
    oreVariety: { min: BIOME_CONFIG.ORE_VARIETY_MIN, max: BIOME_CONFIG.ORE_VARIETY_MAX }
  };
}

/**
 * Subscribe to biome settings changes
 */
export function subscribeToBiomeSettings(callback: SettingsChangeCallback): () => void {
  subscribers.push(callback);
  
  // Return unsubscribe function
  return () => {
    const index = subscribers.indexOf(callback);
    if (index !== -1) {
      subscribers.splice(index, 1);
    }
  };
}

/**
 * Notify all subscribers about settings changes
 */
function notifySubscribers(): void {
  for (const callback of subscribers) {
    callback(getBiomeSettings());
  }
}

// Group settings by category for UI organization
export const BiomeCategories = {
  BIOME_TYPE: {
    label: 'Biome Type',
    settings: ['biomeType']
  },
  TERRAIN: {
    label: 'Terrain',
    settings: ['terrainHeight', 'terrainVariation', 'hillsEnabled', 'hillFrequency', 'hillHeight', 'hillSteepness']
  },
  WATER: {
    label: 'Water',
    settings: ['beachSize', 'lakeEnabled', 'lakeSize', 'lakeDepth']
  },
  VEGETATION: {
    label: 'Vegetation',
    settings: ['treeDensity', 'flowerDensity', 'grassDensity', 'bushDensity']
  },
  STRUCTURES: {
    label: 'Structures',
    settings: ['cabinsEnabled', 'cabinDensity', 'cavesEnabled', 'caveDensity', 'caveSize', 'caveDepth']
  },
  RESOURCES: {
    label: 'Resources',
    settings: ['oreRarity', 'oreVariety']
  }
}

// Used for rendering UI controls based on biome type
export const BiomeTypeSpecificSettings = {
  forest: {
    enabledSettings: ['treeDensity', 'cabinsEnabled', 'cabinDensity', 'bushDensity', 'flowerDensity'],
    disabledSettings: []
  },
  desert: {
    enabledSettings: [],
    disabledSettings: ['treeDensity', 'cabinDensity', 'flowerDensity', 'grassDensity', 'bushDensity']
  },
  snow: {
    enabledSettings: ['treeDensity'],
    disabledSettings: ['cabinsEnabled', 'cabinDensity']
  },
  plains: {
    enabledSettings: ['grassDensity', 'flowerDensity', 'bushDensity'],
    disabledSettings: ['treeDensity', 'cabinsEnabled', 'cabinDensity']
  }
} 