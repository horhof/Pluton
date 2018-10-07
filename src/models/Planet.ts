import * as sequelize from 'sequelize'

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
  const model = db.define('planets', Columns, Options) as Planets
  return model
}