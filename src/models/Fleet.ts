import { Int, N, ID } from '../types/Number'
import { Planet } from './Planet'

export enum FleetState {
  /** Sitting idle at its home planet. Can WARP. */
  HOME = 1,
  /** Moving to a remote planet. Can ARRIVE or RETURN. */
  WARP = 2,
  /** Arrived at remote planet. Can RETURN. */
  ARRIVE = 3,
  /** Warping in the other direction. Can reach HOME. */
  RETURN = 4,
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
