import { getLog } from '../Logger'
const debug = getLog(`Database`)

import sequelize = require('sequelize')
import * as Umzug from 'umzug'

import * as User from './User'
import * as Ship from './Ship'
import * as Fleet from './Fleet'

export class Database {
  static RESET = true
  users: User.Users
  ships: Ship.Ships
  fleets: Fleet.Fleets
  private sequelize: sequelize.Sequelize

  constructor() {
    debug(`New> Starting Sequelize...`)
    this.sequelize = new sequelize('pluton', 'pluton', 'password', {
      host: 'localhost',
      dialect: 'postgres',
      operatorsAliases: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });
    debug(`New> Defining models...`)
    this.users = User.define(this.sequelize)
    this.ships = Ship.define(this.sequelize)
    this.fleets = Fleet.define(this.sequelize)
    debug(`New> Associating models...`)
    this.fleets.belongsTo(this.users) && this.users.hasMany(this.fleets)
  }
  private async seed() {
    const umzug = new Umzug({
      storage: 'sequelize',
      storageOptions: {
        sequelize: this.sequelize,
      },
      migrations: {
        pattern: /^\d+\.js$/,
        params: [this.sequelize],
        path: 'build/migrations',
      },
    })

    return umzug.pending()
      .then((pending: Umzug.Migration[]) => {
        debug(`Migrate> Pending=%o`, pending)
        return umzug.up()
      })
  }

  async start() {
    if (Database.RESET) await this.sequelize.dropAllSchemas({})
    debug(`Start> Syncing tables...`)
    await this.sequelize.sync()
    debug(`Start> Seeding...`)
    return this.seed()
  }
}