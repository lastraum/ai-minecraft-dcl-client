import { engine, GltfContainer, Entity, GltfContainerLoadingState } from '@dcl/sdk/ecs'

// Stores model loading status
interface ModelLoadingState {
  trackedEntities: Entity[]
  isComplete: boolean
  onComplete?: () => void
  checkInterval: number
  timeSinceLastCheck: number
}

// Current loading state
const state: ModelLoadingState = {
  trackedEntities: [],
  isComplete: false,
  checkInterval: 1, // Check every 1 second
  timeSinceLastCheck: 0
}

// Maximum time to wait for models to load before giving up (in seconds)
const LOADING_MAX_TIMEOUT = 20 // 20 seconds

/**
 * Initializes the model loading tracking system
 * @param onAllModelsLoaded Callback to execute when all models are loaded
 */
export function initModelLoadingSystem(onAllModelsLoaded?: () => void): void {
  // Store the callback
  state.onComplete = onAllModelsLoaded
  
  // Reset the state
  state.trackedEntities = []
  state.isComplete = false
  state.timeSinceLastCheck = 0

  console.log('Model loading system initialized')
  
  // Add system to check model loading states
  engine.addSystem(checkModelLoadingStates)
}

/**
 * System that checks the loading status of tracked GLTF models
 */
function checkModelLoadingStates(dt: number): void {
  // Skip if already complete
  if (state.isComplete) return
  
  // Check periodically rather than every frame
  state.timeSinceLastCheck += dt
  if (state.timeSinceLastCheck < state.checkInterval) return
  
  // Reset interval timer
  state.timeSinceLastCheck = 0
  
  // Log the number of tracked entities
  if (state.trackedEntities.length > 0) {
    console.log(`Checking loading status of ${state.trackedEntities.length} models...`)
  }
  
  // Track loading stats
  let totalEntities = state.trackedEntities.length
  let loadedEntities = 0
  let errorEntities = 0
  let unknownEntities = 0
  
  // Stop tracking entities that no longer exist
  state.trackedEntities = state.trackedEntities.filter(entity => 
    GltfContainer.has(entity)
  )
  
  // Check loading state of each entity
  for (const entity of state.trackedEntities) {
    const loadingState = GltfContainerLoadingState.getOrNull(entity)
    
    // Skip if no loading state component
    if (!loadingState) continue
    
    // Track loading state based on currentState value
    const currentState = loadingState.currentState
    
    if (currentState === 2) { // FINISHED
      loadedEntities++
    } else if (currentState === 3) { // FINISHED_WITH_ERROR
      errorEntities++
      loadedEntities++ // Count errors as "loaded" since they won't change
    } else if (currentState === 0) { // UNKNOWN
      unknownEntities++
    }
    // LOADING (1) state doesn't need special handling, just waiting
  }
  
  // Handle case when all entities are loaded (or had errors)
  if (loadedEntities >= totalEntities && totalEntities > 0) {
    console.log(`All models loaded! (${loadedEntities}/${totalEntities}, with ${errorEntities} errors)`)
    completeLoading()
  } else if (totalEntities > 0) {
    // Log progress
    const percentComplete = Math.floor((loadedEntities / totalEntities) * 100)
    console.log(`Loading progress: ${loadedEntities}/${totalEntities} models (${percentComplete}%)`)
    
    // Check if we've been running too long and need to time out
    if (state.timeSinceLastCheck > LOADING_MAX_TIMEOUT) {
      console.log(`Loading timed out after ${LOADING_MAX_TIMEOUT} seconds. Some models may not have loaded correctly.`)
      completeLoading()
    }
  }
}

/**
 * Complete the loading process and trigger callback
 */
function completeLoading(): void {
  if (!state.isComplete && state.onComplete) {
    state.isComplete = true
    state.onComplete()
  }
}

/**
 * Registers a model to be tracked for loading
 * @param entity The entity with GltfContainer
 */
export function trackModelLoading(entity: Entity): void {
  if (GltfContainer.has(entity) && !state.trackedEntities.includes(entity)) {
    state.trackedEntities.push(entity)
  }
} 