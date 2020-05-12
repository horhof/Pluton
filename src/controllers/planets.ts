import { assign, get } from 'lodash'
import { getCreatedId, getInstance, getNextIndex, query } from '../database'
import { stampLog } from '../log'
import { Planet, createPlanet } from '../models/planet'
import { Star } from '../models/star'
import { Ctx, showErr } from '../server'
import { isLeft } from '../types/either'
import { getProperty } from './validation'
import { render as renderNewPlanet } from '../templates/newPlanet'
import { render as renderPlanet } from '../templates/planet'

const log = stampLog(`Http:Planet`)

/** GET /planets/<ID>.html */
export const planetsId =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`readPlanet`)
    $(`Parsing parameters...`)
    const id = getProperty<number>(ctx.params, 'id', Number, isFinite)
    if (!id) {
      return showErr(ctx, `"${id}" is not a valid ID.`, $, 400)
    }
    $(`Done. Fetching planet %o...`, id)
    const res = await getInstance<Planet>({ noun: `planets?id=eq.${id}&select=*,star:stars(*),fleets(*)&fleets.order=index.asc` })
    if (isLeft(res)) {
      return showErr(ctx, res.message, $, 404)
    }
    const planet = res
    ctx.type = 'html'
    // @ts-ignore
    ctx.body = renderPlanet(planet, planet.star!, planet.fleets!)
  }

/** GET /planets/new.html */
export const planetsNew =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`createPlanetForm`)
    $()

    const qs = ctx.request.query || {}
    const { star_id } = qs
    if (!star_id) {
      return showErr(ctx, `Need a star to create this planet under.`, $, 400)
    }

    const res = await query({ noun: `stars?id=eq.${star_id}` })
    if (!res.ok) {
      return showErr(ctx, `Can't find star "${star_id}".`, $, 404)
    }
    const [star] = await res.json() as Star[]

    ctx.type = 'html'
    $(`Rendering form... StarId=%o Star=%o`, star_id, star)
    ctx.body = renderNewPlanet(star_id, star)
  }

/** GET /planets/create.html, { star_id, name, ruler } */
export const planetsCreate =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`createPlanet`)

    $(`Processing parameters...`)
    const args = ctx.request.query
    const name = get(args, 'name')
    const ruler = get(args, 'ruler')
    const star_id = get(args, 'star_id')

    if (!name) {
      return showErr(ctx, `No planet name was given.`, $, 400)
    }

    if (!ruler) {
      return showErr(ctx, `No ruler name was given.`, $, 400)
    }

    if (!star_id) {
      return showErr(ctx, `No star ID was given.`, $, 400)
    }

    const planet = { name, ruler, star_id }
    $(`Done. Planet=%o`, planet)

    const res = await createPlanet(star_id, name, ruler)
    if (res instanceof Error) {
      return showErr(ctx, `Failed to create planet: ${res.message}`, $, 500)
    }
    const id = res

    ctx.redirect(`${id}.html`)
  }
