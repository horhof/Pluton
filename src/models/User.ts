import { getLog } from '../Logger'
const debug = getLog(`Http:Ctrl:Fleet`)

import * as Planet from './Planet'
import * as Fleet from './Fleet'

import sequelize = require('sequelize')

export interface IUser {
  name: string
}

export interface User extends IUser {
}

export interface Users extends sequelize.Model<User, IUser> {
  initUser(data: IUser): Promise<User>
}

export const Columns = {
  name: sequelize.STRING,
}

const Options = {
  timestamps: false,
}

type UserDeps = [Planet.Planets, Fleet.Fleets]

export function define(db: sequelize.Sequelize, deps: UserDeps) {
  const [planets, fleets] = deps

  const model = <Users>db.define('users', Columns, Options)

  model.initUser = async function(data: IUser) {
    debug(`Init user>`)
    const userName = data.name
    await fleets.add({ name: `${userName}'s planet` })
    return this.create(data)
  }

  return model
}