import * as the from 'lodash'

import { Database } from '../data/Database'
import { Record } from '../data/Record'
import { Model } from '../data/Model'

import { getLog } from '../Logger'
const debug = getLog(`Xxx`)
debug

interface XxxFields {
  name: string
}

export class Xxx extends Record implements XxxFields {
  name: string

  constructor(x: any) {
    super(x, {
      name: x => the(x).isString(),
    })
  }
}

export class Xxxs extends Model<XxxFields, Xxx> {
  constructor(database: Database) {
    super('xxx', database)
  }

  protected instantiate(untrusted: any) {
    return new Xxx(untrusted)
  }
}