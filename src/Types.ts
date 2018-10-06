import * as the from 'lodash'

export type Id = string

export const isId = (x: any): boolean => the(x).isString()