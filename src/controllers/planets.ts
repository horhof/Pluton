import { get } from 'lodash'
import { query } from '../database'
import { stampLog } from '../log'
import { getFleetsByPlanet } from '../models/fleet'
import { createPlanet, getPlanet } from '../models/planet'
import { getStarByPlanet, Star } from '../models/star'
import { Ctx, showErr } from '../server'
import { render as renderNewPlanet } from '../templates/newPlanet'
import { render as renderPlanet } from '../templates/planet'
import { getProperty } from './validation'

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
    const planetRes = await getPlanet(id)
    if (planetRes instanceof Error) {
      return showErr(ctx, planetRes.message, $, 500)
    }
    if (planetRes === undefined) {
      return showErr(ctx, `No such planet ${id}`, $, 404)
    }
    const planet = planetRes

    $(`Done. Fetching star for planet %o...`, id)
    const starRes = await getStarByPlanet(id)
    if (starRes instanceof Error) {
      return showErr(ctx, starRes.message, $, 500)
    }
    if (starRes === undefined) {
      return showErr(ctx, `Planet ${id} has no star`, $, 500)
    }
    const star = starRes

    $(`Done. Fetching fleets for planet %o...`, id)
    const fleetsRes = await getFleetsByPlanet(id)
    if (fleetsRes instanceof Error) {
      return showErr(ctx, fleetsRes.message, $, 500)
    }
    const fleets = fleetsRes

    ctx.type = 'html'
    ctx.body = renderPlanet(planet, star, fleets)
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
