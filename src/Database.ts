import { defaults } from 'lodash'
import Fetch from 'node-fetch'
import { stampLog } from './Log'

const log = stampLog(`Database`)

type Verb = 'get' | 'post' | 'put' | 'delete'

interface QueryArgs {
  verb?: Verb
  noun: string
  body?: any
  headers?: { [key: string]: string }
}

export const query =
  async (args: QueryArgs) => {
    const $ = log(`query2`)
    defaults(args, {
      verb: 'get',
      headers: {},
    })

    const { verb, noun, body: body_, headers } = args
    defaults(headers, { 'Content-Type': 'application/json' })
    const body = body_ ? JSON.stringify(body_) : undefined

    const res = await Fetch(`http://localhost:4000/${noun}`, {
      method: verb,
      body,
      headers,
    })

    return res
  }
