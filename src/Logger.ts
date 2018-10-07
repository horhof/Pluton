import * as Debug from 'debug'

process.env['DEBUG'] = `Pluton:*`
export const getLog = (tag: string) => Debug(`Pluton:${tag}`)