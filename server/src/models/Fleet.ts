import { assign } from 'lodash'
import * as sequelize from 'sequelize'

import { getLog } from '../Logger'
import { ModelOptions } from './Database'
import { Planet, Planets } from './Planet'
import { User, Users } from './User'

const debug = getLog(`Fleet`)

export interface IFleet {
  id?: number
  name?: string
  index?: number
  /** Is this fleet a planetary defense fleet or able to be moved? */
  mobile?: boolean
  /** Whether or not the fleet is en route to a target. */
  moving?: boolean
  /** The number of ticks until the fleet reaches its destination. */
  ticks_remaining?: number
  /** The owning planet. */
  planet_id?: number
  planet?: Planet
  /** The planet the fleet is at or is travelling to. */
  target_planet_id?: number
  targetPlanet?: Planet
  /** The fleet's owner (if planets are joined). */
  user_id?: number
  user?: User
}

export interface Fleet extends IFleet, sequelize.Instance<IFleet> {
  warp(planetId: number): Promise<Fleet>
}

export interface Fleets extends sequelize.Model<Fleet, IFleet> {
  prototype: Fleet
  planets: Planets
  users: Users
  /** Add to a planet's set of fleets. */
  add(data: IFleet): Promise<Fleet>
}

export enum WarpTime {
  BASE = 6,
}

export const Columns = {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
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
    defaultValue: true,
  },
  moving: {
    type: sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  ticks_remaining: {
    type: sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  planet_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    references: { model: 'planets', key: 'id' },
    onDelete: 'CASCADE',
  },
  target_planet_id: {
    type: sequelize.INTEGER,
    allowNull: true,
    references: { model: 'planets', key: 'id' },
    onDelete: 'SET NULL',
  },
}

export function define(db: sequelize.Sequelize) {
  const model = db.define('fleets', Columns, ModelOptions) as Fleets

  model.add = async function(data: IFleet) {
    const { planet_id } = data
    if (!planet_id) throw new Error(`Fleet must belong to a planet.`)
    const count = await this.count({
      include: [model.planets],
      where: { planet_id },
    })
    assign(data, { index: count + 1 })
    return this.create(data)
  }

  model.prototype.warp = async function(planet_id: number) {
    debug(`Warp> Planet=%o`, planet_id)
    return this.update({
      target_planet_id: planet_id,
      moving: true,
      ticks_remaining: WarpTime.BASE,
    })
  }

  return model
}

type Deps = [Planets, Users]
export function associate(fleets: Fleets, [planets, users]: Deps) {
  assign(fleets, { planets, users })
  fleets.belongsTo(planets, { foreignKey: `planet_id` }) && planets.hasMany(fleets)
}