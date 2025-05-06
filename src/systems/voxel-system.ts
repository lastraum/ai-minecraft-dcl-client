import { Engine, Entity, GltfContainer, Transform, VisibilityComponent, TransformType, VisibilityComponentType } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { VoxelPosition } from '../terrain/terrain-generator'

/**
 * Creates and sets up the voxel system
 * @param engine The Decentraland engine instance
 * @param voxelPositions Array of voxel positions from the terrain generator
 * @param chunkManager The chunk manager instance
 * @param visibilityThreshold Maximum distance for voxel visibility (in meters)
 */
export function createVoxelSystem(
  engine: Engine,
  voxelPositions: VoxelPosition[],
  chunkManager: any,
  visibilityThreshold: number
) {
  // Create all voxel entities and organize them into chunks
  voxelPositions.forEach(pos => {
    // Create entity
    const entity = engine.addEntity()
    
    // Add GltfContainer component (model)
    GltfContainer.create(entity, {
      src: 'models/voxel.glb'  // Path to your voxel .glb model
    })
    
    // Add Transform component (position)
    Transform.create(entity, {
      position: Vector3.create(pos.x, pos.y, pos.z)
    })
    
    // Add VisibilityComponent (initially invisible)
    VisibilityComponent.create(entity, {
      visible: false
    })
    
    // Add to appropriate chunk
    chunkManager.addEntityToChunk(entity, pos)
  })
  
  // Print how many chunks were created
  const chunks = chunkManager.getChunks()
  console.log(`Created ${Object.keys(chunks).length} chunks`)
  
  // Create a system that runs every frame to update visibility
  const visibilitySystem = () => {
    // Get player's position
    const camera = engine.PlayerEntity
    const playerPos = Transform.get(camera).position
    
    // Loop through all chunks to check visibility
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
  
  console.log('Voxel system initialized')
} 