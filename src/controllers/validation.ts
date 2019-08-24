import { get } from 'lodash'

/**
 * @param convert Function to run on input before validation.
 * @param validate Predicate to determine if input is valid.
 */
export const getProperty =
  <T>(obj: any, name: string, convert: Function, validate: Function): T | undefined => {
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
