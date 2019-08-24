import { stampLog } from '../Log'
import { ID } from '../types/Number'
import { Fleet } from './Fleet'
import { Star } from './Star'

const log = stampLog(`Model:Planet`)

export interface Planet {
  name: string
  index: ID
  star_id: ID
  star?: Star
  ruler: string
  fleets?: Fleet
}
