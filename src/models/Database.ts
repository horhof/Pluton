import { getLog } from '../Logger'
const debug = getLog(`Database`)

import sequelize = require('sequelize')

import * as Fleet from './Fleet'
import * as User from './User'

export class Database {
  static RESET = true
  users: User.Users
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
    this.fleets = Fleet.define(this.sequelize)
    debug(`New> Associating models...`)
    this.fleets.belongsTo(this.users)
    this.users.hasMany(this.fleets)
  }

  async start() {
    if (Database.RESET) await this.sequelize.dropAllSchemas({})
    return this.sequelize.sync()
  }
}