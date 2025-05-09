import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import { slug } from '../resources';
import { dimensions } from './helpers';
import { Color4 } from '@dcl/sdk/math';
import { view } from './newBiome';
import { getBiomeSettings, getRange, updateRange } from '../state/biomeState';

export function ResourcesUI(){
    return (
        <UiEntity
            key={slug + "new::biome::ui::resources"}
            uiTransform={{
                display: view === "Resources" ?  'flex' : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.create(0,0,1,0.5)}}
           >

{/* ore rarity */}
<UiEntity
            uiTransform={{
                // display: getBiomeSettings().biomeType === "desert" ?  'none' : "flex",
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
                value: "Ore Rarity Min: " + getRange('oreRarity').min,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Ore Rarity Min"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('oreRarity', parseInt(value), getRange('oreRarity').max)
           }}   
           onSubmit={(value) => {
            updateRange('oreRarity', parseInt(value), getRange('oreRarity').max)
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
                value: "Ore Rarity Max: " + getRange('oreRarity').max,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Ore Rarity Max"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('oreRarity', getRange('oreRarity').min, parseInt(value))
           }}   
           onSubmit={(value) => {
            updateRange('oreRarity', getRange('oreRarity').min, parseInt(value))
           }}
            uiTransform={{
                width: '100%',
                height: '50%',
            }}
            uiBackground={{color:Color4.Black()}}
           />
</UiEntity>


</UiEntity>

{/* ore variety */}
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
                value: "Ore Variety Min: " + getRange('oreVariety').min,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Ore Variety Min"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('oreVariety', parseInt(value), getRange('oreVariety').max)
           }}   
           onSubmit={(value) => {
            updateRange('oreVariety', parseInt(value), getRange('oreVariety').max)
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
                value: "Ore Variety Max: " + getRange('oreVariety').max,
                fontSize: 15,
                color: Color4.White(),
                textAlign:'middle-left'
            }}
           />
           <Input
           color={Color4.White()}
           fontSize={15}
           placeholder="Enter Ore Variety Max"
           placeholderColor={Color4.White()}
           onChange={(value) => {
            updateRange('oreVariety', getRange('oreVariety').min, parseInt(value))
           }}   
           onSubmit={(value) => {
            updateRange('oreVariety', getRange('oreVariety').min, parseInt(value))
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