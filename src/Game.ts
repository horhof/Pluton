import { getLog } from './Logger'
const debug = getLog(`Game`)

import * as restify from 'restify'

import { Database } from './models/Database'
import { UsersCtrl } from './http/Users'
import { FleetsCtrl } from './http/Fleets'

export class Game {
  db: Database

  server: restify.Server

  private controllers: { [name: string]: any } = {}

  constructor() {
    debug(`New> Loading database...`)
    this.db = new Database()

    debug(`New> Loading HTTP server...`)
    this.server = restify.createServer()
    this.server.use(restify.plugins.bodyParser())

    debug(`New> Loading controllers...`)
    this.controllers.users = new UsersCtrl(this.server, this.db.users)
    this.controllers.fleets = new FleetsCtrl(this.server, this.db.fleets)
  }

  async start() {
    debug(`Start> Starting database...`)
    await this.db.start()

    return new Promise<void>(resolve => {
      debug(`Start> Starting HTTP server...`)
      this.server.listen(8192, '127.0.0.1', () => {
        debug(`Init> Server started.`)
        resolve()
      })
    })
  }
}