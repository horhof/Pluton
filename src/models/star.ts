import { N } from '../types/number'
import { Planet } from './planet'

export interface Star {
  id: number
  name: string
  cluster: N
  index: N
  planets?: Planet[]
}
