import * as sequelize from 'sequelize'
import { ModelOptions } from './Database'

export interface ICapSing {
}

export interface CapSing extends ICapSing {
}

export interface CapPlural extends sequelize.Model<CapSing, ICapSing> {
}

export const Columns = {
}

type Deps = [
]

export function define(db: sequelize.Sequelize, deps?: Deps) {
  const model = db.define('lowPlural', Columns, ModelOptions) as CapPlural
  return model
}