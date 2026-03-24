import { controllerMeta } from '@/framework/metadata'

/**
 * 用 @Controller(name) 的 name 当 key 存 meta；
 * handlers 直接从类的 __ipcHandlers 读，不依赖 WeakMap 引用。
 */
export function Controller(name: string) {
  return function (target: any, context: ClassDecoratorContext) {
    // 这里的 context.metadata 和 Handle 里的 context.metadata 是同一个对象
    const handlers = (context.metadata as any)?.__ipcHandlers ?? []

    controllerMeta.set(name, {
      name,
      handlers
    })

    // 如果你还需要在类或原型上挂载数据，依然可以操作 target
    target.prototype.name = name
    ;(target as any).__controllerName = name

    console.log(`[Controller] ${name} 已绑定 ${handlers.length} 个处理函数`)
  }
}

export interface WithControllerName {
  __controllerName?: string
}
