import { ModuleDefinition, IContext } from '@type/module'
import { LogController } from './log.controller'
import { LogService } from './log.service'

const logService = new LogService()
const logController = new LogController(logService)
export class LogModule implements ModuleDefinition {
  register(ctx: IContext) {
    ctx.service.register(logService)
    ctx.controller.register(logController)
  }
}
