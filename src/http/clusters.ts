import { db } from '../db/conn'
import { render as renderCluster } from '../html/cluster'
import { render as renderUniverse } from '../html/universe'
import { stampLog } from '../log'
import { Ctx, showErr } from '../server'
import { getNumber} from '../validation'

const log = stampLog(`http:clusters`)

/** /clusters.html */
export const getClusters =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`getClusters`)

    const res = await db.get(`
        SELECT
          DISTINCT
          s.cluster AS idx
        , count(s.id) AS star_count
        FROM stars AS s
        GROUP BY
          s.cluster
        ORDER BY
          s.cluster ASC
      `,
      [],
      r => ({
        idx: r.idx as number,
        starCount: r.star_count as number,
      }))
    if (res instanceof Error) {
      return showErr(ctx, `Can't get clusters`, $, 500)
    }
    const clusters = res

    ctx.type = 'html'
    ctx.body = renderUniverse(clusters)
  }

/** /clusters/<IDX>.html */
export const getClustersByIdx =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`getClustersByIdx`)

    const idx = getNumber(ctx.params, 'idx')
    if (idx === undefined) {
      return showErr(ctx, `Cluster index "${idx}" not valid.`, $, 400)
    }

    $(`Querying for cluster %o neighbors...`, idx)
    const clusterRes = await db.get(`
        SELECT
          DISTINCT ON (s.cluster)
          s.cluster
        , prev.cluster AS prev
        , next.cluster AS next
        FROM stars AS s
        LEFT JOIN stars AS prev
          ON prev.cluster = s.cluster - 1
        LEFT JOIN stars AS next
          ON next.cluster = s.cluster + 1
        WHERE TRUE
          AND s.cluster = $1
        ORDER BY
          s.cluster ASC
        , s.index ASC
      `,
      [idx],
      (r: any) => ({
        cluster: r.cluster as number,
        prev: r.prev as number || undefined,
        next: r.next as number || undefined,
      }))
    if (clusterRes instanceof Error || clusterRes === undefined) {
      return showErr(ctx, `Can't find neighbors for cluster "${idx}".`, $, 404)
    }
    const [clusterVals] = clusterRes
    const { next, prev } = clusterVals

    $(`Querying for all stars with a cluster of %o...`, idx)
    const starsRes = await db.get(`
        SELECT
          id
        , name
        FROM stars
        WHERE TRUE
          AND cluster = $1
        ORDER BY
          cluster ASC
        , index ASC
      `,
      [idx],
      r => ({
        id: r.id as number,
        name: r.name as string,
      }))
    if (starsRes instanceof Error) {
      return showErr(ctx, `Can't find stars for cluster "${idx}": ${starsRes.message}`, $, 404)
    }
    const stars = starsRes

    ctx.type = 'html'
    ctx.body = renderCluster(idx, prev, next, stars)
  }
