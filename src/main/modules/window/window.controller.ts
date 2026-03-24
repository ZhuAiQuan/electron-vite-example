import WindowServer from './window.service'
import { Controller, Handle } from '@/framework'

@Controller('window')
export default class WindowController {
  constructor(private windowServer: WindowServer) {}

  @Handle()
  close() {
    this.windowServer.close()
  }

  @Handle()
  minimize() {
    this.windowServer.minimizeWindow()
  }

  @Handle()
  maximize() {
    this.windowServer.maximizeWindow()
  }

  /** 由 ControllerManage.cleanup 统一移除 IPC；子类可在此做本 controller 的其它资源释放 */
  dispose() {
    //
  }
}
