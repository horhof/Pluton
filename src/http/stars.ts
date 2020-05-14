import { getPlanetsForStar } from '../data/planet'
import { getStar } from '../data/star'
import { render as renderStar } from '../html/star'
import { stampLog } from '../log'
import { Ctx, showErr } from '../server'
import { getProperty } from '../validation'

const log = stampLog(`http:star`)

/** /stars/<ID>.html */
export const getStarById =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`getStarById`)

    $(`Parsing parameters...`)
    const id = getProperty<number>(ctx.params, 'id', Number, isFinite)
    if (!id) {
      return showErr(ctx, `"${id}" is not a valid ID.`, $, 400)
    }

    $(`Done. Fetching star %o...`, id)
    const starRes = await getStar(id)
    if (starRes instanceof Error) {
      return showErr(ctx, `Failed to get star ${id}: ${starRes.message}.`, $, 500)
    }
    if (starRes === undefined) {
      return showErr(ctx, `No such star ${id}`, $, 404)
    }
    const star = starRes

    $(`Done. Fetching planets for star %o...`, id)
    const planetRes = await getPlanetsForStar(id)
    if (planetRes instanceof Error) {
      return showErr(ctx, planetRes.message, $, 500)
    }
    if (planetRes === undefined) {
      return showErr(ctx, `No such planet ${id}`, $, 404)
    }
    const planets = planetRes

    ctx.type = 'html'
    ctx.body = renderStar(star, planets)
  }
