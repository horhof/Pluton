import { getLog } from '../Logger'
const debug = getLog(`Game`)
debug

import * as fs from 'fs'
// @ts-ignore
import * as LowDb from 'lowdb'
// @ts-ignore
import * as FileSync from 'lowdb/adapters/FileSync'
const lodashId = require('lodash-id')

export interface DatabaseOptions {
  wipe?: boolean
  defaultsFile?: string
}

/**
 * I am the gateway to the data store.
 *
 * Models know how to ask me to read / write their data.
 */
export class Database {
  // @ts-ignore
  private instance: LowDb.Lowdb<any, LowDb.AdapterSync<any>>

  constructor(
    private filename: string,
    options: DatabaseOptions,
  ) {
    if (options.wipe) {
      fs.writeFileSync(filename, '{}')
    }

    const adapter = new FileSync(this.filename)
    this.instance = LowDb(adapter)
    lodashId.createId = (collection: any[]): number => collection.length + 1;
    this.instance._.mixin(lodashId)

    if (options.defaultsFile) {
      debug(`New> Seeding database...`)
      const defaults = JSON.parse(fs.readFileSync(options.defaultsFile, 'utf8'))
      this.instance.defaults(defaults).write()
    }
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