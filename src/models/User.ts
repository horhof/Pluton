import * as sequelize from 'sequelize'

import { getLog } from '../Logger'
import * as Fleet from './Fleet'
import * as Planet from './Planet'

const debug = getLog(`Http:Ctrl:Fleet`)

export interface IUser {
  id?: number
  name?: string
  email?: string
  password?: string
}

export interface User extends IUser {
}

export interface Users extends sequelize.Model<User, IUser> {
  fleets: Fleet.Fleets
  planets: Planet.Planets
  initUser(data: IUser): Promise<User>
}

export const Columns = {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: sequelize.STRING,
    allowBlank: false,
  },
  email: {
    type: sequelize.STRING,
    allowBlank: false,
  },
  password: {
    type: sequelize.STRING,
    allowBlank: false,
  },
}

const Options = {
  timestamps: false,
}

type UserDeps = [
  Planet.Planets,
  Fleet.Fleets
]

export function define(db: sequelize.Sequelize, deps: UserDeps) {
  const model = db.define('users', Columns, Options) as Users
  const [planets, fleets] = deps
  model.planets = planets
  model.fleets = fleets

  model.initUser = async function(data: IUser) {
    debug(`Init user>`)
    const userName = data.name
    const user = await this.create(data)
    await this.planets.create({
      name: `${userName}'s planet`,
      userId: user.id,
    })
    return user
  }

  return model
}