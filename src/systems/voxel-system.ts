import { ColliderLayer, engine, Entity, GltfContainer, Transform, VisibilityComponent } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { VoxelPosition, BlockType } from '../terrain/terrain-generator'
import { Chunk } from './chunk-manager'

// Define the interface for the chunk manager
interface ChunkManager {
  getChunks(): Record<string, Chunk>
  addEntityToChunk(entity: Entity, position: VoxelPosition): void
}

// Debug interface
interface DebugSettings {
  ALWAYS_VISIBLE?: boolean
}

/**
 * Creates and sets up the voxel system
 * @param engine The Decentraland engine instance
 * @param voxelPositions Array of voxel positions from the terrain generator
 * @param chunkManager The chunk manager instance
 * @param visibilityThreshold Maximum distance for voxel visibility (in meters)
 * @param debug Optional debug settings to override default behavior
 */
export function createVoxelSystem(
  _engine: any,
  voxelPositions: VoxelPosition[],
  chunkManager: ChunkManager,
  visibilityThreshold: number,
  debug?: DebugSettings
) {
  // Debug flags
  const alwaysVisible = debug?.ALWAYS_VISIBLE || false
  
  // Block type model mapping
  const modelPaths: Record<BlockType, string> = {
    [BlockType.GRASS]: 'models/grass.glb',
    [BlockType.DIRT]: 'models/dirt.glb',
    [BlockType.STONE_DARK]: 'models/stone_dark.glb'
  }

  // Track the count of each block type for logging
  const blockCounts: Record<BlockType, number> = {
    [BlockType.GRASS]: 0,
    [BlockType.DIRT]: 0,
    [BlockType.STONE_DARK]: 0
  }
  
  // Create all voxel entities and organize them into chunks
  voxelPositions.forEach(pos => {
    // Create entity
    const entity = engine.addEntity()
    
    // Increment block counter
    blockCounts[pos.type]++
    
    // Add GltfContainer component (model) based on block type
    GltfContainer.create(entity, {
      src: modelPaths[pos.type],
      invisibleMeshesCollisionMask:ColliderLayer.CL_NONE,
      visibleMeshesCollisionMask:ColliderLayer.CL_PHYSICS | ColliderLayer.CL_POINTER,
    })
    
    // Add Transform component (position)
    // Apply a 0.5 offset in each direction to account for the center origin of the GLB model
    Transform.create(entity, {
      position: Vector3.create(
        pos.x + 0.5, 
        pos.y + 0.5, 
        pos.z + 0.5
      )
    })
    
    // Add VisibilityComponent (initially invisible or based on debug flag)
    VisibilityComponent.create(entity, {
      visible: alwaysVisible
    })
    
    // Add to appropriate chunk
    chunkManager.addEntityToChunk(entity, pos)
  })
  
  // Print how many chunks were created
  const chunks = chunkManager.getChunks()
  console.log(`Created ${Object.keys(chunks).length} chunks`)
  console.log(`Block counts: Grass: ${blockCounts[BlockType.GRASS]}, Dirt: ${blockCounts[BlockType.DIRT]}, Stone: ${blockCounts[BlockType.STONE_DARK]}`)
  
  if (alwaysVisible) {
    console.log('DEBUG: Visibility toggle disabled - all voxels are always visible')
  } else {
    // Create a system that runs every frame to update visibility
    const visibilitySystem = () => {
      // Get player's position
      const playerTransform = Transform.getMutableOrNull(engine.PlayerEntity)
      if (!playerTransform) {
        return
      }
      const playerPos = playerTransform.position
      // Loop through all chunks to check visibility/// 
      for (const chunkKey in chunks) {
        const chunk = chunks[chunkKey]
        
        // Calculate distance from player to chunk center
        const distance = Vector3.distance(playerPos, chunk.center)
        
        // Determine if this chunk should be visible
        const visible = distance < visibilityThreshold
        
        // Update visibility for all entities in this chunk
        for (const entity of chunk.entities) {
          // Only update if needed (to avoid unnecessary updates)
          const visibilityComponent = VisibilityComponent.getMutable(entity)
          if (visibilityComponent.visible !== visible) {
            visibilityComponent.visible = visible
          }
        }
      }
    }
    
    // Add the visibility system to the engine
    engine.addSystem(visibilitySystem)
  }
  
  console.log('Voxel system initialized')
} 