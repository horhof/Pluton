import { stampLog } from '../Log'
import { ID } from '../types/Number'
import { Fleet } from './Fleet'
import { Star } from './Star'

const log = stampLog(`Model:Planet`)

export interface Planet {
  id: number
  index: ID
  name: string
  ruler: string
  // Parent.
  star_id: ID
  star?: Star
  // Children.
  fleets?: Fleet
}
