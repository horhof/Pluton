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

export const getNumber =
  (ctx: { [key: string]: any }, name: string): number | undefined =>
    getProperty<number>(ctx, name, Number, isFinite)

export const getString =
  (ctx: { [key: string]: any }, name: string): string | undefined =>
    getProperty<string>(ctx, name, String, (a: any) => typeof a === 'string' && a.length > 0)

export const get =
  <T>(obj: any, prop: string, defaultValue?: T): T | undefined => {
    try {
      const value = obj[prop]
      return (value === undefined) ? defaultValue : value
    } catch {
      return defaultValue
    }
  }
