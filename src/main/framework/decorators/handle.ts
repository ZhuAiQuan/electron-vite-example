/** 装饰器挂在类上的 handlers，避免 WeakMap key 不一致 */
export interface WithIpcHandlers {
  __ipcHandlers?: { method: string; handlerName: string }[]
}

export function Handle(name?: string) {
  return function (_, context: ClassMethodDecoratorContext) {
    // Stage 3 标准：元数据直接挂在 context.metadata 上
    // 注意：metadata 在整个类定义期间是共享的
    const metadata = context.metadata as any
    if (!metadata.__ipcHandlers) {
      metadata.__ipcHandlers = []
    }

    metadata.__ipcHandlers.push({
      method: name ?? String(context.name),
      handlerName: String(context.name)
    })
  }
}
