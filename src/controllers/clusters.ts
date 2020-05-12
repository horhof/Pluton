import { chain, map } from 'lodash'
import { query } from '../database'
import { stampLog } from '../log'
import { Star } from '../models/star'
import { Ctx, showErr } from '../server'
import { render as renderUniverse } from '../templates/universe'
import { render as renderCluster } from '../templates/cluster'
import { db } from '../db/conn'

const log = stampLog(`Http:Cluster`)

/** GET /clusters.html */
export const readClusters =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`readClusters`)

    const res = await db.get(`
        SELECT DISTINCT
          cluster
        FROM stars
        ORDER BY
          cluster ASC
      `,
      [],
      r => r.cluster as number)
    if (res instanceof Error) {
      return showErr(ctx, `Can't get clusters`, $, 500)
    }
    const clusters = res

    ctx.type = 'html'
    ctx.body = renderUniverse(clusters)
  }

/** GET /clusters/<ID>.html */
export const readCluster =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`readCluster`)

    const index = chain(ctx.params).get('index').toNumber().value()

    if (!isFinite(index)) {
      return showErr(ctx, `Cluster index "${index}" not valid.`, $, 400)
    }

    $(`Querying for all stars with a cluster of %o...`, index)
    const res = await db.get(`
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
      [index],
      r => ({
        id: r.id as number,
        name: r.name as string,
      }))
    if (res instanceof Error) {
      return showErr(ctx, `Can't find cluster "${index}".`, $, 404)
    }
    const stars = res

    ctx.type = 'html'
    ctx.body = renderCluster(index, stars)
  }
