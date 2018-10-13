import * as restify from 'restify'
import * as sequelize from 'sequelize'

import { FleetsCtrl } from './http/Fleets'
import { GameCtrl } from './http/Game'
import { PlanetsCtrl } from './http/Planets'
import { UsersCtrl } from './http/Users'
import { getLog } from './Logger'
import { Database } from './models/Database'
import { IFleet } from './models/Fleet'

const debug = getLog(`Server`)

export class Server {
  db: Database
  server: restify.Server
  private ctrl: { [name: string]: any } = {}

  constructor() {
    debug(`New> Loading database...`)
    this.db = new Database()

    debug(`New> Loading HTTP server...`)
    this.server = restify.createServer()
    this.server.use(restify.plugins.bodyParser())

    debug(`New> Loading controllers...`)
    this.ctrl.game = new GameCtrl(this.server, this)
    this.ctrl.users = new UsersCtrl(this.server, this.db.users)
    this.ctrl.fleets = new FleetsCtrl(this.server, this.db.fleets)
    this.ctrl.planets = new PlanetsCtrl(this.server, this.db.planets)
  }

  async start() {
    debug(`Start> Starting database...`)
    await this.db.start()
    await new Promise<void>(resolve => {
      debug(`Start> Starting HTTP server...`)
      this.server.listen(8192, '127.0.0.1', () => {
        debug(`Init> Server started.`)
        resolve()
      })
    })
    debug(`Start> Connecting static resources...`);
    this.server.get('/*', restify.plugins.serveStatic({
      directory: __dirname + '\\..\\..\\client\\project',
      default: 'index.html',
    }))
  }

  async tick() {
    debug(`Tick>`)
    return this.advanceMovingFleets()
  }

  private async advanceMovingFleets() {
    // @ts-ignore: sequelize.literal is not a number
    const data = {
      ticks_remaining: sequelize.literal(`ticks_remaining - 1`)
    } as IFleet
    const where = {
      moving: true,
      ticks_remaining: { $gt: 0 },
    }
    return this.db.fleets.update(data, { where })
  }
}