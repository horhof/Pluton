import { N } from '../types/Number'
import { Fleet } from './Fleet'
import { Star } from './Star'

export interface Planet {
  name: string
  index: N
  star: Star
  fleets?: Fleet
}
