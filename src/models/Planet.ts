import { getLog } from '../Logger'
const debug = getLog(`User`)
debug

import * as the from 'lodash'

import { Database } from '../data/Database'
import { Record } from '../data/Record'
import { Model } from '../data/Model'
import { Id, isId } from '../Types'

interface IPlanet {
  name: string
  userId: Id
}

export class Planet extends Record implements IPlanet {
  name: string
  userId: Id

  constructor(x: any) {
    super(x, {
      name: x => the(x).isString(),
      id: isId,
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