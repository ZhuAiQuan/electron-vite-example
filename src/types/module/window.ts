import type { Response } from '../request/response'

export interface WindowService {
  close: () => Promise<Response>
  maximize: () => Promise<Response>
  minimize: () => Promise<Response>
}
