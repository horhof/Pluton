import { getLog } from '../Logger'
const debug = getLog('Users')
debug

import sequelize = require('sequelize')

export interface IFleet {
  name: string
  userId: number
  mobile: boolean
  targetPlanetId: number
  moving: boolean
  travelTime: number
}

export interface Fleet extends IFleet {
}

export interface Fleets extends sequelize.Model<Fleet, IFleet> {
}

export function define(db: sequelize.Sequelize) {
  const model: Fleets = db.define('fleets', {
    name: sequelize.STRING,
    // user
    mobile: sequelize.STRING,
    // target
    moving: sequelize.BOOLEAN,
    travelTime: sequelize.INTEGER,
  })

  return model
}