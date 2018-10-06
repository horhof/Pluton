import { getLog } from '../Logger'
const debug = getLog('Fleets')
debug

import sequelize = require('sequelize')

export interface IFleet {
  name: string
  mobile: boolean
  moving: boolean
  travelTime: number
  userId: number
  targetPlanetId: number
}

export interface Fleet extends IFleet {
}

export interface Fleets extends sequelize.Model<Fleet, IFleet> {
}

export const Columns = {
  name: sequelize.STRING,
  mobile: sequelize.STRING,
  moving: sequelize.BOOLEAN,
  travelTime: sequelize.INTEGER,
}

const Options = {
  timestamps: false,
}

export function define(db: sequelize.Sequelize) {
  const model: Fleets = db.define('fleets', Columns, Options)
  return model
}