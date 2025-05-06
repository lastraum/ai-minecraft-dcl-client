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
  STONE = 'stone'
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
      
      // Generate heightmap using sine waves
      for (let x = 0; x < sceneSize; x++) {
        for (let z = 0; z < sceneSize; z++) {
          // Calculate height using sine waves for natural-looking terrain
          // This creates a wavy pattern that looks natural
          const height = Math.floor(8 + 4 * Math.sin(x / 4) + 4 * Math.sin(z / 4))
          
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
              type = BlockType.STONE // Everything below is stone
            }
            
            voxelPositions.push({ x, y, z, type })
          }
        }
      }
      
      return voxelPositions
    }
  }
} 