// import { BiomeSettings, DEFAULT_BIOME_SETTINGS, BIOME_CONFIG, UI_CONFIG } from '../resources'
// import { Color4 } from '@dcl/sdk/math'
// import { slug } from '../resources'
// import ReactEcs, { UiEntity, Button, Checkbox, Label, Slider, Input } from '@dcl/sdk/react-ecs'
// import { dimensions } from './helpers'
// // State management
// let showSettings = false
// let currentSettings: BiomeSettings = {...DEFAULT_BIOME_SETTINGS}
// let onApplySettings: ((settings: BiomeSettings) => void) | null = null

// // Function to toggle settings panel visibility
// export function toggleBiomeSettings(show?: boolean): void {
//   showSettings = show !== undefined ? show : !showSettings
// }

// // Function to set the callback for when settings are applied
// export function setOnApplySettings(callback: (settings: BiomeSettings) => void): void {
//   onApplySettings = callback
// }

// // Function to reset settings to defaults
// function resetSettings(): void {
//   currentSettings = {...DEFAULT_BIOME_SETTINGS}
// }

// // Function to apply settings
// function applySettings(): void {
//   if (onApplySettings) {
//     onApplySettings(currentSettings)
//   }
//   toggleBiomeSettings(false)
// }

// // Helper function to update a specific setting
// function updateSetting<K extends keyof BiomeSettings>(key: K, value: BiomeSettings[K]): void {
//   currentSettings = {
//     ...currentSettings,
//     [key]: value
//   }
// }

// // UI Component for biome settings
// export function BiomeSettingsPanel() {
//   if (!showSettings) return null

//   return (
//     <UiEntity
//       key={slug + "biome::settings"}
//       uiTransform={{
//         width: UI_CONFIG.BIOME_SETTINGS_PANEL_WIDTH,
//         height: UI_CONFIG.BIOME_SETTINGS_PANEL_HEIGHT,
//         position: { right: UI_CONFIG.BIOME_SETTINGS_MARGIN_RIGHT, top: UI_CONFIG.BIOME_SETTINGS_MARGIN_TOP },
//         padding: UI_CONFIG.BIOME_SETTINGS_PADDING
//       }}
//       uiBackground={{
//         color: UI_CONFIG.PANEL_BACKGROUND
//       }}
//     >
//       {/* Header */}
//       <UiEntity
//         uiTransform={{
//           width: '100%',
//           height: UI_CONFIG.HEADER_HEIGHT,
//           margin: { bottom: 10 }
//         }}
//       >
//         <Label
//           value="Biome Settings"
//           fontSize={UI_CONFIG.HEADER_FONT_SIZE}
//           color={Color4.White()}
//           textAlign="middle-center"
//         />
//       </UiEntity>
      
//       {/* Beach Settings */}
//       <UiEntity
//         uiTransform={{
//           width: '100%',
//           height: UI_CONFIG.CONTROL_HEIGHT,
//           margin: { bottom: 5 }
//         }}
//       >
//         <Label
//           value="Beach Size"
//           fontSize={UI_CONFIG.LABEL_FONT_SIZE}
//           color={Color4.White()}
//           textAlign="middle-left"
//         />
//         <Slider
//           uiTransform={{
//             width: '60%',
//             position: { right: 0 }
//           }}
//           min={BIOME_CONFIG.BEACH_SIZE_MIN}
//           max={BIOME_CONFIG.BEACH_SIZE_MAX}
//           step={BIOME_CONFIG.BEACH_SIZE_STEP}
//           value={currentSettings.beachSize}
//           onChange={(value) => updateSetting('beachSize', value)}
//         />
//       </UiEntity>
      
//       {/* Lake Settings */}
//       <UiEntity
//         uiTransform={{
//           width: '100%',
//           height: UI_CONFIG.CONTROL_HEIGHT,
//           margin: { bottom: 5 }
//         }}
//       >
//         <Label
//           value="Lake Enabled"
//           fontSize={UI_CONFIG.LABEL_FONT_SIZE}
//           color={Color4.White()}
//           textAlign="middle-left"
//         />
//         <Checkbox
//           uiTransform={{
//             width: '20px',
//             position: { right: 0 }
//           }}
//           checked={currentSettings.lakeEnabled}
//           onChange={(value) => updateSetting('lakeEnabled', value)}
//         />
//       </UiEntity>
      
//       <UiEntity
//         uiTransform={{
//           width: '100%',
//           height: UI_CONFIG.CONTROL_HEIGHT,
//           margin: { bottom: 5 }
//         }}
//         uiBackground={{ color: Color4.create(0, 0, 0, 0) }}
//       >
//         <Label
//           value="Lake Size"
//           fontSize={UI_CONFIG.LABEL_FONT_SIZE}
//           color={currentSettings.lakeEnabled ? Color4.White() : Color4.Gray()}
//           textAlign="middle-left"
//         />
//         <Slider
//           uiTransform={{
//             width: '60%',
//             position: { right: 0 }
//           }}
//           min={BIOME_CONFIG.LAKE_SIZE_MIN}
//           max={BIOME_CONFIG.LAKE_SIZE_MAX}
//           step={BIOME_CONFIG.LAKE_SIZE_STEP}
//           value={currentSettings.lakeSize}
//           onChange={(value) => updateSetting('lakeSize', value)}
//           disabled={!currentSettings.lakeEnabled}
//         />
//       </UiEntity>
      
//       <UiEntity
//         uiTransform={{
//           width: '100%',
//           height: UI_CONFIG.CONTROL_HEIGHT,
//           margin: { bottom: 5 }
//         }}
//       >
//         <Label
//           value="Lake Depth"
//           fontSize={UI_CONFIG.LABEL_FONT_SIZE}
//           color={currentSettings.lakeEnabled ? Color4.White() : Color4.Gray()}
//           textAlign="middle-left"
//         />
//         <Slider
//           uiTransform={{
//             width: '60%',
//             position: { right: 0 }
//           }}
//           min={BIOME_CONFIG.LAKE_DEPTH_MIN}
//           max={BIOME_CONFIG.LAKE_DEPTH_MAX}
//           step={BIOME_CONFIG.LAKE_DEPTH_STEP}
//           value={currentSettings.lakeDepth}
//           onChange={(value) => updateSetting('lakeDepth', value)}
//           disabled={!currentSettings.lakeEnabled}
//         />
//       </UiEntity>
      
//       {/* Forest Settings */}
//       <UiEntity
//         uiTransform={{
//           width: '100%',
//           height: UI_CONFIG.CONTROL_HEIGHT,
//           margin: { bottom: 5 }
//         }}
//       >
//         <Label
//           value="Tree Density"
//           fontSize={UI_CONFIG.LABEL_FONT_SIZE}
//           color={Color4.White()}
//           textAlign="middle-left"
//         />
//         <Slider
//           uiTransform={{
//             width: '60%',
//             position: { right: 0 }
//           }}
//           min={BIOME_CONFIG.TREE_DENSITY_MIN}
//           max={BIOME_CONFIG.TREE_DENSITY_MAX}
//           step={BIOME_CONFIG.TREE_DENSITY_STEP}
//           value={currentSettings.treeDensity}
//           onChange={(value) => updateSetting('treeDensity', value)}
//         />
//       </UiEntity>
      
//       {/* Cabin Settings */}
//       <UiEntity
//         uiTransform={{
//           width: '100%',
//           height: UI_CONFIG.CONTROL_HEIGHT,
//           margin: { bottom: 5 }
//         }}
//       >
//         <Label
//           value="Cabins Enabled"
//           fontSize={UI_CONFIG.LABEL_FONT_SIZE}
//           color={Color4.White()}
//           textAlign="middle-left"
//         />
//         <Checkbox
//           uiTransform={{
//             width: '20px',
//             position: { right: 0 }
//           }}
//           checked={currentSettings.cabinsEnabled}
//           onChange={(value) => updateSetting('cabinsEnabled', value)}
//         />
//       </UiEntity>
      
//       <UiEntity
//         uiTransform={{
//           width: '100%',
//           height: UI_CONFIG.CONTROL_HEIGHT,
//           margin: { bottom: 5 }
//         }}
//       >
//         <Label
//           value="Cabin Density"
//           fontSize={UI_CONFIG.LABEL_FONT_SIZE}
//           color={currentSettings.cabinsEnabled ? Color4.White() : Color4.Gray()}
//           textAlign="middle-left"
//         />
//         <Slider
//           uiTransform={{
//             width: '60%',
//             position: { right: 0 }
//           }}
//           min={BIOME_CONFIG.CABIN_DENSITY_MIN}
//           max={BIOME_CONFIG.CABIN_DENSITY_MAX}
//           step={BIOME_CONFIG.CABIN_DENSITY_STEP}
//           value={currentSettings.cabinDensity}
//           onChange={(value) => updateSetting('cabinDensity', value)}
//           disabled={!currentSettings.cabinsEnabled}
//         />
//       </UiEntity>
      
//       {/* Terrain Settings */}
//       <UiEntity
//         uiTransform={{
//           width: '100%',
//           height: UI_CONFIG.CONTROL_HEIGHT,
//           margin: { bottom: 5 }
//         }}
//       >
//         <Label
//           value="Terrain Height"
//           fontSize={UI_CONFIG.LABEL_FONT_SIZE}
//           color={Color4.White()}
//           textAlign="middle-left"
//         />
//         <Slider
//           uiTransform={{
//             width: '60%',
//             position: { right: 0 }
//           }}
//           min={BIOME_CONFIG.TERRAIN_HEIGHT_MIN}
//           max={BIOME_CONFIG.TERRAIN_HEIGHT_MAX}
//           step={BIOME_CONFIG.TERRAIN_HEIGHT_STEP}
//           value={currentSettings.terrainHeight}
//           onChange={(value) => updateSetting('terrainHeight', Math.floor(value))}
//         />
//       </UiEntity>
      
//       <UiEntity
//         uiTransform={{
//           width: '100%',
//           height: UI_CONFIG.CONTROL_HEIGHT,
//           margin: { bottom: 15 }
//         }}
//       >
//         <Label
//           value="Terrain Variation"
//           fontSize={UI_CONFIG.LABEL_FONT_SIZE}
//           color={Color4.White()}
//           textAlign="middle-left"
//         />
//         <Slider
//           uiTransform={{
//             width: '60%',
//             position: { right: 0 }
//           }}
//           min={BIOME_CONFIG.TERRAIN_VARIATION_MIN}
//           max={BIOME_CONFIG.TERRAIN_VARIATION_MAX}
//           step={BIOME_CONFIG.TERRAIN_VARIATION_STEP}
//           value={currentSettings.terrainVariation}
//           onChange={(value) => updateSetting('terrainVariation', Math.floor(value))}
//         />
//       </UiEntity>
      
//       {/* Buttons */}
//       <UiEntity
//         uiTransform={{
//           width: '100%',
//           height: UI_CONFIG.BUTTON_HEIGHT,
//           flexDirection: 'row',
//           justifyContent: 'space-between'
//         }}
//       >
//         <Button
//           uiTransform={{
//             width: '30%',
//             height: UI_CONFIG.BUTTON_HEIGHT
//           }}
//           value="Cancel"
//           fontSize={UI_CONFIG.BUTTON_FONT_SIZE}
//           onMouseDown={() => toggleBiomeSettings(false)}
//         />
        
//         <Button
//           uiTransform={{
//             width: '30%',
//             height: UI_CONFIG.BUTTON_HEIGHT
//           }}
//           value="Reset"
//           fontSize={UI_CONFIG.BUTTON_FONT_SIZE}
//           onMouseDown={() => resetSettings()}
//         />
        
//         <Button
//           uiTransform={{
//             width: '30%',
//             height: UI_CONFIG.BUTTON_HEIGHT
//           }}
//           value="Apply"
//           fontSize={UI_CONFIG.BUTTON_FONT_SIZE}
//           onMouseDown={() => applySettings()}
//         />
//       </UiEntity>
//     </UiEntity>
//   )
// } 