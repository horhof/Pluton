import { query } from '../Database'
import { AsyncEither, left } from '../types/Either'
import { ID, N } from '../types/Number'
import { Planet } from './Planet'

export interface Star {
  name: string
  cluster: N
  index: N
  planets?: Planet[]
}

export enum StarErr {
  LOOKUP,
}

export const getStar =
  async (id: ID): AsyncEither<StarErr, Star> => {
    const res = await query({ noun: `stars?id=eq.${id}&select=*,planets(*)` })
    if (!res.ok) {
      return left(StarErr.LOOKUP, `Failed to query for star "${id}".`)
    }
    const body = await res.json() as Star[]
    const [star] = body
    if (!star) {
      return left(StarErr.LOOKUP, `No star with ID "${id}".`)
    }
    return star
  }
