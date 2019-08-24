import { ID } from '../types/Number'
import { Fleet } from './Fleet'
import { Star } from './Star'
import { stampLog } from '../Log'
import { query } from '../Database';
import { AsyncEither, left } from '../types/Either';

const log = stampLog(`Model:Planet`)

export interface Planet {
  name: string
  index: ID
  star_id: ID
  star?: Star
  ruler: string
  fleets?: Fleet
}

enum PlanetErr {
  LOOKUP,
}

export const getPlanet =
  async (id: ID): AsyncEither<PlanetErr, Planet> => {
    const $ = log(`getPlanet`)
    const res = await query({ noun: `planets?id=eq.${id}&select=*,star:stars(*),fleets(*)&fleets.order=index.asc` })
    if (!res.ok) {
      return left(PlanetErr.LOOKUP, `Failed to query for planet "${id}".`)
    }
    const body = await res.json() as Planet[]
    const [planet] = body
    if (!planet) {
      return left(PlanetErr.LOOKUP, `No planet with ID "${id}".`)
    }
    return planet
  }
