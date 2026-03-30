import { app } from 'electron'
import path from 'path'
import { name } from '../../../package.json'
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs'
import { platform } from 'os'
import { execSync } from 'child_process'

/**
 * 获取配置文件地址
 * @returns 返回配置文件地址
 */
export function getConfigPath() {
  return path.join(
    app.isPackaged ? path.join(path.dirname(process.execPath)) : app.getAppPath(),
    '.bin',
    'config.json'
  )
}

/**
 * 获取app默认位置 开发环境在当前根目录的上级而生产环境则是用户目录
 */
export function getBasePath() {
  console.log(getConfigPath())
  const dataDir = path.join(
    app.isPackaged ? app.getPath('userData') : getParentDirectory(app.getAppPath(), 1),
    `.${name}`
  )
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true })
  }
  //   测试能否读写
  canWriteFile(dataDir)
  //   将目标文件夹设置为隐藏
  if (platform() === 'win32') {
    try {
      execSync(`attrib +h "${dataDir}"`, { stdio: 'ignore' })
    } catch {
      console.warn('设置隐藏文件夹失败')
    }
  }

  return dataDir
}

/**
 * 获取上级目录
 * @param pathStr 传入路径
 * @param level 层级
 * @returns 返回路径
 */
export function getParentDirectory(pathStr: string, level = 1) {
  let result = pathStr
  for (let i = 0; i < level; i++) {
    result = path.dirname(result)
  }
  return result
}

export function canWriteFile(targetPath: string) {
  try {
    const tstFile = path.join(targetPath, '.write_test')
    writeFileSync(tstFile, 'test')
    unlinkSync(tstFile)
  } catch {
    throw new Error('没有权限读写')
  }
}
