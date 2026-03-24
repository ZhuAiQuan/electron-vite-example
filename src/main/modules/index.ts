import { WindowModule } from './window'
import type { IContext } from '@type/module'

export class RootModule {
  register(ctx: IContext) {
    new WindowModule().register(ctx)
  }
}
