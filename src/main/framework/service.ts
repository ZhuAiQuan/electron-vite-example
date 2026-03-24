import { Service } from '@type/service'

export class ServiceManage implements Service {
  name = 'service_manage'
  private services: Map<string, Service> = new Map()
  /**
   * 注册子实例来实现Ioc 手动DI
   * @param service 服务实例
   */
  register(service: Service) {
    if (this.services.has(service.name)) {
      //
      console.warn(`服务（${service.name}）已存在，将会被覆盖`)
    }
    this.services.set(service.name, service)
  }
  /**
   * 返回指定名称的服务实例
   * @param name 服务名
   * @returns 服务实例
   */
  getService<T extends Service>(name: string): T | undefined {
    if (this.services.has(name)) {
      return this.services.get(name) as T
    }
    throw new Error(`服务（${name}）不存在`)
  }
  async setup() {
    const allServices = this.services.values()
    for (const srv of allServices) {
      await srv.setup?.()
      console.log(`服务${srv.name}初始化成功`)
    }
  }
  async cleanup() {
    const allServices = this.services.values()
    for (const srv of allServices) {
      if (srv.cleanup) {
        await srv.cleanup()
        console.log(`服务${srv.name}清理完成`)
      }
    }
  }
}
