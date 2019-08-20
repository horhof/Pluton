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
