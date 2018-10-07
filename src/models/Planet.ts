import * as sequelize from 'sequelize'

import { getLog } from '../Logger'
import { ModelOptions } from './Database'
import * as Star from './Star'

const debug = getLog(`Planet`)

export interface IPlanet {
  id?: number
  name?: string
  index?: number
  star_id?: number
  user_id?: number
}

export interface Planet extends IPlanet {
}

export interface Planets extends sequelize.Model<Planet, IPlanet> {
  stars: Star.Stars
  init(data: IPlanet): Promise<Planet>
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
  star_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    references: { model: 'stars', key: 'id' },
    onDelete: 'SET NULL',
  },
  user_id: {
    type: sequelize.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'SET NULL',
  },
}

type Deps = [
  Star.Stars
]

export function define(db: sequelize.Sequelize, deps: Deps) {
  const model = db.define('planets', Columns, ModelOptions) as Planets
  const [stars] = deps
  model.stars = stars

  model.init = async function(data: { name: string, user_id: number }) {
    const { name, user_id } = data
    const stars = await this.stars.count()
    const star_id = Math.round(Math.random() * stars + 1)
    const planets = await this.count({ where: { star_id } })
    debug(`Init> Stars=%o StarId=%o Planets=%o`, stars, star_id, planets)
    const insert = {
      name: `${name}'s planet`,
      user_id,
      star_id,
      index: planets + 1,
    }
    debug(`Init> Data=%o`, insert)
    return this.create(insert)
  }

  return model
}