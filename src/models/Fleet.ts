import { getLog } from '../Logger'
const debug = getLog(`Models:Fleet`)

import { assign } from 'lodash'
import * as sequelize from 'sequelize'
import * as Planet from './Planet'

export interface IFleet {
  id?: number
  name?: string
  index?: number
  /** Is this fleet a planetary defense fleet or able to be moved? */
  mobile?: boolean
  /** Whether or not the fleet is en route to a target. */
  moving?: boolean
  /** The number of ticks until the fleet reaches its destination. */
  ticksRemaining?: number
  /** The owning planet. */
  planetId?: number
  /** The planet the fleet is at or is travelling to. */
  targetPlanetId?: number
}

export interface Fleet extends IFleet {
}

export interface Fleets extends sequelize.Model<Fleet, IFleet> {
  planets: Planet.Planets
  /** Add to a planet's set of fleets. */
  add(data: IFleet): Promise<Fleet>
}

export const Columns = {
  name: {
    type: sequelize.STRING,
    allowNull: false,
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
    type: sequelize.BOOLEAN,
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

type FleetDeps = [
  Planet.Planets
]

export function define(db: sequelize.Sequelize, deps: FleetDeps) {
  const model = <Fleets>db.define('fleets', Columns, Options)
  const [planets] = deps
  model.planets = planets

  model.add = async function(data: IFleet) {
    const { planetId } = data
    if (!planetId) throw new Error(`Fleet must belong to a planet.`)
    const count = await this.count({
      include: [model.planets],
      where: { planetId },
    })
    assign(data, { index: count + 1 })
    return this.create(data)
  }

  return model
}