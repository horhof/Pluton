import { Pool, QueryResult } from 'pg'
import { stampLog } from '../Log'

const log = stampLog(`Db`)

export class Client {
  constructor(private pool: Pool) {}

  async query<T>(text: string, values: any[] = []): Promise<QueryResult<T> | Error> {
    const $ = log(`query`)

    const res = await this.pool.query({ text, values })
      .catch((err: Error) => err)

    return res
  }

  async selectRows<T>(text: string, values: any[], convert: (v: any) => T): Promise<T[] | Error> {
    const $ = log(`getRows`)

    const res = await this.query<T>(text, values)
    if (res instanceof Error) {
      $(`Error: query failed: %o`, res.message)
      return []
    }

    if (!res || !res.rows || res.rows.length < 1) {
      return []
    }

    return res.rows.map(convert)
  }
}
