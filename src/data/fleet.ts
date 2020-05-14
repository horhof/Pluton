import { db } from '../db/conn'
import { stampLog } from '../log'
import { Planet } from './planet'

const log = stampLog(`data:fleet`)

export enum FleetState {
  /** Sitting idle at its home planet. Can WARP. */
  HOME = 'home',
  /** Moving to a remote planet. Can ARRIVE or RETURN. */
  WARP = 'warp',
  /** Arrived at remote planet. Can RETURN. */
  ARRIVED = 'arrived',
  /** Warping in the other direction. Can reach HOME. */
  RETURN = 'return',
}

export interface Fleet {
  id: number
  /** The order of the fleet within its planet, e.g. 13. */
  index: number
  /** E.g. "Space Legion XIII". */
  name: string
  /** Whether this fleet is an immovable base bound to the planet or mobile. */
  is_base: boolean
  ships: number
  /** Whether this fleet is attacking its target or defending it. */
  is_attacking: boolean
  /** How many ticks in the total trip from home to destination. */
  warp_time: number
  /**
   * How many ticks away from home.
   *
   * This starts at 0 and increments up to warp_time. When returning back home,
   * it decrements back to 0.
   */
  from_home: number
  state: FleetState
  // Foreign keys.
  /** The ID of the owning planet. */
  planet_id: number
  /** The ID of the planet this fleet is en route to. */
  target_id: number | undefined
  // Joins.
  planet?: Planet
  target?: Planet
}

export const getFleet =
  async (id: number): Promise<Fleet | undefined | Error> => {
    const $ = log(`getFleet`)

    const res = await db.get<Fleet>(`
        SELECT *
        FROM fleets
        WHERE id = $1
      `,
      [id],
      cast)
    if (res instanceof Error) {
      return res
    }
    const [fleet] = res

    return fleet || undefined
  }

export const getFleetsForPlanet =
  async (id: number): Promise<Fleet[] | Error> => {
    const $ = log(`getFleetsByPlanet`)

    const res = await db.get<Fleet>(`
        SELECT *
        FROM fleets
        WHERE TRUE
          AND planet_id = $1
      `,
      [id],
      cast)
    if (res instanceof Error) {
      return res
    }
    const fleets = res

    return fleets || []
  }

export const createFleet =
  async (planetId: number, name: string): Promise<number | Error> => {
    const $ = log(`createPlanet`)

    const res = await db.get<number>(`
        INSERT INTO fleets
          (planet_id, index, name)
        VALUES
          (
            $1
          , (SELECT coalesce(max(index), 0) FROM fleets WHERE planet_id = $1) + 1
          , $2
          )
        RETURNING id
      `,
      [planetId, name],
      a => a.id as number)
    if (res instanceof Error) {
      return res
    }
    const [fleetId] = res
    $(`Done. Fleet %o created.`, fleetId)

    return fleetId
  }

const cast =
  (a: any): Fleet => {
    return {
      id: a.id as number,
      index: a.index as number,
      name: a.name as string,
      is_base: a.is_base as boolean,
      ships: a.ships as number,
      is_attacking: a.is_attacking as boolean,
      warp_time: a.warp_time as number,
      from_home: a.from_home as number,
      state: a.state as FleetState,
      planet_id: a.planet_id as number,
      target_id: a.target_id !== null ? a.target_id as number : undefined,
    }
  }
