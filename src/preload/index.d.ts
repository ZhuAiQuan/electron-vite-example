import { ElectronAPI } from '@electron-toolkit/preload'
import type { WindowService } from '@type/module/window'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      window: WindowService
    }
  }
}
