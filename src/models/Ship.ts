import sequelize = require('sequelize')

export interface IShip {
  class: string
  designation: number
  name: string
  initiative: number
}

export interface Ship extends IShip {
}

export interface Ships extends sequelize.Model<Ship, IShip> {
}

export enum ShipClass {
  F = 'Fighter',
  P = 'Corvette',
  A = 'Frigate',
  D = 'Destroyer',
  C = 'Cruiser',
  B = 'Battleship',
}

export const Columns = {
  class: {
    type: sequelize.ENUM(Object.keys(ShipClass)),
    allowNull: false,
  },
  designation: {
    type: sequelize.INTEGER,
    allowNull: false,
  },
  name: {
    type: sequelize.STRING,
    allowNull: false,
  },
  initiative: {
    type: sequelize.INTEGER,
    allowNull: false,
    defaultValue: 10,
  },
}

const Options = {
  timestamps: false,
}

export function define(db: sequelize.Sequelize) {
  const model: Ships = db.define('ships', Columns, Options)
  return model
}