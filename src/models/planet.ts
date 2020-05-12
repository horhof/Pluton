import { stampLog } from '../log'
import { ID } from '../types/number'
import { Fleet } from './fleet'
import { Star } from './star'
import { db } from '../db/conn'

const log = stampLog(`model:planet`)

export interface Planet {
  id: number
  index: number
  name: string
  ruler: string
  // Parent.
  star_id: number
  star?: Star
  // Children.
  fleets?: Fleet
}

export const getPlanet =
  async (id: number): Promise<Planet | undefined | Error> => {
    const $ = log(`getPlanet`)

    const res = await db.get<Planet | undefined>(`
        SELECT *
        FROM planets
        WHERE TRUE
          AND id = $1
      `,
      [id],
      a => ({
        id: a.id as number,
        index: a.index as number,
        name: a.name as string,
        ruler: a.ruler as string,
        star_id: a.star_id as number,
      }))
    if (res instanceof Error) {
      return res
    }
    const [planet] = res

    return planet
  }

export const createPlanet =
  async (star_id: number, name: string, ruler: string): Promise<number | Error> => {
    const $ = log(`createPlanet`)

    const planetRes = await db.get<number>(`
        INSERT INTO planets
          (star_id, index, name, ruler)
        VALUES
          (
            $1
          , (SELECT coalesce(max(index)) FROM planets WHERE star_id = $1) + 1
          , $2
          , $3
          )
        RETURNING id
      `,
      [star_id, name, ruler],
      a => a.id as number)
    if (planetRes instanceof Error) {
      return planetRes
    }
    const [planetId] = planetRes
    $(`Done. Planet %o created.`, planetId)

    $(`Planet created. Creating base... PlanetId=%o`, planetId)
    const baseRes = await db.get<number>(`
        INSERT INTO fleets
          (planet_id, index, is_base, name)
        VALUES
          (
            $1
          , 1
          , true
          , $2
          )
        RETURNING id
      `,
      [planetId, `${name} Base`],
      a => a as number)
    if (baseRes instanceof Error) {
      return baseRes
    }
    $(`Done. Base created.`)

    return planetId
  }
