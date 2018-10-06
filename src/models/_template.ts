import sequelize = require('sequelize')

export interface IXxx {
}

export interface Xxx extends IXxx {
}

export interface Xxxs extends sequelize.Model<Xxx, IXxx> {
}

export const Columns = {
}

const Options = {
  timestamps: false,
}

export function define(db: sequelize.Sequelize) {
  const model: Xxxs = db.define('xxxs', Columns, Options)
  return model
}