import { ControllerManage } from '@/framework/controller'
import { ServiceManage } from '@/framework/service'

export type IContext = {
  controller: ControllerManage
  service: ServiceManage
}
export interface ModuleDefinition {
  register: (ctx: IContext) => void
}
