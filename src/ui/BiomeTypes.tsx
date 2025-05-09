import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import { slug } from '../resources';
import { dimensions } from './helpers';
import { Color4 } from '@dcl/sdk/math';
import { view } from './newBiome';
import { getBiomeSettings, updateBiomeSetting } from '../state/biomeState';
let biomeTypes:string[] = ['forest','desert','snow','plains']

export function BiomeTypesUI(){
    return (
        <UiEntity
            key={slug + "new::biome::ui::biomeTypes"}
            uiTransform={{
                display: view === "Biome Type" ?  'flex' : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
            }}
            // uiBackground={{color:Color4.create(0,0,1,0.5)}}
           >

            <Dropdown
                uiBackground={{color:Color4.Black()}}
                options={biomeTypes}
                selectedIndex={biomeTypes.indexOf(getBiomeSettings().biomeType)}
                onChange={(value) => {
                    console.log(value)
                    updateBiomeSetting('biomeType', biomeTypes[value])
                }}
                uiTransform={{
                    width: '50%',
                    height: '20%',
                }}
                fontSize={25}
                color={Color4.White()}

            />

           </UiEntity>
    )
}