import { ipcRenderer } from 'electron'

export async function invoke(channel: string, ...args: any[]) {
  const res = await ipcRenderer.invoke(channel, ...args)

  if (!res.success) {
    throw new Error(res.message)
  }

  return res.data
}
