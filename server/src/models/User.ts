import { assign } from 'lodash'
import * as sequelize from 'sequelize'
import * as uuid from 'uuid'

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
  key?: string
}

export interface User extends IUser {
}

export interface Users extends sequelize.Model<User, IUser> {
  fleets: Fleets
  planets: Planets
  /** Initialize a user and create a planet for it. */
  init(data: IUser): Promise<User>
  authenticate(data: IUser): Promise<User>
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
  key: {
    type: sequelize.STRING,
    allowBlank: true,
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

  model.authenticate = async function(data: IUser) {
    const { email, password } = data
    if (!email || !password) throw new Error(`Login details '${email}/${password}' are not valid.`)
    const user = await this.find({ where: { email, password } })
    if (!user) throw new Error(`User was not found with those credentials.`)
    const key = uuid()
    const [affectedRows] = await this.update({ key }, { where: { id: user.id! } })
    if (affectedRows < 1) throw new Error(`Failed to update user with API key.`)
    return await this.findById(user.id) as User
  }

  return model
}

type Deps = [Planets, Fleets]
export function associate(model: Users, [planets, fleets]: Deps) {
  assign(model, { planets, fleets })
}