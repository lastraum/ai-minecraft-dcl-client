import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import { slug } from '../resources';
import { dimensions } from './helpers';
import { Color4 } from '@dcl/sdk/math';

let show = false
let loadingPhrases:string[] = [
    "Loading Biome...",
    "Reticulating Splines...",
    "Generating Terrain...",
    "Building Structures...",
    "Planting Vegetation...",
    "Adding Details...",
    "Just about there...",
    "You can see the light at the end of the tunnel...",
    "Almost Done..."
]
let loadingPhrase:string = ""

export let LOADING_BIOME_TIMER = 0

export function updateLoadingBiomeTimer(dt:number){
    LOADING_BIOME_TIMER -= dt
}

export function chooseLoadingPhrase(){  
    LOADING_BIOME_TIMER = 3
    loadingPhrase = loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)]
}

export function showLoadingBiomeUI(value:boolean){
    show = value
    if(show){
        chooseLoadingPhrase()
    }
}

export function LoadingBiomeUI(){
    return (
        <UiEntity
            key={slug + "new::biome::ui:loading"}
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
            uiText={{
                value:loadingPhrase,
                fontSize:30,
                color:Color4.White()
            }}
           />
    )
}