import * as the from 'lodash'

import { Database } from '../data/Database'
import { Record } from '../data/Record'
import { Model } from '../data/Model'

import { getLog } from '../Logger'
const debug = getLog(`Ship`)
debug

interface ShipFields {
  name: string
  class: string
  designation: number
}

export class Ship extends Record implements ShipFields {
  name: string
  class: string
  designation: number

  constructor(x: any) {
    super(x, {
      name: x => the(x).isString(),
      class: x => the(x).isString(),
      designation: x => the(x).isNumber(),
    })
  }
}

export class Ships extends Model<ShipFields, Ship> {
  constructor(database: Database) {
    super('ships', database)
  }

  protected instantiate(untrusted: any) {
    return new Ship(untrusted)
  }
}