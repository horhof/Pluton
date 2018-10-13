import { assign } from 'lodash'
import * as sequelize from 'sequelize'

import { ModelOptions } from './Database'
import * as Ship from './Ship'
import * as Fleet from './Fleet'

export interface ISquadron {
  id?: number
  size?: number
  // Foreign keys.
  ship_id?: number
  fleet_id?: number
  // Joins.
  ships?: Ship.Ship[]
  fleets?: Fleet.Fleet[]
}

export interface Squadron extends ISquadron {
}

export interface Squadrons extends sequelize.Model<Squadron, ISquadron> {
}

export const Columns = {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  size: {
    type: sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  ship_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    references: { model: 'ships', key: 'id' },
    onDelete: 'CASCADE',
  },
  fleet_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    references: { model: 'fleets', key: 'id' },
    onDelete: 'CASCADE',
  },
}

export function define(db: sequelize.Sequelize) {
  const model = db.define('squadrons', Columns, ModelOptions) as Squadrons
  return model
}

type Deps = [
  Fleet.Fleets
]

export function associate(squadrons: Squadrons, [fleets]: Deps) {
  assign(squadrons, { fleets })
  squadrons.belongsTo(fleets, { foreignKey: `fleet_id` }) && fleets.hasMany(squadrons)
}