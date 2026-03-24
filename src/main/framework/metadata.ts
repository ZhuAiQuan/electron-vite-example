/** 用 @Controller(name) 的 name 当 key，避免 WeakMap 因构造函数引用不一致取不到值 */
export const controllerMeta = new Map<
  string,
  {
    name: string
    handlers: { method: string; handlerName: string }[]
  }
>()

/** 仅类型用，实际 handlers 挂在类的 __ipcHandlers 上 */
export type HandlerItem = { method: string; handlerName: string }
