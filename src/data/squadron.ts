import { db } from '../db/conn'
import { stampLog } from '../log'

const log = stampLog(`data:squadron`)

export interface Squadron {
  id: number
  index: number
  name: string
  ships: number
  squadron_id: number
}

export const getSquadron =
  async (id: number): Promise<Squadron | undefined | Error> => {
    const $ = log(`getSquadron`)

    const res = await db.get<Squadron>(`
        SELECT *
        FROM squadrons
        WHERE id = $1
      `,
      [id],
      castSquadron)
    if (res instanceof Error) {
      return res
    }
    const [squadron] = res

    return squadron || undefined
  }

export const getSquadronsForFleet =
  async (id: number): Promise<Squadron[] | Error> => {
    const $ = log(`getSquadronsForFleet`)

    const res = await db.get<Squadron>(`
        SELECT
          *
        FROM squadrons
        WHERE TRUE
          AND fleet_id = $1
        ORDER BY
          index ASC
      `,
      [id],
      castSquadron)
    if (res instanceof Error) {
      return res
    }
    const squadrons = res

    return squadrons || []
  }

export const createSquadron =
  async (fleetId: number, name: string): Promise<number | Error> => {
    const $ = log(`createSquadron`)

    const res = await db.get<number>(`
        INSERT INTO squadrons
          (fleet_id, index, name)
        VALUES
          (
            $1
          , (SELECT coalesce(max(index), 0) FROM squadrons WHERE fleet_id = $1) + 1
          , $2
          )
        RETURNING id
      `,
      [fleetId, name],
      a => a.id as number)
    if (res instanceof Error) {
      return res
    }
    const [squadronId] = res
    $(`Done. Squadron %o created.`, squadronId)

    return squadronId
  }

export const castSquadron =
  (r: any): Squadron => {
    return {
      id: r.id as number,
      index: r.index as number,
      name: r.name as string,
      ships: r.ships as number,
      squadron_id: r.squadron_id as number,
    }
  }
