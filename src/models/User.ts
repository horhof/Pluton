import * as sequelize from 'sequelize'

import { getLog } from '../Logger'
import { ModelOptions } from './Database'
import * as Fleet from './Fleet'
import * as Planet from './Planet'

const debug = getLog(`User`)

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
  init(data: IUser): Promise<User>
}

export const Columns = {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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

type Deps = [
  Planet.Planets,
  Fleet.Fleets
]

export function define(db: sequelize.Sequelize, deps: Deps) {
  const model = db.define('users', Columns, ModelOptions) as Users
  const [planets, fleets] = deps
  model.planets = planets
  model.fleets = fleets

  model.init = async function(data: IUser) {
    debug(`Init>`)
    const userName = data.name
    const user = await this.create(data)
    await this.planets.init({
      name: `${userName}'s planet`,
      user_id: user.id,
    })
    return user
  }

  return model
}