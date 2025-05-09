import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import { slug } from '../resources';
import { dimensions } from './helpers';
import { Color4 } from '@dcl/sdk/math';
import { view } from './newBiome';
import { getRange, getBiomeSettings, updateRange, updateBiomeSetting } from '../state/biomeState';

export function StructuresUI(){
    return (
        <UiEntity
            key={slug + "new::biome::ui::structures"}
            uiTransform={{
                display: view === "Structures" ?  'flex' : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.create(0,0,1,0.5)}}
           >

{/* cabin density */}
<UiEntity
            uiTransform={{
                display: getBiomeSettings().biomeType === "desert" || getBiomeSettings().biomeType === "snow" || getBiomeSettings().biomeType === "plains" ?  'none' : "flex",
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
                value: (getBiomeSettings().cabinsEnabled ? "Disable" : " Enable") + " Cabins",
                fontSize: 15,
                color: Color4.Black(),
                textAlign:'middle-left'
            }}
            uiBackground={{color:getBiomeSettings().cabinsEnabled ? Color4.Red() : Color4.Green()}}
            onMouseDown={() => {
                updateBiomeSetting('cabinsEnabled', !getBiomeSettings().cabinsEnabled)
            }}
           />
</UiEntity>

<UiEntity
            uiTransform={{
                display: getBiomeSettings().cabinsEnabled ? "flex" : "none",
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
                value: "Cabin Density Min: " + getRange('cabinDensity').min,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Cabin Density Min"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('cabinDensity', parseInt(value), getRange('cabinDensity').max)
           }}   
           onSubmit={(value) => {
            updateRange('cabinDensity', parseInt(value), getRange('cabinDensity').max)
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
                display: getBiomeSettings().cabinsEnabled ? "flex" : "none",
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
                value: "Cabin Density Max: " + getRange('cabinDensity').max,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Cabin Density Max"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('cabinDensity', getRange('cabinDensity').min, parseInt(value))
           }}   
           onSubmit={(value) => {
            updateRange('cabinDensity', getRange('cabinDensity').min, parseInt(value))
           }}
            uiTransform={{
                width: '100%',
                height: '50%',
            }}
            uiBackground={{color:Color4.Black()}}
           />
</UiEntity>


</UiEntity>

{/* cave density */}
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
                value: (getBiomeSettings().cavesEnabled ? "Disable" : " Enable") + " Caves",
                fontSize: 15,
                color: Color4.Black(),
                textAlign:'middle-left'
            }}
            uiBackground={{color:getBiomeSettings().cavesEnabled ? Color4.Red() : Color4.Green()}}
            onMouseDown={() => {
                updateBiomeSetting('cavesEnabled', !getBiomeSettings().cavesEnabled)
            }}
           />
</UiEntity>

<UiEntity
            uiTransform={{
                display: getBiomeSettings().cavesEnabled ? "flex" : "none",
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
                value: "Cave Density Min: " + getRange('caveDensity').min,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Cave Density Min"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('caveDensity', parseInt(value), getRange('caveDensity').max)
           }}   
           onSubmit={(value) => {
            updateRange('caveDensity', parseInt(value), getRange('caveDensity').max)
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
                display: getBiomeSettings().cavesEnabled ? "flex" : "none",
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
                value: "Cave Density Max: " + getRange('caveDensity').max,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Cave Density Max"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('caveDensity', getRange('caveDensity').min, parseInt(value))
           }}   
           onSubmit={(value) => {
            updateRange('caveDensity', getRange('caveDensity').min, parseInt(value))
           }}
            uiTransform={{
                width: '100%',
                height: '50%',
            }}
            uiBackground={{color:Color4.Black()}}
           />
</UiEntity>


</UiEntity>

{/* cave size */}
<UiEntity
            uiTransform={{
                display: getBiomeSettings().cavesEnabled ? "flex" : "none",
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
                value: "Cave Size Min: " + getRange('caveSize').min,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Cave Size Min"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('caveSize', parseInt(value), getRange('caveSize').max)
           }}   
           onSubmit={(value) => {
            updateRange('caveSize', parseInt(value), getRange('caveSize').max)
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
                value: "Cave Size Max: " + getRange('caveSize').max,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Cave Size Max"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('caveSize', getRange('caveSize').min, parseInt(value))
           }}   
           onSubmit={(value) => {
            updateRange('caveSize', getRange('caveSize').min, parseInt(value))
           }}
            uiTransform={{
                width: '100%',
                height: '50%',
            }}
            uiBackground={{color:Color4.Black()}}
           />
</UiEntity>


</UiEntity>

{/* cave depth */}
<UiEntity
            uiTransform={{
                display: getBiomeSettings().cavesEnabled ? "flex" : "none",
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
                value: "Cave Depth Min: " + getRange('caveDepth').min,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Cave Depth Min"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('caveDepth', parseInt(value), getRange('caveDepth').max)
           }}   
           onSubmit={(value) => {
            updateRange('caveDepth', parseInt(value), getRange('caveDepth').max)
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
                value: "Cave Depth Max: " + getRange('caveDepth').max,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Cave Depth Max"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('caveDepth', getRange('caveDepth').min, parseInt(value))
           }}   
           onSubmit={(value) => {
            updateRange('caveDepth', getRange('caveDepth').min, parseInt(value))
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