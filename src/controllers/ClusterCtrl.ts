import { chain, map } from 'lodash'
import { query } from '../Database'
import { stampLog } from '../Log'
import { Star } from '../models/Star'
import { Ctx, showErr } from '../Server'
import { render as renderUniverse } from '../templates/universe'

const log = stampLog(`Http:Cluster`)

/** GET /clusters.html */
export const readClusters =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`readClusters`)

    const res = await query({ noun: `clusters` })
    if (!res.ok) {
      return showErr(ctx, `Can't find clusters`, $, res.status)
    }

    const clusters = await res.json() as { cluster: number }[]
    const input = map(clusters, 'cluster')

    ctx.type = 'html'
    ctx.body = renderUniverse(input)
  }

/** GET /clusters/:index */
export const readCluster =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`readCluster`)

    const index = chain(ctx.params).get('index').toNumber().value()

    if (!isFinite(index)) {
      return showErr(ctx, `Cluster index "${index}" not valid.`, $, 400)
    }

    $(`Querying for all stars with a cluster of %o...`, index)
    const res = await query({ noun: `stars?select=*&cluster=eq.${index}` })

    if (!res.ok) {
      return showErr(ctx, `Can't find cluster "${index}".`, $, 404)
    }

    const stars = await res.json() as Star[]

    const input = { index, stars }
    const template = require('../templates/Cluster.marko')
    ctx.type = 'html'
    ctx.body = template.stream(input)
  }
