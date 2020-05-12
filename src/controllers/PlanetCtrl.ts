import { assign, get } from 'lodash'
import { getCreatedId, getInstance, getNextIndex, query } from '../Database'
import { stampLog } from '../Log'
import { Planet } from '../models/Planet'
import { Star } from '../models/Star'
import { Ctx, sendErr, showErr } from '../Server'
import { isLeft } from '../types/Either'
import { getProperty } from './validation'
import { render as renderNewPlanet } from '../templates/newPlanet'
import { render as renderPlanet } from '../templates/planet'

const log = stampLog(`Http:Planet`)

/** GET /planets/<ID>.html */
export const readPlanet =
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
export const createPlanetForm =
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

/** POST /planets/new.json */
export const createPlanet =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`createPlanet`)

    $(`Processing parameters...`)
    const args = ctx.request.body
    const name = get(args, 'name')
    const ruler = get(args, 'ruler')
    const star_id = get(args, 'star_id')

    if (!name) {
      return sendErr(ctx, `No planet name was given.`, $, 400)
    }

    if (!ruler) {
      return sendErr(ctx, `No ruler name was given.`, $, 400)
    }

    if (!star_id) {
      return sendErr(ctx, `No star ID was given.`, $, 400)
    }

    const planet = { name, ruler, star_id }
    $(`Done. Planet=%o`, planet)

    $(`Getting the next index for this star...`)
    const index = await getNextIndex('stars', star_id, 'planets')
    $(`Done. Index=%o`, index)
    assign(planet, { index })

    $(`Creating planet...`)
    const res1 = await query({ verb: 'post', noun: 'planets', body: planet })

    if (!res1.ok) {
      const body = await res1.json()
      $(`Err=%o`, body)
      return sendErr(ctx, `Failed to create planet: ${body.message}`, $, res1.status)
    }
    $(`Done. Planet created.`)

    const id = getCreatedId(res1.headers)
    if (!id) {
      return sendErr(ctx, `Failed to get created fleet.`, $, 500)
    }

    $(`Planet created. Creating base... PlanetId=%o`, id)
    const res2 = await query({
      verb: 'post',
      noun: 'fleets',
      body: {
        name: `${planet.name} Base`,
        index: 1,
        planet_id: id,
        is_base: true,
      },
    })

    if (!res2.ok) {
      $(`Failed creating base. Res=%O`, await res2.json())
      return sendErr(ctx, `Failed to create home fleet planet ${id}.`, $, res2.status)
    }

    $(`Home fleet created. Done.`)
    //ctx.body = { url: `/planets/${id}.html` }
    ctx.body = { url: `${id}.html` }
  }

/** GET /planets/create.html, { star_id, name, ruler } */
export const createPlanet2 =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`createPlanet`)

    $(`Processing parameters...`)
    const args = ctx.request.query
    const name = get(args, 'name')
    const ruler = get(args, 'ruler')
    const star_id = get(args, 'star_id')

    if (!name) {
      return sendErr(ctx, `No planet name was given.`, $, 400)
    }

    if (!ruler) {
      return sendErr(ctx, `No ruler name was given.`, $, 400)
    }

    if (!star_id) {
      return sendErr(ctx, `No star ID was given.`, $, 400)
    }

    const planet = { name, ruler, star_id }
    $(`Done. Planet=%o`, planet)

    $(`Getting the next index for this star...`)
    const index = await getNextIndex('stars', star_id, 'planets')
    $(`Done. Index=%o`, index)
    assign(planet, { index })

    $(`Creating planet...`)
    const res1 = await query({ verb: 'post', noun: 'planets', body: planet })

    if (!res1.ok) {
      const body = await res1.json()
      $(`Err=%o`, body)
      return sendErr(ctx, `Failed to create planet: ${body.message}`, $, res1.status)
    }
    $(`Done. Planet created.`)

    const id = getCreatedId(res1.headers)
    if (!id) {
      return sendErr(ctx, `Failed to get created fleet.`, $, 500)
    }

    $(`Planet created. Creating base... PlanetId=%o`, id)
    const res2 = await query({
      verb: 'post',
      noun: 'fleets',
      body: {
        name: `${planet.name} Base`,
        index: 1,
        planet_id: id,
        is_base: true,
      },
    })

    if (!res2.ok) {
      $(`Failed creating base. Res=%O`, await res2.json())
      return sendErr(ctx, `Failed to create home fleet planet ${id}.`, $, res2.status)
    }

    $(`Home fleet created. Done.`)
    //ctx.body = { url: `/planets/${id}.html` }
    ctx.redirect(`${id}.html`)
  }
