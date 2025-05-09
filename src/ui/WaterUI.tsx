import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import { slug } from '../resources';
import { Color4 } from '@dcl/sdk/math';
import { view } from './newBiome';
import { getBiomeSettings, updateBiomeSetting, getRange, updateRange } from '../state/biomeState';

export function WaterUI(){
    return (
        <UiEntity
            key={slug + "new::biome::ui::water"}
            uiTransform={{
                display: view === "Water" ?  'flex' : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.create(0,0,1,0.5)}}
           >

{/* beach size */}
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
                value: "Beach Size Min: " + getRange('beachSize').min,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Beach Size Min"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('beachSize', parseInt(value), getRange('beachSize').max)
           }}   
           onSubmit={(value) => {
            updateRange('beachSize', parseInt(value), getRange('beachSize').max)
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
                value: "Beach Size Max: " + getRange('beachSize').max,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Beach Size Max"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('beachSize', getRange('beachSize').min, parseInt(value))
           }}   
           onSubmit={(value) => {
            updateRange('beachSize', getRange('beachSize').min, parseInt(value))
           }}
            uiTransform={{
                width: '100%',
                height: '50%',
            }}
            uiBackground={{color:Color4.Black()}}
           />
</UiEntity>


</UiEntity>

{/* lake size */}
<UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
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
                value: (getBiomeSettings().lakeEnabled ? "Disable" : " Enable") + " Lake",
                fontSize: 15,
                color: Color4.Black(),
                textAlign:'middle-left'
            }}
            uiBackground={{color:getBiomeSettings().lakeEnabled ? Color4.Red() : Color4.Green()}}
            onMouseDown={() => {
                updateBiomeSetting('lakeEnabled', !getBiomeSettings().lakeEnabled)
            }}
           />
</UiEntity>

<UiEntity
            uiTransform={{
                display: getBiomeSettings().lakeEnabled ? "flex" : "none",
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
                value: "Lake Size Min: " + getRange('lakeSize').min,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Lake Size Min"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('lakeSize', parseInt(value), getRange('lakeSize').max)
           }}   
           onSubmit={(value) => {
            updateRange('lakeSize', parseInt(value), getRange('lakeSize').max)
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
                display: getBiomeSettings().lakeEnabled ? "flex" : "none",
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
                value: "Lake Size Max: " + getRange('lakeSize').max,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Lake Size Max"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('lakeSize', getRange('lakeSize').min, parseInt(value))
           }}   
           onSubmit={(value) => {
            updateRange('lakeSize', getRange('lakeSize').min, parseInt(value))
           }}
            uiTransform={{
                width: '100%',
                height: '50%',
            }}
            uiBackground={{color:Color4.Black()}}
           />
</UiEntity>


</UiEntity>

{/* lake depth */}
<UiEntity
            uiTransform={{
                display: getBiomeSettings().lakeEnabled ? "flex" : "none",
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
                value: "Lake Depth Min: " + getRange('lakeDepth').min,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Lake Depth Min"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('lakeDepth', parseInt(value), getRange('lakeDepth').max)
           }}   
           onSubmit={(value) => {
            updateRange('lakeDepth', parseInt(value), getRange('lakeDepth').max)
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
                value: "Lake Depth Max: " + getRange('lakeDepth').max,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Lake Depth Max"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('lakeDepth', getRange('lakeDepth').min, parseInt(value))
           }}   
           onSubmit={(value) => {
            updateRange('lakeDepth', getRange('lakeDepth').min, parseInt(value))
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