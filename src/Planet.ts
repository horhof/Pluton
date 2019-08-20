import { N } from './Types'
import { Star } from './Star'
import { Fleet } from './Fleet'

export interface Planet {
  name: string
  index: N
  star: Star
  fleets?: Fleet
}
