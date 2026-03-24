export interface Service {
  /**
   * 服务名称，用于标识服务
   */
  readonly name: string

  /**
   * 初始化服务
   */
  setup(): void | Promise<void>

  /**
   * 清理资源
   */
  cleanup?(): Promise<void>
}
