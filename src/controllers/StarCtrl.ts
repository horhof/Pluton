import { getInstance } from '../Database'
import { stampLog } from '../Log'
import { Star } from '../models/Star'
import { Ctx, showErr } from '../Server'
import { isLeft } from '../types/Either'
import { getProperty } from './validation'
import { render as renderStar } from '../templates/star'

const log = stampLog(`http:star`)

/** GET /stars/<ID>.html */
export const readStar =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`readStar`)
    $(`Parsing parameters...`)
    const id = getProperty<number>(ctx.params, 'id', Number, isFinite)
    if (!id) {
      return showErr(ctx, `"${id}" is not a valid ID.`, $, 400)
    }
    $(`Done. Fetching star %o...`, id)
    const res = await getInstance<Star>({ noun: `stars?id=eq.${id}&select=*,planets(*)` })
    if (isLeft(res)) {
      return showErr(ctx, res.message, $, 404)
    }
    const star = res

    ctx.type = 'html'
    ctx.body = renderStar(star, star.planets!)
  }
