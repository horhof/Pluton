// @ts-ignore
import * as LowDb from 'lowdb'
// @ts-ignore
import * as FileSync from 'lowdb/adapters/FileSync'
const lodashId = require('lodash-id')

/**
 * I am the gateway to the data store.
 *
 * Models know how to ask me to read / write their data.
 */
export class Database {
  // @ts-ignore
  private instance: LowDb.Lowdb<any, LowDb.AdapterSync<any>>

  constructor(
    private filename = `data/db.json`,
    defaults: any,
  ) {
    const adapter = new FileSync(this.filename)
    this.instance = LowDb(adapter)
    this.instance._.mixin(lodashId)
    this.instance.defaults(defaults).write()
  }

  /**
   * I return a chain over a table.
   *
   * Tables should call this to begin a chain over their data which they can
   * further manipulate.
   */
  async get(name: string) {
    return this.instance.get(name)
  }
}