import { ID } from '../types/Number'
import { Fleet } from './Fleet'
import { Star } from './Star'

export interface Planet {
  name: string
  index: ID
  star_id: ID
  star?: Star
  ruler: string
  fleets?: Fleet
}
