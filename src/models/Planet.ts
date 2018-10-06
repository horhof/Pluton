import { getLog } from '../Logger'
const debug = getLog(`User`)
debug

import * as the from 'lodash'

import { Database } from '../data/Database'
import { Record } from '../data/Record'
import { Model } from '../data/Model'

interface IPlanet {
  name: string
  userId: string
}

export class Planet extends Record implements IPlanet {
  name: string
  userId: string

  constructor(x: any) {
    super(x, {
      name: x => the(x).isString(),
    })
  }
}

export class Planets extends Model<IPlanet, Planet> {
  constructor(database: Database) {
    super('planets', database)
  }

  protected instantiate(untrusted: any) {
    return new Planet(untrusted)
  }
}