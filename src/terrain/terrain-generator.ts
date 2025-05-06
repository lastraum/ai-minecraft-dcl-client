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
          
          // Place voxels from y=0 up to the calculated height
          for (let y = 0; y <= effectiveHeight; y++) {
            // Determine block type based on height:
            // - Top layer is grass
            // - Next 3 layers are dirt
            // - Everything below is stone
            let type: BlockType
            
            if (y === effectiveHeight) {
              type = BlockType.GRASS // Top layer is grass
            } else if (y > effectiveHeight - 4) {
              type = BlockType.DIRT // Next 3 layers are dirt
            } else {
              type = BlockType.STONE_DARK // Everything below is stone
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