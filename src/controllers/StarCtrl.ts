import { stampLog } from '../Log'
import { getStar } from '../models/Star'
import { Ctx, showErr } from '../Server'
import { isLeft } from '../types/Either'
import { getProperty } from './validation'

const log = stampLog(`Http:Star`)

/** GET /stars/<ID>.html */
export const readStar =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`readStar`)

    $(`Parsing parameters...`)
    const id = getProperty<number>(ctx.params, 'id', isFinite, Number)

    if (!id) {
      return showErr(ctx, `"${id}" is not a valid ID.`, $, 400)
    }

    $(`Done. Fetching star %o...`, id)
    const res = await getStar(id)

    if (isLeft(res)) {
      return showErr(ctx, `Star "${id}" not found.`, $, 404)
    }
    const star = res
    $(`Done. Star=%o`, star)

    const template = require('../templates/Star.marko')
    ctx.type = 'html'
    ctx.body = template.stream(star)
  }
