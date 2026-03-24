import { ControllerManage } from './controller'
import { ServiceManage } from './service'
import { RootModule } from '@/modules'
// import WindowServer from '@/modules/window/window.service'

export default class App {
  constructor(
    private service: ServiceManage,
    private controller: ControllerManage,
    private module: RootModule
  ) {}
  init() {
    this.module.register({ service: this.service, controller: this.controller })
    this.service.setup()
    // 注册ipc监听
    this.controller.setup()
  }

  async cleanup() {
    await this.service.cleanup()
    this.controller.dispose()
  }
}
