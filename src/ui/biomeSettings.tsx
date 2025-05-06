import { BiomeSettings, DEFAULT_BIOME_SETTINGS } from '../terrain/terrain-generator'
import { Color4 } from '@dcl/sdk/math'
import { slug } from '../resources'
import ReactEcs, { UiEntity } from '@dcl/sdk/react-ecs'
import { dimensions } from './helpers'
// State management
let showSettings = false
let currentSettings: BiomeSettings = {...DEFAULT_BIOME_SETTINGS}
let onApplySettings: ((settings: BiomeSettings) => void) | null = null

// Function to toggle settings panel visibility
export function toggleBiomeSettings(show?: boolean): void {
  showSettings = show !== undefined ? show : !showSettings
}

// Function to set the callback for when settings are applied
export function setOnApplySettings(callback: (settings: BiomeSettings) => void): void {
  onApplySettings = callback
}

// Function to reset settings to defaults
function resetSettings(): void {
  currentSettings = {...DEFAULT_BIOME_SETTINGS}
}

// Function to apply settings
function applySettings(): void {
  if (onApplySettings) {
    onApplySettings(currentSettings)
  }
  toggleBiomeSettings(false)
}

// Helper function to update a specific setting
function updateSetting<K extends keyof BiomeSettings>(key: K, value: BiomeSettings[K]): void {
  currentSettings = {
    ...currentSettings,
    [key]: value
  }
}

// UI Component for biome settings
export function BiomeSettingsPanel() {
  if (!showSettings) return null

  return (
    <UiEntity
      key={slug + "biome::settings"}
      uiTransform={{
        width:dimensions.width * 0.5,
        height:dimensions.height * 0.5,
        padding: 20
      }}
      uiBackground={{
        color: Color4.create(0.2, 0.2, 0.2, 0.9)
      }}
    >
        </UiEntity>

  )
} 