import sequelize = require('sequelize')

export interface IShip {
  class: string
  designation: number
  name: string
}

export interface Ship extends IShip {
}

export interface Ships extends sequelize.Model<Ship, IShip> {
}

export const Columns = {
  class: sequelize.STRING,
  designation: sequelize.INTEGER,
  name: sequelize.STRING,
}

const Options = {
  timestamps: false,
}

export function define(db: sequelize.Sequelize) {
  const model: Ships = db.define('ships', Columns, Options)
  return model
}