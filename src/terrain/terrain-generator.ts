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

/**
 * Creates a terrain generator for the scene
 * @param sceneSize The size of the scene (width and depth)
 * @param maxLayers Optional maximum number of vertical layers to generate (for performance testing)
 * @returns A terrain generator object
 */
export function createTerrainGenerator(sceneSize: number, maxLayers?: number) {
  return {
    /**
     * Generates a sine-based heightmap terrain
     * Uses the formula: height = 8 + 4 * Math.sin(x / 4) + 4 * Math.sin(z / 4)
     * Creates a wavy terrain with heights ranging roughly from 4 to 12
     * @returns An array of voxel positions
     */
    generateTerrain(): VoxelPosition[] {
      const voxelPositions: VoxelPosition[] = []
      
      // When maxLayers is set, we'll limit the terrain height for performance testing
      const useMaxLayers = maxLayers !== undefined && maxLayers > 0
      console.log(`Terrain generator: ${useMaxLayers ? 'Using max layers: ' + maxLayers : 'No height limit'}`)
      
      // Generate terrain for the 2x2 parcel grid (32x32 voxels)
      // The 2x2 parcel grid starts at x=16, z=0 (accounting for the base parcel at -1,0)
      for (let localX = 0; localX < sceneSize; localX++) {
        for (let localZ = 0; localZ < sceneSize; localZ++) {
          // Convert local coordinates to world coordinates 
          // Since base parcel is at (-1,0), we start at x=16
          const worldX = localX + 16;
          const worldZ = localZ;
          
          // Calculate height using sine waves for natural-looking terrain
          const height = Math.floor(8 + 4 * Math.sin(localX / 4) + 4 * Math.sin(localZ / 4));
          
          // Apply max layers constraint if set
          const effectiveHeight = useMaxLayers ? Math.min(height, maxLayers!) : height;
          
          // Determine biome type based on local coordinates
          // Simple beach/forest/lake biome transition
          const isBeach = localX < sceneSize * 0.3 || localZ < sceneSize * 0.3;
          const isLake = localX > sceneSize * 0.65 && localX < sceneSize * 0.85 && 
                         localZ > sceneSize * 0.65 && localZ < sceneSize * 0.85;
          
          // Set water level for lake
          const waterLevel = 6;
          
          // Place lake water if in lake biome
          if (isLake) {
            // Place water from y=0 up to waterLevel
            for (let y = 0; y <= waterLevel; y++) {
              // Bottom of lake is sand
              if (y === 0) {
                voxelPositions.push({ x: worldX, y, z: worldZ, type: BlockType.SAND });
              } else {
                voxelPositions.push({ x: worldX, y, z: worldZ, type: BlockType.WATER });
              }
            }
            continue; // Skip normal terrain generation for lake areas
          }
          
          // Place voxels from y=0 up to the calculated height
          for (let y = 0; y <= effectiveHeight; y++) {
            // Determine block type based on height and biome:
            let type: BlockType
            
            if (isBeach) {
              // Beach biome (sand, dirt, stone)
              if (y === effectiveHeight) {
                type = BlockType.SAND // Top layer is sand in beach areas
              } else if (y > effectiveHeight - 3) {
                type = BlockType.DIRT // Next 2 layers are dirt
              } else {
                type = BlockType.STONE_DARK // Everything below is stone
              }
            } else {
              // Forest biome (grass, dirt, stone)
              if (y === effectiveHeight) {
                type = BlockType.GRASS // Top layer is grass
              } else if (y > effectiveHeight - 4) {
                type = BlockType.DIRT // Next 3 layers are dirt
              } else {
                type = BlockType.STONE_DARK // Everything below is stone
              }
              
              // Randomly place trees in forest biome
              if (y === effectiveHeight && Math.random() < 0.03) {
                // Place tree trunk (4 blocks high)
                for (let treeY = 1; treeY <= 4; treeY++) {
                  voxelPositions.push({ 
                    x: worldX, 
                    y: y + treeY, 
                    z: worldZ, 
                    type: BlockType.WOOD 
                  })
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
                        })
                      }
                    }
                  }
                }
              }
              
              // Randomly place cabins in the forest (away from the beach edge)
              if (y === effectiveHeight && 
                  localX > sceneSize * 0.4 && localX < sceneSize * 0.6 && 
                  localZ > sceneSize * 0.4 && localZ < sceneSize * 0.6 && 
                  Math.random() < 0.7) {
                
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
            
            voxelPositions.push({ x: worldX, y, z: worldZ, type })
          }
        }
      }
      
      if (useMaxLayers) {
        console.log(`Generated terrain with ${maxLayers} max layers (${voxelPositions.length} voxels total)`)
      } else {
        console.log(`Generated terrain with natural height (${voxelPositions.length} voxels total)`)
      }
      
      return voxelPositions
    }
  }
} 