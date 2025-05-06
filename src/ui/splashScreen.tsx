import ReactEcs, {Dropdown, Input, UiEntity} from '@dcl/sdk/react-ecs'
import { Color4 } from '@dcl/sdk/math';
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
                src: 'https://dclstreams.com/media/images/e6c2bf1c-91cd-4777-b52d-6328d2956f8d.png',
              },
              textureMode: 'stretch',
            }}
           />
    )
}