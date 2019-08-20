import { defaults } from 'lodash'
import Fetch from 'node-fetch'
import { Response } from 'node-fetch'
import { stampLog } from './Log'

const log = stampLog(`Database`)

export const query =
  async (uri: string, body?: any, method: 'get' | 'post' | 'put' | 'delete' = 'get'): Promise<Response> => {
    const $ = log(`query`)
    if (body) body = JSON.stringify(body)
    $(`Method=%o Uri=%o Body=%o`, method, uri, body)
    $(`Querying...`)
    const res = await Fetch(`http://localhost:4000/${uri}`, {
      method,
      body,
      headers: { 'Content-Type': 'application/json' },
    })
    $(`Done.`)
    return res
  }

type Verb = 'get' | 'post' | 'put' | 'delete'

interface QueryArgs {
  verb?: Verb
  noun: string
  body?: any
  headers?: { [key: string]: string }
}

export const query2 =
  async (args: QueryArgs) => {
    const $ = log(`query2`)
    defaults(args, {
      verb: 'get',
      headers: {},
    })

    const { verb, noun, body: body_, headers } = args

    defaults(headers, {
      'Content-Type': 'application/json',
    })

    const body = body_ ? JSON.stringify(body_) : undefined
    $(`Method=%o Uri=%o Body=%o`, verb, noun, body)
    $(`Querying...`)
    const res = await Fetch(`http://localhost:4000/${noun}`, {
      method: verb,
      body,
      headers,
    })
    $(`Done.`)
    return res
  }
