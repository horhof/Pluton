import { N } from '../types/number'
import { Planet } from './planet'
import { stampLog } from '../log'
import { db } from '../db/conn'

const log = stampLog(`model:star`)

export interface Star {
  id: number
  index: number
  cluster: number
  name: string
  // Joins.
  planets?: Planet[]
}

export const getStarByPlanet =
  async (planetId: number): Promise<Star | undefined | Error> => {
    const $ = log(`getStarByPlanet`)

    const res = await db.get<Star | null>(`
        SELECT
          s.*
        FROM stars AS s
        LEFT JOIN planets AS p
          ON p.star_id = s.id
        WHERE TRUE
          AND p.id = $1
      `,
      [planetId],
      convert)
    if (res instanceof Error) {
      return res
    }
    const [star] = res

    return star || undefined
  }

const convert =
  (a: any): Star => {
    return {
      id: a.id as number,
      index: a.index as number,
      cluster: a.cluster as number,
      name: a.name as string,
    }
  }
