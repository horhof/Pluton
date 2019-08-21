import { chain, get } from 'lodash'
import { query } from '../Database'
import { stampLog } from '../Log'
import { Planet } from '../Planet'
import { Ctx, showErr } from '../Server'

const log = stampLog(`Http:Planet`)

/** GET /planets/1.html */
export const readPlanet =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`readPlanet`)

    const id = chain(ctx.params).get('id').toNumber().value()

    if (!isFinite(id)) {
      return showErr(ctx, `"${id}" is not a valid planet ID.`, $, 400)
    }

    const res = await query({ noun: `planets?id=eq.${id}&select=*,star:stars(*),fleets(*)` })

    if (!res.ok) {
      return showErr(ctx, `Can't find planet "${id}" not valid.`, $, 404)
    }

    const data = await res.json() as Planet[]

    if (data.length < 1) {
      return showErr(ctx, `Can't find planet "${id}".`, $, 404)
    }

    const input = data[0]
    $(`Input=%O`, input)
    const template = require('../templates/Planet.marko')
    ctx.type = 'html'
    ctx.body = template.stream(input)
  }

/** GET /planets/new.html */
export const createPlanetForm =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`createPlanetForm`)

    const template = require('../templates/CreatePlanet.marko')
    ctx.type = 'html'
    ctx.body = template.stream()
  }

/** POST /planets/new.json */
export const createPlanet =
  async (ctx: Ctx): Promise<void> => {
    const $ = log(`createPlanet`)

    const args = ctx.request.body
    const name = get(args, 'name')
    const star_id = get(args, 'star_id')
    const index = get(args, 'index')
    const planet = { name, star_id, index }

    $(`Creating planet... Planet=%o`, planet)
    const planetRes = await query({ verb: 'post', noun: 'planets', body: planet })

    if (!planetRes.ok) {
      return showErr(ctx, `Failed to create planet "${JSON.stringify(planet)}".`, $, planetRes.status)
    }

    const h = planetRes.headers.get('location') || ''
    const m = h.match(/(\d+)/)
    const id = m && m[1]

    $(`Planet created. Creating home fleet... PlanetId=%o`, id)
    const fleetRes = await query({
      verb: 'post',
      noun: 'fleets',
      body: {
        name: `${name} Planetary Defense`,
        index: 1,
        planet_id: id,
        mobile: false,
      },
    })

    if (!fleetRes.ok) {
      return showErr(ctx, `Failed to create home fleet planet ${id}.`, $, fleetRes.status)
    }

    $(`Home fleet created. Done.`)
    ctx.body = { url: `/planets/${id}.html` }
  }
