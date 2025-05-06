import { ColliderLayer, engine, Entity, GltfContainer, Transform, VisibilityComponent } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { VoxelPosition, BlockType } from '../terrain/terrain-generator'

// Define the grid cell interface
interface GridCell {
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
const DIRECTIONS = [
  { x: 0, y: 1, z: 0, face: 'top' },    // top
  { x: 0, y: -1, z: 0, face: 'bottom' }, // bottom
  { x: 0, y: 0, z: 1, face: 'north' },   // north
  { x: 0, y: 0, z: -1, face: 'south' },  // south
  { x: 1, y: 0, z: 0, face: 'east' },    // east
  { x: -1, y: 0, z: 0, face: 'west' }    // west
]

// Debug interface
interface DebugSettings {
  ALWAYS_VISIBLE: boolean
  MAX_LAYERS?: number
  MAX_ENTITIES?: number
}

/**
 * Creates and sets up the voxel system with an optimized approach:
 * 1. Stores all voxel data in a 3D grid structure
 * 2. Calculates which faces of each voxel are visible (not obscured by other blocks)
 * 3. Only creates entities for voxels that have at least one visible face
 * 4. Dynamically creates and destroys entities based on player proximity
 * 5. Limits the maximum number of entities to improve performance
 * 
 * This approach prioritizes creating entities for blocks closest to the player first,
 * and only creates entities for blocks that are actually visible (have at least one exposed face).
 * 
 * @param engine The Decentraland engine instance
 * @param voxelPositions Array of voxel positions from the terrain generator
 * @param visibilityThreshold Maximum distance for voxel visibility (in meters)
 * @param maxEntities Maximum number of entities to create at once
 * @param debug Optional debug settings to override default behavior
 * @param spawnParcelOffset Default X offset of 16 for the spawn parcel
 * @returns Object containing references to the grid and active entities
 */
export function createVoxelSystem(
  _engine: any,
  voxelPositions: VoxelPosition[],
  visibilityThreshold: number,
  maxEntities: number = 1000, // Default limit of 1000 entities
  debug?: DebugSettings,
  spawnParcelOffset: number = 16 // Default X offset of 16 for the spawn parcel
) {
  // Debug flags
  const alwaysVisible = debug?.ALWAYS_VISIBLE || false
  
  // Block type model mapping
  const modelPaths: Record<BlockType, string> = {
    [BlockType.GRASS]: 'models/grass.glb',
    [BlockType.DIRT]: 'models/dirt.glb',
    [BlockType.STONE_DARK]: 'models/stone_dark.glb',
    [BlockType.SAND]: 'models/sand.glb',
    [BlockType.WOOD]: 'models/woodplanks.glb',
    [BlockType.LEAVES]: 'models/leaves.glb',
    [BlockType.WOOD_PLANK_LIGHT_RED]: 'models/wood_plank_light_red.glb',
    [BlockType.WOOD_PLANK_DARK]: 'models/wood_plank_dark.glb',
    [BlockType.WATER]: 'models/water.glb'
  }

  // Create a 3D grid to store all voxel data
  // Using a Map with string keys for efficient lookups
  const grid: Map<string, GridCell> = new Map()
  
  // Track active entities for entity limit management
  const activeEntities: Entity[] = []
  
  // Generate grid key from coordinates
  function getGridKey(x: number, y: number, z: number): string {
    return `${x},${y},${z}`
  }
  
  // Initialize the grid with voxel positions
  voxelPositions.forEach(pos => {
    const key = getGridKey(pos.x, pos.y, pos.z)
    grid.set(key, {
      position: pos,
      entity: null,
      visibleFaces: {
        top: false,
        bottom: false,
        north: false,
        south: false,
        east: false,
        west: false
      }
    })
  })
  
  // Calculate visible faces for all grid cells
  grid.forEach((cell, key) => {
    // Check each direction (top, bottom, north, south, east, west)
    DIRECTIONS.forEach(dir => {
      const neighborKey = getGridKey(
        cell.position.x + dir.x,
        cell.position.y + dir.y,
        cell.position.z + dir.z
      )
      
      // If no neighbor in this direction or it's water, the face is visible
      const neighbor = grid.get(neighborKey)
      
      // Special handling for water - water blocks should be visible through other water blocks
      const isNeighborWater = neighbor?.position.type === BlockType.WATER
      const isCurrentWater = cell.position.type === BlockType.WATER
      
      // A face is visible if:
      // 1. There's no neighboring block in that direction, or
      // 2. The current block is not water and the neighbor is water
      // (water blocks should be transparent to each other)
      if (!neighbor || (!isCurrentWater && isNeighborWater)) {
        cell.visibleFaces[dir.face as keyof typeof cell.visibleFaces] = true
      }
    })
  })
  
  // Log statistics about the grid
  let totalBlocks = grid.size
  let visibleFaceBlocks = 0
  
  grid.forEach(cell => {
    // Count blocks with at least one visible face
    if (Object.values(cell.visibleFaces).some(visible => visible)) {
      visibleFaceBlocks++
    }
  })
  
  console.log(`Total blocks in grid: ${totalBlocks}`)
  console.log(`Blocks with visible faces: ${visibleFaceBlocks} (${Math.round(visibleFaceBlocks / totalBlocks * 100)}%)`)
  
  // Create entity for a grid cell
  function createEntityForCell(cell: GridCell): Entity {
    const entity = engine.addEntity()
    
    // Add GltfContainer component (model) based on block type
    GltfContainer.create(entity, {
      src: modelPaths[cell.position.type],
      invisibleMeshesCollisionMask: ColliderLayer.CL_NONE,
      visibleMeshesCollisionMask: cell.position.type === BlockType.WATER ? 
        ColliderLayer.CL_POINTER : // Water has no collision, only pointer
        ColliderLayer.CL_PHYSICS | ColliderLayer.CL_POINTER,
    })
    
    // Add Transform component (position)
    // Apply a 0.5 offset in each direction to account for the center origin of the GLB model
    // Add 16 to X to account for the spawn parcel offset
    Transform.create(entity, {
      position: Vector3.create(
        cell.position.x + 0.5 + spawnParcelOffset, // Add 16 to X for spawn parcel offset
        cell.position.y + 0.5, 
        cell.position.z + 0.5
      )
    })
    
    // Add VisibilityComponent (initially visible if in debug mode)
    VisibilityComponent.create(entity, {
      visible: alwaysVisible
    })
    
    // Store the entity reference and add to active entities list
    cell.entity = entity
    activeEntities.push(entity)
    
    return entity
  }
  
  // Remove entity for a grid cell
  function removeEntityForCell(cell: GridCell): void {
    if (cell.entity) {
      // Remove from engine
      engine.removeEntity(cell.entity)
      
      // Remove from active entities list
      const index = activeEntities.indexOf(cell.entity)
      if (index !== -1) {
        activeEntities.splice(index, 1)
      }
      
      // Clear entity reference
      cell.entity = null
    }
  }
  
  // Determine if a cell should be visible based on distance and face visibility
  function shouldBeVisible(cell: GridCell, playerPos: Vector3): boolean {
    // Always visible in debug mode
    if (alwaysVisible) return true
    
    // Check if any face is visible
    const hasVisibleFace = Object.values(cell.visibleFaces).some(visible => visible)
    if (!hasVisibleFace) {
      return false // No visible faces, no need to create entity
    }
    
    // Calculate distance from player to voxel
    const cellPos = Vector3.create(
      cell.position.x + 0.5 + spawnParcelOffset, // Add 16 to X for spawn parcel offset
      cell.position.y + 0.5,
      cell.position.z + 0.5
    )
    const distance = Vector3.distance(playerPos, cellPos)
    
    // Only visible if within threshold distance
    return distance < visibilityThreshold
  }
  
  // Create a system that updates visibility and manages entities
  if (!alwaysVisible) {
    const visibilitySystem = () => {
      // Get player's position
      const playerTransform = Transform.getMutableOrNull(engine.PlayerEntity)
      if (!playerTransform) {
        return
      }
      const playerPos = playerTransform.position
      
      // Track entities to be made visible and invisible
      const cellsToMakeVisible: GridCell[] = []
      const cellsToMakeInvisible: GridCell[] = []
      
      // Determine which cells should be visible or invisible
      grid.forEach(cell => {
        const shouldBeVisibleNow = shouldBeVisible(cell, playerPos)
        
        if (shouldBeVisibleNow && !cell.entity) {
          // Cell should be visible but has no entity
          cellsToMakeVisible.push(cell)
        } else if (!shouldBeVisibleNow && cell.entity) {
          // Cell has entity but should not be visible
          cellsToMakeInvisible.push(cell)
        }
      })
      
      // Sort cells to make visible by distance to player (closest first)
      cellsToMakeVisible.sort((a, b) => {
        const aPos = Vector3.create(a.position.x + 0.5 + spawnParcelOffset, a.position.y + 0.5, a.position.z + 0.5)
        const bPos = Vector3.create(b.position.x + 0.5 + spawnParcelOffset, b.position.y + 0.5, b.position.z + 0.5)
        const aDistance = Vector3.distance(playerPos, aPos)
        const bDistance = Vector3.distance(playerPos, bPos)
        return aDistance - bDistance
      })
      
      // Process cells to make invisible first to free up entity slots
      cellsToMakeInvisible.forEach(cell => {
        removeEntityForCell(cell)
      })
      
      // Process cells to make visible, up to the maximum entity limit
      let createdCount = 0
      for (const cell of cellsToMakeVisible) {
        // Check if we've reached the entity limit
        if (activeEntities.length >= maxEntities) {
          break
        }
        
        createEntityForCell(cell)
        createdCount++
      }
      
      // If we tried to create entities, log the result
      if (cellsToMakeVisible.length > 0 || cellsToMakeInvisible.length > 0) {
        console.log(`Visibility update: Removed ${cellsToMakeInvisible.length}, Added ${createdCount}, Active ${activeEntities.length}, Pending ${cellsToMakeVisible.length - createdCount}`)
      }
    }
    
    // Add the visibility system to the engine
    engine.addSystem(visibilitySystem)
  } else {
    // In debug mode (always visible), create entities for all blocks with at least one visible face
    console.log(`Debug mode: Creating entities for all ${visibleFaceBlocks} blocks with visible faces`)
    
    let createdCount = 0
    grid.forEach(cell => {
      const hasVisibleFace = Object.values(cell.visibleFaces).some(visible => visible)
      
      if (hasVisibleFace && createdCount < maxEntities) {
        createEntityForCell(cell)
        createdCount++
      }
    })
    
    console.log(`Created ${createdCount} entities in debug mode (max: ${maxEntities})`)
  }
  
  // Return a reference to the grid and active entities for external access
  return {
    grid,
    activeEntities,
    
    // Add a function to preload voxels around a specific location
    preloadAroundLocation: (centerX: number, centerY: number, centerZ: number, radius: number) => {
      console.log(`Preloading voxels around (${centerX}, ${centerY}, ${centerZ}) with radius ${radius}`)
      
      // Create a center position vector
      const centerPos = Vector3.create(centerX, centerY, centerZ)
      
      // Find cells within radius of the center position, with visible faces
      const cellsToPreload: GridCell[] = []
      
      grid.forEach(cell => {
        // Check if the cell has any visible faces
        const hasVisibleFace = Object.values(cell.visibleFaces).some(visible => visible)
        if (!hasVisibleFace) return
        
        // Calculate position with offset
        const cellPos = Vector3.create(
          cell.position.x + 0.5 + spawnParcelOffset,
          cell.position.y + 0.5,
          cell.position.z + 0.5
        )
        
        // Calculate distance to center
        const distance = Vector3.distance(centerPos, cellPos)
        
        // If within radius and no entity created yet, add to preload list
        if (distance < radius && !cell.entity) {
          cellsToPreload.push(cell)
        }
      })
      
      // Sort by distance to center
      cellsToPreload.sort((a, b) => {
        const aPos = Vector3.create(
          a.position.x + 0.5 + spawnParcelOffset,
          a.position.y + 0.5,
          a.position.z + 0.5
        )
        const bPos = Vector3.create(
          b.position.x + 0.5 + spawnParcelOffset,
          b.position.y + 0.5,
          b.position.z + 0.5
        )
        
        const aDistance = Vector3.distance(centerPos, aPos)
        const bDistance = Vector3.distance(centerPos, bPos)
        
        return aDistance - bDistance
      })
      
      // Create entities for the closest voxels up to maxEntities/2
      // We reserve half the available entities for the preload and leave the other half for dynamic loading
      const preloadLimit = Math.floor(maxEntities / 2)
      let preloadCount = 0
      
      for (const cell of cellsToPreload) {
        if (activeEntities.length >= preloadLimit) break
        createEntityForCell(cell)
        preloadCount++
      }
      
      console.log(`Preloaded ${preloadCount} voxels around center location (${cellsToPreload.length - preloadCount} more in queue)`)
      return preloadCount
    }
  }
} 