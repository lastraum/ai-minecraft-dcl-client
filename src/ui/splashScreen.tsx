import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import { slug } from '../resources';

let show = true

export function toggleSplashScreen(){
    show = !show
}

export function createSplashScreen(){
    return (
        <UiEntity
            key={slug + "splash::screen"}
            uiTransform={{
                display: show ?  'flex' : "none",
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                positionType:'absolute',
                position:{left:'0', top:'0'},
            }}
            uiBackground={{
              texture: {
                src: 'https://dclstreams.com/media/images/c612d44f-52e0-4c44-9ecc-a621ee342850.png',
              },
              textureMode: 'stretch',
            }}
           />
    )
}