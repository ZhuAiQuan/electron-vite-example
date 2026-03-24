/**
 * 自动处理错误抛出
 */

import { ipcMain } from 'electron'

export function registerIpc(channel: string, handler: (...args: any[]) => any) {
  ipcMain.handle(channel, async (_, ...args) => {
    try {
      const result = await handler(...args)

      return {
        success: true,
        data: result
      }
    } catch (err: any) {
      console.error(`IPC Error [${channel}]`, err)

      return {
        success: false,
        message: err?.message ?? 'unknown error'
      }
    }
  })
}

export function removeIpc(channel: string): void {
  ipcMain.removeHandler(channel)
}
