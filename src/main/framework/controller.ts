import { Controller, ControllerInstance } from '@type/controller'
import { controllerMeta } from './metadata'
import { preloadRegistry } from './preloadRegistry'
import { registerIpc, removeIpc } from './ipc'
import type { WithControllerName } from './decorators/controller'

const REGISTRY_CHANNEL = 'getAllHandle'

export class ControllerManage implements Controller {
  name = 'controll_manage'
  private controllers: Map<string, ControllerInstance> = new Map()
  /** 记录每个 controller 注册的 channel，用于 cleanup 时自动移除 */
  private channelByController: Map<string, string[]> = new Map()

  register(controller?: ControllerInstance) {
    if (!controller) {
      throw new Error('缺少控制器')
    }
    const name = (controller.constructor as WithControllerName).__controllerName
    if (!name) {
      throw new Error('控制器缺少 @Controller(name) 装饰器')
    }
    if (this.controllers.has(name)) {
      console.warn(`控制器 ${name} 已存在`)
    }
    this.controllers.set(name, controller)
  }

  /** 注册 ipc channel，返回所有收集的 handle name 供 preload 使用 */
  private registerHandlerRegistry() {
    registerIpc(REGISTRY_CHANNEL, () => preloadRegistry)
  }

  setup() {
    const list = Array.from(this.controllers.values())
    for (const ctrl of list) {
      const name = (ctrl.constructor as WithControllerName).__controllerName
      if (!name) continue

      const meta = controllerMeta.get(name)
      if (!meta) continue

      const moduleName = meta.name
      const channels: string[] = []
      preloadRegistry[moduleName] ??= []

      for (const h of meta.handlers) {
        const channel = `${moduleName}:${h.method}`

        preloadRegistry[moduleName].push(h.method)
        registerIpc(channel, ctrl[h.method].bind(ctrl))
        channels.push(channel)

        console.log(`IPC registered → ${channel}`)
      }

      this.channelByController.set(name, channels)
    }

    this.registerHandlerRegistry()
  }

  cleanup() {
    // 先移除 getAllHandle，避免 preload 在清理后仍能拿到旧表
    removeIpc(REGISTRY_CHANNEL)

    for (const [ctrlName, channels] of Array.from(this.channelByController)) {
      for (const channel of channels) {
        removeIpc(channel)
      }
      const ctrl = this.controllers.get(ctrlName)
      if (ctrl?.dispose) {
        ctrl.dispose()
      }
      console.log(`控制器 ${ctrlName} 注销成功`)
    }
    this.channelByController.clear()
  }

  dispose() {
    this.cleanup()
  }
}
