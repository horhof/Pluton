import * as sequelize from 'sequelize'
import * as Umzug from 'umzug'

import { getLog } from '../Logger'
import * as Fleet from './Fleet'
import * as Galaxy from './Galaxy'
import * as Planet from './Planet'
import * as Ship from './Ship'
import * as User from './User'

const debug = getLog(`Database`)

export class Database {
  static RESET = true
  fleets: Fleet.Fleets
  galaxies: Galaxy.Galaxies
  planets: Planet.Planets
  ships: Ship.Ships
  users: User.Users
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
      logging: true,
    });
    debug(`New> Defining models...`)
    this.ships = Ship.define(this.sequelize)
    this.galaxies = Galaxy.define(this.sequelize)
    this.planets = Planet.define(this.sequelize)
    debug(`New> Defining models with dependencies...`)
    this.fleets = Fleet.define(this.sequelize, [this.planets])
    this.users = User.define(this.sequelize, [this.planets, this.fleets])
    debug(`New> Associating models...`)
    this.planets.belongsTo(this.galaxies) && this.galaxies.hasMany(this.planets)
    this.planets.belongsTo(this.users) && this.users.hasMany(this.planets)
    this.fleets.belongsTo(this.planets) && this.planets.hasMany(this.fleets)
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