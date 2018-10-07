import * as sequelize from 'sequelize'

export interface IGalaxy {
  id?: number
  /** Which position is this within the cluster? */
  index?: number
  /** Which cluster is this galaxy a part of? */
  cluster?: number
}

export interface Galaxy extends IGalaxy {
}

export interface Galaxies extends sequelize.Model<Galaxy, IGalaxy> {
}

export const Columns = {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  index: {
    type: sequelize.INTEGER,
    allowNull: false,
  },
  cluster: {
    type: sequelize.INTEGER,
    allowNull: false,
  },
}

const Options = {
  timestamps: false,
}

export function define(db: sequelize.Sequelize) {
  const model = db.define('galaxies', Columns, Options) as Galaxies
  return model
}