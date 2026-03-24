import { Service } from '@type/service'
import { dialog, BrowserWindow, BrowserWindowConstructorOptions, screen, app } from 'electron'
import { join } from 'node:path'
import icon from '../../../../resources/icon.png?asset'
import { is } from '@electron-toolkit/utils'

export default class WindowServer implements Service {
  readonly name = 'window'
  private mainWindow: BrowserWindow | null = null

  setup() {
    this.mainWindow = this.createMainWindow()
    console.log('窗口初始化')
  }
  createMainWindow() {
    // 是否为本地开发环境(未打包状态

    const displays = screen.getAllDisplays()
    const minBounds = displays.sort((a, b) => a.bounds.width - b.bounds.width)
    const width = 1440
    const height = 800
    const minWidth = Math.min(width, minBounds[0].bounds.width)
    const minHeight = Math.min(height, minBounds[0].bounds.height)

    const options: BrowserWindowConstructorOptions = {
      width: Math.min(width, minWidth),
      height: Math.min(height, minHeight),
      autoHideMenuBar: true,
      minHeight,
      minWidth,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: join(__dirname, '..', 'preload', 'index.js')
      },
      frame: false,
      ...(process.platform === 'linux' ? { icon } : {})
    }
    const mainWindow = new BrowserWindow(options)
    // 1. 优先尝试开发服务器
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
      console.log('正在加载开发服务器:', process.env['ELECTRON_RENDERER_URL'])
      mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
      mainWindow.webContents.openDevTools() // 只有开发环境才默认打开
    }
    // 2. 否则加载本地静态文件
    else {
      const indexPath = join(__dirname, '../renderer/index.html')
      console.log('正在加载静态页面:', indexPath)

      // 直接尝试加载，loadFile 内部已经处理了大部分协议兼容问题
      mainWindow.loadFile(indexPath).catch((err) => {
        console.error('核心页面加载失败:', err)
        // 这里是唯一值得兜底的地方：弹出一个原生的错误对话框，告诉用户应用损坏了
        dialog.showErrorBox('应用启动失败', '核心组件丢失，请尝试重新安装程序。')
      })
    }

    mainWindow.on('close', () => {
      setTimeout(() => {
        // 强制退出
        app.exit(0)
      }, 10 * 1000)
    })

    mainWindow.on('closed', () => {
      this.mainWindow = null
    })

    return mainWindow
  }
  getMainWindow() {
    return this.mainWindow
  }
  close() {
    this.mainWindow?.close()
  }
  minimizeWindow() {
    this.mainWindow?.minimize()
  }
  maximizeWindow() {
    if (this.mainWindow?.maximizable) {
      if (this.mainWindow.isMaximized()) {
        this.mainWindow.unmaximize()
      } else {
        this.mainWindow.maximize()
      }
    } else {
      throw new Error('当前环境不支持系统缩放')
    }
  }

  async cleanup() {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.close()
      this.mainWindow = null
    }
  }
}
