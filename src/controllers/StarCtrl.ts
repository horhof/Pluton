import { chain } from 'lodash'
import { query } from '../Database'
import { stampLog } from '../Log'
import { Star } from '../models/Star'
import { Ctx, showErr } from '../Server'

const log = stampLog(`Http:Star`)

/** GET /stars/<ID>.html */
export const readStar =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`readStar`)

    const id = chain(ctx.params).get('id').toNumber().value()

    if (!isFinite(id)) {
      return showErr(ctx, `ID "${id}" not valid.`, $, 400)
    }

    const res = await query({ noun: `stars?id=eq.${id}&select=*,planets(*)` })

    if (!res.ok) {
      return showErr(ctx, `Star ID "${id}" not valid.`, $, 400)
    }

    const body = await res.json() as Star[]

    const input = body[0]
    const template = require('../templates/Star.marko')
    ctx.type = 'html'
    ctx.body = template.stream(input)
  }
