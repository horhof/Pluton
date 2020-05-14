import { db } from '../db/conn'
import { stampLog } from '../log'
import { Planet } from './planet'

const log = stampLog(`data:star`)

export interface Star {
  // Core.
  id: number
  index: number
  cluster: number
  name: string
}

export interface StarNav extends Star {
  prev_id: number | undefined
  prev_index: number | undefined
  prev_name: string | undefined
  next_id: number | undefined
  next_index: number | undefined
  next_name: string | undefined
}

export const getStar =
  async (id: number): Promise<StarNav | undefined | Error> => {
    const $ = log(`getStar`)

    const res = await db.get<StarNav | null>(`
        SELECT
          DISTINCT ON (s.id)
          s.*
        , prev.id AS prev_id
        , prev.index AS prev_index
        , prev.name AS prev_name
        , next.id AS next_id
        , next.index AS next_index
        , next.name AS next_name
        FROM stars AS s
        LEFT JOIN stars AS prev
          ON prev.cluster = s.cluster
          AND prev.index = s.index - 1
        LEFT JOIN stars AS next
          ON next.cluster = s.cluster
          AND next.index = s.index + 1
        WHERE TRUE
          AND s.id = $1
      `,
      [id],
      (a: any): StarNav => {
        return {
          id: a.id as number,
          index: a.index as number,
          cluster: a.cluster as number,
          name: a.name as string,
          prev_id: a.prev_id as number || undefined,
          prev_index: a.prev_index as number || undefined,
          prev_name: a.prev_name as string || undefined,
          next_id: a.next_id as number || undefined,
          next_index: a.next_index as number || undefined,
          next_name: a.next_name as string || undefined,
        }
      })
    if (res instanceof Error) {
      return res
    }
    const [star] = res

    $(`Res=%O`, res)
    return star || undefined
  }

export const getStarByPlanet =
  async (planetId: number): Promise<Star | undefined | Error> => {
    const $ = log(`getStarByPlanet`)

    const res = await db.get<Star | null>(`
        SELECT
          stars.*
        FROM stars
        LEFT JOIN planets
          ON planets.star_id = stars.id
        WHERE TRUE
          AND planets.id = $1
      `,
      [planetId],
      cast)
    if (res instanceof Error) {
      return res
    }
    const [star] = res

    return star || undefined
  }

const cast =
  (a: any): Star => {
    return {
      id: a.id as number,
      index: a.index as number,
      cluster: a.cluster as number,
      name: a.name as string,
    }
  }
