import { getLog } from '../Logger'
const debug = getLog(`Http:Ctrl:Fleet`)

import * as the from 'lodash'
import sequelize = require('sequelize')

export interface IFleet {
  name?: string
  index?: number
  /** Is this fleet a planetary defense fleet or able to be moved? */
  mobile?: boolean
  /** Whether or not the fleet is en route to a target. */
  moving?: boolean
  /** The number of ticks until the fleet reaches its destination. */
  ticksRemaining?: number
  /** The planet the fleet is at or is travelling to. */
  targetPlanetId?: number
  userId?: number
}

export interface Fleet extends IFleet {
}

export interface Fleets extends sequelize.Model<Fleet, IFleet> {
  add(data: IFleet): Promise<Fleet>
}

export const Columns = {
  name: {
    type: sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  index: {
    type: sequelize.INTEGER,
    allowNull: false,
  },
  mobile: {
    type: sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  moving: {
    type: sequelize.STRING,
    allowNull: false,
    defaultValue: false,
  },
  ticksRemaining: {
    type: sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  targetPlanetId: {
    type: sequelize.INTEGER,
    allowNull: true,
    references: { model: 'planets', key: 'id' },
  },
}

const Options = {
  timestamps: false,
}

export function define(db: sequelize.Sequelize) {
  const model = <Fleets>db.define('fleets', Columns, Options)

  model.add = async function(data: IFleet) {
    debug(`Add>`)
    const index = 1
    the(data).assign({ index }).value()
    return this.create(data)
  }

  return model
}