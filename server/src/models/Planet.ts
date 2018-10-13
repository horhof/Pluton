import { assign, forEach } from 'lodash'
import * as sequelize from 'sequelize'

import { getLog } from '../Logger'
import { ModelOptions } from './Database'
import { Stars, Star } from './Star'
import { Users, User } from './User'

const debug = getLog(`Planet`)

export interface IPlanet {
  id?: number
  name?: string
  index?: number
  star_id?: number
  star?: Star
  user_id?: number
  user?: User
  coords?: [number, number, number]
}

export interface Planet extends IPlanet {
}

export interface Planets extends sequelize.Model<Planet, IPlanet> {
  stars: Stars
  init(data: IPlanet): Promise<Planet>
  read(): Promise<Planet[]>
  readById(id: number): Promise<Planet | undefined>
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
    onDelete: 'CASCADE',
  },
}

interface PlanetParams {
  name?: string
  /** If omitted, choose a random star. */
  starIndex?: number
  user_id: number
}

export function define(db: sequelize.Sequelize) {
  const model = db.define('planets', Columns, ModelOptions) as Planets

  model.init = async function(params: PlanetParams) {
    const { name, user_id, starIndex } = params
    debug(`Init> Name=%o UserId=%o StarIndex=%o`, name, user_id, starIndex)
    let star_id: number | undefined
    if (starIndex) {
      debug(`Init> Index to the star was provided. Looking it up...`)
      const star = await this.stars.find({ where: { index: starIndex } })
      if (star)
        star_id = star.id as number
      else
        throw new Error(`Star index ${starIndex} isn't valid.`)
      debug(`Init> Star %o is ID %o`, starIndex, star_id)
    }
    else {
      debug(`Init> Star index wasn't provided. Choosing a random one...`)
      const starCount = await this.stars.count()
      star_id = Math.round(Math.random() * starCount - 1) + 1
      debug(`Init> RandomStarId=%o`, star_id)
    }
    const planetCount = await this.count({ where: { star_id } })
    const insert = {
      name: name || `A mysterious planet`,
      index: planetCount + 1,
      user_id,
      star_id,
    }
    const planet = await this.create(insert)
    return this.readById(planet.id as number) as Planet
  }

  function saveCoords(planet: Planet) {
    // @ts-ignore
    planet = planet.toJSON() as Planet
    const star = planet.star!
    planet.coords = [star.cluster!, star.index!, planet.index!]
    return planet
  }

  model.read = async function() {
    const planets = await this.findAll({ include: [this.stars] })
    forEach(planets, (planet, index) => {
      planets[index] = saveCoords(planet)
    })
    return planets
  }

  model.readById = async function(id: number) {
    let planet = await this.findById(id, { include: [this.stars] })
    if (!planet) return
    saveCoords(planet)
    return planet
  }

  return model
}

type Deps = [Stars, Users]
export function associate(planets: Planets, [stars, users]: Deps) {
  assign(planets, { stars })
  planets.belongsTo(stars, { foreignKey: `star_id` }) && stars.hasMany(planets)
  planets.belongsTo(users, { foreignKey: `user_id` }) && users.hasMany(planets)
}