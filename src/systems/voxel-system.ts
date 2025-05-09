import { ColliderLayer, engine, Entity, GltfContainer, Transform, VisibilityComponent } from '@dcl/sdk/ecs'
import { Vector3 } from '@dcl/sdk/math'
import { VoxelPosition, BlockType, DebugSettings, GridCell, DIRECTIONS, MODEL_PATHS } from '../resources'
import { HORIZONTAL_VISIBILITY_THRESHOLD, VERTICAL_VISIBILITY_THRESHOLD } from '../resources'



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
      src: MODEL_PATHS[cell.position.type],
      invisibleMeshesCollisionMask: ColliderLayer.CL_NONE,
      visibleMeshesCollisionMask: cell.position.type === BlockType.WATER ? 
        ColliderLayer.CL_POINTER : // Water has no collision, only pointer
        ColliderLayer.CL_PHYSICS | ColliderLayer.CL_POINTER,
    })
    
    // Add Transform component (position)
    // Apply a 0.5 offset in each direction to account for the center origin of the GLB model
    Transform.create(entity, {
      position: Vector3.create(
        cell.position.x + 0.5, // No spawn parcel offset needed
        cell.position.y + 0.5, 
        cell.position.z + 0.5
      )
    })
    
    // Add VisibilityComponent (always initially visible when created)
    VisibilityComponent.create(entity, {
      visible: true
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
    // Check if any face is visible first
    const hasVisibleFace = Object.values(cell.visibleFaces).some(visible => visible)
    if (!hasVisibleFace) {
      return false // No visible faces, no need to create entity
    }
    
    // Calculate distance from player to voxel
    const cellPos = Vector3.create(
      cell.position.x + 0.5,
      cell.position.y + 0.5,
      cell.position.z + 0.5
    )
    
    // Calculate horizontal and vertical distances separately
    const horizontalDistance = Math.sqrt(
      Math.pow(playerPos.x - cellPos.x, 2) + 
      Math.pow(playerPos.z - cellPos.z, 2)
    )
    const verticalDistance = Math.abs(playerPos.y - cellPos.y)
    
    // Debug logging for cells near the edge of visibility
    if (horizontalDistance > HORIZONTAL_VISIBILITY_THRESHOLD * 0.8) {
      // console.log(`Cell at (${cellPos.x}, ${cellPos.y}, ${cellPos.z}) - Horizontal distance: ${horizontalDistance}, Vertical distance: ${verticalDistance}`)
    }
    
    // In debug mode (ALWAYS_VISIBLE), all voxels with visible faces are visible regardless of distance
    if (alwaysVisible) return true;
    
    // Use different thresholds for horizontal and vertical visibility
    return horizontalDistance < HORIZONTAL_VISIBILITY_THRESHOLD && 
           verticalDistance < VERTICAL_VISIBILITY_THRESHOLD
  }
  
  // Create a system that updates visibility and manages entities
  // Create the visibility system regardless of ALWAYS_VISIBLE mode
  const visibilitySystem = () => {
    // Get player's position
    const playerTransform = Transform.getMutableOrNull(engine.PlayerEntity)
    if (!playerTransform) {
      console.log('No player transform found')
      return
    }
    const playerPos = playerTransform.position
    
    // Always log player position for debugging
    console.log(`Player position: (${playerPos.x}, ${playerPos.y}, ${playerPos.z})`)
    
    // Track entities to be made visible and invisible
    const cellsToMakeVisible: GridCell[] = []
    const cellsToMakeInvisible: GridCell[] = []
    
    // Log grid statistics
    let totalCells = 0
    let cellsWithEntities = 0
    let cellsInRange = 0
    
    // Determine which cells should be visible or invisible
    grid.forEach(cell => {
      totalCells++
      if (cell.entity) cellsWithEntities++
      
      // For both modes, use shouldBeVisible which handles both ALWAYS_VISIBLE and distance checks
      const shouldBeVisibleNow = shouldBeVisible(cell, playerPos)
      
      if (shouldBeVisibleNow) cellsInRange++
      
      if (shouldBeVisibleNow && !cell.entity) {
        // Cell should be visible but has no entity
        cellsToMakeVisible.push(cell)
      } else if (!shouldBeVisibleNow && cell.entity) {
        // Cell has entity but should not be visible - only used in normal mode
        if (!alwaysVisible) {
          cellsToMakeInvisible.push(cell)
        }
      }
    })
    
    // Log grid statistics
    console.log(`Grid stats: Total=${totalCells}, WithEntities=${cellsWithEntities}, InRange=${cellsInRange}`)
    
    // Sort cells to make visible by distance to player (closest first)
    cellsToMakeVisible.sort((a, b) => {
      const aPos = Vector3.create(
        a.position.x + 0.5,
        a.position.y + 0.5,
        a.position.z + 0.5
      )
      const bPos = Vector3.create(
        b.position.x + 0.5,
        b.position.y + 0.5,
        b.position.z + 0.5
      )
      const aDistance = Vector3.distance(playerPos, aPos)
      const bDistance = Vector3.distance(playerPos, bPos)
      return aDistance - bDistance
    })
    
    // In normal mode, process cells to make invisible first to free up entity slots
    if (!alwaysVisible) {
      cellsToMakeInvisible.forEach(cell => {
        removeEntityForCell(cell)
      })
    }
    
    // Process cells to make visible, up to the maximum entity limit
    let createdCount = 0
    for (const cell of cellsToMakeVisible) {
      // Check if we've reached the entity limit
      if (activeEntities.length >= maxEntities) {
        console.log(`Reached entity limit of ${maxEntities}`)
        break
      }
      
      createEntityForCell(cell)
      createdCount++
    }
    
    // Always log visibility updates
    console.log(`Visibility update: Removed=${cellsToMakeInvisible.length}, Added=${createdCount}, Active=${activeEntities.length}, Pending=${cellsToMakeVisible.length - createdCount}`)
  }
  
  // Add the visibility system to the engine regardless of debug mode
  engine.addSystem(visibilitySystem)
  
  // In debug mode (always visible), preload entities for all blocks with at least one visible face
  if (alwaysVisible) {
    console.log(`Debug mode: Creating entities for all ${visibleFaceBlocks} blocks with visible faces`)
    
    // Sort cells by distance from center (0,0,0) to prioritize central area
    const sortedCells: GridCell[] = []
    grid.forEach(cell => {
      const hasVisibleFace = Object.values(cell.visibleFaces).some(visible => visible)
      if (hasVisibleFace) {
        sortedCells.push(cell)
      }
    })
    
    // Sort by distance from center
    sortedCells.sort((a, b) => {
      const aPos = Vector3.create(
        a.position.x + 0.5,
        a.position.y + 0.5,
        a.position.z + 0.5
      )
      const bPos = Vector3.create(
        b.position.x + 0.5,
        b.position.y + 0.5,
        b.position.z + 0.5
      )
      const center = Vector3.create(80, 0, 80) // Center of our 10x10 grid
      const aDistance = Vector3.distance(center, aPos)
      const bDistance = Vector3.distance(center, bPos)
      return aDistance - bDistance
    })
    
    // Create entities for the closest cells up to the entity limit
    let createdCount = 0
    const initialLoadLimit = Math.min(Math.floor(maxEntities * 0.7), sortedCells.length) // Use only 70% of entity limit for initial load
    
    for (const cell of sortedCells) {
      if (createdCount >= initialLoadLimit) {
        console.log(`Reached initial load limit of ${initialLoadLimit}`)
        break
      }
      createEntityForCell(cell)
      createdCount++
    }
    
    console.log(`Created ${createdCount} entities in debug mode (max: ${maxEntities})`)
    console.log(`Remaining cells without entities: ${sortedCells.length - createdCount} (will be dynamically loaded)`)
  }
  
  // Return a reference to the grid and active entities for external access
  return {
    grid,
    activeEntities,
    
    // Add a function to preload voxels around a specific location
    preloadAroundLocation: function(centerX: number, centerY: number, centerZ: number, radius: number): number {
      console.log(`[VoxelSystem] Starting preload at (${centerX}, ${centerY}, ${centerZ}) with radius ${radius}`)
      console.log(`[VoxelSystem] Current grid size: ${grid.size}`)
      console.log(`[VoxelSystem] Current active entities: ${activeEntities.length}`)
      
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
          cell.position.x + 0.5,
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
      
      console.log(`[VoxelSystem] Found ${cellsToPreload.length} cells to preload`)
      
      // Sort by distance to center
      cellsToPreload.sort((a, b) => {
        const aPos = Vector3.create(
          a.position.x + 0.5,
          a.position.y + 0.5,
          a.position.z + 0.5
        )
        const bPos = Vector3.create(
          b.position.x + 0.5,
          b.position.y + 0.5,
          b.position.z + 0.5
        )
        
        const aDistance = Vector3.distance(centerPos, aPos)
        const bDistance = Vector3.distance(centerPos, bPos)
        
        return aDistance - bDistance
      })
      
      // Calculate how many entities we can create
      const availableSlots = maxEntities - activeEntities.length
      const preloadLimit = Math.min(Math.floor(availableSlots * 0.5), cellsToPreload.length)
      
      console.log(`[VoxelSystem] Available entity slots: ${availableSlots}, Preload limit: ${preloadLimit}`)
      
      // Create entities for the closest voxels up to the preload limit
      let preloadCount = 0
      
      for (const cell of cellsToPreload) {
        if (preloadCount >= preloadLimit) {
          console.log(`[VoxelSystem] Reached preload limit of ${preloadLimit}`)
          break
        }
        createEntityForCell(cell)
        preloadCount++
      }
      
      console.log(`[VoxelSystem] Preloaded ${preloadCount} voxels (${cellsToPreload.length - preloadCount} more in queue)`)
      return preloadCount
    }
  }
} 