import { createWriteStream, existsSync, mkdirSync } from 'fs'

/**
 * 判断路径是否存在，不存在直接创建
 * @param targetPath 目标路径
 */
export function checkDir(targetPath: string) {
  if (!existsSync(targetPath)) {
    mkdirSync(targetPath, { recursive: true })
  }
}

export function createStreamFile(file: string, option?: any) {
   return createWriteStream(file, option)
}
