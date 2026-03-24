import { contextBridge } from 'electron'
import { invoke } from './invoke'

async function initApi() {
  const handlerRegistry = await invoke('getAllHandle') // main 返回上面的对象
  const api: Record<string, any> = {}

  for (const module in handlerRegistry) {
    api[module] = {}
    for (const method of handlerRegistry[module]) {
      api[module][method] = (...args: any[]) => invoke(`${module}:${method}`, ...args)
    }
  }

  contextBridge.exposeInMainWorld('api', api)
}

initApi()
