import { getLog } from './Logger'
const debug = getLog(`Game`)
debug

// @ts-ignore
import * as the from 'lodash'
import * as restify from 'restify'

import { Database } from './data/Database'
import { Fleets } from './models/Fleet'
import { Users } from './models/User'
import FleetsCtrl from './ctrl/FleetsCtrl';
import UsersCtrl from './ctrl/UsersCtrl';

export class Data extends Database {
  users: Users

  fleets: Fleets

  constructor() {
    super('data/db.json', {
      users: [],
      fleets: [],
    })
    this.users = new Users(this)
    this.fleets = new Fleets(this)
    this.users.associateFleets(this.fleets)
  }
}

export class Game {
  db: Data

  server: restify.Server

  private controllers: { [name: string]: any } = {}

  constructor() {
    this.db = new Data()

    debug(`New> Spinning up server...`)
    this.server = restify.createServer()
    this.server.use(restify.plugins.bodyParser())

    /*
    debug(`New> Connecting static resources...`);
    this.server.get(/^\/ui/, restify.plugins.serveStatic({
      directory: __dirname + '\\..',
      default: 'index.html'
    }));
    */

    this.controllers.users = new UsersCtrl(this.server, this.db.users)
    this.controllers.fleets = new FleetsCtrl(this.server, this.db.fleets)

    debug(`New> Done.`);
  }

  async start() {
    return new Promise<void>(resolve => {
      this.server.listen(8192, '127.0.0.1', () => {
        debug(`Init> Server started.`)
        resolve()
      })
    })
  }

  /*
  tick() {
    // For each fleet not in its target location, move it.
    const fleets = await this.db.fleets.getAll()
    the(fleets).forEach(f => {
    })
  }
  */
}