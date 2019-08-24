import { assign, defaults, get } from 'lodash'
import Fetch from 'node-fetch'
import { stampLog } from './Log'
import { AsyncEither, left } from './types/Either'
import { ID } from './types/Number'

const log = stampLog(`Database`)

type Verb = 'get' | 'post' | 'put' | 'delete' | 'patch'

interface QueryArgs {
  verb?: Verb
  noun: string
  body?: any
  contentType?: string
  returnRepresentation?: boolean
  mergeDuplicates?: boolean
  headers?: { [key: string]: string }
}

enum QueryErr {
  QUERY,
  EMPTY_SET,
}

export const query =
  async (args: QueryArgs) => {
    const $ = log(`query`)
    defaults(args, {
      verb: 'get',
      contentType: 'application/json',
      returnRepresentation: false,
      mergeDuplicates: false,
      headers: {},
    })
    const { verb, noun, body, contentType, returnRepresentation, mergeDuplicates, headers } = args
    const bodyStr = body ? JSON.stringify(body) : undefined
    defaults(headers, { 'Content-Type': contentType })
    if (returnRepresentation) {
      $(`Return representation requested.`)
      const header = get(headers, 'Prefer', []) as string[]
      header.push('return=representation')
      assign(headers, { Prefer: header })
    }
    if (mergeDuplicates) {
      const header = get(headers, 'Prefer', []) as string[]
      header.push('resolution=merge-duplicates')
      assign(headers, { Prefer: header })
      $(`Headers=%o`, headers)
    }
    $(`Headers=%o`, headers)
    const res = await Fetch(`http://localhost:4000/${noun}`, {
      method: verb,
      body: bodyStr,
      headers,
    })
    return res
  }

/** Query using the given postgrest query arguments and get the first record. */
export const getInstance =
  async <T>(queryArgs: QueryArgs): AsyncEither<QueryErr, T> => {
    const res = await query(queryArgs)
    if (!res.ok) {
      return left(QueryErr.QUERY, `Failed to query for "${JSON.stringify(queryArgs)}".`)
    }
    const body = await res.json() as T[]
    const [head] = body
    if (!head) {
      return left(QueryErr.EMPTY_SET, `Returned empty set.`)
    }
    return head
  }

/**
 * Look up the next available index number.
 * @param parent E.g. 'stars'.
 * @param parentId Child rows have a foreign key of this value into the parent table.
 * @param child E.g. 'planets'.
 */
export const getNextIndex =
  async (parent: string, parentId: number, child: string): Promise<number> => {
    const res = await query({
      verb: 'get',
      noun: `${child}?${parent}_id=eq.${parentId}&order=index.desc&limit=1`
    })
    if (!res.ok) {
      return 1
    }
    // If there are no children, this will be the first one.
    const parents = await res.json() as { index: number }[]
    if (parents.length < 1) {
      return 1
    }
    const [head] = parents
    return head.index + 1
  }

export const getCreatedId =
  (headers: any/* Headers */): number | undefined => {
    const h = headers.get('location') || ''
    const m = h.match(/(\d+)/)
    const id = m && m[1]
    if (!id) {
      return
    }
    return Number(id)
  }
