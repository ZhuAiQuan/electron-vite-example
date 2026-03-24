/**
 * 可被注册到 ControllerManage 的控制器实例。
 * 由 @Controller(name) / @Handle() 提供元数据，无需 implements Controller；
 * name 由装饰器挂在 prototype 上，dispose 可选。
 */
export interface ControllerInstance {
  name?: string
  dispose?(): void
}

/** 控制器管理器契约（ControllerManage 实现此接口） */
export interface Controller {
  readonly name: string
  register(ctrl?: ControllerInstance): void
  dispose(): void
}
