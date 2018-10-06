import { getLog } from '../Logger'
const debug = getLog(`User`)
debug

import * as the from 'lodash'

import { Database } from '../data/Database'
import { Record } from '../data/Record'
import { Model } from '../data/Model'
import { Planets } from './Planet'

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
  private planets: Planets

  constructor(database: Database) {
    super('users', database)
  }

  async createNewUser(name: string) {
    const user = await this.add({ name })
    await this.planets.add({
      name: `${user.name}'s home planet`,
      userId: user.id,
    })
    return user
  }

  associatePlanets(planets: Planets) {
    this.planets = planets
  }

  protected instantiate(untrusted: any) {
    return new User(untrusted)
  }
}