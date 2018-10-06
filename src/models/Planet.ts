import sequelize = require('sequelize')

export interface IPlanet {
  name: string
  userId: number
}

export interface Planet extends IPlanet {
}

export interface Planets extends sequelize.Model<Planet, IPlanet> {
}

export const Columns = {
  name: sequelize.STRING,
}

const Options = {
  timestamps: false,
}

export function define(db: sequelize.Sequelize) {
  const model: Planets = db.define('planets', Columns, Options)
  return model
}