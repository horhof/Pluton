import * as sequelize from 'sequelize'

export interface IPlanet {
  id?: number
  name?: string
  index?: number
  starId?: number
  userId?: number
}

export interface Planet extends IPlanet {
}

export interface Planets extends sequelize.Model<Planet, IPlanet> {
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
  starId: {
    type: sequelize.INTEGER,
    allowNull: false,
    references: { model: 'stars', key: 'id' },
    onDelete: 'SET NULL',
  },
  userId: {
    type: sequelize.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'SET NULL',
  },
}

const Options = {
  timestamps: false,
}

export function define(db: sequelize.Sequelize) {
  const model = db.define('planets', Columns, Options) as Planets
  return model
}