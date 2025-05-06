import { Entity } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { VoxelPosition } from '../terrain/terrain-generator'

// Define the chunk interface
export interface Chunk {
  key: string
  entities: Entity[]
  center: Vector3
}

/**
 * Initializes a chunk manager for organizing voxels into chunks
 * @param chunkSize The size of each chunk (e.g., 4 for 4x4x4 chunks)
 * @returns A chunk manager object
 */
export function initChunkManager(chunkSize: number) {
  // The chunks map stores all chunks indexed by their key
  const chunks: Record<string, Chunk> = {}
  
  return {
    /**
     * Gets all created chunks
     * @returns A map of all chunks
     */
    getChunks(): Record<string, Chunk> {
      return chunks
    },
    
    /**
     * Gets the appropriate chunk key for a voxel position
     * @param position The voxel position
     * @returns The chunk key (e.g., "0,0,0")
     */
    getChunkKey(position: VoxelPosition): string {
      const chunkX = Math.floor(position.x / chunkSize)
      const chunkY = Math.floor(position.y / chunkSize)
      const chunkZ = Math.floor(position.z / chunkSize)
      return `${chunkX},${chunkY},${chunkZ}`
    },
    
    /**
     * Creates a new chunk or returns an existing one
     * @param key The chunk key
     * @returns The chunk object
     */
    createChunk(key: string): Chunk {
      if (!chunks[key]) {
        // Parse the chunk coordinates from the key
        const [x, y, z] = key.split(',').map(Number)
        
        // Calculate chunk center for distance checks
        const centerX = x * chunkSize + chunkSize / 2
        const centerY = y * chunkSize + chunkSize / 2
        const centerZ = z * chunkSize + chunkSize / 2
        
        // Create the new chunk
        chunks[key] = {
          key,
          entities: [],
          center: Vector3.create(centerX, centerY, centerZ)
        }
      }
      
      return chunks[key]
    },
    
    /**
     * Adds an entity to the appropriate chunk
     * @param entity The entity to add
     * @param position The voxel position
     */
    addEntityToChunk(entity: Entity, position: VoxelPosition): void {
      const chunkKey = this.getChunkKey(position)
      const chunk = this.createChunk(chunkKey)
      chunk.entities.push(entity)
    }
  }
} 