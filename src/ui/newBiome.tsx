import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import { slug } from '../resources';
import { dimensions } from './helpers';
import { Color4 } from '@dcl/sdk/math';
import { BiomeTypesUI } from './BiomeTypes';
import { TerrainUI } from './TerrainUI';
import { WaterUI } from './WaterUI';
import { VegetationUI } from './VegetationUI';
import { StructuresUI } from './StructuresUI';
import { ResourcesUI } from './ResourcesUI';
import { generateRandomBiomeSettings, updateBiomeSettings } from '../state/biomeState';
import { setupScene } from '..';
import { showLoadingBiomeUI } from './loadingBiomeUI';


let show = true
export let view = "Biome Type"

let configOptions:string[] = ['Biome Type', 'Terrain', 'Water', 'Vegetation', 'Structures', 'Resources']

export function showNewBiomeUI(value:boolean){
    show = value
}

export function NewBiomeUI(){
    return (
        <UiEntity
            key={slug + "new::biome::ui"}
            uiTransform={{
                display: show ?  'flex' : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: dimensions.width * 0.4,
                height: dimensions.height * 0.5,
                positionType:'absolute',
                position:{left:dimensions.width * 0.15, top:dimensions.height * 0.35},
            }}
            // uiBackground={{color:Color4.create(0,0,0,0.9)}}
           >

<UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '100%',
                height: '90%'
            }}
           >

            {/* left column */}
            <UiEntity
                uiTransform={{
                    flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%'
            }}
            // uiBackground={{color:Color4.Blue()}}
           >
            {configOptions.map((configOption, index) => (
                <UiEntity
                    key={`${slug}::biome::${configOption}::${index}`}
                    uiTransform={{
                        width: '95%',
                        height: '20%',
                        margin: {top:'1%', bottom:'1%'}
                    }}
                    uiBackground={{color:view === configOption ? Color4.create(0,1,0,.8) : Color4.create(0,0,0,.9)}}
                    uiText={{
                        value:configOption,
                        textWrap:'nowrap',
                        fontSize:16,
                        color:Color4.White()
                    }}
                    onMouseDown={() => {
                        view = configOption
                    }}
                >
                </UiEntity>
            ))}
            </UiEntity>


            <UiEntity
            uiTransform={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '70%',
                height: '100%'
            }}
            // uiBackground={{color:Color4.Green()}}
           >
            <BiomeTypesUI/>
            <TerrainUI/>
            <WaterUI/>
            <VegetationUI/>
            <StructuresUI/>
            <ResourcesUI/>
            </UiEntity>

</UiEntity>



<UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                width: '100%',
                height: '10%',
            }}
           >

<UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
                margin:{right:'1%'}
            }}
            uiBackground={{color:Color4.Purple()}}
            uiText={{
                value: "Randomize Biome",
                fontSize: 16,
                color: Color4.White()
            }}
            onMouseDown={() => {    
                console.log("Randomize Biome")
                updateBiomeSettings(generateRandomBiomeSettings())
            }}
           />

<UiEntity
            uiTransform={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30%',
                height: '100%',
                margin:{left:'1%'}
            }}
            uiBackground={{color:Color4.Teal()}}
            uiText={{
                value: "Generate Biome",
                fontSize: 16,
                color: Color4.Black()
            }}
            onMouseDown={() => {    
                console.log("Generate Biome")
                showLoadingBiomeUI(true)
                showNewBiomeUI(false)
                setupScene()
            }}
           />

            </UiEntity>

           </UiEntity>
    )
}