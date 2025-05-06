import ReactEcs, { Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'
import { UiCanvasInformation, createInputSystem, engine } from '@dcl/sdk/ecs'
import { uiSizer } from './helpers'
import { createSplashScreen } from './splashScreen'


export function setupUi() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
  engine.addSystem(uiSizer)
}

export const uiComponent:any = () => [
  createSplashScreen()
]