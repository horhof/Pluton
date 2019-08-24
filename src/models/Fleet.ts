import { Int, N } from '../types/Number'
import { Planet } from './Planet'

export interface Fleet {
  id: N
  /** E.g. "Space Legion XIII". */
  name: string
  /** The order of the fleet within its planet, e.g. 13. */
  index: N
  /** Whether this fleet is an immovable base bound to the planet or mobile. */
  is_base: boolean
  ships: Int
  /** Whether this fleet is attacking its target or defending it. */
  is_attacking: boolean
  /** Whether this fleet is en route to a destination. */
  is_warping: boolean
  /** If warping, how many ticks remaing until arrival. */
  eta: Int
  /** The ID of the owning planet. */
  planet_id: Int
  planet: Planet
  /** The ID of the planet this fleet is en route to. */
  target_id: Int | null
  target: Planet
  /** The total travel time to target. */
  warp_time: Int
  /** The number of the tick that the fleet has got to retreat on. */
  return_tick: Int
  ruler: string
}
