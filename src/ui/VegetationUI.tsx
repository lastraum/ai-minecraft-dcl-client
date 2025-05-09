import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import { slug } from '../resources';
import { dimensions } from './helpers';
import { Color4 } from '@dcl/sdk/math';
import { view } from './newBiome';
import { getBiomeSettings, getRange } from '../state/biomeState';
import { updateRange } from '../state/biomeState';

export function VegetationUI(){
    return (
        <UiEntity
            key={slug + "new::biome::ui::vegetation"}
            uiTransform={{
                display: view === "Vegetation" && getBiomeSettings().biomeType !== "desert" ?  'flex' : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.create(0,0,1,0.5)}}
           >

{/* flower density */}
<UiEntity
            uiTransform={{
                display: getBiomeSettings().biomeType === "desert" ?  'none' : "flex",
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
                value: "Flower Density Min: " + getRange('flowerDensity').min,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Flower Density Min"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('flowerDensity', parseInt(value), getRange('flowerDensity').max)
           }}   
           onSubmit={(value) => {
            updateRange('flowerDensity', parseInt(value), getRange('flowerDensity').max)
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
                value: "Flower Density Max: " + getRange('flowerDensity').max,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Flower Density Max"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('flowerDensity', getRange('flowerDensity').min, parseInt(value))
           }}   
           onSubmit={(value) => {
            updateRange('flowerDensity', getRange('flowerDensity').min, parseInt(value))
           }}
            uiTransform={{
                width: '100%',
                height: '50%',
            }}
            uiBackground={{color:Color4.Black()}}
           />
</UiEntity>


</UiEntity>

{/* grass density */}
<UiEntity
            uiTransform={{
                display: getBiomeSettings().biomeType === "desert" ?  'none' : "flex",
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
                value: "Grass Density Min: " + getRange('grassDensity').min,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Grass Density Min"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('grassDensity', parseInt(value), getRange('grassDensity').max)
           }}   
           onSubmit={(value) => {
            updateRange('grassDensity', parseInt(value), getRange('grassDensity').max)
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
                value: "Grass Density Max: " + getRange('grassDensity').max,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Grass Density Max"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('grassDensity', getRange('grassDensity').min, parseInt(value))
           }}   
           onSubmit={(value) => {
            updateRange('grassDensity', getRange('grassDensity').min, parseInt(value))
           }}
            uiTransform={{
                width: '100%',
                height: '50%',
            }}
            uiBackground={{color:Color4.Black()}}
           />
</UiEntity>


</UiEntity>

{/* bush density */}
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
                value: "Bush Density Min: " + getRange('bushDensity').min,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Bush Density Min"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('bushDensity', parseInt(value), getRange('bushDensity').max)
           }}   
           onSubmit={(value) => {
            updateRange('bushDensity', parseInt(value), getRange('bushDensity').max)
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
                value: "Bush Density Max: " + getRange('bushDensity').max,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Bush Density Max"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('bushDensity', getRange('bushDensity').min, parseInt(value))
           }}   
           onSubmit={(value) => {
            updateRange('bushDensity', getRange('bushDensity').min, parseInt(value))
           }}
            uiTransform={{
                width: '100%',
                height: '50%',
            }}
            uiBackground={{color:Color4.Black()}}
           />
</UiEntity>


</UiEntity>

{/* tree density */}
<UiEntity
            uiTransform={{
                display: getBiomeSettings().biomeType === "desert" || getBiomeSettings().biomeType === "snow" || getBiomeSettings().biomeType === "plains" ?  'none' : "flex",
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
                value: "Tree Density Min: " + getRange('treeDensity').min,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Tree Density Min"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('treeDensity', parseInt(value), getRange('treeDensity').max)
           }}   
           onSubmit={(value) => {
            updateRange('treeDensity', parseInt(value), getRange('treeDensity').max)
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
                value: "Tree Density Max: " + getRange('treeDensity').max,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Tree Density Max"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('treeDensity', getRange('treeDensity').min, parseInt(value))
           }}   
           onSubmit={(value) => {
            updateRange('treeDensity', getRange('treeDensity').min, parseInt(value))
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