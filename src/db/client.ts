import { Pool, QueryResult } from 'pg'
import { stampLog } from '../log'

const log = stampLog(`db`)

export class Client {
  constructor(private pool: Pool) {}

  async query<T>(text: string, values: any[] = []): Promise<QueryResult<T> | Error> {
    const $ = log(`query`)

    const res = await this.pool.query({ text, values })
      .catch((err: Error) => err)

    return res
  }

  async get<T>(text: string, values: any[], cast: (v: any) => T): Promise<T[] | Error> {
    const $ = log(`get`)

    // $(`get> Text=%s`, text)
    // $(`get> Values=%o`, values)
    const res = await this.query<T>(text, values)
    if (res instanceof Error) {
      $(`Error: query failed: %o`, res.message)
      return res
    }

    if (!res || !res.rows || res.rows.length < 1) {
      return []
    }

    return res.rows.map(cast)
  }
}
