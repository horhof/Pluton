import { N } from '../types/Number'
import { Planet } from './Planet'

export interface Star {
  name: string
  cluster: N
  index: N
  planets?: Planet[]
}
