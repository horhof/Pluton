import * as the from 'lodash'

import { Database } from './data/Database'
import { Record } from './data/Record'
import { Model } from './data/Model'

import { getLog } from './Logger'
import { Fleets } from './Fleet';
const debug = getLog(`Fleet`)
debug

interface IUser {
  name: string
}

export class User extends Record implements IUser {
  name: string

  constructor(x: any) {
    super(x, {
      name: x => the(x).isString(),
    })
  }
}

export class Users extends Model<IUser, User> {
  // @ts-ignore
  private fleets: Fleets

  constructor(database: Database) {
    super('users', database)
  }

  associateFleets(fleets: Fleets) {
    this.fleets = fleets
  }

  protected instantiate(untrusted: any) {
    return new User(untrusted)
  }
}