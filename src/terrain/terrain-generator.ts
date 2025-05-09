import { DEFAULT_BIOME_SETTINGS, VoxelPosition } from "../resources";
import { BiomeSettings } from "../resources";
import { BlockType } from "../resources";
/**
 * Creates a terrain generator for the scene
 * @param sceneSize The size of the scene (width and depth)
 * @param maxLayers Optional maximum number of vertical layers to generate (for performance testing)
 * @param biomeSettings Optional customization settings for biomes
 * @returns A terrain generator object
 */
export function createTerrainGenerator(
  sceneSize: number, 
  maxLayers?: number,
  biomeSettings: BiomeSettings = DEFAULT_BIOME_SETTINGS
) {
  // Helper function to generate 3D noise (for caves)
  const noise3D = (x: number, y: number, z: number): number => {
    // Simple 3D noise implementation
    return Math.sin(x * 0.1) * Math.sin(y * 0.1) * Math.sin(z * 0.1);
  };
  
  // Helper function to generate 2D noise (for hills)
  const noise2D = (x: number, z: number, frequency: number): number => {
    return Math.sin(x * frequency) * Math.sin(z * frequency);
  };

  return {
    /**
     * Generates a terrain with all configured features
     * @returns An array of voxel positions
     */
    generateTerrain(customSettings?: Partial<BiomeSettings>): VoxelPosition[] {
      // Merge any custom settings provided at generation time
      const settings = {...biomeSettings, ...customSettings};
      const voxelPositions: VoxelPosition[] = [];
      
      // When maxLayers is set, we'll limit the terrain height for performance testing
      const useMaxLayers = maxLayers !== undefined && maxLayers > 0;
      console.log(`Terrain generator: ${useMaxLayers ? 'Using max layers: ' + maxLayers : 'No height limit'}`);
      console.log(`Using biome settings: ${JSON.stringify(settings)}`);
      
      // Generate terrain for the scene
      for (let localX = 0; localX < sceneSize; localX++) {
        for (let localZ = 0; localZ < sceneSize; localZ++) {
          // Convert local coordinates to world coordinates
          const worldX = localX;
          const worldZ = localZ;
          
          // Calculate base height using sine waves for natural-looking terrain
          let baseHeight = Math.floor(
            settings.terrainHeight + 
            settings.terrainVariation * Math.sin(localX / 16) + 
            settings.terrainVariation * Math.sin(localZ / 16)
          );
          
          // Add hill height if hills are enabled
          if (settings.hillsEnabled) {
            // Calculate hill height based on position and settings
            const hillNoise = noise2D(localX, localZ, settings.hillFrequency);
            
            // Only add hill height where the noise is positive (creates distinct hills)
            if (hillNoise > 0.3) {
              // Scale the hill height based on settings
              const hillFactor = (hillNoise - 0.3) * settings.hillSteepness;
              baseHeight += Math.floor(hillFactor * settings.hillHeight);
            }
          }
          
          // Apply max layers constraint if set
          const effectiveHeight = useMaxLayers ? Math.min(baseHeight, maxLayers!) : baseHeight;
          
          // Determine biome type based on settings and position
          const isBeach = localX < sceneSize * settings.beachSize || localZ < sceneSize * settings.beachSize;
          
          // Calculate lake center position based on settings
          const lakeCenterX = sceneSize * (0.75 - settings.lakeSize/4);
          const lakeCenterZ = sceneSize * (0.75 - settings.lakeSize/4);
          const lakeRadius = sceneSize * settings.lakeSize;
          
          // Determine if this position is within the lake
          const isLake = settings.lakeEnabled && 
                         Math.pow(localX - lakeCenterX, 2) + Math.pow(localZ - lakeCenterZ, 2) <= Math.pow(lakeRadius, 2);
          
          // Place lake water if in lake biome
          if (isLake) {
            // Place water from y=0 up to waterLevel
            for (let y = 0; y <= settings.lakeDepth; y++) {
              // Bottom of lake is sand
              if (y === 0) {
                voxelPositions.push({ x: worldX, y, z: worldZ, type: BlockType.SAND });
              } else {
                // For snow biome, use ice instead of water
                const blockType = settings.biomeType === 'snow' ? BlockType.ICE : BlockType.WATER;
                voxelPositions.push({ x: worldX, y, z: worldZ, type: blockType });
              }
            }
            continue; // Skip normal terrain generation for lake areas
          }
          
          // Place voxels from y=0 up to the calculated height
          for (let y = 0; y <= effectiveHeight; y++) {
            // Check for cave generation - skip this block if it's a cave
            if (settings.cavesEnabled && 
                y > 2 && y < effectiveHeight - 2 && // Don't create caves too close to surface or bottom
                y < settings.caveDepth && // Don't exceed max cave depth
                noise3D(worldX, y, worldZ) > (1 - settings.caveDensity) &&
                Math.random() < settings.caveSize / 10) {
              continue; // Skip this block - it's a cave space
            }
            
            // Determine block type based on height, biome, and settings
            let blockType: BlockType;
            
            // Handle different biome types
            if (isBeach) {
              // Beach biome is always sand regardless of main biome type
              if (y === effectiveHeight) {
                blockType = BlockType.SAND; // Top layer is sand in beach areas
              } else if (y > effectiveHeight - 3) {
                blockType = BlockType.SAND; // Next 2 layers are also sand
              } else {
                blockType = BlockType.STONE_DARK; // Everything below is stone
              }
            } else {
              // For the top layer, set block based on biome type
              if (y === effectiveHeight) {
                switch (settings.biomeType) {
                  case 'desert':
                    blockType = BlockType.SAND;
                    break;
                  case 'snow':
                    blockType = BlockType.SNOW;
                    break;
                  case 'plains':
                  case 'forest':
                  default:
                    blockType = BlockType.GRASS;
                    break;
                }
              } else if (y > effectiveHeight - 4) {
                // Dirt layer (or sand for desert)
                blockType = settings.biomeType === 'desert' ? BlockType.SAND : BlockType.DIRT;
              } else {
                // Base stone layer - check for ore generation
                blockType = BlockType.STONE_DARK;
                
                // Random ore generation based on depth and settings
                if (y < effectiveHeight - 5 && Math.random() < settings.oreRarity) {
                  // Pick an ore type based on depth and variety
                  const oreDepth = effectiveHeight - y; // How deep we are
                  
                  // More valuable ores are deeper and depend on variety setting
                  if (oreDepth > 20 && settings.oreVariety >= 5) {
                    blockType = BlockType.DIAMOND_ORE;
                  } else if (oreDepth > 15 && settings.oreVariety >= 4) {
                    blockType = BlockType.EMERALD_ORE;
                  } else if (oreDepth > 10 && settings.oreVariety >= 3) {
                    blockType = BlockType.GOLD_ORE;
                  } else if (oreDepth > 5 && settings.oreVariety >= 2) {
                    blockType = BlockType.IRON_ORE;
                  } else {
                    blockType = BlockType.COAL_ORE;
                  }
                }
              }
              
              // Add the block to the voxel positions
              voxelPositions.push({ x: worldX, y, z: worldZ, type: blockType });
              
              // Surface decorations - only add on the top level
              if (y === effectiveHeight) {
                // Trees - only in forest biome
                if (settings.biomeType === 'forest' && Math.random() < settings.treeDensity) {
                  // Place tree trunk (4 blocks high)
                  for (let treeY = 1; treeY <= 4; treeY++) {
                    voxelPositions.push({ 
                      x: worldX, 
                      y: y + treeY, 
                      z: worldZ, 
                      type: BlockType.WOOD 
                    });
                  }
                  
                  // Place tree leaves (3x3x3 cube centered on top of trunk)
                  for (let lx = -1; lx <= 1; lx++) {
                    for (let ly = 0; ly <= 2; ly++) {
                      for (let lz = -1; lz <= 1; lz++) {
                        // Skip the trunk position
                        if (!(lx === 0 && lz === 0 && ly < 2)) {
                          voxelPositions.push({
                            x: worldX + lx,
                            y: y + 4 + ly, // Start leaves at top of trunk
                            z: worldZ + lz,
                            type: BlockType.LEAVES
                          });
                        }
                      }
                    }
                  }
                }
                
                // Flowers - in forest, plains biomes
                if ((settings.biomeType === 'forest' || settings.biomeType === 'plains') && 
                    Math.random() < settings.flowerDensity) {
                  const flowerType = Math.random() > 0.5 ? BlockType.FLOWER_RED : BlockType.FLOWER_YELLOW;
                  voxelPositions.push({
                    x: worldX,
                    y: y + 1,
                    z: worldZ,
                    type: flowerType
                  });
                }
                
                // Tall grass - in plains biome
                if (settings.biomeType === 'plains' && Math.random() < settings.grassDensity) {
                  voxelPositions.push({
                    x: worldX,
                    y: y + 1,
                    z: worldZ,
                    type: BlockType.TALL_GRASS
                  });
                }
                
                // Bushes - in forest, plains biomes
                if ((settings.biomeType === 'forest' || settings.biomeType === 'plains') && 
                    Math.random() < settings.bushDensity) {
                  voxelPositions.push({
                    x: worldX,
                    y: y + 1,
                    z: worldZ,
                    type: BlockType.BUSH
                  });
                }
                
                // Cabins - in forest biome
                if (settings.biomeType === 'forest' && 
                    settings.cabinsEnabled && 
                    localX > sceneSize * 0.4 && localX < sceneSize * 0.6 && 
                    localZ > sceneSize * 0.4 && localZ < sceneSize * 0.6 && 
                    Math.random() < settings.cabinDensity) {
                  
                  // Simple cabin floor - 3x3 dark wood planks
                  for (let fx = -1; fx <= 1; fx++) {
                    for (let fz = -1; fz <= 1; fz++) {
                      voxelPositions.push({
                        x: worldX + fx,
                        y: y + 1,
                        z: worldZ + fz,
                        type: BlockType.WOOD_PLANK_DARK
                      });
                    }
                  }
                  
                  // Cabin walls - 3x3x3 light red wood planks with a door
                  for (let wx = -1; wx <= 1; wx++) {
                    for (let wz = -1; wz <= 1; wz++) {
                      for (let wy = 2; wy <= 3; wy++) {
                        // Skip the center of one wall for the door
                        if (!(wx === 0 && wz === -1 && wy === 2)) {
                          // Only place walls on the perimeter
                          if (wx === -1 || wx === 1 || wz === -1 || wz === 1) {
                            voxelPositions.push({
                              x: worldX + wx,
                              y: y + wy,
                              z: worldZ + wz,
                              type: BlockType.WOOD_PLANK_LIGHT_RED
                            });
                          }
                        }
                      }
                    }
                  }
                  
                  // Cabin roof - 5x5 dark wood planks
                  for (let rx = -2; rx <= 2; rx++) {
                    for (let rz = -2; rz <= 2; rz++) {
                      voxelPositions.push({
                        x: worldX + rx,
                        y: y + 4,
                        z: worldZ + rz,
                        type: BlockType.WOOD_PLANK_DARK
                      });
                    }
                  }
                }
              }
              
              continue; // Skip adding block again below
            }
            
            // Add the block if not already added
            voxelPositions.push({ x: worldX, y, z: worldZ, type: blockType });
          }
        }
      }
      
      console.log(`Generated terrain with ${voxelPositions.length} voxels total`);
      
      return voxelPositions;
    }
  };
} 