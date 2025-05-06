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
  STONE_DARK = 'stone_dark'
}

/**
 * Creates a terrain generator for the scene
 * @param sceneSize The size of the scene (width and depth)
 * @returns A terrain generator object
 */
export function createTerrainGenerator(sceneSize: number) {
  return {
    /**
     * Generates a sine-based heightmap terrain
     * Uses the formula: height = 8 + 4 * Math.sin(x / 4) + 4 * Math.sin(z / 4)
     * Creates a wavy terrain with heights ranging roughly from 4 to 12
     * @returns An array of voxel positions
     */
    generateTerrain(): VoxelPosition[] {
      const voxelPositions: VoxelPosition[] = []
      
      // Since the base parcel is (-1,0), we need to adjust coordinates:
      // - Base parcel (-1,0): x=0-16, z=0-16
      // - The 2x2 parcel grid starts at:
      //   - (0,0): x=16-32, z=0-16
      //   - (0,1): x=16-32, z=16-32
      //   - (1,0): x=32-48, z=0-16
      //   - (1,1): x=32-48, z=16-32
      
      // Generate heightmap for 2x2 parcel grid
      for (let localX = 0; localX < sceneSize; localX++) {
        for (let localZ = 0; localZ < sceneSize; localZ++) {
          // Convert local coordinates to world coordinates with base parcel offset
          // Add 16 to x since base parcel is at -1,0 (one parcel to the left)
          const worldX = localX + 16;
          const worldZ = localZ;
          
          // Skip if in the base parcel (0-16, 0-16)
          if (worldX < 16 && worldZ < 16) {
            continue;
          }
          
          // Calculate height using sine waves for natural-looking terrain
          // Using local coordinates for terrain generation to get consistent patterns
          const height = Math.floor(8 + 4 * Math.sin(localX / 4) + 4 * Math.sin(localZ / 4));
          
          // Place voxels from y=0 up to the calculated height
          for (let y = 0; y <= height; y++) {
            // Determine block type based on height:
            // - Top layer is grass
            // - Next 3 layers are dirt
            // - Everything below is stone
            let type: BlockType
            
            if (y === height) {
              type = BlockType.GRASS // Top layer is grass
            } else if (y > height - 4) {
              type = BlockType.DIRT // Next 3 layers are dirt
            } else {
              type = BlockType.STONE_DARK // Everything below is stone
            }
            
            voxelPositions.push({ x: worldX, y, z: worldZ, type })
          }
        }
      }
      
      return voxelPositions
    }
  }
} 