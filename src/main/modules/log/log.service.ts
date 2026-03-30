import { getBasePath } from '@/utils/config'
import path from 'path'
import { checkDir } from '@/utils/fs'
import { createWriteStream, WriteStream } from 'fs'
import { Service } from '@type/service'

type Level = 'log' | 'warn' | 'error' | 'debug' | 'info'
// type ProcessType = 'Main' | 'Preload' | 'Renderer'

function parseViteStackTrace(callerLine: string) {
  // 1. 解析文件路径、行号和列号
  const fileMatch = callerLine.match(
    /\(?(https?:\/\/[^:]+|file:\/\/\/[^:]+|\s+at\s+.+\s+\()?([^:)]+):(\d+)(?::(\d+))?\)?$/
  )

  if (!fileMatch) {
    return null
  }

  const fullPath = fileMatch[2] || 'unknown'
  const lineNumber = parseInt(fileMatch[3]) || 0
  const columnNumber = parseInt(fileMatch[4]) || 0

  // 2. 提取函数名
  const functionMatch = callerLine.match(/at\s+([^(]+)/)
  const functionName = functionMatch ? functionMatch[1].trim() : 'unknown'

  // 3. 清理文件路径 - 针对 Vite 优化
  let cleanPath = fullPath

  // 移除常见的协议前缀
  cleanPath = cleanPath
    .replace(/^file:\/\/\//, '') // 移除 file:///
    .replace(/^https?:\/\//, '') // 移除 http:// 或 https://
    .replace(/^\/+/, '') // 移除开头的斜杠

  // 如果路径包含 src/，只保留 src/ 之后的部分
  const srcIndex = cleanPath.indexOf('src/')
  if (srcIndex !== -1) {
    cleanPath = cleanPath.substring(srcIndex)
  }

  return {
    file: cleanPath,
    line: lineNumber,
    column: columnNumber,
    function: functionName,
    // 保留原始信息便于调试
    original: {
      fullPath: fullPath,
      callerLine: callerLine
    }
  }
}

export class LogService implements Service {
  name = 'logger'
  private logStream: WriteStream | null = null
  private logCache: string[] = []
  constructor(
    /**
     * 日志文件地址
     */
    private logDir = 'log',
    /**
     * 日志文件名称
     */
    private filename = '',
    /**
     * 日志文件最大大小
     */
    private maxFileSize = 10 * 1024 * 1024
  ) {
    // 本来想直接proxy console 但这样太黑盒了 所以创建一个log service用于专门处理日志收集工作
    // 应该使用webwork写入日志或者是上传日志
    this.setup()
  }
  setup() {
    if (this.logStream) return
    const logDir = path.join(getBasePath(), this.logDir)
    // 根据日期(YYYYMMDD)创建目录 便于清理文件
    this.logStream = this.generateSteam(this.generateLogFile(logDir))
  }
  private generateLogFile(dir: string) {
    const logFile = path.join(
      dir,
      new Date().toLocaleString().replace(/\//g, ''),
      `${this.filename}${new Date().toLocaleTimeString().replace(/:/g, '_')}.log`
    )
    checkDir(logFile)
    return logFile
  }
  private writeStream(level: Level, msg: string, arg?: any[]) {
    if (this.logStream) {
      const text = this.createLogInfo(level, msg, arg)
      // 先读取文件大小 再决定是否重新流转日志文件
      this.logStream.write(text + ' \n')
      this.logCache.push(text)

      if (process.env.NODE_ENV === 'development') {
        console[level in console ? level : 'log'](text)
      }

      // 这样会导致每一次流写入完成都会触发一次监听 监听里会查看一次数组长度
      this.logStream.once('drain', () => {
        // 查看cache里数据大小
        const size = Buffer.byteLength(this.logCache.join('\n'), 'utf-8')
        if (size > this.maxFileSize) {
          this.endWriteStream().then(() => {
            const logDir = path.join(getBasePath(), this.logDir)
            this.logStream = this.generateSteam(this.generateLogFile(logDir))
          })
        }
      })
    }
  }
  private createLogInfo(level: Level, msg: string, arg?: any[]) {
    const callerInfo = this.currentCallerInfo()
    const dateString = new Date().toLocaleString()
    const argsStr = this.formateArgs(arg)

    const positionInfo = `${callerInfo?.file}:${callerInfo?.line}:${callerInfo?.column}`

    return `[${dateString}][${level}][${positionInfo}][${callerInfo?.function}] ${msg} ${argsStr}`
  }
  /**
   * 利用Error stack获取当前调用栈信息
   * @returns 返回调用栈详细信息
   */
  private currentCallerInfo() {
    const stackLines = (new Error().stack || '').split('\n').filter((t) => t.trim())
    let txt = stackLines?.[3] || ''
    for (let i = 3; i < stackLines.length; i++) {
      const t = stackLines[i]
      if (!t.includes('log.service.ts') && !t.includes('LogService.')) {
        txt = t
        break
      }
    }
    return parseViteStackTrace(txt)
  }
  private formateArgs(args?: any[]) {
    return args
      ?.map((item) => {
        if (item && typeof item === 'object') {
          try {
            if (item instanceof Error) return `Error: ${item.message}\nStack: ${item.stack || '--'}`
            return JSON.stringify(item)
          } catch {
            return `[Object: ${item?.constructor.name || 'Unknown'}]`
          }
        }
        return String(item)
      })
      .join(' ')
  }
  private generateSteam(filePath: string) {
    return createWriteStream(filePath, {
      encoding: 'utf-8',
      flags: 'a'
    })
  }
  private endWriteStream() {
    return new Promise<void>((resolve) => {
      if (this.logStream && !this.logStream.closed) {
        this.logStream.end(() => {
          this.logStream = null
          resolve()
        })
      }
    })
  }
  log(msg?: any, ...optionalParams: any[]) {
    const message = String(msg)
    this.writeStream('log', message, optionalParams)
  }
  info(msg?: any, ...optionalParams: any[]) {
    const message = String(msg)
    this.writeStream('info', message, optionalParams)
  }
  error(msg?: any, ...optionalParams: any[]) {
    const message = String(msg)
    this.writeStream('error', message, optionalParams)
  }
  debug(msg?: any, ...optionalParams: any[]) {
    const message = String(msg)
    this.writeStream('debug', message, optionalParams)
  }
  warn(msg?: any, ...optionalParams: any[]) {
    const message = String(msg)
    this.writeStream('warn', message, optionalParams)
  }
  dispose() {
    this.logStream?.end()
  }
}
