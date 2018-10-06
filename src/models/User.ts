import { getLog } from '../Logger'
const debug = getLog('Users')
debug

import sequelize = require('sequelize')

export interface IUser {
  name: string
}

export interface User extends IUser {
}

export interface Users extends sequelize.Model<User, IUser> {
}

export function define(db: sequelize.Sequelize) {
  const model: Users = db.define('users', {
    name: sequelize.STRING,
  })

  return model
}