import Debug from 'debug'

export type Logger = (format?: string, ...opts: any[]) => void

type GetLogger = (nameOverride?: string) => Logger

const STAMP = `Pluton`

const LOG_START = `*`

export const stampLog =
  (tag: string) => getStamper(getLogger(`${STAMP}:${tag}`))

export const getLogger =
  (tag: string): Debug.IDebugger => {
    const log = Debug(tag)
    log.log = console.log.bind(console)
    return log
  }

export const getStamper =
  (fn: Logger): GetLogger =>
    (name?: string) => stamp(fn, 2, name)

export const stamp =
  (fn: Logger, levelsUp = 1, nameOverride?: string): Logger => {
    const name = nameOverride || fnName(levelsUp)
    return (format = LOG_START, ...opts) => {
      fn(`${name}> ${format}`, ...opts)
    }
  }

const fnName =
  (levelsUp = 0): string => {
    const stack = new Error().stack || ''
    //console.log(stack)
    const lines = stack.split(`\n`)
    const parent = lines[2 + levelsUp]
    const m = parent.match(/\s+ at (.+?) .+/)
    const name = (m ? m[1] : 'UNKNOWN')
      .replace('Object.exports.', '')
      .replace('Object.<anonymous>', '')
    return name
  }
