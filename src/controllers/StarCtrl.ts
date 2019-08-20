import { chain } from 'lodash'
import { stampLog } from '../Log'
import { Ctx, endReq } from '../Server'
import { query } from '../Database'
import { Star } from '../Star'

const log = stampLog(`Http:Star`)

enum StarCtrlErr {
  GENERAL,
}

/** GET /stars/:id */
export const readStar =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`readStar`)

    const id = chain(ctx.params).get('id').toNumber().value()

    if (!isFinite(id)) {
      return endReq(ctx, `ID "${id}" not valid.`, $, 400)
    }

    const res = await query(`stars?id=eq.${id}&select=*,planets(*)`)

    if (!res.ok) {
      return endReq(ctx, `Star ID "${id}" not valid.`, $, 400)
    }

    const body = await res.json() as Star[]

    const input = body[0]
    ctx.type = 'html'
    const template = require('../templates/Star.marko')
    ctx.body = template.stream(input)
  }

/** GET /clusters/:index */
export const readCluster =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`readCluster`)

    const index = chain(ctx.params).get('index').toNumber().value()

    if (!isFinite(index)) {
      return endReq(ctx, `Cluster index "${index}" not valid.`, $, 400)
    }

    const res = await query(`stars?select=*&cluster.eq.${index}`)

    if (!res.ok) {
      return endReq(ctx, `Can't find cluster "${index}".`, $, 404)
    }

    const body = await res.json() as Star[]

    const input = { index, stars: body }
    ctx.type = 'html'
    const template = require('../templates/Cluster.marko')
    ctx.body = template.stream(input)
  }
