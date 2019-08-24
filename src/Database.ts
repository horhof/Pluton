import { assign, defaults, get } from 'lodash'
import Fetch from 'node-fetch'
import { stampLog } from './Log'

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

    $(`Assigning content type...`)
    defaults(headers, { 'Content-Type': contentType })
    $(`Done. Headers=%o`, headers)

    if (returnRepresentation) {
      $(`Return representation requested.`)
      const header = get(headers, 'Prefer', []) as string[]
      header.push('return=representation')
      assign(headers, { Prefer: header })
      $(`Headers=%o`, headers)
    }

    if (mergeDuplicates) {
      $(`Merge duplicates requested.`)
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
