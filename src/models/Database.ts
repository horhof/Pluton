import { getLog } from '../Logger'
const debug = getLog(`Database`)

import sequelize = require('sequelize')
import * as Umzug from 'umzug'

import * as User from './User'
import * as Ship from './Ship'
import * as Fleet from './Fleet'
import * as Planet from './Planet'

export class Database {
  static RESET = true
  users: User.Users
  ships: Ship.Ships
  fleets: Fleet.Fleets
  planets: Planet.Planets
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
      logging: false,
    });
    debug(`New> Defining models...`)
    this.planets = Planet.define(this.sequelize)
    this.fleets = Fleet.define(this.sequelize, [this.planets])
    this.users = User.define(this.sequelize, [this.planets, this.fleets])
    this.ships = Ship.define(this.sequelize)
    debug(`New> Associating models...`)
    this.fleets.belongsTo(this.planets) && this.planets.hasMany(this.fleets)
    this.planets.belongsTo(this.users) && this.users.hasMany(this.planets)
  }

  private async seed() {
    const umzug = new Umzug({
      storage: 'sequelize',
      storageOptions: {
        sequelize: this.sequelize,
      },
      migrations: {
        pattern: /^.+\.js$/,
        params: [this.sequelize],
        path: 'build/migrations',
      },
    })
    return umzug.up()
  }

  async start() {
    if (Database.RESET) {
      debug(`Start> Dropping schemas...`)
      await this.sequelize.query(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`)
    }
    debug(`Start> Syncing tables...`)
    await this.sequelize.sync()
    debug(`Start> Seeding...`)
    return this.seed()
  }
}