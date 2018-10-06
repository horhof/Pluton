import { getLog } from '../Logger'
const debug = getLog(`User`)
debug

import * as the from 'lodash'

import { Database } from '../data/Database'
import { Record } from '../data/Record'
import { Model } from '../data/Model'
import { Planets, Planet } from './Planet'

interface UserFields {
  name: string
  planets?: Planet[]
}

export class User extends Record implements UserFields {
  name: string
  planets?: Planet[]

  constructor(x: any) {
    super(x, {
      name: x => the(x).isString(),
      planet: () => true,
    })
  }
}

export class Users extends Model<UserFields, User> {
  private planets: Planets

  constructor(database: Database) {
    super('users', database)
  }

  /** Create a new user and planet for that user. */
  async createNewUser(name: string) {
    const user = await this.add({ name })
    await this.planets.add({
      name: `${user.name}'s home planet`,
      userId: user.id,
    })
    return user
  }

  async getAll() {
    const users = await super.getAll()
    const _planets = await this.planets.getAll()
    return the(users)
      .map(user => {
        return the(user)
          .assign({
            planets: the(_planets).filter(x => x.userId === user.id),
          })
          .value()
      })
      .value()
  }

  associatePlanets(planets: Planets) {
    this.planets = planets
  }

  protected instantiate(untrusted: any) {
    return new User(untrusted)
  }
}