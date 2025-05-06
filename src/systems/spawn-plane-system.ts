import { engine, Entity, Transform, MeshRenderer, MeshCollider, Material } from '@dcl/sdk/ecs'
import { Vector3, Color4, Quaternion } from '@dcl/sdk/math'

let spawnPlaneEntity: Entity | null = null

/**
 * Creates a spawn plane for the player to land on while the scene is loading
 * @returns The spawn plane entity
 */
export function createSpawnPlane(): Entity {
  // If the spawn plane already exists, return it
  if (spawnPlaneEntity !== null) {
    return spawnPlaneEntity
  }

  console.log('Creating spawn plane')
  
  // Create spawn plane entity
  spawnPlaneEntity = engine.addEntity()
  
  // Position it high above the scene
  Transform.create(spawnPlaneEntity, {
    position: Vector3.create(8, 20, 8), // Center of the scene at y=30
    scale: Vector3.create(16, 16, 1), // Cover the whole scene (16x16)
    rotation: Quaternion.fromEulerDegrees(90, 0, 0)
  })
  
  // Add mesh and material (semi-transparent)
  MeshRenderer.setPlane(spawnPlaneEntity)
  Material.setPbrMaterial(spawnPlaneEntity, {
    albedoColor: Color4.create(0.5, 0.5, 0.5, 0.3), // Semi-transparent gray
    transparencyMode: 2 // Alpha blend
  })
  
  // Add collision
  MeshCollider.setPlane(spawnPlaneEntity)
  
  return spawnPlaneEntity
}

/**
 * Removes the spawn plane when the scene is fully loaded
 */
export function removeSpawnPlane(): void {
  if (spawnPlaneEntity) {
    console.log('Removing spawn plane')
    engine.removeEntity(spawnPlaneEntity)
    spawnPlaneEntity = null
  }
} 