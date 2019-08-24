import { get } from 'lodash'

export const getProperty =
  <T>(obj: any, name: string, validate: Function, convert: Function): T | undefined => {
    if (!obj) {
      return
    }

    const input = get(obj, name)
    if (!input) {
      return
    }

    const output = convert(input)

    if (!validate(output)) {
      return
    }

    return output as T
  }
