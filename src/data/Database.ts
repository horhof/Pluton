import * as LowDb from 'lowdb';
import * as FileSync from 'lowdb/adapters/FileSync';

import { Fleets } from '../Fleet';
import { Users } from '../User';

import { getLog } from '../Logger';
const debug = getLog(`Record`)
debug

const lodashId = require('lodash-id')

/**
 * I am the gateway to the data store.
 *
 * Tables know how to ask me to read / write their data.
 */
export class Database {
  fleets: Fleets

  users: Users

  private instance: LowDb.Lowdb<any, LowDb.AdapterSync<any>>

  private log = getLog('Database')

  constructor(
    private filename = 'data/db.json'
  ) { }

  /** I initialize the data store with data if it doesn't already exist. */
  async initialize() {
    this.log(`Initialize>`)

    const adapter = new FileSync(this.filename)
    this.instance = LowDb(adapter)
    this.instance._.mixin(lodashId)

    // Initialize database with defaults.
    this.instance
      .defaults({
        fleets: [],
        users: [],
      })
      .write()

    // Initialize models.
    this.fleets = new Fleets(this)
    this.users = new Users(this)
  }

  /**
   * I return a chain over a table.
   *
   * Tables should call this to begin a chain over their data which they can
   * further manipulate.
   */
  async get(name: string) {
    this.log(`Get> Name=%O`, name)
    return this.instance.get(name)
  }
}