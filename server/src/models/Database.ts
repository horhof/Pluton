import * as sequelize from 'sequelize'
import * as Umzug from 'umzug'

import { getLog } from '../Logger'
import * as Fleet from './Fleet'
import * as Planet from './Planet'
import * as Squadron from './Squadron'
import * as Ship from './Ship'
import * as Star from './Star'
import * as User from './User'

const debug = getLog(`Db`)

export const ModelOptions = {
  timestamps: false,
  underscored: true,
}

export class Database {
  static RESET = true
  fleets: Fleet.Fleets
  planets: Planet.Planets
  squadrons: Squadron.Squadrons
  ships: Ship.Ships
  stars: Star.Stars
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
      logging: false,
    });
    debug(`New> Defining models...`)
    this.fleets = Fleet.define(this.sequelize)
    this.planets = Planet.define(this.sequelize)
    this.ships = Ship.define(this.sequelize)
    this.squadrons = Squadron.define(this.sequelize)
    this.stars = Star.define(this.sequelize)
    this.users = User.define(this.sequelize)
    debug(`New> Associating models...`)
    Fleet.associate(this.fleets, [this.planets, this.users])
    Planet.associate(this.planets, [this.stars, this.users])
    Squadron.associate(this.squadrons, [this.fleets])
    User.associate(this.users, [this.planets, this.fleets])
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
        path: 'server/build/migrations',
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