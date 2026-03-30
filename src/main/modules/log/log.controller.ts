import { LogService } from './log.service'
import { Controller, Handle } from '@/framework'

@Controller('log')
export class LogController {
  constructor(private logger: LogService) {}

  @Handle()
  log(msg?: any, ...rest: any[]) {
    return this.logger.log(msg, rest)
  }

  @Handle()
  info(msg?: any, ...rest: any[]) {
    return this.logger.info(msg, rest)
  }

  @Handle()
  warn(msg?: any, ...rest: any[]) {
    return this.logger.warn(msg, rest)
  }

  @Handle()
  error(msg?: any, ...rest: any[]) {
    return this.logger.error(msg, rest)
  }

  @Handle()
  debug(msg?: any, ...rest: any[]) {
    return this.logger.debug(msg, rest)
  }

  dispose() {
    this.logger.dispose()
  }
}
