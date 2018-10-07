import * as sequelize from 'sequelize'

export interface ICapSing {
}

export interface CapSing extends ICapSing {
}

export interface CapPlural extends sequelize.Model<CapSing, ICapSing> {
}

export const Columns = {
}

const Options = {
  timestamps: false,
}

export function define(db: sequelize.Sequelize) {
  const model = db.define('lowPlural', Columns, Options) as CapPlural
  return model
}