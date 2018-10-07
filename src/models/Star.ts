import * as sequelize from 'sequelize'

export interface IStar {
  id?: number
  /** Which position is this within the cluster? */
  index?: number
  /** Which cluster is this star a part of? */
  cluster?: number
  name?: number
}

export interface Star extends IStar {
}

export interface Stars extends sequelize.Model<Star, IStar> {
}

export const Columns = {
  id: {
    type: sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  name: {
    type: sequelize.STRING,
    allowNull: false,
  },
}

const Options = {
  timestamps: false,
}

export function define(db: sequelize.Sequelize) {
  const model = db.define('stars', Columns, Options) as Stars
  return model
}