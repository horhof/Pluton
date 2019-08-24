import { floor } from 'lodash'
import { allPass, complement, gte, is } from 'ramda'

export type Int = number

/** A natural number including zero. */
export type N = number

/** A natural number excluding zero. */
export type ID = number

export type Float = number

const isFloat =
  (a: number): boolean =>
    a - floor(a) !== 0

export const isInt =
  <(x: any) => x is Int>
  allPass([is(Number), complement(isFloat)])

/** Is this a natural number (including zero). */
export const isN =
  <(a: any) => a is N>
  allPass([isInt, gte(0)])
