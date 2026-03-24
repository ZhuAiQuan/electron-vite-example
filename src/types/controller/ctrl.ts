import { Controller } from './index'

export interface ControllerInst extends Controller {
  /**
   * 注册事件监听
   * @returns
   */
  register: () => void
  /**
   * 清理事件监听
   * @returns
   */
  dispose: () => void
}
