import { N, Int } from './Types'
import { Planet } from './Planet'

export interface Fleet {
  id: N
  name: string
  index: N
  mobile: boolean
  size: Int
  attacking: boolean
  planet: Planet
}
