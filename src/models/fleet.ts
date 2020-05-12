import { stampLog } from '../log'
import { ID, N } from '../types/number'
import { Planet } from './planet'
import { db } from '../db/conn'

const log = stampLog(`model:fleet`)

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
  id: ID
  /** E.g. "Space Legion XIII". */
  name: string
  /** The order of the fleet within its planet, e.g. 13. */
  index: ID
  /** Whether this fleet is an immovable base bound to the planet or mobile. */
  is_base: boolean
  ships: N
  /** Whether this fleet is attacking its target or defending it. */
  is_attacking: boolean
  /** The ID of the owning planet. */
  planet_id: ID
  planet: Planet
  /** The ID of the planet this fleet is en route to. */
  target_id: ID | null
  target: Planet
  /** How many ticks in the total trip from home to destination. */
  warp_time: N
  /**
   * How many ticks away from home.
   *
   * This starts at 0 and increments up to warp_time. When returning back home,
   * it decrements back to 0.
   */
  from_home: N
  state: FleetState
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
          , (SELECT coalesce(max(index)) FROM fleets WHERE planet_id = $1) + 1
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
