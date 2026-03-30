import { app } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import App, { ServiceManage, ControllerManage } from '@/framework'
import { RootModule } from '@/modules'
import { getBasePath } from './utils/config'

const service = new ServiceManage()
const controller = new ControllerManage()
const module = new RootModule()
export const electronInst = new App(service, controller, module)

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  electronInst.init()
  getBasePath()
})

app.on('window-all-closed', () => {
  electronInst.cleanup()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
