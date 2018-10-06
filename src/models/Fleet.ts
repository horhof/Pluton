import { getLog } from '../Logger'
const debug = getLog(`Fleet`)
debug

import * as the from 'lodash'

import { Database } from '../data/Database'
import { Record } from '../data/Record'
import { Model } from '../data/Model'

interface FleetFields {
  name: string
  userId?: string
  mobile?: boolean
  targetPlanetId?: string
  moving?: boolean
  travelTime?: number
}

export class Fleet extends Record implements FleetFields {
  name: string

  userId: string

  /** Does this fleet occupy and defend a planet or is it mobile? */
  mobile: boolean

  /** Which planet is this fleet moving toward or has stopped at? */
  targetPlanetId: string

  /** Is this fleet in transit or arrived at its destination? */
  moving: boolean

  /** If moving, how many ticks left before this fleet arrives at the target? */
  travelTime: number

  constructor(x: any) {
    super(x, {
      name: x => the(x).isString(),
      userId: x => the(x).isString(),
      targetPlanetId: x => the(x).isString(),
      moving: x => the(x).isBoolean(),
      travelTime: x => the(x).isNumber(),
    })
  }
}

export class Fleets extends Model<FleetFields, Fleet> {
  constructor(database: Database) {
    super('fleets', database)
  }

  protected instantiate(untrusted: any) {
    return new Fleet(untrusted)
  }
}