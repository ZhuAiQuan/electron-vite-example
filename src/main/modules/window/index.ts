import WindowController from './window.controller'
import WindowService from './window.service'
import { ModuleDefinition, IContext } from '@type/module'

export class WindowModule implements ModuleDefinition {
  register(ctx: IContext) {
    const windowServer = new WindowService()
    const windowController = new WindowController(windowServer)

    ctx.service.register(windowServer)
    ctx.controller.register(windowController)
  }
}
