import { engine, GltfContainer, Entity } from '@dcl/sdk/ecs'

// Stores model loading status
interface ModelLoadingState {
  totalModels: number
  loadingStartTime: number
  isComplete: boolean
  onComplete?: () => void
}

// Current loading state
const state: ModelLoadingState = {
  totalModels: 0,
  loadingStartTime: 0,
  isComplete: false
}

// Loading timeout in milliseconds (models should load within this time)
const LOADING_TIMEOUT = 5000 // 5 seconds

/**
 * Initializes the model loading tracking system
 * @param onAllModelsLoaded Callback to execute when all models are loaded
 */
export function initModelLoadingSystem(onAllModelsLoaded?: () => void): void {
  // Store the callback
  state.onComplete = onAllModelsLoaded
  
  // Reset the state
  state.totalModels = 0
  state.isComplete = false
  state.loadingStartTime = Date.now()

  console.log('Model loading system initialized')
  
  // Add system to check if enough time has passed for models to load
  engine.addSystem(checkModelLoadingTimeout)
}

/**
 * System that uses a timeout to determine when models are likely loaded
 */
function checkModelLoadingTimeout(): void {
  if (state.isComplete) return
  
  // Check if we've passed the loading timeout
  const elapsed = Date.now() - state.loadingStartTime
  
  if (elapsed > LOADING_TIMEOUT) {
    console.log(`Model loading timeout reached (${LOADING_TIMEOUT}ms)`)
    
    if (!state.isComplete && state.onComplete) {
      state.isComplete = true
      state.onComplete()
    }
  }
}

/**
 * Registers a model to be tracked for loading
 * @param entity The entity with GltfContainer
 */
export function trackModelLoading(entity: Entity): void {
  if (GltfContainer.has(entity)) {
    state.totalModels++
  }
} 