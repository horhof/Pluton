import { assign, chain, get } from 'lodash'
import { query, getNextIndex, getCreatedId } from '../Database'
import { stampLog } from '../Log'
import { Planet } from '../models/Planet'
import { Star } from '../models/Star'
import { Ctx, showErr, sendErr } from '../Server'

const log = stampLog(`Http:Planet`)

/** GET /planets/<ID>.html */
export const readPlanet =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`readPlanet`)

    const id = chain(ctx.params).get('id').toNumber().value()

    if (!isFinite(id)) {
      return showErr(ctx, `"${id}" is not a valid planet ID.`, $, 400)
    }

    const res = await query({ noun: `planets?id=eq.${id}&select=*,star:stars(*),fleets(*)&fleets.order=index.asc` })

    if (!res.ok) {
      return showErr(ctx, `Can't find planet "${id}" not valid.`, $, 404)
    }

    const data = await res.json() as Planet[]

    if (data.length < 1) {
      return showErr(ctx, `Can't find planet "${id}".`, $, 404)
    }

    const input = data[0]
    const template = require('../templates/Planet.marko')
    ctx.type = 'html'
    ctx.body = template.stream(input)
  }

/** GET /planets/new.html */
export const createPlanetForm =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`createPlanetForm`)

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

    const template = require('../templates/NewPlanet.marko')
    ctx.type = 'html'
    ctx.body = template.stream({ star })
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
