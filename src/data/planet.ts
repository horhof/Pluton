import { db } from '../db/conn'
import { stampLog } from '../log'
import { Fleet } from './fleet'
import { Star } from './star'

const log = stampLog(`data:planet`)

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

export interface PlanetNav extends Planet {
  prev_id: number | undefined
  prev_index: number | undefined
  prev_name: string | undefined
  next_id: number | undefined
  next_index: number | undefined
  next_name: string | undefined
}

export const getPlanet =
  async (id: number): Promise<PlanetNav | undefined | Error> => {
    const $ = log(`getPlanet`)

    const res = await db.get<PlanetNav | undefined>(`
        SELECT
          p.*
        , prev.id AS prev_id
        , prev.index AS prev_index
        , prev.name AS prev_name
        , next.id AS next_id
        , next.index AS next_index
        , next.name AS next_name
        FROM planets AS p
        LEFT JOIN planets AS prev
          ON prev.star_id = p.star_id
          AND prev.index = p.index - 1
        LEFT JOIN planets AS next
          ON next.star_id = p.star_id
          AND next.index = p.index + 1
        WHERE TRUE
          AND p.id = $1
      `,
      [id],
      a => ({
        id: a.id as number,
        index: a.index as number,
        name: a.name as string,
        ruler: a.ruler as string,
        star_id: a.star_id as number,
        prev_id: a.prev_id as number || undefined,
        prev_index: a.prev_index as number || undefined,
        prev_name: a.prev_name as string || undefined,
        next_id: a.next_id as number || undefined,
        next_index: a.next_index as number || undefined,
        next_name: a.next_name as string || undefined,
      }))
    if (res instanceof Error) {
      return res
    }
    const [planet] = res
    $(`Planet=%O`, planet)

    return planet
  }

export const getPlanetsForStar =
  async (id: number): Promise<Planet[] | Error> => {
    const $ = log(`getPlanetsForStar`)

    const res = await db.get<Planet>(`
        SELECT
          *
        FROM planets
        WHERE TRUE
          AND star_id = $1
        ORDER BY
          index ASC
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
    const planets = res

    return planets
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
          , (SELECT coalesce(max(index), 0) FROM planets WHERE star_id = $1) + 1
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
