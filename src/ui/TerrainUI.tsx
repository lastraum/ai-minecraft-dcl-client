import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import { DEFAULT_BIOME_SETTINGS, slug } from '../resources';
import { dimensions } from './helpers';
import { Color4 } from '@dcl/sdk/math';
import { view } from './newBiome';
import { getBiomeSettings, getRange, updateBiomeSetting, updateRange } from '../state/biomeState';

export function TerrainUI(){
    return (
        <UiEntity
            key={slug + "new::biome::ui::terrain"}
            uiTransform={{
                display: view === "Terrain" ?  'flex' : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
                margin:{top:'5%'}
            }}
            // uiBackground={{color:Color4.create(0,0,1,0.5)}}
           >

{/* terrain height */}
<UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
                height: '20%',
            }}
            // uiBackground={{color:Color4.Red()}}
           >


<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '45%',
                height: '100%',
            }}
           >
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{bottom:'5%'}
            }}
            uiText={{
                value: "Terrain Height Min: " + getRange('terrainHeight').min,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Terrain Height Min"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('terrainHeight', parseInt(value), getRange('terrainHeight').max)
           }}   
           onSubmit={(value) => {
            updateRange('terrainHeight', parseInt(value), getRange('terrainHeight').max)
           }}
            uiTransform={{
                width: '100%',
                height: '50%',
            }}
            uiBackground={{color:Color4.Black()}}
           />
</UiEntity>
<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '45%',
                height: '100%',
                margin:{left:'2%'}
            }}
           >
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{bottom:'5%'}
            }}
            uiText={{
                value: "Terrain Height Max: " + getRange('terrainHeight').max,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Terrain Height Max"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('terrainHeight', getRange('terrainHeight').min, parseInt(value))
           }}   
           onSubmit={(value) => {
            updateRange('terrainHeight', getRange('terrainHeight').min, parseInt(value))
           }}
            uiTransform={{
                width: '100%',
                height: '50%',
            }}
            uiBackground={{color:Color4.Black()}}
           />
</UiEntity>


</UiEntity>

{/* terrain variation */}
<UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
                height: '20%',
                margin:{top:'5%'}
            }}
            // uiBackground={{color:Color4.Red()}}
           >


<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '45%',
                height: '100%',
            }}
           >
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{bottom:'5%'}
            }}
            uiText={{
                value: "Terrain Variation Min: " + getRange('terrainVariation').min,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Terrain Variation Min"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('terrainVariation', parseInt(value), getRange('terrainVariation').max)
           }}   
           onSubmit={(value) => {
            updateRange('terrainVariation', parseInt(value), getRange('terrainVariation').max)
           }}
            uiTransform={{
                width: '100%',
                height: '50%',
            }}
            uiBackground={{color:Color4.Black()}}
           />
</UiEntity>
<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '45%',
                height: '100%',
                margin:{left:'2%'}
            }}
           >
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{bottom:'5%'}
            }}
            uiText={{
                value: "Terrain Variation Max: " + getRange('terrainVariation').max,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Terrain Variation Max"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('terrainVariation', getRange('terrainVariation').min, parseInt(value))
           }}   
           onSubmit={(value) => {
            updateRange('terrainVariation', getRange('terrainVariation').min, parseInt(value))
           }}
            uiTransform={{
                width: '100%',
                height: '50%',
            }}
            uiBackground={{color:Color4.Black()}}
           />
</UiEntity>


</UiEntity>

{/* hill frequency */}
<UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '90%',
                height: '20%',
                margin:{top:'5%'}
            }}
            // uiBackground={{color:Color4.Red()}}
           >

<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
            }}
           >
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '50%',
                margin:{top:'20%'}
            }}
            uiText={{
                value: (getBiomeSettings().hillsEnabled ? "Disable" : " Enable") + " Hills",
                fontSize: 15,
                color: Color4.Black(),
                textAlign:'middle-left'
            }}
            uiBackground={{color:getBiomeSettings().hillsEnabled ? Color4.Red() : Color4.Green()}}
            onMouseDown={() => {
                updateBiomeSetting('hillsEnabled', !getBiomeSettings().hillsEnabled)
            }}
           />
</UiEntity>

<UiEntity
            uiTransform={{
                display: getBiomeSettings().hillsEnabled ? "flex" : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '45%',
                height: '100%',
            }}
           >
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{bottom:'5%'}
            }}
            uiText={{
                value: "Hill Frequency Min: " + getRange('hillFrequency').min,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Hill Frequency Min"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('hillFrequency', parseInt(value), getRange('hillFrequency').max)
           }}   
           onSubmit={(value) => {
            updateRange('hillFrequency', parseInt(value), getRange('hillFrequency').max)
           }}
            uiTransform={{
                width: '100%',
                height: '50%',
            }}
            uiBackground={{color:Color4.Black()}}
           />
</UiEntity>
<UiEntity
            uiTransform={{
                display: getBiomeSettings().hillsEnabled ? "flex" : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '45%',
                height: '100%',
                margin:{left:'2%'}
            }}
           >
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{bottom:'5%'}
            }}
            uiText={{
                value: "Hill Frequency Max: " + getRange('hillFrequency').max,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Hill Frequency Max"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('hillFrequency', getRange('hillFrequency').min, parseInt(value))
           }}   
           onSubmit={(value) => {
            updateRange('hillFrequency', getRange('hillFrequency').min, parseInt(value))
           }}
            uiTransform={{
                width: '100%',
                height: '50%',
            }}
            uiBackground={{color:Color4.Black()}}
           />
</UiEntity>


</UiEntity>

{/* hill height */}
<UiEntity
            uiTransform={{
                display: getBiomeSettings().hillsEnabled ? "flex" : "none",
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
                height: '20%',
                margin:{top:'5%'}
            }}
            // uiBackground={{color:Color4.Red()}}
           >
<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
            }}
           >
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '50%',
                margin:{top:'20%'}
            }}

           />
</UiEntity>

<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '45%',
                height: '100%',
            }}
           >
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{bottom:'5%'}
            }}
            uiText={{
                value: "Hill Height Min: " + getRange('hillHeight').min,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Hill Height Min"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('hillHeight', parseInt(value), getRange('hillHeight').max)
           }}   
           onSubmit={(value) => {
            updateRange('hillHeight', parseInt(value), getRange('hillHeight').max)
           }}
            uiTransform={{
                width: '100%',
                height: '50%',
            }}
            uiBackground={{color:Color4.Black()}}
           />
</UiEntity>
<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '45%',
                height: '100%',
                margin:{left:'2%'}
            }}
           >
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{bottom:'5%'}
            }}
            uiText={{
                value: "Hill Height Max: " + getRange('hillHeight').max,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Hill Height Max"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('hillHeight', getRange('hillHeight').min, parseInt(value))
           }}   
           onSubmit={(value) => {
            updateRange('hillHeight', getRange('hillHeight').min, parseInt(value))
           }}
            uiTransform={{
                width: '100%',
                height: '50%',
            }}
            uiBackground={{color:Color4.Black()}}
           />
</UiEntity>


</UiEntity>

{/* hill steepness */}
<UiEntity
            uiTransform={{
                display: getBiomeSettings().hillsEnabled ? "flex" : "none",
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
                height: '20%',
                margin:{top:'5%'}
            }}
            // uiBackground={{color:Color4.Red()}}
           >

<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '15%',
                height: '100%',
            }}
           >
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '50%',
                margin:{top:'20%'}
            }}

           />
</UiEntity>
<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '45%',
                height: '100%',
            }}
           >
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{bottom:'5%'}
            }}
            uiText={{
                value: "Hill Steepness Min: " + getRange('hillSteepness').min,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Hill Steepness Min"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('hillSteepness', parseInt(value), getRange('hillSteepness').max)
           }}   
           onSubmit={(value) => {
            updateRange('hillSteepness', parseInt(value), getRange('hillSteepness').max)
           }}
            uiTransform={{
                width: '100%',
                height: '50%',
            }}
            uiBackground={{color:Color4.Black()}}
           />
</UiEntity>
<UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '45%',
                height: '100%',
                margin:{left:'2%'}
            }}
           >
            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '20%',
                margin:{bottom:'5%'}
            }}
            uiText={{
                value: "Hill Steepness Max: " + getRange('hillSteepness').max,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Hill Steepness Max"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('hillSteepness', getRange('hillSteepness').min, parseInt(value))
           }}   
           onSubmit={(value) => {
            updateRange('hillSteepness', getRange('hillSteepness').min, parseInt(value))
           }}
            uiTransform={{
                width: '100%',
                height: '50%',
            }}
            uiBackground={{color:Color4.Black()}}
           />
</UiEntity>


</UiEntity>

           </UiEntity>
    )
}