import { assign } from 'lodash'
import * as sequelize from 'sequelize'

import { getLog } from '../Logger'
import { ModelOptions } from './Database'
import { Fleets } from './Fleet'
import { Planets } from './Planet'

const debug = getLog(`User`)
debug

export interface IUser {
  id?: number
  name?: string
  email?: string
  password?: string
}

export interface User extends IUser {
}

export interface Users extends sequelize.Model<User, IUser> {
  fleets: Fleets
  planets: Planets
  /** Initialize a user and create a planet for it. */
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

export function define(db: sequelize.Sequelize) {
  const model = db.define('users', Columns, ModelOptions) as Users

  model.init = async function(data: IUser) {
    const user = await this.create(data)
    await this.planets.init({
      name: `${user.name}'s planet`,
      user_id: user.id,
    })
    return user
  }

  return model
}

type Deps = [Planets, Fleets]
export function associate(model: Users, [planets, fleets]: Deps) {
  assign(model, { planets, fleets })
}