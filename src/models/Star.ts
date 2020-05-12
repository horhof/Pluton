import { N } from '../types/Number'
import { Planet } from './Planet'

export interface Star {
  id: number
  name: string
  cluster: N
  index: N
  planets?: Planet[]
}
